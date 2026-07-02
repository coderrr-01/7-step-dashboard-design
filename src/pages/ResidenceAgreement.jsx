import PageLayout from "../components/PageLayout";

export default function ResidenceAgreement() {
  return (
    <PageLayout page="ResidenceAgreement">
          <main className="flex-grow-1">
              <div className="pdf-viewer-container">
                  <div className="pdf-toolbar">
                      <div className="d-flex align-items-center">
                          <span className="small fw-bold opacity-50 text-uppercase tracking-widest pdf-toolbar-label">RESIDENCY_AGREEMENT_V2.PDF</span>
                      </div>
                      <div className="d-flex align-items-center gap-4">
                          <div className="d-flex align-items-center bg-white bg-opacity-10 rounded px-2 py-1">
                              <button className="btn btn-link p-0 text-white border-0 opacity-75"><i data-lucide="minus"
                                      className="lucide-icon-sm"></i></button>
                              <span className="small fw-bold mx-2 pdf-zoom-label">100%</span>
                              <button className="btn btn-link p-0 text-white border-0 opacity-75"><i data-lucide="plus"
                                      className="lucide-icon-sm"></i></button>
                          </div>
                          <div className="small opacity-50 ps-3 border-start border-white border-opacity-25 pdf-page-label">
                              Page <span className="fw-bold">1</span> of 3
                          </div>
                          <div className="d-flex gap-3 ms-2">
                              <button className="btn btn-link p-0 text-white opacity-50"><i data-lucide="search"
                                      className="lucide-icon-md"></i></button>
                              <button className="btn btn-link p-0 text-white opacity-50"><i data-lucide="printer"
                                      className="lucide-icon-md"></i></button>
                              <button className="btn btn-link p-0 text-white opacity-50"><i data-lucide="download"
                                      className="lucide-icon-md"></i></button>
                          </div>
                      </div>
                  </div>
                  <div className="pdf-main-area">
                      <div className="pdf-thumbnails">
                          <div className="thumbnail-item active">
                              <div className="w-100 h-100 bg-white p-2">
                                  <div className="thumbnail-line-lg"></div>
                                  <div className="thumbnail-line-sm"></div>
                                  <div className="thumbnail-line-sm"></div>
                                  <div className="thumbnail-line-sm-short"></div>
                              </div>
                          </div>
                          <div className="thumbnail-item">
                              <div className="w-100 h-100 bg-white p-2 opacity-50">
                                  <div className="thumbnail-line-lg"></div>
                                  <div className="thumbnail-line-sm"></div>
                              </div>
                          </div>
                          <div className="thumbnail-item">
                              <div className="w-100 h-100 bg-white p-2 opacity-50">
                                  <div className="thumbnail-line-lg"></div>
                              </div>
                          </div>
                      </div>
                      <div className="pdf-content-pane">
                          <div className="paper-document">
                              <header className="text-center mb-5">
                                  <h1 className="display-5 fw-bold mb-2 serif">Residency Agreement</h1>
                                  <p className="text-uppercase small tracking-widest fw-bold doc-gold-subtitle">
                                      Elite Residency Concierge Service</p>
                                  <div className="mx-auto mt-4 doc-gold-line"></div>
                              </header>
                              <div className="doc-body">
                                  <p className="mb-4">This Residency Agreement (the "Agreement") is entered into as of this day by
                                      and between the applicant and Elite Residency Concierge. This document outlines the
                                      comprehensive terms of residency approval and the mandate for correct service provision.
                                  </p>
                                  <h2 className="h5 fw-bold mb-3 serif">1. Terms of Residency</h2>
                                  <p className="mb-4">Elite Residency Agreement encompasses the associated with our nationwide
                                      assortment of classic and unique residential services. We will leverage our professional
                                      network to process applications, provides assistance with visas, and coordinate with
                                      relevant government entities for your residency status.</p>
                                  <p className="mb-4">The applicant agrees to provide all necessary documentation including
                                      financial statements, identification papers, and background checks as requested by the
                                      county or state authorities.</p>
                                  <h2 className="h5 fw-bold mb-3 serif">2. Digital Signature Authorization</h2>
                                  <p>By adopting the digital signature below, the applicant acknowledges that they have read,
                                      understood, and agreed to be bound by the terms and conditions set forth in this
                                      Residency Agreement. This electronic signature shall carry the same legal weight as a
                                      physical ink signature.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="signature-section">
                  <div className="container">
                      <div className="row justify-content-center">
                          <div className="col-lg-10">
                              <div className="mb-2">
                                  <span className="fw-bold text-uppercase tracking-widest signature-area-label">Signature Area</span>
                              </div>
                              <div className="d-flex align-items-center gap-4 mb-3">
                                  <div className="form-check form-check-inline">
                                      <input checked="" className="form-check-input" id="drawOption" name="sigType" type="radio"
                                          value="draw" />
                                      <label className="form-check-label" htmlFor="drawOption">Draw</label>
                                  </div>
                              </div>
                              <div className="sig-canvas-container">
                                  <div className="sig-canvas-placeholder" id="canvasPlaceholder">Draw Your Signature</div>
                                  <canvas className="sig-canvas" id="signatureCanvas"></canvas>
                              </div>
                              <div className="row g-3 pt-3 border-top border-secondary border-opacity-25">
                                  <div className="col-md-4">
                                      <button className="btn btn-premium-outline">Back to List</button>
                                  </div>
                                  <div className="col-md-4">
                                      <button className="btn btn-premium-outline mb-3"
                                          type="button">Clear
                                          Signature
                                      </button>
                                  </div>
                                  <div className="col-md-4">
                                      <button className="btn btn-premium-solid">Adopt &amp; Sign</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </main>
          <div className="support-chat-box" id="supportChat">
              <div className="chat-header">
                  <span>Support chat</span>
                  <button type="button" className="btn btn-link p-0 text-dark border-0"><i data-lucide="x"
                          className="lucide-icon-sm"></i></button>
              </div>
              <div className="chat-body">
                  Hi, Have any questions? Do you need our support chat you can help.
              </div>
          </div>
          <button type="button" className="chat-toggle-btn">
              <i data-lucide="message-circle" className="lucide-icon-lg"></i>
          </button>
          
    </PageLayout>
  );
}
