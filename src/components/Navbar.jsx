import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navigator from "../pages/Partial-element/Navigator";
import { FaHome } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import stepsConfig from "../config/stepsConfig";
import { useSteps } from "../context/StepContext";

const steps = stepsConfig.map(({ label, path, number }) => [label, path, number]);

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { canAccessStep, completedSteps } = useSteps();

  const [open, setOpen] = useState(false);

  const activePath =
    pathname === "/view-room"
      ? "/room-search"
      : pathname === "/residence-agreement"
        ? "/document-sign"
        : pathname;

  const activeStepData =
    steps.find(([, path]) => path === activePath) || steps[0];

  const activeLabel = activeStepData[0];
  const activeStep = activeStepData[2];
  const totalSteps = steps.length;

  const homepageNavigate = () => {
    navigate("/");
  }

  const handleStepClick = (step, e) => {
    // Forward-only navigation: the header must never move the user between steps.
    // The user advances only through each page's own Continue/Confirm/Submit
    // action. Clicking the step you are already on is a harmless no-op; every
    // other step — a completed one (backward) or a locked one (forward) — is
    // blocked here so the user always stays on the current active step.
    if (step[1] !== activePath) {
      e.preventDefault();
      return;
    }
  };

  const getStepClass = (step) => {
    const isActive    = activePath === step[1];
    const isCompleted = completedSteps.includes(step[2]);
    const isLocked    = !canAccessStep(step[2]);
    const isFirst     = step[2] === 1;
    const isLast      = step[2] === steps.length;

    return [
      'stepper-item',
      isActive    ? 'active'    : '',
      isCompleted ? 'completed' : '',
      isLocked    ? 'locked'    : '',
      isFirst     ? 'first'     : '',
      isLast      ? 'last'      : '',
    ].filter(Boolean).join(' ');
  };

  return (
    <div className="stepper-container-fluid p-0">
      <div className="stepper-row">

        {/* Dashboard */}
        {pathname !== "/payment-screen" && (
          <div className="stepper-dashboard-box">
            <div className="homepage_icon" onClick={homepageNavigate}>
              <FaHome />
              <span className="home-nav">DASHBOARD</span>
            </div>
          </div>
        )}

        {/* Desktop Stepper */}
        <div className={`desktopview-stepper ${pathname === "/payment-screen" ? "payment-active" : ""
          }`}>
          <div className="stepper-container">
            {steps.map((step) => {
              const isCurrent = step[1] === activePath;   // the only interactive step
              // Only the current step behaves like a link. Completed (previous) and
              // future steps are non-interactive: no pointer cursor and no tooltip
              // that suggests they can be opened. Click is blocked in handleStepClick.
              return (
                <Link
                  key={step[1]}
                  to={step[1]}
                  onClick={(e) => handleStepClick(step, e)}
                  className={getStepClass(step)}
                  style={{ cursor: isCurrent ? 'pointer' : 'not-allowed', userSelect: 'none' }}
                  title={isCurrent ? step[0] : ''}
                  aria-disabled={isCurrent ? undefined : 'true'}
                >
                  <span>{step[0]}</span>

                  {step[2] !== steps.length && (
                    <div className="step-separator"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className="mobile-stepper">
          <div className="custom-dropdown">

            <div
              className={`selected ${open ? "open" : ""}`}
              onClick={() => setOpen(!open)}
            >
              {activeLabel}
            </div>

          </div>
        </div>

        {/* Navigator */}
        <div className="stepper-completion">
          <Navigator 
            title={activeLabel} 
            activeStep={activeStep}
            totalSteps={totalSteps}
          />
        </div>

      </div>
    </div>
  );
}
