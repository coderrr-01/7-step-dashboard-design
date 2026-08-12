import { useEffect, useRef, useState } from "react";
import { Routes, useLocation } from "react-router-dom";

const steps = [
   { label: "APPLY", path: "/" },
   { label: "REVIEW", path: "/review" },
   { label: "ROOM SEARCH", path: "/room-search" },
   { label: "INTERVIEW", path: "/interview" },
   { label: "SECURE BOOKING", path: "/secure-booking" },
   { label: "LEASE SIGN", path: "/document-sign" },
   { label: "SECURE PAYMENT", path: "/payment-screen" },
];

const aliases = {
   "/view-room": "/room-search",
   "/Viewphoto": "/room-search",
   "/residence-agreement": "/document-sign",
};

export default function PageTransition({ children }) {
   const location = useLocation();
   const [displayLocation, setDisplayLocation] = useState(location);
   const [stage, setStage] = useState("enter");
   const transitioning = useRef(false);

   const pathKey = aliases[location.pathname] || location.pathname;
   const activeIndex = steps.findIndex((s) => s.path === pathKey);
   const stepNumber = activeIndex >= 0 ? activeIndex + 1 : steps.length;
   const activeStep = steps[activeIndex] || steps[steps.length - 1];
   const progress = (stepNumber / steps.length) * 100;

   useEffect(() => {
      if (location.pathname === displayLocation.pathname) return;
      if (transitioning.current) return;
      transitioning.current = true;
      setStage("exit");
   }, [location, displayLocation]);

   useEffect(() => {
      window.scrollTo(0, 0);
   }, [displayLocation.pathname]);

   const handleAnimationEnd = (e) => {
      if (e.target !== e.currentTarget) return;
      if (stage === "exit") {
         setDisplayLocation(location);
         setStage("enter");
         transitioning.current = false;
      }
   };

   return (
      <>
         <div className="typeform-progress">
            <div
               className="typeform-progress-fill"
               style={{ width: `${progress}%` }}
            />
         </div>
         <div className="typeform-progress-label" key={`${displayLocation.pathname}-label`}>
            <span>{activeStep.label}</span>
            <span>
               {String(stepNumber).padStart(2, "0")}/{String(steps.length).padStart(2, "0")}
            </span>
         </div>
         <div
            key={displayLocation.pathname}
            className={`page-transition ${stage}`}
            onAnimationEnd={handleAnimationEnd}
         >
            <Routes location={displayLocation}>{children}</Routes>
         </div>
      </>
   );
}
