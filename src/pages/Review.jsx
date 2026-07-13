import PageLayout from "../components/PageLayout";
import { MdMarkEmailRead } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../assets/styles/style.css";

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
         <main className="container-xxl pb-lg-5 my-lg-5">
            <div className="row align-items-center g-5">
               {/* Left Visual */}
               <div className="col-md-5 text-center">
                  {/* <div className="orbitCard">
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
                  </div> */}
                  <div className="verification-house-card">
                     <div className="house-background-grid"></div>

                     <svg
                        className="house-svg"
                        viewBox="0 0 620 440"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Animated house verification illustration"
                     >
                        <defs>
                           <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                              <feGaussianBlur stdDeviation="4" result="blur" />
                              <feMerge>
                                 <feMergeNode in="blur" />
                                 <feMergeNode in="SourceGraphic" />
                              </feMerge>
                           </filter>

                           <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#c6a15c" />
                              <stop offset="50%" stopColor="#f4ddb0" />
                              <stop offset="100%" stopColor="#9f7837" />
                           </linearGradient>
                        </defs>


                        <g className="svg-line decorative-line">
                           <path d="M330 55 V105" />
                           <path d="M355 78 H465" />
                           <path d="M365 94 H445" />
                        </g>


                        <g className="svg-line measurement-lines">
                           <path d="M92 105 V355" />
                           <path d="M84 105 H100" />
                           <path d="M84 355 H100" />

                           <path d="M125 390 H505" />
                           <path d="M125 382 V398" />
                           <path d="M505 382 V398" />

                           <path d="M92 105 H230" className="dashed" />
                           <path d="M92 355 H180" className="dashed" />
                        </g>


                        <g className="house-drawing" filter="url(#goldGlow)">

                           <path className="svg-line house-line"
                              d="M135 205 L250 95 L365 205" />

                           <path className="svg-line house-line"
                              d="M155 205 L250 115 L345 205" />


                           <path className="svg-line house-line"
                              d="M300 130 H445 L520 205 H365" />

                           <path className="svg-line house-line thin"
                              d="M327 130 L400 205" />

                           <path className="svg-line house-line thin"
                              d="M365 130 L438 205" />

                           <path className="svg-line house-line thin"
                              d="M405 130 L478 205" />


                           <path className="svg-line house-line"
                              d="M180 118 V82 H218 V118" />

                           <path className="svg-line house-line"
                              d="M174 82 H224 V94 H180" />


                           <path className="svg-line house-line"
                              d="M155 205 V350 H455 V205" />


                           <path className="svg-line house-line"
                              d="M455 205 H520 V350 H455" />


                           <path className="svg-line house-line"
                              d="M365 205 V260 H455" />

                           <path className="svg-line house-line"
                              d="M388 220 H438 V246 H388 Z" />


                           <path className="svg-line house-line"
                              d="M220 185 V155
                     C220 125 280 125 280 155
                     V185 Z"/>

                           <path className="svg-line house-line thin"
                              d="M250 135 V185" />

                           <path className="svg-line house-line thin"
                              d="M220 158 H280" />


                           <path className="svg-line house-line"
                              d="M180 250 H220 V310 H180 Z" />

                           <path className="svg-line house-line thin"
                              d="M200 250 V310" />

                           <path className="svg-line house-line"
                              d="M245 245 H310 V350 H245 Z" />

                           <circle className="door-handle" cx="298" cy="299" r="3" />


                           <path className="svg-line house-line"
                              d="M365 245 H485 V350 H365 Z" />

                           <path className="svg-line house-line thin"
                              d="M365 270 H485 M365 295 H485 M365 320 H485" />


                           <path className="svg-line house-line"
                              d="M130 350 H510" />

                           <path className="svg-line house-line"
                              d="M155 350 L135 370 H335 L315 350" />

                           <path className="svg-line house-line thin"
                              d="M170 365 H315" />
                        </g>


                        <g className="svg-line decorative-dashes">
                           <path d="M55 225 H125" className="dashed" />
                           <path d="M500 225 H565" className="dashed" />
                           <path d="M530 250 V330" className="dashed" />
                           <path d="M250 375 V420" className="dashed" />
                        </g>


                        <g className="dot-pattern dot-pattern-top">
                           <circle cx="500" cy="58" r="2" />
                           <circle cx="515" cy="58" r="2" />
                           <circle cx="530" cy="58" r="2" />
                           <circle cx="545" cy="58" r="2" />

                           <circle cx="500" cy="73" r="2" />
                           <circle cx="515" cy="73" r="2" />
                           <circle cx="530" cy="73" r="2" />
                           <circle cx="545" cy="73" r="2" />

                           <circle cx="500" cy="88" r="2" />
                           <circle cx="515" cy="88" r="2" />
                           <circle cx="530" cy="88" r="2" />
                           <circle cx="545" cy="88" r="2" />
                        </g>

                        <g className="dot-pattern dot-pattern-bottom">
                           <circle cx="45" cy="365" r="2" />
                           <circle cx="60" cy="365" r="2" />
                           <circle cx="75" cy="365" r="2" />

                           <circle cx="45" cy="380" r="2" />
                           <circle cx="60" cy="380" r="2" />
                           <circle cx="75" cy="380" r="2" />

                           <circle cx="45" cy="395" r="2" />
                           <circle cx="60" cy="395" r="2" />
                           <circle cx="75" cy="395" r="2" />
                        </g>
                     </svg>

                     <div className="verification-scan-line"></div>


                     <span className="gold-particle particle-one"></span>
                     <span className="gold-particle particle-two"></span>
                     <span className="gold-particle particle-three"></span>
                     <span className="gold-particle particle-four"></span>
                     <span className="gold-particle particle-five"></span>
                  </div>




               </div>
               {/* Right Status Card */}
               {/* <div className="col-md-7">
                  <div className="verification-card">
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
                        <Link to="/room-search">
                           <button className="btn btn-jrny-dark w-100 shadow-lg">View Submitted Dossier</button>
                        </Link>

                     </div>
                  </div>
                  <p className="mt-4 text-center text-md-start fst-italic text-muted small">
                     "Preserving legacy through meticulous verification."
                  </p>
               </div> */}
               <div className="col-md-7">
                  <div className="verification-card">
                     {/* Decorative Guilloche */}
                     <div className="guilloche-corner">
                        <svg className="text-primary w-100 h-100" viewBox="0 0 100 100">
                           <path
                              d="M100 0 Q 80 0 80 20 Q 80 40 100 40"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                           />
                           <path
                              d="M100 10 Q 85 10 85 25 Q 85 40 100 40"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                           />
                        </svg>
                     </div>

                     <div className="mb-4">
                        <div className="d-flex align-items-center gap-3 mb-3">
                           <span className="status-badge">Current Status: Pending</span>
                           <span className="ref-number">Ref: HR-2024-0892</span>
                        </div>

                        <h3 className="display-serif h2 mb-3">
                           Verification in Progress
                        </h3>

                        <p className="fs-5 text-muted lh-base">
                           Your application record is currently being processed by our residency
                           specialists. This manual review ensures all provided lineage,
                           financial, and academic documents meet the Heritage Residency's
                           archival standards.
                        </p>
                     </div>

                     <hr className="my-4 review-divider" />

                     <div className="mb-5">
                        <div className="d-flex align-items-start gap-3 mb-4">
                           <span className="material-symbols-outlined text-primary-container">
                              <MdMarkEmailRead />
                           </span>

                           <div>
                              <h4 className="h6 mb-1">Next Step: Email Notification</h4>
                              <p className="text-muted small mb-0">
                                 You will receive a formal invitation once your interview is
                                 approved. Expected turnaround: 3-5 business days.
                              </p>
                           </div>
                        </div>

                        <div className="d-flex align-items-start gap-3">
                           <span className="material-symbols-outlined text-primary-container">
                              <FaFileAlt />
                           </span>

                           <div>
                              <h4 className="h6 mb-1">Document Integrity</h4>
                              <p className="text-muted small mb-0">
                                 Your uploaded files have been encrypted and stored in our
                                 secure private vault.
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* Desktop Button */}
                     <div className="d-none d-md-block">
                        <Link to="/room-search">
                           <button className="btn btn-jrny-dark w-100 shadow-lg">
                              View Submitted Dossier
                           </button>
                        </Link>
                     </div>

                     {/* Mobile Loader */}
                     <div className="d-flex d-md-none justify-content-center">
                        <div className="verification-loader">
                           <div className="loader-ring"></div>

                           <div className="loader-content">
                              <span className="loader-dot"></span>
                              <p>Verification in Progress...</p>
                           </div>
                        </div>
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

