import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import "../../assets/styles/Navigator-style.css"
import { FaLock, FaUnlock } from "react-icons/fa";
import { FaCompass } from "react-icons/fa6";
import stepsConfig from "../../config/stepsConfig";
import { useSteps } from "../../context/StepContext";

export default function Navigator({ activeStep = 1, totalSteps = 7, title }) {
  const [open, setOpen] = useState(false);
  const { completedSteps, canAccessStep } = useSteps();

  // Lock background scroll while the panel is open — same approach as the
  // mobile drawer in Header.jsx. The page's scroll container is the root
  // <html> element (body only sets overflow-x), so BOTH must be locked.
  // overflow:hidden preserves the current scroll position (no jump) and is
  // restored on close. The panel itself keeps its own overflow:auto, so it
  // can still scroll internally.
  useEffect(() => {
    if (!open) return;
    const de = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = de.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    de.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      de.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [open]);

  // Journey finished end-to-end (e.g. both payments done)? Then the whole
  // timeline reads Completed — no Active/Upcoming/Locked leftovers.
  const journeyComplete = stepsConfig.every((s) => completedSteps.includes(s.number));

  const getStepState = (stepNumber) => {
    if (journeyComplete) return "completed";
    // The screen the user is ON always shows as Active — even if its
    // completion was already recorded. Completed must therefore be checked
    // AFTER active, otherwise the current step renders as "Completed".
    if (stepNumber === activeStep) return "active";
    // Any step BEFORE the one the user is on is finished by definition —
    // e.g. reaching Review via "View Review Status" must show APPLY as
    // Completed, never Upcoming.
    if (completedSteps.includes(stepNumber) || stepNumber < activeStep) return "completed";
    if (!canAccessStep(stepNumber)) return "muted";
    return "inactive";
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
      case "muted":
        return "Locked";
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
      {createPortal(
        <>
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
                          {state === "completed" || state === "active" ? <FaUnlock /> : <FaLock />}
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
        </>,
        document.body,
      )}
    </>
  );
}
