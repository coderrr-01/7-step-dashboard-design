import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navigator from "../pages/Partial-element/Navigator";
import { FaHome } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import stepsConfig from "../config/stepsConfig";

const steps = stepsConfig.map(({ label, path, number }) => [label, path, number]);

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

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
            {steps.map(([label, path], index) => (
              <Link
                key={path}
                to={path}
                className={`stepper-item 
                  ${activePath === path ? "active" : ""}
                  ${index === 0 ? "first" : ""}
                  ${index === steps.length - 1 ? "last" : ""}
                `}
              >
                <span>{label}</span>

                {index !== steps.length - 1 && (
                  <div className="step-separator"></div>
                )}
              </Link>
            ))}
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

            {/* {open && (
              <div className="dropdown-list">
                {steps.map(([label, path, number]) => {
                  const isActive = activePath === path;

                  return (
                    <div
                      key={path}
                      className={`dropdown-item ${isActive ? "active" : ""}`}
                      onClick={() => {
                        navigate(path);
                        setOpen(false);
                      }}
                    >
                      {label} {String(number).padStart(2, "0")}/07
                    </div>
                  );
                })}
              </div>
            )} */}
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