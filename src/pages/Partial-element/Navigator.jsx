import { useState } from "react";
import { IoClose } from "react-icons/io5";
import "../../assets/styles/Navigator-style.css"
import { FaLock, FaUnlock } from "react-icons/fa";
import { FaCompass } from "react-icons/fa6";
import stepsConfig from "../../config/stepsConfig";

export default function Navigator({ activeStep = 1, totalSteps = 7, title }) {
  const [open, setOpen] = useState(false);

  const getStepState = (stepNumber) => {
    if (stepNumber < activeStep) return "completed";
    if (stepNumber === activeStep) return "active";
    if (stepNumber === activeStep + 1) return "inactive";
    return "muted";
  };

  const getTimelineClass = (state) => {
    switch (state) {
      case "completed":
        return "timeline-item";
      case "active":
        return "timeline-item timeline-item-active";
      case "inactive":
        return "timeline-item timeline-item-inactive";
      case "muted":
        return "timeline-item timeline-item-muted";
      default:
        return "timeline-item";
    }
  };

  const getBadgeClass = (state) => {
    switch (state) {
      case "completed":
        return "completed-badges";
      case "active":
        return "active-badges";
      default:
        return "upcoming-badges";
    }
  };

  const getBadgeLabel = (state) => {
    switch (state) {
      case "completed":
        return "Completed";
      case "active":
        return "Active";
      default:
        return "Upcoming";
    }
  };

  return (
    <>
      <div className="navigator-header" onClick={() => setOpen(true)}>
        <div className="navigator-current">
          <span>
            {String(activeStep).padStart(2, "0")}/
            {String(totalSteps).padStart(2, "0")}
          </span>
        </div>
        <FaCompass />
        <h2>{title}</h2>
      </div>
      {open && (
        <div className="nav-overlay" onClick={() => setOpen(false)} />
      )}
      <div className={`nav-panel ${open ? "open" : ""}`}>
        <div className="sidebar-card-gold">
          <div className="d-flex align-items-center timeline-header gap-2">
            <div className="d-flex align-items-center gap-2">
              <div className="phase-indicator-dot"></div>
              <h4 className="heading-section-label">Registration</h4>
            </div>
            <button className="close-btn" onClick={() => setOpen(false)}>
              <IoClose />
            </button>
          </div>
          <div className="timeline-container mb-4">
            <div className="timeline-line"></div>

            {stepsConfig.map((step) => {
              const state = getStepState(step.number);
              return (
                <div key={step.number} className={getTimelineClass(state)}>
                  <div className="timeline-icon-wrapper">
                    <div className="timeline-icon">
                      {state === "active" ? <FaUnlock /> : <FaLock />}
                    </div>
                  </div>
                  <div>
                    <p className={`label-caps mb-1 ${state === "completed" || state === "active" ? "text-primary" : ""}`}>
                      {String(step.number).padStart(2, "0")}
                    </p>
                    <h3 className={`font-archivo h6 fw-bold text-dark mb-2`}>
                      {step.label}
                    </h3>
                    <p className={`small text-muted mb-0 ${state === "active" ? "fst-italic" : ""}`}>
                      {step.description}
                    </p>
                    <div className={getBadgeClass(state)}>
                      {getBadgeLabel(state)}
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </>
  );
}
