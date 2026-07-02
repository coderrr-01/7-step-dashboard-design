import PageLayout from "../components/PageLayout";
import ResidenceSlider from "./Partial-element/ResidenceSlider";
import Calendar from "./Partial-element/Calendar.jsx";
import InterviewSchedule from "./Partial-element/InterviewSchedule.jsx";
import Timeslot from "./Partial-element/Timeslot.jsx";
import { useNavigate } from 'react-router-dom';
export default function SecureBooking() {
   const navigate = useNavigate();
   const viewroombtn = () => {
      navigate('/view-room');
   }
   const securePlaneblock = ""

   return (
      <PageLayout page="SecureBooking">
         {/* BEGIN: MainContent */}
         <main className="container-fluid py-5 px-lg-5 flex-grow-1 scheduling-section bg-field">
            <div className="container container-narrow">
               <div class="row mb-5">
                  <div class="col-lg-8">
                     <h1 class="display-4 serif-heading heading-hero mb-3 hero-title">Available Residences</h1>
                     <p class="mb-0 text-muted fs-5 heading-lead-wide">Browse our curated collection of heritage-preserved living spaces. Each residence has been meticulously restored to offer contemporary comfort within a historical framework.</p>
                  </div>
               </div>
               <section className="residency-card">
                  {/* Selected Residence Summary */}
                  <div className="selected-residence-header">
                     <span className="selected-badge">SELECTED</span>
                     <ResidenceSlider />
                     <div className="p-3 w-50 d-flex flex-column" data-purpose="residence-details">
                        <div className="d-flex justify-content-between setPricingblock">
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
                        <div className="mt-4">
                           <button className="btn btn-gold mb-2 w-50" onClick={viewroombtn}>View Room</button>
                        </div>
                     </div>
                  </div>
                  <InterviewSchedule datatext="securePlaneblock" />
               </section>
            </div>
         </main>


      </PageLayout>
   );
}

