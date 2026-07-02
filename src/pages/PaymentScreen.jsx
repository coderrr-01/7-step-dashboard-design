import { useState } from "react";
import PageLayout from "../components/PageLayout";
import BankDeposite from "../pages/Partial-element/BankDeposite"

export default function PaymentScreen() {
   const [activeStep, setActiveStep] = useState("Security");
   const [activePayment, setActivePayment] = useState(0);
   const paymentMethods = [
      {
         name: "Stripe",
         icon: "credit_card",
      },
      {
         name: "PayPal",
         icon: "account_balance_wallet",
      },
      {
         name: "Revolut",
         icon: "currency_exchange",
      },
      {
         name: "Bank",
         icon: "account_balance",
      },
      {
         name: "Cash",
         icon: "payments",
      },
   ];

   return (
      <PageLayout page="PaymentScreen">
         <main className="container-fluid py-5 px-lg-5 flex-grow-1">
            <div className="container container-narrow">
               <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                  <div>
                     <h1 class="display-4 serif-heading heading-hero mb-2 hero-title">
                        <span className="material-symbols-outlined text-primary-container opacity-50">lock</span>
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
                                    <span className="material-symbols-outlined fs-6">star</span>
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
                        <p className="small text-muted opacity-50 d-flex align-items-center gap-1 mt-3 pt-3 border-top border-light">
                           <span className="material-symbols-outlined icon-xs">sync</span>
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
                           <span className="material-symbols-outlined fs-6">chat_bubble</span>
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
                                    <span className="material-symbols-outlined">
                                       {item.icon}
                                    </span>

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
                                                payments
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
                                                payments
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
                                                payments
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
                              <span className="material-symbols-outlined fs-5">lock</span>
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

