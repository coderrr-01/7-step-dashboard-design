import Navbar from "./Navbar";
import NotificationBell from "./NotificationBell";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/images/jrny-logo.png";
import { IoLogOut } from "react-icons/io5";
import { FaFileCircleCheck } from "react-icons/fa6";
import { FaSackDollar } from "react-icons/fa6";
import { MdOutlineAddIcCall } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { logout, getToken, wpServerLogout } from "../services/api";
import { useClientData } from "../hooks/useClientData";

export default function Header({ activeLabel }) {
   const { client } = useClientData();
   const { pathname } = useLocation();
   const navigate = useNavigate();
   const isDashboard = pathname === "/dashboard";
   const [open, setOpen] = useState(false);
   const [dropdown, setdropdown] = useState(false);
   const [loggingOut, setLoggingOut] = useState(false);
   const [navActive, setNavActive] = useState(""); // currently-flashed header link
   const ref = useRef(null);
   const ddRef = useRef(null);
   // Viewport coords for the portaled dropdown — computed from the trigger
   // rect when it opens. The header is sticky, so the anchor stays put.
   const [ddPos, setddPos] = useState({ top: 0, right: 8 });
   const userName = client?.name || client?.email || 'Loading...';

   const toggleDropdown = () => {
      if (!dropdown) {
         const r = ref.current?.getBoundingClientRect();
         if (r) {
            setddPos({
               top: r.bottom + 10,
               right: Math.max(8, window.innerWidth - r.right),
            });
         }
      }
      setdropdown(!dropdown);
   };

   // Only the dashboard page reacts to the header nav links. On any other page
   // they do nothing, exactly like before.
   const gotoSection = (id) => {
      if (!isDashboard) return;
      setOpen(false);
      setNavActive(id);
      window.dispatchEvent(new CustomEvent("jrny:scrollto-section", { detail: { section: id } }));
   };

   async function handleLogout() {
      setLoggingOut(true);
      await new Promise(r => setTimeout(r, 50));

      logout();
      const loginUrl = (window.jrnyData?.loginUrl) || 'https://staywithjourney.com/login';

      if (window.parent !== window) {
         try { window.parent.postMessage({ type: 'jrny_logout', loginUrl }, '*'); } catch { /* ignore */ }
      }

      // Await server-side session invalidation so the spinner stays visible.
      try {
         await wpServerLogout(token);
      } catch { /* best-effort: still redirect even if server call fails */ }

      // Redirect to login page.
      try {
         if (window.top && window.top !== window) {
            window.top.location.replace(loginUrl);
            return;
         }
      } catch { /* cross-origin / sandbox: fall through to same-frame redirect */ }
      window.location.replace(loginUrl);
   }

   // Re-anchor the profile dropdown under its icon on scroll/resize so it
    // slides with the (sticky) header instead of floating fixed in the viewport.
    useEffect(() => {
      if (!dropdown) return;
      const track = () => requestAnimationFrame(() => {
         const r = ref.current?.getBoundingClientRect();
         if (r) {
            setddPos({
               top: r.bottom + 10,
               right: Math.max(8, window.innerWidth - r.right),
            });
         }
      });
      track();
      window.addEventListener("scroll", track, true);
      window.addEventListener("resize", track);
      return () => {
         window.removeEventListener("scroll", track, true);
         window.removeEventListener("resize", track);
      };
    }, [dropdown]);

    // close when click outside (trigger wrapper OR the portaled dropdown itself)
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (
            ref.current &&
            !ref.current.contains(event.target) &&
            !ddRef.current?.contains(event.target)
         ) {
            setdropdown(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   // Lock background scroll while the mobile drawer is open. The page's scroll
   // container is the root <html> element (body only sets overflow-x), so a
   // body-only lock had no effect — we must lock document.documentElement (and
   // body for good measure). JS-only, no CSS change; overflow:hidden preserves
   // the current scroll position (no jump) and is restored on close.
   useEffect(() => {
      if (!open) return;
      const de = document.documentElement;
      const body = document.body;
      const prevHtmlOverflow = de.style.overflow;
      const prevBodyOverflow = body.style.overflow;
      de.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      return () => {
         de.style.overflow = prevHtmlOverflow;
         body.style.overflow = prevBodyOverflow;
      };
   }, [open]);
   return <>
      <div className="sticky-header">
         <div className="desktop-menu">
            <header className="navbar-custom d-flex justify-content-between align-items-center">
               <div className="logo-img-wrapper">
                 <img src={logo} alt="JRNY Logo" className="navbar-logo" />
               </div>
               <div className="top-header-section">
                  <nav className=" d-md-flex gap-5">
                     <a
                        className="nav-link-custom active"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (isDashboard) window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                     >{ activeLabel }</a>
                     <a
                        className={`nav-link-custom ${isDashboard ? (navActive === "my-profile" ? "active" : "") : ""}`}
                        href="#"
                        onClick={(e) => { e.preventDefault(); gotoSection("my-profile"); }}
                     >MY PROFILE</a>
                     <a
                        className={`nav-link-custom ${isDashboard ? (navActive === "lease-agreement" ? "active" : "") : ""}`}
                        href="#"
                        onClick={(e) => { e.preventDefault(); gotoSection("lease-agreement"); }}
                     >LEASE AGREEMENT</a>
                     <a
                        className={`nav-link-custom ${isDashboard ? (navActive === "payment-history" ? "active" : "") : ""}`}
                        href="#"
                        onClick={(e) => { e.preventDefault(); gotoSection("payment-history"); }}
                     >PAYMENT HISTORY</a>
                     <a
                        className={`nav-link-custom ${isDashboard ? (navActive === "contact-us" ? "active" : "") : ""}`}
                        href="#"
                        onClick={(e) => { e.preventDefault(); gotoSection("contact-us"); }}
                     >CONTACT US</a>
                  </nav>
               </div>
<div className="d-flex align-items-center gap-3 user-profile-details">
                   <NotificationBell client={client} />
                   <div className="profile-wrapper" ref={ref}>
                     <div
                        className="user-profile new-iconset"
                        onClick={toggleDropdown}
                      >
                    
<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_77_8841)">
<path d="M21.3388 3.66116C18.9779 1.30024 15.8388 0 12.5 0C9.16119 0 6.02207 1.30024 3.66116 3.66116C1.30024 6.02207 0 9.16119 0 12.5C0 15.8388 1.30024 18.9779 3.66116 21.3388C6.02207 23.6998 9.16119 25 12.5 25C15.8388 25 18.9779 23.6998 21.3388 21.3388C23.6998 18.9779 25 15.8388 25 12.5C25 9.16119 23.6998 6.02207 21.3388 3.66116ZM5.42507 20.9618C5.83782 17.4103 8.8913 14.6683 12.5 14.6683C14.4024 14.6683 16.1913 15.4095 17.5369 16.7549C18.6737 17.8919 19.3907 19.3764 19.5751 20.9616C17.6582 22.567 15.1901 23.5352 12.5 23.5352C9.80988 23.5352 7.34196 22.5672 5.42507 20.9618ZM12.5 13.1596C10.4067 13.1596 8.70342 11.4563 8.70342 9.36298C8.70342 7.26948 10.4067 5.56641 12.5 5.56641C14.5933 5.56641 16.2966 7.26948 16.2966 9.36298C16.2966 11.4563 14.5933 13.1596 12.5 13.1596ZM20.8359 19.7233C20.4626 18.2184 19.6842 16.8308 18.5726 15.7192C17.6723 14.819 16.6073 14.1436 15.4457 13.7203C16.8421 12.7733 17.7614 11.1734 17.7614 9.36298C17.7614 6.46191 15.4011 4.10156 12.5 4.10156C9.59892 4.10156 7.23858 6.46191 7.23858 9.36298C7.23858 11.1744 8.15868 12.7748 9.5562 13.7217C8.48751 14.1111 7.49855 14.7133 6.64768 15.506C5.41553 16.6534 4.5599 18.1166 4.16317 19.7222C2.48299 17.7853 1.46484 15.2594 1.46484 12.5C1.46484 6.41518 6.41518 1.46484 12.5 1.46484C18.5848 1.46484 23.5352 6.41518 23.5352 12.5C23.5352 15.2599 22.5166 17.7864 20.8359 19.7233Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_77_8841">
<rect width="25" height="25" fill="white"/>
</clipPath>
</defs>
</svg>

                        <span className="user-name">{userName}</span>
                      </div>
                  </div>
                  {/* LOGOUT DROPDOWN — portaled to <body> with position:fixed
                      (coords from the trigger rect). Inside the header it was
                      trapped in stacking contexts and hid behind the header /
                      stepper bar on iOS. Portaled + z-index 2200 = always on
                      top of the header too. */}
                  {createPortal(
                     <div
                        className={`profile-dropdown ${dropdown ? "active" : ""}`}
                        ref={ddRef}
                        style={{ top: ddPos.top, right: ddPos.right }}
                     >
                        <div className="pd-user">
                           <span className="pd-avatar">
                              {(userName || "U").charAt(0).toUpperCase()}
                           </span>
                           <div className="pd-user-info">
                              <span className="pd-user-name">{userName}</span>
                              <span className="pd-user-sub">Signed in</span>
                           </div>
                        </div>
                        <ul>
                           <li
                             className="logout"
                             role="button"
                             tabIndex={0}
                             /* onClick, NOT onMouseDown — iOS Safari never
                                fires mousedown for taps on plain <li>, so
                                logout worked on Android but died on iPhone */
                             onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                             onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                   e.preventDefault();
                                   handleLogout();
                                }
                             }}
                           ><span><IoLogOut /></span> Logout {loggingOut && <span className="logout-spinner"></span>}</li>
                        </ul>
                     </div>,
                     document.body,
                  )}
                  <div className="hamburger" onClick={() => setOpen(true)}>
                     <span></span>
                     <span></span>
                     <span></span>
                  </div>
               </div>
            </header>
         </div>
         {/* MOBILE DRAWER — portaled to <body> (same as nav-panel) so its
             position:fixed always anchors to the viewport. Inside
             .page-transition the retained animation filter creates a
             containing block and the drawer scrolled away with the page. */}
         {createPortal(
            <>
               <div className={`mobile-drawer ${open ? "active" : ""}`}>
                  <div className="drawer-header">
                     <button className="close-btn" onClick={() => setOpen(false)}>✕</button>
                     <img src={logo} alt="JRNY Logo" className="drawer-logo" />
                  </div>
                  <a
                     href="#"
                     onClick={(e) => {
                        e.preventDefault();
                        setOpen(false);
                        if (isDashboard) {
                           window.scrollTo({ top: 0, behavior: "smooth" });
                        } else {
                           navigate("/dashboard");
                        }
                     }}
                  >Dashboard</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); gotoSection("my-profile"); }}>My profile</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); gotoSection("lease-agreement"); }}>Lease agreement</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); gotoSection("payment-history"); }}>Payment history</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); gotoSection("contact-us"); }}>Contact us</a>
               </div>
               {/* OVERLAY */}
               {open && <div className="overlay" onClick={() => setOpen(false)} />}
            </>,
            document.body,
         )}
         <Navbar />
      </div>

   </>;
}