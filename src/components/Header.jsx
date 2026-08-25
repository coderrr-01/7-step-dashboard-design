import Navbar from "./Navbar";
import { createPortal } from "react-dom";
import { IoNotificationsCircleOutline } from "react-icons/io5";
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
   const [open, setOpen] = useState(false);
   const [dropdown, setdropdown] = useState(false);
   const [loggingOut, setLoggingOut] = useState(false);
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

   async function handleLogout() {
      setLoggingOut(true);
      const token = getToken();
      logout(); // clears the local token and remembers it so ?token cannot auto-restore
      const loginUrl = (window.jrnyData?.loginUrl) || 'https://wordpress-1608288-6566160.cloudwaysapps.com/login';

      // Still notify the WP parent (if embedded) so it can run the genuine
      // wp-login.php?action=logout — but DO NOT depend on it: the redirect and
      // server-session invalidation below run regardless of whether the parent
      // listens. Relying only on this postMessage is why logout appeared to do nothing.
      if (window.parent !== window) {
         try { window.parent.postMessage({ type: 'jrny_logout', loginUrl }, '*'); } catch { /* ignore */ }
      }

      // Await the server-side session invalidation so the loader stays visible
      // until logout is actually complete.
      try {
         await wpServerLogout(token);
      } catch { /* best-effort: still redirect even if server call fails */ }

      // Send the whole page (top window, breaking out of the dashboard iframe) to
      // the login page. Falls back to this frame if top navigation is blocked.
      try {
         if (window.top && window.top !== window) {
            window.top.location.replace(loginUrl);
            return;
         }
      } catch { /* cross-origin / sandbox: fall through to same-frame redirect */ }
      window.location.replace(loginUrl);
   }

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
                     <a className="nav-link-custom active" href="#">{ activeLabel }</a>
                     <a className="nav-link-custom" href="#">MY PROFILE</a>
                     <a className="nav-link-custom" href="#">LEASE AGREEMENT</a>
                     <a className="nav-link-custom" href="#">PAYMENT HISTORY</a>
                     <a className="nav-link-custom" href="#">CONTACT US</a>
                  </nav>
               </div>
               <div className="d-flex align-items-center gap-3 user-profile-details">
                  <div className="user-profile new-iconset">
                     <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.25 8.12501C26.25 10.5375 24.2875 12.5 21.875 12.5C19.4625 12.5 17.5 10.5375 17.5 8.12501C17.5 5.71251 19.4625 3.75001 21.875 3.75001C24.2875 3.75001 26.25 5.71251 26.25 8.12501ZM23.75 14.7375C23.125 14.9 22.5 15 21.875 15C20.0527 14.9967 18.3059 14.2713 17.0173 12.9827C15.7287 11.6941 15.0033 9.94735 15 8.12501C15 6.28751 15.725 4.62501 16.875 3.38751C16.6482 3.10943 16.3621 2.88547 16.0378 2.73194C15.7134 2.5784 15.3589 2.49917 15 2.50001C13.625 2.50001 12.5 3.62501 12.5 5.00001V5.36251C8.7875 6.46251 6.25 9.87501 6.25 13.75V21.25L3.75 23.75V25H26.25V23.75L23.75 21.25V14.7375ZM15 28.75C16.3875 28.75 17.5 27.6375 17.5 26.25H12.5C12.5 26.913 12.7634 27.5489 13.2322 28.0178C13.7011 28.4866 14.337 28.75 15 28.75Z" fill="white" />
                        <circle cx="21.9645" cy="8.03572" r="4.82143" fill="#ff0000" />
                     </svg>
                  </div>
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
                  <a href="#">Dashboard</a>
                  <a href="#">My profile</a>
                  <a href="#">Lease agreement</a>
                  <a href="#">Payment history</a>
                  <a href="#">Contact us</a>
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