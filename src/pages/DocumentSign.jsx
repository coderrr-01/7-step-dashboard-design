import { useState, useRef } from "react";
import PageLayout from "../components/PageLayout";
import { toast } from "react-toastify";
import { useClientData } from "../hooks/useClientData";
import { signLease } from "../services/api";

export default function DocumentSign() {
   const { client, loading } = useClientData();

   const [verfiyeActive, setverfiyeActive] = useState(false);
   const [isVerified, setIsVerified]       = useState(false);
   const [activeTab, setActiveTab]         = useState("type");
   const [submitting, setSubmitting]       = useState(false);
   const [signedPdf, setSignedPdf]         = useState(client?.signed_lease || '');

   // Draw tab canvas
   const canvasRef  = useRef(null);
   const drawing    = useRef(false);
   const hasSigned  = useRef(false);

   const verifyData = () => {
      if (verfiyeActive) return;
      setverfiyeActive(true);
      toast.success("Verified Successfully!");
      setIsVerified(true);
   };

   // Canvas drawing helpers
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

   const getPos = (e) => {
      const canvas = canvasRef.current;
      const rect   = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
   };

   const onPointerDown = (e) => {
      e.preventDefault();
      if (!canvasRef.current) return;
      setupCanvas();
      drawing.current  = true;
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
      const canvas = canvasRef.current;
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      hasSigned.current = false;
   };

   const handleSign = async () => {
      if (!client) {
         toast.error('Client data not loaded. Please refresh.');
         return;
      }

      let signatureData = '';

      if (activeTab === 'draw') {
         if (!hasSigned.current) {
            toast.error('Please draw your signature first.');
            return;
         }
         signatureData = canvasRef.current.toDataURL('image/png');
      } else {
         // Type tab — generate a simple text-based signature image
         if (!isVerified) {
            toast.error('Please verify your name first.');
            return;
         }
         // Create a small canvas to render typed name as signature
         const offscreen = document.createElement('canvas');
         offscreen.width  = 400;
         offscreen.height = 100;
         const ctx = offscreen.getContext('2d');
         ctx.fillStyle = '#fff';
         ctx.fillRect(0, 0, 400, 100);
         ctx.font         = 'italic 36px Georgia, serif';
         ctx.fillStyle    = '#000';
         ctx.fillText(client.name || 'Signature', 20, 65);
         signatureData = offscreen.toDataURL('image/png');
      }

      setSubmitting(true);
      try {
         const res = await signLease({
            client_id: client.id,
            signature: signatureData,
         });

         if (res.success) {
            setSignedPdf(res.signed_pdf);
            toast.success('Lease signed successfully!');
         } else {
            toast.error(res.message || 'Signing failed. Please try again.');
         }
      } catch (e) {
         toast.error(e.message || 'Network error. Please try again.');
      } finally {
         setSubmitting(false);
      }
   };

   // If already signed — show the signed PDF view
   if (signedPdf || (client && client.signed_lease)) {
      const pdfUrl = signedPdf || client.signed_lease;
      return (
         <PageLayout page="DocumentSign">
            <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1 bg-field">
               <div className="container container-narrow">
                  <div className="row g-5">
                     <div className="col-lg-8">
                        <h1 class="display-4 serif-heading heading-hero mb-3 hero-title">Residency Agreement</h1>
                        <p class="mb-0 text-muted fs-5 heading-lead-wide">
                           Unit Selection: {client?.unit ? `Unit ${client.unit}` : 'The Victorian Premier'} <span>----</span> {client?.address || 'Suite 422B'}
                        </p>
                     </div>
                     <div className="col-12">
                        <div className="auth-card p-4">
                           <p style={{ color: 'green' }}>Your signed lease agreement is available below.</p>
                           <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
                              View Signed PDF
                           </a>
                        </div>
                     </div>
                  </div>
               </div>
            </main>
         </PageLayout>
      );
   }

   const displayName = client ? client.name : 'Arjun mehta';
   const unitDisplay = client ? (client.unit ? `Unit ${client.unit}` : 'The Victorian Premier') : 'The Victorian Premier';
   const addressDisplay = client ? (client.address || 'Suite 422B') : 'Suite 422B';
   const startDate  = client ? (client.start_date  || 'September 1, 2024')  : 'September 1, 2024';
   const endDate    = client ? (client.end_date    || 'July 31, 2025')      : 'July 31, 2025';
   const rentAmount = client ? (client.rent_amount || 'N/A')                : 'N/A';
   const deposit    = client ? (client.security_deposit || 'N/A')           : 'N/A';

   return (
      <PageLayout page="DocumentSign">
         <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1 bg-field">
            <div className="container container-narrow">
               <div className="row g-5">
                  {/* Document Section */}
                  <div className="col-lg-8">
                     <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
                        <div>
                           <h1 class="display-4 serif-heading heading-hero mb-3 hero-title">Residency Agreement</h1>
                           <p class="mb-0 text-muted fs-5 heading-lead-wide">Unit Selection: {unitDisplay} <span>----</span> {addressDisplay}</p>
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
                              <h2 className="mb-2">Heritage Residency Institutions</h2>
                              <p className="text-uppercase text-muted small tracking-widest doc-tagline">Excellence, Community &amp; Scholastic Integrity</p>
                              <hr className="mx-auto mt-4 doc-divider" />
                           </div>
                           <div className="doc-body text-dark doc-body-text">
                              <section className="mb-5">
                                 <h4 className="heading-doc-section mb-3">1. Parties &amp; Property</h4>
                                 <p>This Residency Agreement ("Agreement") is entered into this day by and between <strong>Heritage Residency Group</strong> ("The Institution") and <strong>{displayName}</strong> ("The Resident"). The property referred to as <strong>{unitDisplay}</strong> is located at {addressDisplay}.</p>
                              </section>
                              <section className="mb-5">
                                 <h4 className="heading-doc-section mb-3">2. Term &amp; Tenure</h4>
                                 <p>The term of this residency shall commence on <strong>{startDate}</strong>, and terminate on <strong>{endDate}</strong>. The Resident is granted exclusive occupancy of {unitDisplay} and shared access to the Heritage Archives, The Atrium, and private dining facilities.</p>
                              </section>
                              <section className="mb-5">
                                 <h4 className="heading-doc-section mb-3">3. Institutional Covenants</h4>
                                 <p>The Resident agrees to uphold the prestige and decorum of the institution. This includes adherence to the quiet study protocols in shared corridors between the hours of 10:00 PM and 7:00 AM. Failure to maintain professional standards may result in a review of residency privileges by the Board of Governors.</p>
                              </section>
                              <section className="mb-5">
                                 <h4 className="heading-doc-section mb-3">4. Financial Obligations</h4>
                                 <p>Monthly rent: <strong>${rentAmount}</strong>. Security deposit: <strong>${deposit}</strong>. All payments must be settled by the 1st of each month via the secure portal provided by the Registry.</p>
                              </section>
                              <div className="mt-5 pt-5 text-center text-muted fst-italic doc-end-preview">
                                 (End of Preview Content)
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-4">
                     <div className="auth-card">
                        <h2 className="h3 fw-bold text-dark mb-2">Authorize Document</h2>
                        <p className="text-muted small mb-5">Please provide your signature to finalize the agreement for <strong>{unitDisplay}</strong>.</p>
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
                              <button
                                 type="button"
                                 className={`nav-link ${activeTab === "draw" ? "active" : ""}`}
                                 onClick={() => setActiveTab("draw")}
                              >
                                 Draw
                              </button>
                           </li>
                        </ul>
                        <div className="tab-content" id="signatureTabContent">
                           <div className="tab-content">
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
                                             value={displayName}
                                             type="text"
                                          />
                                          <span
                                             onClick={verifyData}
                                             className="ms-2"
                                             style={{ cursor: "pointer" }}
                                          >
                                             {!verfiyeActive && (
                                                <i className="bi bi-check-circle fs-3 text-success"></i>
                                             )}
                                             {verfiyeActive && (
                                                <i className="bi bi-check-circle-fill fs-3 text-success"></i>
                                             )}
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
                        </div>
                        <div className="d-grid gap-2">
                           <button
                              className="btn-gold"
                              disabled={submitting || (activeTab === 'type' && !isVerified)}
                              onClick={handleSign}
                           >
                              {submitting ? 'Signing...' : 'Adopt & Sign'}
                           </button>
                        </div>
                        <div className="security-badge mt-5">
                           <span className="material-symbols-outlined text-gold-lock">lock</span>
                           <div>
                              <div className="text-dark text-uppercase fw-bold security-badge-title">Encrypted Security</div>
                              <div className="text-muted security-badge-desc">256-bit SSL network signing environment</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </PageLayout>
   );
}
