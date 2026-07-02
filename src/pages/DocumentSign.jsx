import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { toast } from "react-toastify";
export default function DocumentSign() {
   const [verfiyeActive, setverfiyeActive] = useState(false)
   const [isVerified, setIsVerified] = useState(false)

   const verifyData = () => {
      if (verfiyeActive) return;
      setverfiyeActive(true)
      toast.success("Verified Successfully!")
      setIsVerified(true)

   }
   const [activeTab, setActiveTab] = useState("type");
   return (
      <PageLayout page="DocumentSign">
         {/* Main Content */}
         <main className="container-fluid py-5 px-lg-5 flex-grow-1 bg-field">
            <div className="container container-narrow">
               <div className="row g-5">
                  {/* Document Section */}
                  <div className="col-lg-8">
                     <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
                        <div>
                           <h1 class="display-4 serif-heading heading-hero mb-3 hero-title">Residency Agreement</h1>
                           <p class="mb-0 text-muted fs-5 heading-lead-wide">Unit Selection: The Victorian Premier <span>----</span> Suite 422B</p>
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
                                 <p>This Residency Agreement ("Agreement") is entered into this day by and between <strong>Heritage Residency Group</strong> ("The Institution") and the individual identified in Step 1 of the application ("The Resident"). The property referred to as "The Victorian Premier" is located at 12 Highgate Mews, London SW1.</p>
                              </section>
                              <section className="mb-5">
                                 <h4 className="heading-doc-section mb-3">2. Term &amp; Tenure</h4>
                                 <p>The term of this residency shall commence on September 1, 2024, and terminate on July 31, 2025. The Resident is granted exclusive occupancy of Suite 422B and shared access to the Heritage Archives, The Atrium, and private dining facilities.</p>
                              </section>
                              <section className="mb-5">
                                 <h4 className="heading-doc-section mb-3">3. Institutional Covenants</h4>
                                 <p>The Resident agrees to uphold the prestige and decorum of the institution. This includes adherence to the quiet study protocols in shared corridors between the hours of 10:00 PM and 7:00 AM. Failure to maintain professional standards may result in a review of residency privileges by the Board of Governors.</p>
                              </section>
                              <section className="mb-5">
                                 <h4 className="heading-doc-section mb-3">4. Financial Obligations</h4>
                                 <p>Rent and associated service charges are as outlined in the "Financials" section of the application. All payments must be settled by the 1st of each month via the secure portal provided by the Registry.</p>
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
                        <p className="text-muted small mb-5">Please provide your signature to finalize the agreement for <strong>The Victorian Premier</strong>.</p>
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
                                             value="Arjun mehta"
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
                              {/* DRAW TAB */}
                              {activeTab === "draw" && (
                                 <div className="tab-pane show active">
                                    <div className="border rounded p-5 text-center text-muted draw-signature-area">
                                       Sign here...
                                    </div>
                                 </div>
                              )}
                           </div>
                           <div className="tab-pane fade" id="draw" role="tabpanel">
                              <div className="border rounded p-5 text-center text-muted mb-4 draw-signature-area">
                                 Sign here...
                              </div>
                           </div>
                        </div>
                        <div className="d-grid gap-2">
                           <button className="btn-gold" disabled={!isVerified} onClick={() => setActiveTab("draw")}>  Adopt &amp; Sign</button>
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

