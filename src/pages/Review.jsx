import PageLayout from "../components/PageLayout";
import { MdMarkEmailRead } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
export default function Review() {
   return (
      <PageLayout page="Review">
         <section className="step-header">
            <div className="container-fluid">
               <div className="container container-narrow">
                  <div className="row">
                     <div className="col-lg-8">
                        <h1 className="display-4 serif-heading heading-hero mb-3 hero-title">In Review</h1>
                        <p className="mb-0 text-muted fs-5 heading-lead-wide">Our specialist committee is currently verifying your submitted documentation and identity credentials for the 2026 intake cycle.</p>
                     </div>
                  </div>
               </div>

            </div>
         </section>
         {/* Main Content */}
         <main className="container-xxl py-5 my-lg-5">
            <div className="row align-items-center g-5">
               {/* Left Visual */}
               <div className="col-md-5 text-center">
                  <div className="orbitCard">
                     <div className="orbit-loader">
                        <div className="orbit-ring"></div>
                        <div className="orbit-line">
                           <span className="orbit-dot"></span>
                        </div>

                        <div className="center-circle">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M8 8h8v8H8z" stroke="#fff" strokeWidth="2" />
                              <path d="M6 6l12 12" stroke="#fff" strokeWidth="2" />
                           </svg>
                        </div>
                     </div>
                  </div>

                  {/* <div className="status-visual-container">
       
                        <div className="glow-effect"></div>
                        <svg className="w-100 h-100 text-primary-container spinning-svg" viewBox="0 0 200 200">
                           <circle cx="100" cy="100" fill="none" r="80" stroke="currentColor" stroke-dasharray="4 4" strokeWidth="0.5"></circle>
                           <circle cx="100" cy="100" fill="none" r="60" stroke="currentColor" strokeWidth="1"></circle>
                           <g className="orbit-dot">
                              <circle cx="100" cy="40" fill="currentColor" r="4"></circle>
                           </g>
                           <path className="opacity-50" d="M70 100 L90 120 L130 80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                           <rect fill="none" height="30" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 100 100)" width="30" x="85" y="85"></rect>
                        </svg>
                        <div className="position-absolute top-50 start-50 translate-middle">
                           <span className="material-symbols-outlined fs-1 text-primary" style={{ fontVariationSettings: "'wght' 200" }}></span>
                        </div>
                     </div> */}
               </div>
               {/* Right Status Card */}
               <div className="col-md-7">
                  <div className="verification-card">
                     {/* Decorative Guilloche */}
                     <div className="guilloche-corner">
                        <svg className="text-primary w-100 h-100" viewBox="0 0 100 100">
                           <path d="M100 0 Q 80 0 80 20 Q 80 40 100 40" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
                           <path d="M100 10 Q 85 10 85 25 Q 85 40 100 40" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
                        </svg>
                     </div>
                     <div className="mb-4">
                        <div className="d-flex align-items-center gap-3 mb-3">
                           <span className="status-badge">Current Status: Pending</span>
                           <span className="ref-number">Ref: HR-2024-0892</span>
                        </div>
                        <h3 className="display-serif h2 mb-3">Verification in Progress</h3>
                        <p className="fs-5 text-muted lh-base">
                           Your application record is currently being processed by our residency specialists. This manual review ensures all provided lineage, financial, and academic documents meet the Heritage Residency's archival standards.
                        </p>
                     </div>
                     <hr className="my-4 review-divider" />
                     <div className="mb-5">
                        <div className="d-flex align-items-start gap-3 mb-4">
                           <span className="material-symbols-outlined text-primary-container"><MdMarkEmailRead /></span>
                           <div>
                              <h4 className="h6 mb-1">Next Step: Email Notification</h4>
                              <p className="text-muted small mb-0">You will receive a formal invitation once your interview is approved. Expected turnaround: 3-5 business days.</p>
                           </div>
                        </div>
                        <div className="d-flex align-items-start gap-3">
                           <span className="material-symbols-outlined text-primary-container"><FaFileAlt /></span>
                           <div>
                              <h4 className="h6 mb-1">Document Integrity</h4>
                              <p className="text-muted small mb-0">Your uploaded files have been encrypted and stored in our secure private vault.</p>
                           </div>
                        </div>
                     </div>
                     <div>
                        <button className="btn btn-jrny-dark w-100 shadow-lg">View Submitted Dossier</button>
                     </div>
                  </div>
                  <p className="mt-4 text-center text-md-start fst-italic text-muted small">
                     "Preserving legacy through meticulous verification."
                  </p>
               </div>
            </div>
         </main>
         {/* Footer */}

      </PageLayout>
   );
}

