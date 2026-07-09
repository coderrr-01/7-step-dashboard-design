import { useState } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import "../../assets/styles/Navigator-style.css"
import { FaLock, FaUnlock } from "react-icons/fa";
import { FaCompass } from "react-icons/fa6";
export default function Navigator({ title  }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="navigator-header" onClick={() => setOpen(true)}>
        <h2>{title}</h2>
      </div>
      {open && (
        <div className="nav-overlay" onClick={() => setOpen(false)} />
      )}
      <div className={`nav-panel ${open ? "open" : ""}`}>

        <div class="sidebar-card-gold">
          <div class="d-flex align-items-center timeline-header gap-2 ">
            <div className="d-flex align-items-center gap-2">
              <div class="phase-indicator-dot"></div>
              <h4 class="heading-section-label">Registration</h4>
            </div>

            <button className="close-btn" onClick={() => setOpen(false)}>
              <IoClose />
            </button>
          </div>
          <div class="timeline-container mb-4">
            <div class="timeline-line"></div>

            <div class="timeline-item">
              <div class="timeline-icon-wrapper">
                <div class="timeline-icon">
                  <FaLock />
                </div>
              </div>
              <div>
                <p class="label-caps text-primary mb-1">01 </p>
                <h3 class="font-archivo h6 fw-bold text-dark mb-2">Apply</h3>
                <p class="small text-muted mb-0">Identity verification and profile setup completed on Oct 12.</p>
                <div className="completed-badges">Completed</div>
              </div>
            </div>

            <div class="timeline-item timeline-item-active">
              <div class="timeline-icon-wrapper">
                <div class="timeline-icon">
                  <FaUnlock />
                </div>
              </div>
              <div>
                <p class="label-caps text-primary mb-1">02 </p>
                <h3 class="font-archivo h6 fw-bold text-dark mb-2">Review</h3>
                <p class="small text-muted fst-italic ">Selecting finishes, layouts, and custom heritage features for your residence.</p>
                <div className="active-badges">Active</div>
              </div>
            </div>

            <div class="timeline-item timeline-item-inactive">
              <div class="timeline-icon-wrapper">
                <div class="timeline-icon">
                  <FaLock />
                </div>
              </div>
              <div>
                <p class="label-caps mb-1">03 </p>
                <h3 class="font-archivo h6 fw-bold text-dark mb-2">Room Search</h3>
                <p class="small text-muted mb-0">Secure verification of prestige-tier funding sources.</p>
                <div className="upcoming-badges">Upcoming</div>
              </div>
            </div>

            <div class="timeline-item timeline-item-inactive">
              <div class="timeline-icon-wrapper">
                <div class="timeline-icon">
                  <FaLock />
                </div>
              </div>
              <div>
                <p class="label-caps mb-1">04 </p>
                <h3 class="font-archivo h6 fw-bold mb-1">Interview</h3>
                <p class="small text-muted mb-0">Board review and legal attestation of heritage membership.</p>
                <div className="upcoming-badges">Upcoming</div>
              </div>
            </div>

            <div class="timeline-item timeline-item-muted">
              <div class="timeline-icon-wrapper">
                <div class="timeline-icon">
                  <FaLock />
                </div>
              </div>
              <div>
                <p class="label-caps mb-1">05 </p>
                <h3 class="font-archivo h6 fw-bold mb-1">Secure Booking</h3>
                <p class="small text-muted mb-0">Completion of the Elysian Heritage onboarding journey.</p>
                <div className="upcoming-badges">Upcoming</div>
              </div>
            </div>
            <div class="timeline-item timeline-item-muted">
              <div class="timeline-icon-wrapper">
                <div class="timeline-icon">
                  <FaLock />
                </div>
              </div>
              <div>
                <p class="label-caps mb-1">06 </p>
                <h3 class="font-archivo h6 fw-bold mb-1">Lease Sign</h3>
                <p class="small text-muted mb-0">Completion of the Elysian Heritage onboarding journey.</p>
                <div className="upcoming-badges">Upcoming</div>
              </div>
            </div>
            <div class="timeline-item timeline-item-muted">
              <div class="timeline-icon-wrapper">
                <div class="timeline-icon">
                  <FaLock />
                </div>
              </div>
              <div>
                <p class="label-caps mb-1">07 </p>
                <h3 class="font-archivo h6 fw-bold mb-1">Secure Payment</h3>
                <p class="small text-muted mb-0">Completion of the Elysian Heritage onboarding journey.</p>
                <div className="upcoming-badges">Upcoming</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}