import { useState } from "react";
import PageLayout from "../components/PageLayout";
import BankDeposite from "../pages/Partial-element/BankDeposite"
import stripeIcon from "../assets/icons/stripe.svg";
import paypalIcon from "../assets/icons/paypal.svg";
import Revoulticon from "../assets/icons/revsult.svg";
import bankicon from "../assets/icons/bank.svg";
import CashIcon from "../assets/icons/cash.svg";

export default function PaymentScreen() {
   const [activeStep, setActiveStep] = useState("Security");
   const [activePayment, setActivePayment] = useState(0);
   const paymentMethods = [
      {
         name: "Stripe",
         icon: stripeIcon,
      },
      {
         name: "PayPal",
         icon: paypalIcon,
      },
      {
         name: "Revolut",
         icon: Revoulticon,
      },
      {
         name: "Bank",
         icon: bankicon,
      },
      {
         name: "Cash",
         icon: CashIcon,
      },
   ];

   return (
      <PageLayout page="PaymentScreen">
         <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1">
            <div className="container container-narrow py-5 px-lg-5">
               <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                  <div>
                     <h1 class="display-4 serif-heading heading-hero mb-2 hero-title">
                        Secure Checkout
                     </h1>
                     <p className="mb-0 text-muted fs-5 heading-lead-wide">Complete your residency reservation</p>
                  </div>
               </div>
               <div className="row g-5">

                  <aside className="col-lg-5 order-2 order-lg-1">
                     <div className="checkout-card mb-4">
                        <div className="p-4 border-bottom checkout-summary-header">
                           <h3 className="h5 mb-4">Reservation Summary</h3>
                           <div className="d-flex gap-3">
                              <img alt="The Victorian Premier" className="property-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA4V3fzGFxJRfHod-q3i610fpthD2Ue4VGIGDUje-iPYuVVdhTF9ISMA8pliiKaFrTiBcSdZR99tUouMkDjPEJq7AlRG5GL8uWblUgPopibMVKtg5K3ltNBt_-EWva5iLE2uCGEygHax40C2fDKHRddQUv_dQhbwQD_DLqLe1O952nifBIl5QaWyonzDRKBYcWu_wpXwgQ9Dug7wx2LCyLw5ewlbpMA0tqqKv4mVo6fuavy7TxWhwVlBDwZIsyg_L5joLScmveingP" />
                              <div>
                                 <h4 className="h6 mb-1 fw-bold">The Victorian Premier</h4>
                                 <p className="small text-muted mb-2">King Studio â$¢ East Wing</p>
                                 <div className="d-flex align-items-center gap-1 text-primary-container">
                                    <span className="material-symbols-outlined fs-6">

                                       <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M9.86955 1.56306C9.6878 1.20892 9.39498 1.02144 8.99108 1.00061C8.60738 1.02144 8.31455 1.20892 8.11261 1.56306L6.17391 5.68765L1.81183 6.37509C1.42813 6.43758 1.17569 6.65631 1.05453 7.03127C0.933357 7.42707 1.01414 7.77078 1.29686 8.06242L4.44725 11.2809L3.68995 15.8429C3.64956 16.2387 3.78082 16.5616 4.08375 16.8116C4.40686 17.0407 4.75017 17.0615 5.11368 16.8741L8.99108 14.7493L12.8988 16.8741C13.2421 17.0615 13.5753 17.0407 13.8984 16.8116C14.2215 16.5616 14.3528 16.2387 14.2922 15.8429L13.5652 11.2809L16.7156 8.06242C16.9781 7.77078 17.0589 7.42707 16.9579 7.03127C16.8166 6.65631 16.554 6.43758 16.1703 6.37509L11.8083 5.68765L9.86955 1.56306Z" fill="#B8924A" />
                                       </svg>

                                    </span>
                                    <span className="small fw-bold text-uppercase elite-tier-label">Elite Tier Residence</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="p-4">
                           <div className="d-flex justify-content-between small mb-2">
                              <span className="text-muted">Rent Start Date</span>
                              <span className="fw-medium">September 01, 2024</span>
                           </div>
                           <div className="d-flex justify-content-between small mb-4">
                              <span className="text-muted">Rent End Date</span>
                              <span className="fw-medium">August 31, 2025</span>
                           </div>
                           <hr className="my-4 opacity-10" />
                           <div className="d-flex justify-content-between small mb-2">
                              <span className="text-muted">Security Deposit</span>
                              <span className="fw-medium">$ 1,800.00</span>
                           </div>
                           <div className="d-flex justify-content-between small mb-4">
                              <span className="text-muted">Administrative Fee</span>
                              <span className="fw-medium">$ 0.00</span>
                           </div>
                           <hr className="my-4 opacity-10" />
                           <div className="d-flex justify-content-between align-items-baseline pt-2">
                              <span className="fw-bold">Total Due Now</span>
                              <span className="h4 text-primary-container mb-0 fw-bold">$ 1,800.00</span>
                           </div>
                        </div>
                     </div>
                     <div className="checkout-card p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                           <h3 className="h5 mb-0">Customer Details</h3>
                           <span className="tag-verified">Verified</span>
                        </div>
                        <div className="mb-3">
                           <label className="text-uppercase text-muted fw-bold mb-1 form-label-micro">Full Name</label>
                           <p className="fw-medium mb-0">Julianne Vanes-Harding</p>
                        </div>
                        <div className="row g-3 mb-3">
                           <div className="col-6">
                              <label className="text-uppercase text-muted fw-bold mb-1 form-label-micro">Contact Phone</label>
                              <p className="mb-0"><a className="text-primary-container text-decoration-none fw-medium" href="tel:+12125550198">+1 (212) 555-0198</a></p>
                           </div>
                           <div className="col-6">
                              <label className="text-uppercase text-muted fw-bold mb-1 form-label-micro">Email Address</label>
                              <p className="mb-0 text-truncate fw-medium">vanes@global-exec.com</p>
                           </div>
                        </div>
                        <p className="small text-muted opacity-50 d-flex align-items-center gap-2 mt-3 pt-3 border-top border-light">
                           <span className="material-symbols-outlined icon-xs">
<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.55625 4.95536C6.98542 3.55655 8.61875 2.85714 10.4563 2.85714C12.3229 2.85714 13.9708 3.54167 15.4 4.91071L13.6062 6.74107C13.2854 7.09821 13.2125 7.48512 13.3875 7.90179C13.5625 8.31845 13.8833 8.54167 14.35 8.57143H19.6H19.95C20.5917 8.5119 20.9417 8.15476 21 7.5V1.78571C20.9708 1.30952 20.7521 0.982143 20.3438 0.803571C19.9354 0.625 19.5562 0.699405 19.2062 1.02679L17.3687 2.90179C16.0854 1.59226 14.6125 0.729167 12.95 0.3125C11.2875 -0.104167 9.63958 -0.104167 8.00625 0.3125C6.34375 0.758929 4.87083 1.6369 3.5875 2.94643C2.50833 4.04762 1.73542 5.28274 1.26875 6.65179C1.15208 7.03869 1.16667 7.41071 1.3125 7.76786C1.4875 8.09524 1.75 8.33333 2.1 8.48214C2.47917 8.60119 2.84375 8.58631 3.19375 8.4375C3.51458 8.25893 3.74792 7.99107 3.89375 7.63393C4.24375 6.65179 4.79792 5.75893 5.55625 4.95536ZM0 12.5V12.8571V18.2143C0.0291667 18.6905 0.247917 19.0179 0.65625 19.1964C1.06458 19.375 1.44375 19.3006 1.79375 18.9732L3.63125 17.0982C4.91458 18.4077 6.3875 19.2708 8.05 19.6875C9.7125 20.1042 11.3604 20.1042 12.9937 19.6875C14.6562 19.2411 16.1292 18.3631 17.4125 17.0536C18.4917 15.9524 19.2646 14.7173 19.7313 13.3482C19.8771 12.9613 19.8625 12.5893 19.6875 12.2321C19.5125 11.9048 19.25 11.6667 18.9 11.5179C18.5208 11.3988 18.1562 11.4137 17.8062 11.5625C17.4854 11.7411 17.2521 12.0089 17.1063 12.3661C16.7854 13.378 16.2313 14.2708 15.4438 15.0446C14.0146 16.4435 12.3813 17.1429 10.5437 17.1429C8.67708 17.1429 7.02917 16.4583 5.6 15.0893L7.39375 13.2589C7.71458 12.9018 7.7875 12.5149 7.6125 12.0982C7.4375 11.6815 7.11667 11.4583 6.65 11.4286H1.4H1.05C0.408333 11.4881 0.0583333 11.8452 0 12.5Z" fill="#565656"/>
</svg>
</span>
                           Records synchronized via Journey CRM
                        </p>
                     </div>
                     <div className="merchant-footer text-center">
                        <p className="text-uppercase text-primary-container fw-bold mb-1 security-note">Official Merchant</p>
                        <h4 className="h6 fw-bold mb-2">Journey Realty LLC</h4>
                        <div className="small text-muted mb-3">
                           <p className="mb-0">211 E 43rd Street, New York, NY 10029</p>
                           <p className="mb-0">Tel: <a className="text-primary-container fw-bold text-decoration-none" href="tel:+12125550198">+1 (212) 555-0198</a></p>
                        </div>
                        <a className="text-primary-container fw-bold small text-decoration-none d-flex align-items-center justify-content-center gap-2 mb-3" href="#">
                           <span className="material-symbols-outlined fs-6">
<svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.44146 12.0703C3.83202 11.2891 3.74089 10.5599 3.16808 9.88281C2.30886 8.9974 1.87925 7.99479 1.87925 6.875C1.90529 5.57292 2.4781 4.42708 3.59768 3.4375C4.71727 2.44792 6.22741 1.92708 8.1281 1.875C10.0288 1.92708 11.5389 2.44792 12.6585 3.4375C13.7781 4.42708 14.3509 5.57292 14.377 6.875C14.3509 8.17708 13.7781 9.32292 12.6585 10.3125C11.5389 11.3021 10.0288 11.8229 8.1281 11.875C7.60736 11.875 7.11266 11.8229 6.644 11.7188C6.22741 11.6406 5.83686 11.7057 5.47234 11.9141C5.29008 11.9922 5.12084 12.0703 4.96462 12.1484C4.33974 12.4349 3.68881 12.6693 3.01185 12.8516C3.116 12.6693 3.22015 12.487 3.3243 12.3047C3.37637 12.2266 3.41543 12.1484 3.44146 12.0703ZM0.00459474 6.875C0.0306316 8.54167 0.62948 9.97396 1.80114 11.1719C1.74907 11.25 1.71001 11.3151 1.68397 11.3672C1.29342 12.1224 0.824756 12.8125 0.277982 13.4375C-0.0084237 13.724 -0.0735159 14.0495 0.0827054 14.4141C0.264964 14.7786 0.551369 14.974 0.941922 15C2.66036 14.9219 4.26162 14.5312 5.74573 13.8281C5.92798 13.75 6.11024 13.6719 6.2925 13.5938C6.89135 13.6979 7.50322 13.75 8.1281 13.75C10.4193 13.6979 12.3331 13.0208 13.8692 11.7188C15.4054 10.4427 16.1995 8.82812 16.2516 6.875C16.1995 4.92188 15.4054 3.30729 13.8692 2.03125C12.3331 0.729167 10.4193 0.0520833 8.1281 0C5.83686 0.0520833 3.92315 0.729167 2.38697 2.03125C0.850793 3.30729 0.0566685 4.92188 0.00459474 6.875ZM16.8765 18.75C17.5014 18.75 18.1132 18.6979 18.7121 18.5938C18.8944 18.6719 19.0766 18.75 19.2589 18.8281C20.743 19.5312 22.3442 19.9219 24.0627 20C24.4532 19.974 24.7396 19.7917 24.9219 19.4531C25.0521 19.0625 24.987 18.724 24.7266 18.4375C24.1798 17.8125 23.7112 17.1354 23.3206 16.4062C23.2946 16.3542 23.2685 16.3151 23.2425 16.2891C23.2425 16.263 23.2295 16.224 23.2035 16.1719C24.3751 14.974 24.974 13.5417 25 11.875C24.9479 9.97396 24.1929 8.38542 22.7348 7.10938C21.3028 5.83333 19.4802 5.13021 17.267 5C17.4233 5.59896 17.5014 6.22396 17.5014 6.875V6.91406C19.2198 7.07031 20.5867 7.63021 21.6022 8.59375C22.5916 9.55729 23.0993 10.651 23.1253 11.875C23.1253 12.9948 22.6957 13.9974 21.8365 14.8828C21.2637 15.5599 21.1726 16.2891 21.5631 17.0703C21.5892 17.1484 21.6282 17.2266 21.6803 17.3047C21.7584 17.4349 21.8365 17.5651 21.9146 17.6953C21.9407 17.7474 21.9667 17.7995 21.9927 17.8516C21.3158 17.6693 20.6649 17.4349 20.04 17.1484C19.8838 17.0703 19.7145 16.9922 19.5323 16.9141C19.1677 16.7057 18.7772 16.6406 18.3606 16.7188C17.8919 16.8229 17.3972 16.875 16.8765 16.875C15.6528 16.849 14.5852 16.6146 13.674 16.1719C12.7627 15.7292 12.0467 15.1562 11.5259 14.4531C10.901 14.6615 10.2501 14.8047 9.57315 14.8828C10.2501 16.0547 11.2395 16.9922 12.5414 17.6953C13.8172 18.3724 15.2622 18.724 16.8765 18.75Z" fill="#B8924A"/>
</svg>
</span>
                           Customer Support (Live Chat)
                        </a>
                        <div className="d-flex justify-content-center gap-3 opacity-50 payment-card-logos">
                           <img alt="Visa" height="12" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPBiq8s9weYMoMJqD4SjmtqC4Iur2tqb0B_FbHTULec7qf7uKPoEokFiY9hJa33S6nikb8NoUteiKRyw2LzELTcGfyb8AjmVUsC6HQWPDfb6PRej6t5HfhS-IIW2OsOmUndOnz0ny5YhtsBlavxM8aEg_G9RM_9ozx64MI8ltQT0bXcuAAQD1lSc_XA5lsDBsfrGuCecDlfTCdnID42y5uPJpxb5Hf-zqjpntB0OsxodEsgCL_aowdAAad8KMasECFyRAke4ZJTgkm" />
                           <img alt="Mastercard" height="12" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOYrL3fzawccTnwodkmrFdFgbZ2M5eF1Yg3thJyvXBrFpmQ4SL8qPbmK3h7xVQo-wdY0hR9gcrzxeDl2ko8B6zac-_eRkpYpvVn0NtLlxerCCy4Pr5IUpmXE-1Y77aj_s0Ray8zd4pd_xL4DNlr-rn4QO12RE96W0fCCRmLRqbncPebXEa3T6nyFeeOmfx24VTddlTGPzH8w807UKe6NWxjI1uEuc1w2PLYls3YwOEWqUVn3eeyC7uBxPte2QQDU0T1MaW5bOuQb3t" />
                           <img alt="Stripe" height="12" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEsFbm1M3zHrcFjhbJLkG2mvgG9l6eUFWmHbtLS4mtto-Wev3bAzGlE00duHXCqiCr7nBygluW-qvD8uOuSH3OzzToPmubs_DAYjMlsyPmLmB4Iq8iVMPxtwvx_jdkVkgp-uzhIJ5hqXXprePFwBCJwwPZhFvq2gCQBDkpILXOxBPwxi8d3_Y6XcU8VR5NkHNlug-i3nSTdo7LbRFy3TD15w2JVPjSVKaqPkUIH1JSO-MAIahJRzcPy5LR1OZzADNcfiu-_RGBtqN-" />
                        </div>
                     </div>
                  </aside>
                  <section className="col-lg-7 order-1 order-lg-2">
                     <div className="checkout-card p-4">
                        <h3 className="h4 mb-4">Choose Payment Method</h3>
                        <div className="row g-3 mb-4">
                           {paymentMethods.map((item, index) => (
                              <div className="col" key={item.name}>
                                 <button
                                    className={`payment-tile w-100 h-100 ${activePayment === index ? "active" : ""
                                       }`}
                                    onClick={() => setActivePayment(index)}
                                 >
                                    {/* <span className="">
                                       {item.icon}
                                    </span> */}
                                    <div>
                                       <img src={item.icon} alt={item.name} />

                                    </div>

                                    <span className="small fw-bold">
                                       {item.name}
                                    </span>
                                 </button>
                              </div>
                           ))}
                        </div>

                        <div className="payment-method-details">
                           {activePayment === 0 && (
                              <>
                                 <div className="paymentmethod_title">
                                    <h3>Stripe pay</h3>
                                    <div className="borderline"></div>
                                 </div>
                                 <div className="p-4 mb-4 payment-settings-box">
                                    <div className="form-check d-flex gap-3 mb-4">
                                       <input defaultChecked={true} className="form-check-input mt-1" id="recurringCheck" type="checkbox" />
                                       <label className="form-check-label" htmlFor="recurringCheck">
                                          <span className="d-block fw-bold mb-1">Recurring Monthly Automatic Payment</span>
                                          <span className="d-block small text-muted">Your subsequent rent payments will be automatically charged using this method.</span>
                                       </label>
                                    </div>
                                    <div className="form-check d-flex gap-3">
                                       <input defaultChecked={true} className="form-check-input mt-1" id="saveMethodCheck" type="checkbox" />
                                       <label className="form-check-label fw-bold small" htmlFor="saveMethodCheck">
                                          Save your preferred payment method for future transactions
                                       </label>
                                    </div>
                                 </div>
                                 <div className="chevron-tabs-container mb-4">

                                    <div
                                       className={`chevron-tab ${activeStep === "Security" ? "active" : "inactive"
                                          }`}
                                       onClick={() => setActiveStep("Security")}
                                       style={{ cursor: "pointer" }}
                                    >
                                       <div className="step-num">01</div>

                                       <div className="lh-1">
                                          <span className="text-uppercase fw-bold d-block mb-1 chevron-step-label">
                                             Process Step
                                          </span>

                                          <span className="fw-bold small">
                                             Security Deposit
                                          </span>
                                       </div>
                                    </div>


                                    <div
                                       className={`chevron-tab ${activeStep === "Rent" ? "active" : "inactive"
                                          }`}
                                       onClick={() => setActiveStep("Rent")}
                                       style={{ cursor: "pointer" }}
                                    >
                                       <div className="step-num">02</div>

                                       <div className="lh-1">
                                          <span className="text-uppercase fw-bold d-block mb-1 chevron-step-label">
                                             Upcoming
                                          </span>

                                          <span className="fw-bold small">
                                             Pay Rent
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                                 {activeStep === "Security" && (
                                    <div className="mb-5">
                                       <label className="form-label small fw-bold text-muted mb-2">
                                          Amount to Authorize
                                       </label>

                                       <div className="amount_pay input-group">
                                          <input
                                             className="form-control p-3 fw-bold border-light bg-light"
                                             readOnly
                                             type="text"
                                             value="$ 1,800.00"
                                          />

                                          <span className="input-group-text bg-light border-light">
                                             <span className="material-symbols-outlined">

                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                   <path d="M13.2422 21.1523C15.6653 21.1523 17.6367 19.181 17.6367 16.7578C17.6367 14.3347 15.6653 12.3633 13.2422 12.3633C10.819 12.3633 8.84766 14.3347 8.84766 16.7578C8.84766 19.181 10.819 21.1523 13.2422 21.1523ZM13.2422 14.1211C14.6961 14.1211 15.8789 15.3039 15.8789 16.7578C15.8789 18.2117 14.6961 19.3945 13.2422 19.3945C11.7883 19.3945 10.6055 18.2117 10.6055 16.7578C10.6055 15.3039 11.7883 14.1211 13.2422 14.1211Z" fill="white" />
                                                   <path d="M29.1211 5.33203H4.39453C3.90914 5.33203 3.51562 5.72555 3.51562 6.21094V8.84766H0.878906C0.393516 8.84766 0 9.24117 0 9.72656V23.7891C0 24.2745 0.393516 24.668 0.878906 24.668H25.5469C26.0323 24.668 26.4258 24.2745 26.4258 23.7891V21.1523H29.1211C29.6065 21.1523 30 20.7588 30 20.2734V6.21094C30 5.72555 29.6065 5.33203 29.1211 5.33203ZM24.668 12.2121C23.9201 11.9469 23.3266 11.3534 23.0613 10.6055H24.668V12.2121ZM21.2408 10.6055C21.5912 12.3248 22.9486 13.6822 24.668 14.0327V19.483C22.9486 19.8334 21.5912 21.1908 21.2408 22.9102H5.18502C4.83457 21.1908 3.47719 19.8334 1.75781 19.4829V14.0326C3.47719 13.6822 4.83457 12.3248 5.18502 10.6054H21.2408V10.6055ZM3.36445 10.6055C3.0992 11.3534 2.5057 11.9469 1.75781 12.2121V10.6055H3.36445ZM1.75781 21.3035C2.5057 21.5688 3.0992 22.1623 3.36445 22.9102H1.75781V21.3035ZM23.0613 22.9102C23.3266 22.1623 23.9201 21.5688 24.668 21.3035V22.9102H23.0613ZM28.2422 19.3945H26.4258V9.72656C26.4258 9.24117 26.0323 8.84766 25.5469 8.84766H5.27344V7.08984H28.2422V19.3945Z" fill="white" />
                                                   <path d="M20.2734 17.6367C20.7588 17.6367 21.1523 17.2432 21.1523 16.7578C21.1523 16.2724 20.7588 15.8789 20.2734 15.8789C19.788 15.8789 19.3945 16.2724 19.3945 16.7578C19.3945 17.2432 19.788 17.6367 20.2734 17.6367Z" fill="white" />
                                                   <path d="M6.21094 17.6367C6.69634 17.6367 7.08984 17.2432 7.08984 16.7578C7.08984 16.2724 6.69634 15.8789 6.21094 15.8789C5.72553 15.8789 5.33203 16.2724 5.33203 16.7578C5.33203 17.2432 5.72553 17.6367 6.21094 17.6367Z" fill="white" />
                                                </svg>

                                             </span>
                                          </span>
                                       </div>
                                    </div>
                                 )}


                                 {activeStep === "Rent" && (
                                    <div className="mb-5">
                                       <label className="form-label small fw-bold text-muted mb-2">
                                          Rent Amount
                                       </label>

                                       <div className="amount_pay input-group">
                                          <input
                                             className="form-control p-3 fw-bold border-light bg-light"
                                             readOnly
                                             type="text"
                                             value="$ 2,000.00"
                                          />

                                          <span className="input-group-text bg-light border-light">
                                             <span className="material-symbols-outlined">
                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.2422 21.1523C15.6653 21.1523 17.6367 19.181 17.6367 16.7578C17.6367 14.3347 15.6653 12.3633 13.2422 12.3633C10.819 12.3633 8.84766 14.3347 8.84766 16.7578C8.84766 19.181 10.819 21.1523 13.2422 21.1523ZM13.2422 14.1211C14.6961 14.1211 15.8789 15.3039 15.8789 16.7578C15.8789 18.2117 14.6961 19.3945 13.2422 19.3945C11.7883 19.3945 10.6055 18.2117 10.6055 16.7578C10.6055 15.3039 11.7883 14.1211 13.2422 14.1211Z" fill="white"></path><path d="M29.1211 5.33203H4.39453C3.90914 5.33203 3.51562 5.72555 3.51562 6.21094V8.84766H0.878906C0.393516 8.84766 0 9.24117 0 9.72656V23.7891C0 24.2745 0.393516 24.668 0.878906 24.668H25.5469C26.0323 24.668 26.4258 24.2745 26.4258 23.7891V21.1523H29.1211C29.6065 21.1523 30 20.7588 30 20.2734V6.21094C30 5.72555 29.6065 5.33203 29.1211 5.33203ZM24.668 12.2121C23.9201 11.9469 23.3266 11.3534 23.0613 10.6055H24.668V12.2121ZM21.2408 10.6055C21.5912 12.3248 22.9486 13.6822 24.668 14.0327V19.483C22.9486 19.8334 21.5912 21.1908 21.2408 22.9102H5.18502C4.83457 21.1908 3.47719 19.8334 1.75781 19.4829V14.0326C3.47719 13.6822 4.83457 12.3248 5.18502 10.6054H21.2408V10.6055ZM3.36445 10.6055C3.0992 11.3534 2.5057 11.9469 1.75781 12.2121V10.6055H3.36445ZM1.75781 21.3035C2.5057 21.5688 3.0992 22.1623 3.36445 22.9102H1.75781V21.3035ZM23.0613 22.9102C23.3266 22.1623 23.9201 21.5688 24.668 21.3035V22.9102H23.0613ZM28.2422 19.3945H26.4258V9.72656C26.4258 9.24117 26.0323 8.84766 25.5469 8.84766H5.27344V7.08984H28.2422V19.3945Z" fill="white"></path><path d="M20.2734 17.6367C20.7588 17.6367 21.1523 17.2432 21.1523 16.7578C21.1523 16.2724 20.7588 15.8789 20.2734 15.8789C19.788 15.8789 19.3945 16.2724 19.3945 16.7578C19.3945 17.2432 19.788 17.6367 20.2734 17.6367Z" fill="white"></path><path d="M6.21094 17.6367C6.69634 17.6367 7.08984 17.2432 7.08984 16.7578C7.08984 16.2724 6.69634 15.8789 6.21094 15.8789C5.72553 15.8789 5.33203 16.2724 5.33203 16.7578C5.33203 17.2432 5.72553 17.6367 6.21094 17.6367Z" fill="white"></path></svg>
                                             </span>
                                          </span>
                                       </div>
                                    </div>
                                 )}
                              </>

                           )}
                           {activePayment === 1 && (
                              <>
                                 <div className="paymentmethod_title">
                                    <h3>PayPal pay</h3>
                                    <div className="borderline"></div>
                                 </div>
                                 <div className="p-4 mb-4 payment-settings-box">
                                    <div className="form-check d-flex gap-3 mb-4">
                                       <input defaultChecked={true} className="form-check-input mt-1" id="recurringCheck" type="checkbox" />
                                       <label className="form-check-label" htmlFor="recurringCheck">
                                          <span className="d-block fw-bold mb-1">Recurring Monthly Automatic Payment</span>
                                          <span className="d-block small text-muted">Your subsequent rent payments will be automatically charged using this method.</span>
                                       </label>
                                    </div>
                                    <div className="form-check d-flex gap-3">
                                       <input defaultChecked={true} className="form-check-input mt-1" id="saveMethodCheck" type="checkbox" />
                                       <label className="form-check-label fw-bold small" htmlFor="saveMethodCheck">
                                          Save your preferred payment method for future transactions
                                       </label>
                                    </div>
                                 </div>
                                 <div className="chevron-tabs-container mb-4">

                                    <div
                                       className={`chevron-tab ${activeStep === "Security" ? "active" : "inactive"
                                          }`}
                                       onClick={() => setActiveStep("Security")}
                                       style={{ cursor: "pointer" }}
                                    >
                                       <div className="step-num">01</div>

                                       <div className="lh-1">
                                          <span className="text-uppercase fw-bold d-block mb-1 chevron-step-label">
                                             Process Step
                                          </span>

                                          <span className="fw-bold small">
                                             Security Deposit
                                          </span>
                                       </div>
                                    </div>


                                    <div
                                       className={`chevron-tab ${activeStep === "Rent" ? "active" : "inactive"
                                          }`}
                                       onClick={() => setActiveStep("Rent")}
                                       style={{ cursor: "pointer" }}
                                    >
                                       <div className="step-num">02</div>

                                       <div className="lh-1">
                                          <span className="text-uppercase fw-bold d-block mb-1 chevron-step-label">
                                             Upcoming
                                          </span>

                                          <span className="fw-bold small">
                                             Pay Rent
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                                 {activeStep === "Security" && (
                                    <div className="mb-5">
                                       <label className="form-label small fw-bold text-muted mb-2">
                                          Amount to Authorize
                                       </label>

                                       <div className="amount_pay input-group">
                                          <input
                                             className="form-control p-3 fw-bold border-light bg-light"
                                             readOnly
                                             type="text"
                                             value="$ 1,800.00"
                                          />

                                          <span className="input-group-text bg-light border-light">
                                             <span className="material-symbols-outlined">

                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                   <path d="M13.2422 21.1523C15.6653 21.1523 17.6367 19.181 17.6367 16.7578C17.6367 14.3347 15.6653 12.3633 13.2422 12.3633C10.819 12.3633 8.84766 14.3347 8.84766 16.7578C8.84766 19.181 10.819 21.1523 13.2422 21.1523ZM13.2422 14.1211C14.6961 14.1211 15.8789 15.3039 15.8789 16.7578C15.8789 18.2117 14.6961 19.3945 13.2422 19.3945C11.7883 19.3945 10.6055 18.2117 10.6055 16.7578C10.6055 15.3039 11.7883 14.1211 13.2422 14.1211Z" fill="white" />
                                                   <path d="M29.1211 5.33203H4.39453C3.90914 5.33203 3.51562 5.72555 3.51562 6.21094V8.84766H0.878906C0.393516 8.84766 0 9.24117 0 9.72656V23.7891C0 24.2745 0.393516 24.668 0.878906 24.668H25.5469C26.0323 24.668 26.4258 24.2745 26.4258 23.7891V21.1523H29.1211C29.6065 21.1523 30 20.7588 30 20.2734V6.21094C30 5.72555 29.6065 5.33203 29.1211 5.33203ZM24.668 12.2121C23.9201 11.9469 23.3266 11.3534 23.0613 10.6055H24.668V12.2121ZM21.2408 10.6055C21.5912 12.3248 22.9486 13.6822 24.668 14.0327V19.483C22.9486 19.8334 21.5912 21.1908 21.2408 22.9102H5.18502C4.83457 21.1908 3.47719 19.8334 1.75781 19.4829V14.0326C3.47719 13.6822 4.83457 12.3248 5.18502 10.6054H21.2408V10.6055ZM3.36445 10.6055C3.0992 11.3534 2.5057 11.9469 1.75781 12.2121V10.6055H3.36445ZM1.75781 21.3035C2.5057 21.5688 3.0992 22.1623 3.36445 22.9102H1.75781V21.3035ZM23.0613 22.9102C23.3266 22.1623 23.9201 21.5688 24.668 21.3035V22.9102H23.0613ZM28.2422 19.3945H26.4258V9.72656C26.4258 9.24117 26.0323 8.84766 25.5469 8.84766H5.27344V7.08984H28.2422V19.3945Z" fill="white" />
                                                   <path d="M20.2734 17.6367C20.7588 17.6367 21.1523 17.2432 21.1523 16.7578C21.1523 16.2724 20.7588 15.8789 20.2734 15.8789C19.788 15.8789 19.3945 16.2724 19.3945 16.7578C19.3945 17.2432 19.788 17.6367 20.2734 17.6367Z" fill="white" />
                                                   <path d="M6.21094 17.6367C6.69634 17.6367 7.08984 17.2432 7.08984 16.7578C7.08984 16.2724 6.69634 15.8789 6.21094 15.8789C5.72553 15.8789 5.33203 16.2724 5.33203 16.7578C5.33203 17.2432 5.72553 17.6367 6.21094 17.6367Z" fill="white" />
                                                </svg>

                                             </span>
                                          </span>
                                       </div>
                                    </div>
                                 )}


                                 {activeStep === "Rent" && (
                                    <div className="mb-5">
                                       <label className="form-label small fw-bold text-muted mb-2">
                                          Rent Amount
                                       </label>

                                       <div className="amount_pay input-group">
                                          <input
                                             className="form-control p-3 fw-bold border-light bg-light"
                                             readOnly
                                             type="text"
                                             value="$ 2,000.00"
                                          />

                                          <span className="input-group-text bg-light border-light">
                                             <span className="material-symbols-outlined">
                                                payments
                                             </span>
                                          </span>
                                       </div>
                                    </div>
                                 )}
                              </>

                           )}
                           {activePayment === 2 && (
                              <>
                                 <div className="paymentmethod_title">
                                    <h3>Revolut pay</h3>
                                    <div className="borderline"></div>
                                 </div>
                                 <div className="p-4 mb-4 payment-settings-box">
                                    <div className="form-check d-flex gap-3 mb-4">
                                       <input defaultChecked={true} className="form-check-input mt-1" id="recurringCheck" type="checkbox" />
                                       <label className="form-check-label" htmlFor="recurringCheck">
                                          <span className="d-block fw-bold mb-1">Recurring Monthly Automatic Payment</span>
                                          <span className="d-block small text-muted">Your subsequent rent payments will be automatically charged using this method.</span>
                                       </label>
                                    </div>
                                    <div className="form-check d-flex gap-3">
                                       <input defaultChecked={true} className="form-check-input mt-1" id="saveMethodCheck" type="checkbox" />
                                       <label className="form-check-label fw-bold small" htmlFor="saveMethodCheck">
                                          Save your preferred payment method for future transactions
                                       </label>
                                    </div>
                                 </div>
                                 <div className="chevron-tabs-container mb-4">

                                    <div
                                       className={`chevron-tab ${activeStep === "Security" ? "active" : "inactive"
                                          }`}
                                       onClick={() => setActiveStep("Security")}
                                       style={{ cursor: "pointer" }}
                                    >
                                       <div className="step-num">01</div>

                                       <div className="lh-1">
                                          <span className="text-uppercase fw-bold d-block mb-1 chevron-step-label">
                                             Process Step
                                          </span>

                                          <span className="fw-bold small">
                                             Security Deposit
                                          </span>
                                       </div>
                                    </div>


                                    <div
                                       className={`chevron-tab ${activeStep === "Rent" ? "active" : "inactive"
                                          }`}
                                       onClick={() => setActiveStep("Rent")}
                                       style={{ cursor: "pointer" }}
                                    >
                                       <div className="step-num">02</div>

                                       <div className="lh-1">
                                          <span className="text-uppercase fw-bold d-block mb-1 chevron-step-label">
                                             Upcoming
                                          </span>

                                          <span className="fw-bold small">
                                             Pay Rent
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                                 {activeStep === "Security" && (
                                    <div className="mb-5">
                                       <label className="form-label small fw-bold text-muted mb-2">
                                          Amount to Authorize
                                       </label>

                                       <div className="amount_pay input-group">
                                          <input
                                             className="form-control p-3 fw-bold border-light bg-light"
                                             readOnly
                                             type="text"
                                             value="$ 1,800.00"
                                          />

                                          <span className="input-group-text bg-light border-light">
                                             <span className="material-symbols-outlined">

                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                   <path d="M13.2422 21.1523C15.6653 21.1523 17.6367 19.181 17.6367 16.7578C17.6367 14.3347 15.6653 12.3633 13.2422 12.3633C10.819 12.3633 8.84766 14.3347 8.84766 16.7578C8.84766 19.181 10.819 21.1523 13.2422 21.1523ZM13.2422 14.1211C14.6961 14.1211 15.8789 15.3039 15.8789 16.7578C15.8789 18.2117 14.6961 19.3945 13.2422 19.3945C11.7883 19.3945 10.6055 18.2117 10.6055 16.7578C10.6055 15.3039 11.7883 14.1211 13.2422 14.1211Z" fill="white" />
                                                   <path d="M29.1211 5.33203H4.39453C3.90914 5.33203 3.51562 5.72555 3.51562 6.21094V8.84766H0.878906C0.393516 8.84766 0 9.24117 0 9.72656V23.7891C0 24.2745 0.393516 24.668 0.878906 24.668H25.5469C26.0323 24.668 26.4258 24.2745 26.4258 23.7891V21.1523H29.1211C29.6065 21.1523 30 20.7588 30 20.2734V6.21094C30 5.72555 29.6065 5.33203 29.1211 5.33203ZM24.668 12.2121C23.9201 11.9469 23.3266 11.3534 23.0613 10.6055H24.668V12.2121ZM21.2408 10.6055C21.5912 12.3248 22.9486 13.6822 24.668 14.0327V19.483C22.9486 19.8334 21.5912 21.1908 21.2408 22.9102H5.18502C4.83457 21.1908 3.47719 19.8334 1.75781 19.4829V14.0326C3.47719 13.6822 4.83457 12.3248 5.18502 10.6054H21.2408V10.6055ZM3.36445 10.6055C3.0992 11.3534 2.5057 11.9469 1.75781 12.2121V10.6055H3.36445ZM1.75781 21.3035C2.5057 21.5688 3.0992 22.1623 3.36445 22.9102H1.75781V21.3035ZM23.0613 22.9102C23.3266 22.1623 23.9201 21.5688 24.668 21.3035V22.9102H23.0613ZM28.2422 19.3945H26.4258V9.72656C26.4258 9.24117 26.0323 8.84766 25.5469 8.84766H5.27344V7.08984H28.2422V19.3945Z" fill="white" />
                                                   <path d="M20.2734 17.6367C20.7588 17.6367 21.1523 17.2432 21.1523 16.7578C21.1523 16.2724 20.7588 15.8789 20.2734 15.8789C19.788 15.8789 19.3945 16.2724 19.3945 16.7578C19.3945 17.2432 19.788 17.6367 20.2734 17.6367Z" fill="white" />
                                                   <path d="M6.21094 17.6367C6.69634 17.6367 7.08984 17.2432 7.08984 16.7578C7.08984 16.2724 6.69634 15.8789 6.21094 15.8789C5.72553 15.8789 5.33203 16.2724 5.33203 16.7578C5.33203 17.2432 5.72553 17.6367 6.21094 17.6367Z" fill="white" />
                                                </svg>

                                             </span>
                                          </span>
                                       </div>
                                    </div>
                                 )}


                                 {activeStep === "Rent" && (
                                    <div className="mb-5">
                                       <label className="form-label small fw-bold text-muted mb-2">
                                          Rent Amount
                                       </label>

                                       <div className="amount_pay input-group">
                                          <input
                                             className="form-control p-3 fw-bold border-light bg-light"
                                             readOnly
                                             type="text"
                                             value="$ 2,000.00"
                                          />

                                          <span className="input-group-text bg-light border-light">
                                             <span className="material-symbols-outlined">
                                                payments
                                             </span>
                                          </span>
                                       </div>
                                    </div>
                                 )}
                              </>

                           )}
                           {activePayment === 3 && (
                              <>
                                 <div className="paymentmethod_title">
                                    <h3>Bank pay</h3>
                                    <div className="borderline"></div>
                                 </div>
                                 <div className="p-4 mb-4 payment-settings-box">
                                    <div className="form-check d-flex gap-3 mb-4">
                                       <input defaultChecked={true} className="form-check-input mt-1" id="recurringCheck" type="checkbox" />
                                       <label className="form-check-label" htmlFor="recurringCheck">
                                          <span className="d-block fw-bold mb-1">Recurring Monthly Automatic Payment</span>
                                          <span className="d-block small text-muted">Your subsequent rent payments will be automatically charged using this method.</span>
                                       </label>
                                    </div>
                                    <div className="form-check d-flex gap-3">
                                       <input defaultChecked={true} className="form-check-input mt-1" id="saveMethodCheck" type="checkbox" />
                                       <label className="form-check-label fw-bold small" htmlFor="saveMethodCheck">
                                          Save your preferred payment method for future transactions
                                       </label>
                                    </div>
                                 </div>
                                 <div className="chevron-tabs-container mb-4">

                                    <div
                                       className={`chevron-tab ${activeStep === "Security" ? "active" : "inactive"
                                          }`}
                                       onClick={() => setActiveStep("Security")}
                                       style={{ cursor: "pointer" }}
                                    >
                                       <div className="step-num">01</div>

                                       <div className="lh-1">
                                          <span className="text-uppercase fw-bold d-block mb-1 chevron-step-label">
                                             Process Step
                                          </span>

                                          <span className="fw-bold small">
                                             Security Deposit
                                          </span>
                                       </div>
                                    </div>


                                    <div
                                       className={`chevron-tab ${activeStep === "Rent" ? "active" : "inactive"
                                          }`}
                                       onClick={() => setActiveStep("Rent")}
                                       style={{ cursor: "pointer" }}
                                    >
                                       <div className="step-num">02</div>

                                       <div className="lh-1">
                                          <span className="text-uppercase fw-bold d-block mb-1 chevron-step-label">
                                             Upcoming
                                          </span>

                                          <span className="fw-bold small">
                                             Pay Rent
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                                 {activeStep === "Security" && (
                                    <div className="mb-4">
                                       <BankDeposite rentTitle="Security Deposit" />
                                    </div>
                                 )}


                                 {activeStep === "Rent" && (
                                    <div className="mb-4">
                                       <BankDeposite rentTitle="Rent Deposit" />
                                    </div>
                                 )}
                              </>

                           )}

                           {activePayment === 4 && (
                              <>
                                 <div className="paymentmethod_title">
                                    <h3>Cash pay</h3>
                                    <div className="borderline"></div>
                                 </div>
                                 <div className="p-4 mb-4 payment-settings-box">
                                    <p className="mb-0">You can pay by cash directyle at our office: <b>211E 43rd Street</b></p>
                                 </div>


                              </>

                           )}






                        </div>

                        <div className="pt-4 border-top">
                           <button className="btn btn-primary-elite w-100 d-flex align-items-center justify-content-center gap-2 mb-3">
                              <span className="material-symbols-outlined fs-5">
                                 <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.625 12.375H21.8333V9.25C21.8333 5.80312 18.9928 3 15.5 3C12.0072 3 9.16667 5.80312 9.16667 9.25V12.375H8.375C7.06611 12.375 6 13.426 6 14.7187V25.6562C6 26.949 7.06611 28 8.375 28H22.625C23.9339 28 25 26.949 25 25.6562V14.7187C25 13.426 23.9339 12.375 22.625 12.375ZM11.2778 9.25C11.2778 6.95208 13.1714 5.08333 15.5 5.08333C17.8286 5.08333 19.7222 6.95208 19.7222 9.25V12.375H11.2778V9.25ZM16.5556 20.4187V22.7917C16.5556 23.3667 16.0837 23.8333 15.5 23.8333C14.9163 23.8333 14.4444 23.3667 14.4444 22.7917V20.4187C13.8164 20.0573 13.3889 19.3927 13.3889 18.625C13.3889 17.476 14.3357 16.5417 15.5 16.5417C16.6643 16.5417 17.6111 17.476 17.6111 18.625C17.6111 19.3927 17.1836 20.0573 16.5556 20.4187Z" fill="white" />
                                 </svg>
                              </span>
                              Authorize  $ 1,800.00 Payment
                           </button>
                           <p className="text-center text-uppercase fw-bold text-muted d-flex align-items-center justify-content-center gap-1 mb-0 security-note">
                              <span className="material-symbols-outlined icon-xs">shield</span>
                              Secured by Journey Realty Escrow
                           </p>
                        </div>
                     </div>
                  </section>
               </div>
            </div>

         </main>

      </PageLayout>
   );
}

