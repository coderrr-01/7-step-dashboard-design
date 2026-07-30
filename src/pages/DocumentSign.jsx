import { useState, useRef, useEffect } from "react";
import PageLayout from "../components/PageLayout";
import { toast } from "react-toastify";
import { useClientData } from "../hooks/useClientData";
import { signLease, requestLeaseExtension } from "../services/api";
import { useSteps } from "../context/StepContext";
import { useNavigate } from "react-router-dom";

export default function DocumentSign() {
   const navigate = useNavigate();
   const { client, loading, refetch } = useClientData();
   const { completeStep } = useSteps();

   const [activeTab, setActiveTab]   = useState("type");
   const [verified, setVerified]     = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [signedPdf, setSignedPdf]   = useState('');

   const canvasRef = useRef(null);
   const drawing   = useRef(false);
   const hasSigned = useRef(false);

   useEffect(() => {
      if (client?.signed_lease) setSignedPdf(client.signed_lease);
   }, [client?.signed_lease]);

   // ── Canvas setup ──────────────────────────────────────────────────────────
   const setupCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect  = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width  = rect.width  * ratio;
      canvas.height = rect.height * ratio;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.lineWidth   = 2;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.strokeStyle = '#000';
   };

   useEffect(() => {
      if (activeTab === 'draw') setTimeout(setupCanvas, 100);
   }, [activeTab]);

   const getPos = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
   };

   const onPointerDown = (e) => {
      e.preventDefault();
      if (!canvasRef.current) return;
      drawing.current   = true;
      hasSigned.current = true;
      const ctx = canvasRef.current.getContext('2d');
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
   };

   const onPointerMove = (e) => {
      if (!drawing.current || !canvasRef.current) return;
      e.preventDefault();
      const ctx = canvasRef.current.getContext('2d');
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
   };

   const onPointerUp = (e) => {
      e.preventDefault();
      drawing.current = false;
      if (canvasRef.current) canvasRef.current.getContext('2d').closePath();
   };

   const clearCanvas = () => {
      if (!canvasRef.current) return;
      canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      hasSigned.current = false;
   };

   // "Adopt & Sign" button on Type tab → switches to Draw tab
   const handleAdoptSign = () => setActiveTab('draw');

   // Submit drawn signature → call API
   const handleSubmitSignature = async () => {
      if (!client) { toast.error('Client data not loaded. Please refresh.'); return; }
      if (!hasSigned.current) { toast.error('Please draw your signature first.'); return; }
      setSubmitting(true);
      try {
         const res = await signLease({ client_id: client.id, signature: canvasRef.current.toDataURL('image/png') });
         if (res.success) {
            setSignedPdf(res.signed_pdf);
            completeStep(6);
            toast.success('Lease signed successfully!');
            await refetch();
         } else {
            toast.error(res.message || 'Signing failed. Please try again.');
         }
      } catch (e) {
         toast.error(e.message || 'Network error. Please try again.');
      } finally {
         setSubmitting(false);
      }
   };

   // ── Derived values from Zoho CRM client ───────────────────────────────────
   const name          = client?.name          || '';
   const unit          = client?.unit          ? `Unit ${client.unit}` : 'The Victorian Premier';
   const address       = client?.address       || 'Suite 422B';
   const effectiveDate = client?.effective_date || '';
   const extStatus     = client?.extension_status || '';
   const extensionPdf  = client?.extension_signed_pdf || '';

   // Use requested dates when extension is Approved
   const startDate = (extStatus === 'Approved' && client?.requested_start_date)
      ? client.requested_start_date : (client?.start_date || 'September 1, 2024');
   const endDate   = (extStatus === 'Approved' && client?.requested_end_date)
      ? client.requested_end_date   : (client?.end_date   || 'July 31, 2025');

   const rentAmount = client?.rent_amount      || 'N/A';
   const deposit    = client?.security_deposit || 'N/A';
   const phone      = client?.phone            || '';
   const email      = client?.email            || '';

   // Show extension block if lease ends within 40 days
   const showExtension = (() => {
      if (!client?.end_date) return false;
      const today = new Date();
      const end   = new Date(client.end_date);
      const diff  = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
      return end >= today && diff <= 40;
   })();

   const signaturePanelProps = {
      activeTab, setActiveTab, verified, setVerified,
      canvasRef, onPointerDown, onPointerMove, onPointerUp,
      clearCanvas, handleAdoptSign, handleSubmitSignature,
      submitting, unit, name,
   };

   // ── Already signed — show PDF + extension states ──────────────────────────
   if (!loading && (signedPdf || client?.signed_lease)) {
      const pdfUrl = signedPdf || client.signed_lease;
      return (
         <PageLayout page="DocumentSign">
            <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1 bg-field">
               <div className="container container-narrow">
                  <div className="row g-5">
                     <div className="col-lg-8">
                        <h1 className="display-4 serif-heading heading-hero mb-3 hero-title">Residency Agreement</h1>
                        <p className="mb-0 text-muted fs-5 heading-lead-wide">
                           Unit Selection: {unit} <span>----</span> {address}
                        </p>
                     </div>
                     <div className="col-12">
                        <div className="auth-card p-4">
                           <p style={{ color: 'green' }}>Your signed lease agreement is available below.</p>
                           <div className="list-group mt-3">
                              <div className="list-group-item d-flex justify-content-between align-items-center p-3">
                                 <div><h6 className="mb-0">Signed Lease Agreement</h6></div>
                                 <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">View</a>
                              </div>

                              {showExtension && (extStatus === '' || extStatus === 'None') && (
                                 <ExtensionRequestForm client={client} onSubmitted={refetch} />
                              )}
                              {showExtension && extStatus === 'Requested' && (
                                 <div className="alert alert-warning mt-3">
                                    Your extension request is pending management approval.
                                 </div>
                              )}
                              {showExtension && extStatus === 'Approved' && (
                                 <>
                                    <div className="alert alert-success mt-3">
                                       Your extension request has been approved. Please sign your extension lease below.
                                    </div>
                                    <div className="mt-3">
                                       <SignaturePanel {...signaturePanelProps} />
                                    </div>
                                 </>
                              )}
                              {extStatus === 'Signed' && extensionPdf && (
                                 <div className="list-group-item d-flex justify-content-between align-items-center p-3 mt-3">
                                    <div><h6 className="mb-0">Extension Lease Agreement (Signed)</h6></div>
                                    <a href={extensionPdf} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">View</a>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </main>
         </PageLayout>
      );
   }

   // ── Main sign view ────────────────────────────────────────────────────────
   return (
      <PageLayout page="DocumentSign">
         <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1 bg-field">
            <div className="container container-narrow">
               <div className="row g-5">
                  {/* Document preview */}
                  <div className="col-lg-8">
                     <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
                        <div>
                           <h1 className="display-4 serif-heading heading-hero mb-3 hero-title">Residency Agreement</h1>
                           <p className="mb-0 text-muted fs-5 heading-lead-wide">Unit Selection: {unit} <span>----</span> {address}</p>
                        </div>
                        <div className="d-flex gap-2 mt-3 mt-md-0">
                           <button className="btn btn-action-small">
                              <span className="material-symbols-outlined icon-sm">download</span>
                              Download PDF
                           </button>
                           <button className="btn btn-action-small">
                              <span className="material-symbols-outlined icon-sm">print</span>
                              Print
                           </button>
                        </div>
                     </div>
                     <div className="doc-preview-area">
                        <div className="white-document">
                           <div className="doc-header text-center mb-5">
                              <h2 className="mb-2">SUBLEASE AGREEMENT</h2>
                              <p className="text-uppercase text-muted small tracking-widest doc-tagline">Journey Realty Group LLC</p>
                              <hr className="mx-auto mt-4 doc-divider" />
                           </div>
                           <div className="doc-body text-dark doc-body-text">
                              <section className="mb-4">
                                 <p>This Sublease Agreement is made effective as of <strong>{effectiveDate}</strong>, by and between <strong>JOURNEY REALTY GROUP LLC</strong> ("Lessor"), and <strong>{name}</strong> ("Subtenant").</p>
                              </section>
                              <section className="mb-4">
                                 <h4 className="heading-doc-section mb-2">PREMISES</h4>
                                 <p>Lessor sublets to Subtenant a fully furnished private room located at Unit: <strong>{unit}</strong>, Address: <strong>{address}</strong>.</p>
                              </section>
                              <section className="mb-4">
                                 <h4 className="heading-doc-section mb-2">TERMS AND POSSESSION</h4>
                                 <p>The term of this Sublease will begin on <strong>{startDate}</strong> and will terminate on <strong>{endDate}</strong>. Subtenant shall be entitled to possession once payment of the security deposit has been made.</p>
                              </section>
                              <section className="mb-4">
                                 <h4 className="heading-doc-section mb-2">SUBLEASE PAYMENTS</h4>
                                 <p>Subtenant shall pay to Lessor sublease payments of <strong>${rentAmount}</strong> per month, payable on the second (2nd) of each month.</p>
                              </section>
                              <section className="mb-4">
                                 <h4 className="heading-doc-section mb-2">LATE FEES</h4>
                                 <p>If rent is not submitted on time, a $50 late fee will be charged.</p>
                              </section>
                              <section className="mb-4">
                                 <h4 className="heading-doc-section mb-2">SECURITY DEPOSIT</h4>
                                 <p>Subtenant shall pay a security deposit of <strong>${deposit}</strong> prior to possession. The security deposit will be returned 15 days after the last day of the term, less damages if applicable.</p>
                              </section>
                              <section className="mb-4">
                                 <h4 className="heading-doc-section mb-2">SUBTENANT DETAIL</h4>
                                 <p><strong>Name:</strong> {name}<br /><strong>Phone:</strong> {phone}<br /><strong>Email:</strong> {email}</p>
                              </section>
                              <section className="mb-4">
                                 <h4 className="heading-doc-section mb-2">PAYMENT INFORMATION</h4>
                                 <p>
                                    Account Name: Journey Realty Group LLC<br />
                                    Account Number: 909503879<br />
                                    Routing Number: 021000021<br />
                                    Swift Code: CHASUS33<br />
                                    Email: journeyrealtygroupllc@gmail.com
                                 </p>
                              </section>
                              <section className="mb-4">
                                 <h4 className="heading-doc-section mb-2">PAYMENT PROOF REQUIREMENT</h4>
                                 <p>Tenants must provide proof of rent payment by email to goerealtypayments@gmail.com or text to +1 (929) 241-9530 within 24 hours of payment.</p>
                              </section>
                              <section className="mb-4">
                                 <h4 className="heading-doc-section mb-2">GOVERNING LAW</h4>
                                 <p>This Sublease shall be construed in accordance with the laws of the State of New York. Venue shall be Brooklyn, New York.</p>
                              </section>
                              <section className="mb-4">
                                 <h4 className="heading-doc-section mb-2">CANCELLATION</h4>
                                 <p>If Subtenant leaves before the end of the Sublease, Subtenant shall give 30-day written notice at the beginning of the month. Without notice, Subtenant may be responsible for the last month or forfeiture of deposit.</p>
                              </section>
                              <section className="mb-4">
                                 <h4 className="heading-doc-section mb-2">CARE OF PREMISES</h4>
                                 <p>Subtenant is responsible for maintaining the room, bathroom, kitchen, and common areas clean. Cleaning fee may apply.</p>
                              </section>
                              <section className="mb-4">
                                 <h4 className="heading-doc-section mb-2">SMOKING / ILLEGAL DRUGS</h4>
                                 <p>Smoking and illegal drug use are strictly prohibited.</p>
                              </section>
                              <section className="mb-4">
                                 <h4 className="heading-doc-section mb-2">CHECK-OUT</h4>
                                 <p>Checkout shall be at 12 PM on the last day of the lease. Subtenant must remove all belongings and restore the room to original condition.</p>
                              </section>
                              <div className="mt-5 pt-3 text-center text-muted fst-italic doc-end-preview">
                                 (End of Preview Content)
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Signature panel */}
                  <div className="col-lg-4">
                     <SignaturePanel {...signaturePanelProps} />
                  </div>
               </div>
            </div>
         </main>
      </PageLayout>
   );
}

// ── Signature Panel ───────────────────────────────────────────────────────────
function SignaturePanel({
   activeTab, setActiveTab, verified, setVerified,
   canvasRef, onPointerDown, onPointerMove, onPointerUp,
   clearCanvas, handleAdoptSign, handleSubmitSignature,
   submitting, unit, name,
}) {
   return (
      <div className="auth-card">
         <h2 className="h3 fw-bold text-dark mb-2">Authorize Document</h2>
         <p className="text-muted small mb-5">
            Please provide your signature to finalize the agreement for <strong>{unit}</strong>.
         </p>

         <ul className="nav nav-tabs nav-tabs-custom nav-fill">
            <li className="nav-item">
               <button
                  type="button"
                  className={`nav-link ${activeTab === "type" ? "active" : ""}`}
                  onClick={() => setActiveTab("type")}
               >
                  Type
               </button>
            </li>
            <li className="nav-item">
               {/* Draw tab — disabled, only reachable via Adopt & Sign */}
               <button
                  type="button"
                  className={`nav-link ${activeTab === "draw" ? "active" : ""}`}
                  style={{ pointerEvents: 'none', opacity: activeTab === 'draw' ? 1 : 0.45 }}
                  tabIndex={-1}
               >
                  Draw
               </button>
            </li>
         </ul>

         <div className="tab-content" id="signatureTabContent">
            {activeTab === "type" && (
               <div className="tab-pane show active">
                  <div className="mb-4">
                     <label className="text-uppercase text-muted fw-bold mb-2 d-block doc-label">
                        Full Name
                     </label>
                     <div className="d-flex align-items-center">
                        <input
                           disabled
                           className="signature-input"
                           value={name}
                           type="text"
                        />
                        <span
                           onClick={() => { if (!verified) { setVerified(true); toast.success("Verified Successfully!"); } }}
                           className="ms-2"
                           style={{ cursor: "pointer" }}
                        >
                           {verified
                              ? <i className="bi bi-check-circle-fill fs-3 text-success"></i>
                              : <i className="bi bi-check-circle fs-3 text-success"></i>
                           }
                        </span>
                     </div>
                  </div>
                  <p className="text-muted fst-italic mb-5">
                     By typing your name, you agree that this digital signature is the legal equivalent of your manual signature.
                  </p>
               </div>
            )}

            {activeTab === "draw" && (
               <div className="tab-pane show active">
                  <p className="text-muted small mb-2">Draw your signature below:</p>
                  <canvas
                     ref={canvasRef}
                     width={400}
                     height={150}
                     style={{
                        border: '1px solid #000',
                        width: '100%',
                        height: '150px',
                        display: 'block',
                        background: '#fff',
                        touchAction: 'none',
                        cursor: 'crosshair',
                     }}
                     onPointerDown={onPointerDown}
                     onPointerMove={onPointerMove}
                     onPointerUp={onPointerUp}
                     onPointerLeave={onPointerUp}
                  />
                  <button type="button" className="btn btn-sm btn-outline-secondary mt-2" onClick={clearCanvas}>
                     Clear
                  </button>
               </div>
            )}
         </div>

         <div className="d-grid gap-2 mt-3">
            {activeTab === "type" ? (
               <button
                  className="btn-gold"
                  disabled={!verified}
                  onClick={handleAdoptSign}
               >
                  Adopt &amp; Sign
               </button>
            ) : (
               <button
                  className="btn-gold"
                  disabled={submitting}
                  onClick={handleSubmitSignature}
               >
                  {submitting ? 'Signing...' : 'Submit Signed Lease'}
               </button>
            )}
         </div>

         <div className="security-badge mt-5">
            <span className="material-symbols-outlined text-gold-lock">lock</span>
            <div>
               <div className="text-dark text-uppercase fw-bold security-badge-title">Encrypted Security</div>
               <div className="text-muted security-badge-desc">256-bit SSL network signing environment</div>
            </div>
         </div>
      </div>
   );
}

// ── Extension Request Form ────────────────────────────────────────────────────
function ExtensionRequestForm({ client, onSubmitted }) {
   const [startDate, setStartDate]   = useState('');
   const [endDate, setEndDate]       = useState('');
   const [comment, setComment]       = useState('');
   const [submitting, setSubmitting] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!startDate || !endDate) { toast.error('Please select start and end dates.'); return; }
      setSubmitting(true);
      try {
         const data = await requestLeaseExtension({
            client_id: client.id,
            start_date: startDate,
            end_date: endDate,
            comment,
         });
         if (data.success) {
            toast.success('Extension request submitted!');
            if (onSubmitted) onSubmitted();
         } else {
            toast.error(data.message || 'Request failed.');
         }
      } catch (e) {
         toast.error('Network error. Please try again.');
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className="lease-extension-box border p-4 mt-3">
         <h4 className="h6 fw-bold mb-3">Request Lease Extension</h4>
         <p className="text-muted small">Your current lease end date: <strong>{client?.end_date || ''}</strong></p>
         <form onSubmit={handleSubmit}>
            <div className="mb-3">
               <label className="form-label small fw-bold">New Start Date</label>
               <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div className="mb-3">
               <label className="form-label small fw-bold">New End Date</label>
               <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <div className="mb-3">
               <label className="form-label small fw-bold">Comment</label>
               <textarea className="form-control" rows={3} value={comment} onChange={e => setComment(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-gold w-100" disabled={submitting}>
               {submitting ? 'Submitting...' : 'Submit Extension Request'}
            </button>
         </form>
      </div>
   );
}
