import { useState } from "react";
import PageLayout from "../components/PageLayout";
import Calendar from "./Partial-element/Calendar.jsx";
import InterviewSchedule from "./Partial-element/InterviewSchedule.jsx";
import ResidenceSlider from "./Partial-element/ResidenceSlider.jsx";
import Timeslot from "./Partial-element/Timeslot.jsx";
import { useNavigate } from 'react-router-dom';
export default function Interview() {
   const navigate = useNavigate();
   const viewroombtn = () => {
      navigate('/view-room');
   }


   const [interviewProgres, setinterviewProgres] = useState(false)
   const [Avalableresidence, setAvalableresidence] = useState(true)
   const interview_btn = () => {
      setinterviewProgres(true)
      setAvalableresidence(false)
   }

   return (
      <>


         <PageLayout page="Interview">
            {Avalableresidence &&
               (
                  <>
                     <main className="container-fluid py-5 px-lg-5 flex-grow-1 scheduling-section bg-field">
                        <div className="container container-narrow">

                           <div class="row mb-5">
                              <div class="col-lg-8">
                                 <h1 class="display-4 serif-heading heading-hero mb-3 hero-title">Available Residences</h1>
                                 <p class="mb-0 text-muted fs-5 heading-lead-wide">Browse our curated collection of heritage-preserved living spaces. Each residence has been meticulously restored to offer contemporary comfort within a historical framework.</p>
                              </div>
                           </div>
                           <section className="residency-card">
                              <div className="selected-residence-header">
                                 <span className="selected-badge">SELECTED</span>
                                 <ResidenceSlider />
                                 <div className="p-3 w-50 d-flex flex-column" data-purpose="residence-details">
                                    <div className="d-flex justify-content-between">
                                       <div>
                                          <h4 className="serif-font mb-0 residence-title">The Victorian Premier (1BR)</h4>
                                          <p className="mb-0 residence-meta">East Wing, Floor 4 â€¢ 820 sq.ft â€¢ Limited Availability</p>
                                       </div>
                                       <div className="text-end">
                                          <div className="fw-bold residence-price">$4,850/mo</div>
                                          <div className="residence-price-note">Inclusive of Concierge</div>
                                       </div>
                                    </div>
                                    <div className="d-flex gap-4 mt-3 residence-features">
                                       <span><i className="bi bi-snow2 text-gold me-1"></i> Climate Controlled</span>
                                       <span><i className="bi bi-wifi text-gold me-1"></i> Gigabit Fiber</span>
                                    </div>
                                    <div class="mt-4">
                                       <button className="btn btn-gold mb-2 w-50" onClick={viewroombtn}>View Room</button>
                                    </div>
                                 </div>
                              </div>
                              <InterviewSchedule interview_progress={interview_btn} />
                           </section>
                        </div>
                     </main></>
               )}
            {interviewProgres && (
               <>
                  <section className="step-header">
                     <div className="container-fluid">
                        <div className="container container-narrow">
                           <div className="row">
                              <div className="col-lg-8">
                                 <h1 className="display-4 serif-heading heading-hero mb-3">In Review</h1>
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
                                       <path d="M8 8h8v8H8z" stroke="#B8944F" strokeWidth="2" />
                                       <path d="M6 6l12 12" stroke="#B8944F" strokeWidth="2" />
                                    </svg>
                                 </div>
                              </div>
                           </div>
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
                                 <h3 className="display-serif h2 mb-3">Inerview Verification</h3>
                                 <p className="fs-5 text-muted lh-base">
                                    Your application record is currently being processed by our residency specialists. This manual review ensures all provided lineage, financial, and academic documents meet the Heritage Residency's archival standards.
                                 </p>
                              </div>
                              <hr className="my-4 review-divider" />
                              <div className="mb-5">
                                 <div className="d-flex align-items-start gap-3 mb-4">
                                    <span className="material-symbols-outlined text-primary-container">k</span>
                                    <div>
                                       <h4 className="h6 mb-1">Next Step: Email Notification</h4>
                                       <p className="text-muted small mb-0">You will receive a formal invitation once your interview is approved. Expected turnaround: 3-5 business days.</p>
                                    </div>
                                 </div>
                                 <div className="d-flex align-items-start gap-3">
                                    <span className="material-symbols-outlined text-primary-container">k</span>
                                    <div>
                                       <h4 className="h6 mb-1">Document Integrity</h4>
                                       <p className="text-muted small mb-0">Your uploaded files have been encrypted and stored in our secure private vault.</p>
                                    </div>
                                 </div>
                              </div>
                              <div>
                                 <button className="btn btn-jrny-dark w-100 shadow-lg">Please Wait For Our Response</button>
                              </div>
                           </div>
                           <p className="mt-4 text-center text-md-start fst-italic text-muted small">
                              "Preserving legacy through meticulous verification."
                           </p>
                        </div>
                     </div>
                  </main>
               </>
            )}


         </PageLayout>




      </>

   );
}

