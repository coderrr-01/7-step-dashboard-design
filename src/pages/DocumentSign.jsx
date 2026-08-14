import { useState, useRef, useEffect } from "react";
import PageLayout from "../components/PageLayout";
import { toast } from "react-toastify";
import { useClientData } from "../hooks/useClientData";
import { signLease, requestLeaseExtension } from "../services/api";
import { useSteps } from "../context/StepContext";
import {
  FaFileSignature,
  FaDownload,
  FaPrint,
  FaCheck,
  FaLandmark,
  FaPen,
  FaLock,
} from "react-icons/fa6";
import "../assets/styles/document-sign-style.css";
import { useNavigate } from 'react-router-dom';

export default function DocumentSign() {
  const { client, loading, refetch } = useClientData();
  const { completeStep } = useSteps();

  const [activeTab, setActiveTab] = useState("type");
  const [verfiyeActive, setverfiyeActive] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [signedPdf, setSignedPdf] = useState(
    () => localStorage.getItem("jrny_signed_lease") || ""
  );
  const [selectedRoom] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jrny_selected_room') || 'null'); }
    catch { return null; }
  });

  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const hasSigned = useRef(false);

  useEffect(() => {
    if (client?.signed_lease) {
      setSignedPdf(client.signed_lease);
      localStorage.setItem("jrny_signed_lease", client.signed_lease);
    }
  }, [client?.signed_lease]);

  // ── Canvas setup ──────────────────────────────────────────────────────────
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111";
  };

  useEffect(() => {
    if (activeTab === "draw") setTimeout(setupCanvas, 100);
  }, [activeTab]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    drawing.current = true;
    hasSigned.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const onPointerMove = (e) => {
    if (!drawing.current || !canvasRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const onPointerUp = (e) => {
    e.preventDefault();
    drawing.current = false;
    if (canvasRef.current) canvasRef.current.getContext("2d").closePath();
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    canvasRef.current
      .getContext("2d")
      .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    hasSigned.current = false;
  };

  const verifyData = () => {
    if (verfiyeActive) return;
    setverfiyeActive(true);
    toast.success("Verified Successfully!");
    setIsVerified(true);
  };

  // "Adopt & Sign" button on Type tab → switches to Draw tab
  const handleAdoptSign = () => setActiveTab("draw");

  // Submit drawn signature → call API
  const handleSubmitSignature = async () => {
    if (!client) {
      toast.error("Client data not loaded. Please refresh.");
      return;
    }
    if (!hasSigned.current) {
      toast.error("Please draw your signature first.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await signLease({
        client_id: client.id,
        signature: canvasRef.current.toDataURL("image/png"),
      });
      if (res.success) {
        setSignedPdf(res.signed_pdf);
        localStorage.setItem("jrny_signed_lease", res.signed_pdf);
        completeStep(6);
        toast.success("Lease signed successfully!");
        await refetch();
      } else {
        toast.error(res.message || "Signing failed. Please try again.");
      }
    } catch (e) {
      toast.error(e.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived values from Zoho CRM client ───────────────────────────────────
  const name = client?.name || "";
  const unit = client?.unit || client?.room_name || "The Victorian Premier";
  const address = client?.address || "Suite 422B";
  const effectiveDate = client?.effective_date || "";
  const extStatus = client?.extension_status || "";
  const extensionPdf = client?.extension_signed_pdf || "";

  // Use requested dates when extension is Approved
  const startDate =
    extStatus === "Approved" && client?.requested_start_date
      ? client.requested_start_date
      : client?.start_date || "September 1, 2024";
  const endDate =
    extStatus === "Approved" && client?.requested_end_date
      ? client.requested_end_date
      : client?.end_date || "July 31, 2025";

  // Amounts: prefer the Zoho client record, fall back to the persisted
  // selected room (which carries the Zoho monthly_rent / security_deposit).
  const rentAmount =
    client?.rent_amount ||
    selectedRoom?.monthly_rent ||
    selectedRoom?.price ||
    "N/A";
  const deposit = client?.security_deposit || selectedRoom?.security_deposit || "N/A";
  const phone = client?.phone || "";
  const email = client?.email || "";

  // Show extension block if lease ends within 40 days
  const showExtension = (() => {
    if (!client?.end_date) return false;
    const today = new Date();
    const end = new Date(client.end_date);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return end >= today && diff <= 40;
  })();

  const signaturePanelProps = {
    activeTab,
    setActiveTab,
    verified: isVerified,
    setVerified: setIsVerified,
    verfiyeActive,
    verifyData,
    canvasRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    clearCanvas,
    handleAdoptSign,
    handleSubmitSignature,
    submitting,
    unit,
    name,
  };

   const paymentbtn = () => {
        Navigate('/payment-screen');
    }

  // ── Already signed — show PDF + extension states ──────────────────────────
  if (!loading && (signedPdf || client?.signed_lease)) {
    const pdfUrl = signedPdf || client.signed_lease;
    return (
      <PageLayout page="DocumentSign">
        <main className="ds-page-bg container-fluid px-lg-5 ">
          <div className="ds-ambient">
            <span className="ds-blob ds-blob-1"></span>
            <span className="ds-blob ds-blob-2"></span>
          </div>
          <div className="ds-center container container-narrow ">
            <div className="ds-header">
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span className="ds-header-icon">
                  <FaFileSignature />
                </span>
                <div>
                  <h1 className="ds-header-title">Residency Agreement</h1>
                  <p className="ds-header-sub">
                    Unit Selection: {unit} — {address}
                  </p>
                </div>
              </div>
              <div className="ds-header-actions">
                <a className="ds-header-btn" href={pdfUrl} target="_blank" rel="noreferrer">
                  <FaDownload /> Download PDF
                </a>
                {/* <button className="ds-header-btn" onClick={() => window.print()}>
                  <FaPrint /> Print
                </button> */}
              </div>
            </div>

            <div className="ds-layout d-block">
              <div className="ds-doc-card">
                <div className="ds-doc-toolbar">
                  <span className="ds-doc-toolbar-title">
                    <FaLandmark /> Signed Lease Agreement
                  </span>
                  <span className="ds-doc-toolbar-badge">
                    <FaCheck /> Signed
                  </span>
                </div>

                <div className="ds-doc-paper">
                  <div className="ds-doc-sheet">
                    <p className="ds-success-note">
                      Your signed lease agreement is available below.
                    </p>

                    <div className="ds-signed-row">
                      <div>
                        <div className="ds-signed-label">Signed Lease Agreement</div>
                      </div>
                      <a className="ds-view-btn" href={pdfUrl} target="_blank" rel="noreferrer">
                        View
                      </a>
                    </div>

                    {showExtension && (extStatus === "" || extStatus === "None") && (
                      <ExtensionRequestForm client={client} onSubmitted={refetch} />
                    )}
                    {showExtension && extStatus === "Requested" && (
                      <div className="ds-alert ds-alert-warning">
                        Your extension request is pending management approval.
                      </div>
                    )}
                    {showExtension && extStatus === "Approved" && (
                      <>
                        <div className="ds-alert ds-alert-success">
                          Your extension request has been approved. Please sign your
                          extension lease below.
                        </div>
                        <div style={{ marginTop: 16 }}>
                          <SignaturePanel {...signaturePanelProps} />
                        </div>
                      </>
                    )}
                    {extStatus === "Signed" && extensionPdf && (
                      <div className="ds-signed-row">
                        <div>
                          <div className="ds-signed-label">
                            Extension Lease Agreement (Signed)
                          </div>
                        </div>
                        <a className="ds-view-btn" href={extensionPdf} target="_blank" rel="noreferrer">
                          View
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button type="button" onClick={paymentbtn} className="btn btn-black mt-5 mobile-view-btn">SECURE PAYMENT NOW<i class="bi bi-arrow-right"></i></button>
            </div>
          </div>
        </main>
      </PageLayout>
    );
  }

  // ── Main sign view ────────────────────────────────────────────────────────
  return (
    <PageLayout page="DocumentSign">
      <main className="ds-page-bg">
        <div className="ds-ambient">
          <span className="ds-blob ds-blob-1"></span>
          <span className="ds-blob ds-blob-2"></span>
        </div>

        <div className="ds-center">
          {/* Page header */}
          <div className="ds-header">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span className="ds-header-icon">
                <FaFileSignature />
              </span>
              <div>
                <h1 className="ds-header-title">Residency Agreement</h1>
                <p className="ds-header-sub">
                  Unit Selection: {unit} — {address}
                </p>
              </div>
            </div>
            <div className="ds-header-actions">
              <button className="ds-header-btn">
                <FaDownload /> Download PDF
              </button>
              {/* <button className="ds-header-btn">
                <FaPrint /> Print
              </button> */}
            </div>
          </div>

          <div className="ds-layout">
            {/* Document section */}
            <div className="ds-doc-card">
              <div className="ds-doc-toolbar">
                <span className="ds-doc-toolbar-title">
                  <FaLandmark /> Agreement Document
                </span>
                <span className="ds-doc-toolbar-badge">
                  <FaCheck /> Ready to Sign
                </span>
              </div>

              <div className="ds-doc-paper">
                <div className="ds-doc-sheet">
                  <div className="ds-doc-org">
                    <span className="ds-doc-org-seal">
                      <FaLandmark />
                    </span>
                    <h2 className="ds-doc-org-name">Journey Realty Group LLC</h2>
                    <p className="ds-doc-org-tag">
                      Journey Realty Group LLC — Sublease Agreement
                    </p>
                    <hr className="ds-doc-divider" />
                  </div>

                  <div className="ds-doc-body">
                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">1</span>
                        Parties &amp; Effective Date
                      </h4>
                      <p>
                        This Sublease Agreement is made effective as of{" "}
                        <strong>{effectiveDate}</strong>, by and between{" "}
                        <strong>JOURNEY REALTY GROUP LLC</strong> ("Lessor"), and{" "}
                        <strong>{name}</strong> ("Subtenant").
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">2</span>
                        Premises
                      </h4>
                      <p>
                        Lessor sublets to Subtenant a fully furnished private room
                        located at Unit: <strong>{unit}</strong>, Address:{" "}
                        <strong>{address}</strong>.
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">3</span>
                        Terms and Possession
                      </h4>
                      <p>
                        The term of this Sublease will begin on{" "}
                        <strong>{startDate}</strong> and will terminate on{" "}
                        <strong>{endDate}</strong>. Subtenant shall be entitled to
                        possession once payment of the security deposit has been
                        made.
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">4</span>
                        Sublease Payments
                      </h4>
                      <p>
                        Subtenant shall pay to Lessor sublease payments of{" "}
                        <strong>${rentAmount}</strong> per month, payable on the
                        second (2nd) of each month.
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">5</span>
                        Late Fees
                      </h4>
                      <p>If rent is not submitted on time, a $50 late fee will be charged.</p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">6</span>
                        Security Deposit
                      </h4>
                      <p>
                        Subtenant shall pay a security deposit of{" "}
                        <strong>${deposit}</strong> prior to possession. The security
                        deposit will be returned 15 days after the last day of the
                        term, less damages if applicable.
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">7</span>
                        Subtenant Detail
                      </h4>
                      <p>
                        <strong>Name:</strong> {name}
                        <br />
                        <strong>Phone:</strong> {phone}
                        <br />
                        <strong>Email:</strong> {email}
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">8</span>
                        Payment Information
                      </h4>
                      <p>
                        Account Name: Journey Realty Group LLC
                        <br />
                        Account Number: 909503879
                        <br />
                        Routing Number: 021000021
                        <br />
                        Swift Code: CHASUS33
                        <br />
                        Email: journeyrealtygroupllc@gmail.com
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">9</span>
                        Payment Proof Requirement
                      </h4>
                      <p>
                        Tenants must provide proof of rent payment by email to
                        goerealtypayments@gmail.com or text to +1 (929) 241-9530
                        within 24 hours of payment.
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">10</span>
                        Governing Law
                      </h4>
                      <p>
                        This Sublease shall be construed in accordance with the laws
                        of the State of New York. Venue shall be Brooklyn, New York.
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">11</span>
                        Cancellation
                      </h4>
                      <p>
                        If Subtenant leaves before the end of the Sublease, Subtenant
                        shall give 30-day written notice at the beginning of the
                        month. Without notice, Subtenant may be responsible for the
                        last month or forfeiture of deposit.
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">12</span>
                        Care of Premises
                      </h4>
                      <p>
                        Subtenant is responsible for maintaining the room, bathroom,
                        kitchen, and common areas clean. Cleaning fee may apply.
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">13</span>
                        Smoking / Illegal Drugs
                      </h4>
                      <p>Smoking and illegal drug use are strictly prohibited.</p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">14</span>
                        Check-out
                      </h4>
                      <p>
                        Checkout shall be at 12 PM on the last day of the lease.
                        Subtenant must remove all belongings and restore the room to
                        original condition.
                      </p>
                    </section>

                    <div className="ds-doc-end">(End of Preview Content)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature panel */}
            <SignaturePanel {...signaturePanelProps} />
          </div>
        </div>
      </main>
    </PageLayout>
  );
}

// ── Signature Panel ───────────────────────────────────────────────────────────
function SignaturePanel({
  activeTab,
  setActiveTab,
  verified,
  verfiyeActive,
  verifyData,
  canvasRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  clearCanvas,
  handleAdoptSign,
  handleSubmitSignature,
  submitting,
  unit,
  name,
}) {
  return (
    <aside className="ds-auth-card">
      <div className="ds-auth-head">
        <span className="ds-auth-icon">
          <FaPen />
        </span>
        <h2 className="ds-auth-title">Authorize Document</h2>
      </div>
      <p className="ds-auth-sub">
        Please provide your signature to finalize the agreement for{" "}
        <strong>{unit}</strong>.
      </p>

      <div className="ds-tabs">
        <button
          type="button"
          className={`ds-tab ${activeTab === "type" ? "active" : ""}`}
          onClick={() => setActiveTab("type")}
        >
          Type
        </button>
        {/* Draw tab — disabled, only reachable via Adopt & Sign */}
        <button
          type="button"
          className={`ds-tab ${activeTab === "draw" ? "active" : ""}`}
          style={{ pointerEvents: "none", opacity: activeTab === "draw" ? 1 : 0.45 }}
          tabIndex={-1}
        >
          Draw
        </button>
      </div>

      {activeTab === "type" && (
        <div>
          <label className="ds-label">Full Name</label>
          <div className="ds-sign-row">
            <input disabled className="ds-sign-input" value={name} type="text" />
            <span
              onClick={verifyData}
              className={`ds-sign-check ${verfiyeActive ? "verified" : ""}`}
              style={{ cursor: "pointer" }}
            >
              <FaCheck />
            </span>
          </div>
          <p className="ds-legal-note">
            By typing your name, you agree that this digital signature is the legal
            equivalent of your manual signature.
          </p>
        </div>
      )}

      {activeTab === "draw" && (
        <div>
          <label className="ds-label">Draw Signature</label>
          <canvas
            ref={canvasRef}
            className="ds-canvas"
            width={400}
            height={150}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          />
          <button type="button" className="ds-clear-btn" onClick={clearCanvas}>
            Clear
          </button>
        </div>
      )}

      {activeTab === "type" ? (
        <button className="ds-sign-btn" disabled={!verified} onClick={handleAdoptSign}>
          <FaFileSignature /> Adopt &amp; Sign
        </button>
      ) : (
        <button className="ds-sign-btn" disabled={submitting} onClick={handleSubmitSignature}>
          {submitting ? "Signing..." : "Submit Signed Lease"}
        </button>
      )}

      <div className="ds-security">
        <span className="ds-security-icon">
          <FaLock />
        </span>
        <div>
          <div className="ds-security-title">Encrypted Security</div>
          <div className="ds-security-desc">256-bit SSL network signing environment</div>
        </div>
      </div>
    </aside>
  );
}

// ── Extension Request Form ────────────────────────────────────────────────────
function ExtensionRequestForm({ client, onSubmitted }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await requestLeaseExtension({
        client_id: client.id,
        start_date: startDate,
        end_date: endDate,
        comment,
      });
      if (data.success) {
        toast.success("Extension request submitted!");
        if (onSubmitted) onSubmitted();
      } else {
        toast.error(data.message || "Request failed.");
      }
    } catch (e) {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ds-extension-box">
      <h4 className="ds-extension-title">Request Lease Extension</h4>
      <p className="ds-extension-sub">
        Your current lease end date: <strong>{client?.end_date || ""}</strong>
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label className="ds-label">New Start Date</label>
          <input
            type="date"
            className="ds-sign-input"
            style={{ width: "100%" }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label className="ds-label">New End Date</label>
          <input
            type="date"
            className="ds-sign-input"
            style={{ width: "100%" }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label className="ds-label">Comment</label>
          <textarea
            className="ds-sign-input"
            style={{ width: "100%", resize: "vertical" }}
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button type="submit" className="ds-sign-btn" style={{ marginTop: 0 }} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Extension Request"}
        </button>
      </form>
    </div>
  );
}
