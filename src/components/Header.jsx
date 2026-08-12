import Navbar from "./Navbar";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/images/jrny-logo.png";
import { IoLogOut } from "react-icons/io5";
import { FaFileCircleCheck } from "react-icons/fa6";
import { FaSackDollar } from "react-icons/fa6";
import { MdOutlineAddIcCall } from "react-icons/md";
import { CiSettings } from "react-icons/ci";

export default function Header({ activeLabel }) {
   const [open, setOpen] = useState(false);
   const [dropdown, setdropdown] = useState(false);
   const ref = useRef(null);

   // close when click outside
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (ref.current && !ref.current.contains(event.target)) {
            setdropdown(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);
   return <>
      <div>
         <div className="desktop-menu">
            <header className="navbar-custom d-flex justify-content-between align-items-center">
               <div>
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
                        onClick={() => setdropdown(!dropdown)}
                     >
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 12.5C2.5 7.78625 2.5 5.42875 3.965 3.965C5.43 2.50125 7.78625 2.5 12.5 2.5H17.5C22.2137 2.5 24.5712 2.5 26.035 3.965C27.4987 5.43 27.5 7.78625 27.5 12.5V17.5C27.5 22.2137 27.5 24.5712 26.035 26.035C24.57 27.4987 22.2137 27.5 17.5 27.5H12.5C7.78625 27.5 5.42875 27.5 3.965 26.035C2.50125 24.57 2.5 22.2137 2.5 17.5V12.5ZM9.67375 20.5588C10.8153 19.6827 12.1552 19.1017 13.5749 18.8672C14.9946 18.6328 16.4503 18.752 17.8129 19.2145C19.1755 19.6769 20.403 20.4683 21.3867 21.5184C22.3704 22.5686 23.08 23.8451 23.4525 25.235C23.495 25.3936 23.5059 25.559 23.4845 25.7217C23.4631 25.8845 23.4098 26.0415 23.3278 26.1837C23.2457 26.3258 23.1364 26.4505 23.0062 26.5504C22.876 26.6504 22.7273 26.7237 22.5688 26.7663C22.2485 26.8521 21.9073 26.8072 21.6201 26.6415C21.3329 26.4758 21.1234 26.2027 21.0375 25.8825C20.6817 24.5531 19.8971 23.3784 18.8055 22.5405C17.7138 21.7026 16.3761 21.2484 15 21.2484C13.6239 21.2484 12.2862 21.7026 11.1945 22.5405C10.1029 23.3784 9.31829 24.5531 8.9625 25.8825C8.9236 26.0449 8.85256 26.1979 8.75357 26.3323C8.65457 26.4668 8.52964 26.5801 8.38613 26.6655C8.24263 26.7509 8.08347 26.8067 7.91805 26.8296C7.75263 26.8524 7.5843 26.8419 7.42301 26.7987C7.26172 26.7554 7.11074 26.6802 6.97897 26.5777C6.84721 26.4751 6.73733 26.3471 6.65584 26.2014C6.57434 26.0556 6.52288 25.895 6.50449 25.729C6.48609 25.563 6.50114 25.3951 6.54875 25.235C7.04741 23.3748 8.14585 21.7311 9.67375 20.5588ZM12.5 11.25C12.5 10.587 12.7634 9.95107 13.2322 9.48223C13.7011 9.01339 14.337 8.75 15 8.75C15.663 8.75 16.2989 9.01339 16.7678 9.48223C17.2366 9.95107 17.5 10.587 17.5 11.25C17.5 11.913 17.2366 12.5489 16.7678 13.0178C16.2989 13.4866 15.663 13.75 15 13.75C14.337 13.75 13.7011 13.4866 13.2322 13.0178C12.7634 12.5489 12.5 11.913 12.5 11.25ZM15 6.25C13.6739 6.25 12.4021 6.77678 11.4645 7.71447C10.5268 8.65215 10 9.92392 10 11.25C10 12.5761 10.5268 13.8479 11.4645 14.7855C12.4021 15.7232 13.6739 16.25 15 16.25C16.3261 16.25 17.5979 15.7232 18.5355 14.7855C19.4732 13.8479 20 12.5761 20 11.25C20 9.92392 19.4732 8.65215 18.5355 7.71447C17.5979 6.77678 16.3261 6.25 15 6.25Z" fill="white" />
                           <path d="M22.5 3.125H7.5C5.08375 3.125 3.125 5.08375 3.125 7.5V22.5C3.125 24.9162 5.08375 26.875 7.5 26.875H22.5C24.9162 26.875 26.875 24.9162 26.875 22.5V7.5C26.875 5.08375 24.9162 3.125 22.5 3.125Z" stroke="white" stroke-width="1.16667" />
                        </svg>
                        <span className="user-name">Arjun Mehta</span>
                     </div>
                     <div className={`profile-dropdown ${dropdown ? "active" : ""}`}>
                        <ul>
                           <li className="logout"><span><IoLogOut /></span> Logout</li>
                        </ul>
                     </div>
                  </div>
                  <div className="hamburger" onClick={() => setOpen(true)}>
                     <span></span>
                     <span></span>
                     <span></span>
                  </div>
               </div>
            </header>
         </div>
         <div className="mobile-megamenu">
            {/* MOBILE DRAWER */}
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
         </div>
         <Navbar />
      </div>

   </>;
}