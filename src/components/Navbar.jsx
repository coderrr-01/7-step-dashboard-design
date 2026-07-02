import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navigator from "../pages/Partial-element/Navigator";
import { FaHome } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";

const steps = [
  ["APPLY", "/", 1],
  ["REVIEW", "/review", 2],
  ["ROOM SEARCH", "/room-search", 4],
  ["INTERVIEW", "/interview", 3],
  ["SECURE BOOKING", "/secure-booking", 5],
  ["LEASE SIGN", "/document-sign", 6],
  ["SECURE PAYMENT", "/payment-screen", 7],
];

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

  const homepageNavigate =() =>{
   navigate("/");
  }
  return (
    <div className="container-fluid p-0">
      <div className="stepper-row">

        {/* Dashboard */}
        {pathname !== "/payment-screen" && (
          <div className="stepper-dashboard-box">
            <div className="homepage_icon" onClick={homepageNavigate}>
              <FaHome />
              <span className="home-nav">Dashboard</span>
            </div>
          </div>
        )}

        {/* Desktop Stepper */}
        <div className="desktopview-stepper">
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
          <Navigator />
        </div>

      </div>
    </div>
  );
}