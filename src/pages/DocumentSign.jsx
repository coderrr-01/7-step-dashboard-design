import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { toast } from "react-toastify";
import {
  FaFileSignature,
  FaDownload,
  FaPrint,
  FaShieldHalved,
  FaCheck,
  FaLandmark,
  FaPen,
  FaLock,
} from "react-icons/fa6";
import "../assets/styles/document-sign-style.css";

export default function DocumentSign() {
  const [verfiyeActive, setverfiyeActive] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [activeTab, setActiveTab] = useState("type");

  const verifyData = () => {
    if (verfiyeActive) return;
    setverfiyeActive(true);
    toast.success("Verified Successfully!");
    setIsVerified(true);
  };

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
                  Unit Selection: The Victorian Premier — Suite 422B
                </p>
              </div>
            </div>
            <div className="ds-header-actions">
              <button className="ds-header-btn">
                <FaDownload /> Download PDF
              </button>
              <button className="ds-header-btn">
                <FaPrint /> Print
              </button>
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
                    <h2 className="ds-doc-org-name">
                      Heritage Residency Institutions
                    </h2>
                    <p className="ds-doc-org-tag">
                      Excellence, Community &amp; Scholastic Integrity
                    </p>
                    <hr className="ds-doc-divider" />
                  </div>

                  <div className="ds-doc-body">
                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">1</span>
                        Parties &amp; Property
                      </h4>
                      <p>
                        This Residency Agreement ("Agreement") is entered into
                        this day by and between{" "}
                        <strong>Heritage Residency Group</strong> ("The
                        Institution") and the individual identified in Step 1 of
                        the application ("The Resident"). The property referred
                        to as "The Victorian Premier" is located at 12 Highgate
                        Mews, London SW1.
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">2</span>
                        Term &amp; Tenure
                      </h4>
                      <p>
                        The term of this residency shall commence on September
                        1, 2024, and terminate on July 31, 2025. The Resident is
                        granted exclusive occupancy of Suite 422B and shared
                        access to the Heritage Archives, The Atrium, and private
                        dining facilities.
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">3</span>
                        Institutional Covenants
                      </h4>
                      <p>
                        The Resident agrees to uphold the prestige and decorum
                        of the institution. This includes adherence to the quiet
                        study protocols in shared corridors between the hours of
                        10:00 PM and 7:00 AM. Failure to maintain professional
                        standards may result in a review of residency privileges
                        by the Board of Governors.
                      </p>
                    </section>

                    <section className="ds-doc-section">
                      <h4 className="ds-doc-section-title">
                        <span className="ds-doc-section-num">4</span>
                        Financial Obligations
                      </h4>
                      <p>
                        Rent and associated service charges are as outlined in
                        the "Financials" section of the application. All
                        payments must be settled by the 1st of each month via
                        the secure portal provided by the Registry.
                      </p>
                    </section>

                    <div className="ds-doc-end">
                      (End of Preview Content)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Authorize section */}
            <aside className="ds-auth-card">
              <div className="ds-auth-head">
                <span className="ds-auth-icon">
                  <FaPen />
                </span>
                <h2 className="ds-auth-title">Authorize Document</h2>
              </div>
              <p className="ds-auth-sub">
                Please provide your signature to finalize the agreement for{" "}
                <strong>The Victorian Premier</strong>.
              </p>

              <div className="ds-tabs">
                <button
                  type="button"
                  className={`ds-tab ${activeTab === "type" ? "active" : ""}`}
                  onClick={() => setActiveTab("type")}
                >
                  Type
                </button>
                <button
                  type="button"
                  className={`ds-tab ${activeTab === "draw" ? "active" : ""}`}
                  onClick={() => setActiveTab("draw")}
                >
                  Draw
                </button>
              </div>

              {activeTab === "type" && (
                <div>
                  <label className="ds-label">Full Name</label>
                  <div className="ds-sign-row">
                    <input
                      disabled
                      className="ds-sign-input"
                      value="Arjun mehta"
                      type="text"
                    />
                    <span
                      onClick={verifyData}
                      className={`ds-sign-check ${verfiyeActive ? "verified" : ""}`}
                      style={{ cursor: "pointer" }}
                    >
                      <FaCheck />
                    </span>
                  </div>
                  <p className="ds-legal-note">
                    By typing your name, you agree that this digital signature
                    is the legal equivalent of your manual signature.
                  </p>
                </div>
              )}

              {activeTab === "draw" && (
                <div>
                  <label className="ds-label">Draw Signature</label>
                  <div className="ds-draw-area">
                    <div className="ds-draw-icon">
                      <FaPen />
                    </div>
                    Sign here...
                  </div>
                </div>
              )}

              <button
                className="ds-sign-btn"
                disabled={!isVerified}
                onClick={() => setActiveTab("draw")}
              >
                <FaFileSignature /> Adopt &amp; Sign
              </button>

              <div className="ds-security">
                <span className="ds-security-icon">
                  <FaLock />
                </span>
                <div>
                  <div className="ds-security-title">Encrypted Security</div>
                  <div className="ds-security-desc">
                    256-bit SSL network signing environment
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
