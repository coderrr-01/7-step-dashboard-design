import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navigator from "../pages/Partial-element/Navigator";
import { FaHome } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import stepsConfig from "../config/stepsConfig";
import { useSteps } from "../context/StepContext";

const steps = stepsConfig.map(({ label, path, number }) => ({ label, path, number }));

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const { canAccessStep, completedSteps, currentStep } = useSteps();

  const [open, setOpen] = useState(false);

  const activePath =
    pathname === "/view-room"
      ? "/room-search"
      : pathname === "/residence-agreement"
        ? "/document-sign"
        : pathname;

  const activeStepData = steps.find(s => s.path === activePath) || steps[0];
  const activeLabel    = activeStepData.label;
  const activeStep     = activeStepData.number;
  const totalSteps     = steps.length;

  const handleStepClick = (step) => {
    if (!canAccessStep(step.number)) return; // locked — do nothing
    navigate(step.path);
  };

  const getStepClass = (step) => {
    const isActive    = activePath === step.path;
    const isCompleted = completedSteps.includes(step.number);
    const isLocked    = !canAccessStep(step.number);
    const isFirst     = step.number === 1;
    const isLast      = step.number === steps.length;

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
            <div className="homepage_icon" onClick={() => navigate("/")}>
              <FaHome />
              <span className="home-nav">DASHBOARD</span>
            </div>
          </div>
        )}

        {/* Desktop Stepper */}
        <div className={`desktopview-stepper ${pathname === "/payment-screen" ? "payment-active" : ""}`}>
          <div className="stepper-container">
            {steps.map((step, index) => {
              const isLocked = !canAccessStep(step.number);
              return (
                <div
                  key={step.path}
                  className={getStepClass(step)}
                  onClick={() => handleStepClick(step)}
                  style={{ cursor: isLocked ? 'not-allowed' : 'pointer', userSelect: 'none' }}
                  title={isLocked ? `Complete step ${step.number - 1} first` : step.label}
                >
                  <span>{step.label}</span>
                  {index !== steps.length - 1 && (
                    <div className="step-separator"></div>
                  )}
                </div>
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
