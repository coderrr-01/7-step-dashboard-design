import { useState, useEffect } from "react";
import PageLayout from "../components/PageLayout";
import BankDeposite from "../pages/Partial-element/BankDeposite";
import { useClientData } from "../hooks/useClientData";
import { submitStripePayment, submitPaypalPayment, submitRevolutPayment, createRevolutCheckout, getRevolutStatus, getPaymentUI } from "../services/api";
import { toast } from "react-toastify";
import { useSteps } from "../context/StepContext";

export default function PaymentScreen() {
   const { client, loading: clientLoading, refetch } = useClientData();
   const { completeStep } = useSteps();
   const [activeStep, setActiveStep]       = useState("Security");
   const [activePayment, setActivePayment] = useState(0);
   const [submitting, setSubmitting]       = useState(false);
   const [pollingType, setPollingType]     = useState(null);
   const [iframeHtml, setIframeHtml]         = useState({});
   const [iframeLoading, setIframeLoading]   = useState({}); // per-key loading map
   const [iframeError, setIframeError]       = useState({}); // per-key error map
   const methodNames = ['stripe', 'paypal', 'revolut', 'bank', 'cash'];

   const methodIndexFor = (method) => {
      const normalized = String(method || '').trim().toLowerCase();
      if (!normalized) return -1;
      return paymentMethods.findIndex(m => m.name.toLowerCase() === normalized);
   };

   // Fetch payment UI HTML from WP for current method+section
   const loadPaymentUI = async (method, section, force = false) => {
      const key = `${method}_${section}`;
      if (!force && iframeHtml[key]) return; // already loaded
      setIframeLoading(prev => ({ ...prev, [key]: true }));
      setIframeError(prev => ({ ...prev, [key]: false }));
      try {
         const res = await getPaymentUI(method, section);
         if (res?.success && res.html) {
            setIframeHtml(prev => ({ ...prev, [key]: res.html }));
            if (res.deposit_paid && !depositPaidNow) {
               setDepositPaidNow(true);
               const paidMethodIndex = methodIndexFor(res.deposit_method) >= 0
                  ? methodIndexFor(res.deposit_method)
                  : methodIndexFor(method);
               setDepositMethod(paidMethodIndex >= 0 ? paidMethodIndex : null);
               if (storageKey) localStorage.setItem(storageKey, '1');
               if (storageMethodKey && paidMethodIndex >= 0) localStorage.setItem(storageMethodKey, String(paidMethodIndex));
            }
            if (res.rent_paid && !rentPaidNow) {
               setRentPaidNow(true);
               if (rentStorageKey) localStorage.setItem(rentStorageKey, '1');
            }
         } else {
            setIframeError(prev => ({ ...prev, [key]: true }));
         }
      } catch {
         setIframeError(prev => ({ ...prev, [key]: true }));
      } finally {
         setIframeLoading(prev => ({ ...prev, [key]: false }));
      }
   };

   // After a payment is confirmed, drop the cached iframe HTML for that section
   // and reload whatever method is on screen so the UI reflects the latest DB state.
   const reloadPaymentUI = (section) => {
      setIframeHtml(prev => {
         const next = { ...prev };
         Object.keys(next).forEach(k => { if (k.endsWith(`_${section}`)) delete next[k]; });
         return next;
      });
      const method = methodNames[activePayment];
      if (method && method !== 'cash') {
         loadPaymentUI(method, activeStep === 'Rent' ? 'rent' : 'deposit', true);
      }
   };

   // Load iframe when method or step changes
   useEffect(() => {
      const method = methodNames[activePayment];
      // Revolut keeps its native checkout button below; the iframe is loaded so
      // the shared payment-history table (same one Stripe uses) is ready to show
      // once a Revolut payment is confirmed.
      if (!method || method === 'cash') return;
      loadPaymentUI(method, activeStep === 'Rent' ? 'rent' : 'deposit');
   }, [activePayment, activeStep]);

   // Read selected room from localStorage (saved by RoomSearch when user clicks View Room)
   const [selectedRoom] = useState(() => {
      try { return JSON.parse(localStorage.getItem('jrny_selected_room') || 'null'); }
      catch { return null; }
   });

   // Persist deposit-paid state across refresh per client
   const storageKey       = client?.id ? `jrny_deposit_paid_${client.id}` : null;
   const storageMethodKey = client?.id ? `jrny_deposit_method_${client.id}` : null;
   const rentStorageKey   = client?.id ? `jrny_rent_paid_${client.id}` : null;

   const [depositPaidNow, setDepositPaidNow] = useState(() => {
      if (!storageKey) return false;
      return localStorage.getItem(storageKey) === '1';
   });

   // Which payment index was used to pay the deposit (null = not paid yet)
   const [depositMethod, setDepositMethod] = useState(() => {
      if (!storageMethodKey) return null;
      const v = localStorage.getItem(storageMethodKey);
      return v !== null ? parseInt(v, 10) : null;
   });

   // Persist rent-paid state across refresh per client
   const [rentPaidNow, setRentPaidNow] = useState(() => {
      if (!rentStorageKey) return false;
      return localStorage.getItem(rentStorageKey) === '1';
   });

   // Sync from Zoho data once loaded
   useEffect(() => {
      if (client?.deposit_paid && !depositPaidNow) {
         setDepositPaidNow(true);
         const paidMethodIndex = methodIndexFor(client?.deposit_method);
         if (paidMethodIndex >= 0) {
            setDepositMethod(paidMethodIndex);
            if (storageMethodKey) localStorage.setItem(storageMethodKey, String(paidMethodIndex));
         }
         if (storageKey) localStorage.setItem(storageKey, '1');
         reloadPaymentUI('deposit');
      }
   }, [client?.deposit_paid, client?.deposit_method, storageKey, storageMethodKey]);

   // Sync rent-paid state from Zoho data once loaded
   useEffect(() => {
      if (client?.rent_paid && !rentPaidNow) {
         setRentPaidNow(true);
         if (rentStorageKey) localStorage.setItem(rentStorageKey, '1');
         reloadPaymentUI('rent');
      }
   }, [client?.rent_paid, client?.rent_method, rentStorageKey]);

   const paymentMethods = [
      { name: "Stripe",  icon: "credit_card"          },
      { name: "PayPal",  icon: "account_balance_wallet" },
      { name: "Revolut", icon: "currency_exchange"     },
      { name: "Bank",    icon: "account_balance"       },
      { name: "Cash",    icon: "payments"              },
   ];

   // Restore the last successful gateway for the current step so rent opens on
   // the same method that completed the deposit.
   useEffect(() => {
      if (clientLoading) return;

      const preferredIndex = depositMethod ?? methodIndexFor(client?.deposit_method || client?.rent_method);
      if (preferredIndex >= 0 && activePayment !== preferredIndex) {
         setActivePayment(preferredIndex);
      }
   }, [activeStep, clientLoading, client?.deposit_method, client?.rent_method, depositMethod]);

   const depositPaid = depositPaidNow || !!client?.deposit_paid;
   const rentPaid    = rentPaidNow    || !!client?.rent_paid;

   // After deposit paid: only show the method used + Cash (index 4)
   const visibleMethods = depositPaid && depositMethod !== null
      ? paymentMethods.filter((_, i) => i === depositMethod || i === 4)
      : paymentMethods;

   // Pricing source of truth: client (Zoho via API). selectedRoom used only if client has no assignment.
   const rawDeposit = client?.security_deposit
      ? parseFloat(client.security_deposit)
      : (selectedRoom?.security_deposit ? parseFloat(selectedRoom.security_deposit) : 0);
   const rawRent = client?.rent_amount
      ? parseFloat(client.rent_amount)
      : (selectedRoom?.monthly_rent ? parseFloat(selectedRoom.monthly_rent) : 0);

   const depositAmount = `$ ${rawDeposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
   const rentAmount    = `$ ${rawRent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

   const clientName  = client?.name  || 'Julianne Vanes-Harding';
   const clientPhone = client?.phone || '+1 (212) 555-0198';
   const clientEmail = client?.email || 'vanes@global-exec.com';
   const startDate   = client?.start_date || 'September 01, 2024';
   const endDate     = client?.end_date   || 'August 31, 2025';
   const unitLabel   = selectedRoom?.name || client?.unit || client?.room_name || 'The Victorian Premier';

   const handleRentTabClick = () => {
      // Don't block while client data is still loading
      if (!clientLoading && !depositPaid) {
         toast.warning('Please pay the Security Deposit first.');
         return;
      }
      setActiveStep("Rent");
   };

   const handleAuthorize = async () => {
      const type     = activeStep === 'Rent' ? 'rent' : 'deposit';
      const amount   = type === 'deposit' ? rawDeposit : rawRent;
      const clientId = client?.id || '';

      if (activePayment === 3) return;
      if (activePayment === 4) {
         toast.info('Please visit our office at 211E 43rd Street to pay in cash.');
         return;
      }

      if (!clientId) {
         toast.error('Client record not found. Please refresh.');
         return;
      }

      setSubmitting(true);
      try {
         let res;
         if (activePayment === 0) {
            res = await submitStripePayment({ type, client_id: clientId, amount });
         } else if (activePayment === 1) {
            res = await submitPaypalPayment({ type, client_id: clientId, amount });
         } else if (activePayment === 2) {
            res = await submitRevolutPayment({ type, client_id: clientId, amount });
         }

          if (res?.success) {
            if (type === 'deposit') {
               toast.success('Security deposit recorded! Pending verification.');
               setDepositPaidNow(true);
               setDepositMethod(activePayment);
               if (storageKey)       localStorage.setItem(storageKey, '1');
               if (storageMethodKey) localStorage.setItem(storageMethodKey, String(activePayment));
               setActiveStep("Rent");
            } else {
               toast.success('Rent payment recorded! Pending verification.');
               completeStep(7);
            }
            reloadPaymentUI(type);
            refetch();
         } else {
            toast.error(res?.message || 'Payment failed. Please try again.');
         }
      } catch (e) {
         toast.error(e.message || 'Network error. Please try again.');
      } finally {
         setSubmitting(false);
      }
   };

   const handleRevolutCheckout = async () => {
      const type = activeStep === 'Rent' ? 'rent' : 'deposit';

      // Open a blank tab synchronously inside the click handler so popup
      // blockers allow it; navigate it to Revolut once we have the URL.
      let checkoutTab = null;
      try {
         checkoutTab = window.open('', '_blank');
      } catch {
         checkoutTab = null;
      }

      setSubmitting(true);
      try {
         const result = await createRevolutCheckout(type);
         if (!result?.success || !result?.checkout_url) {
            throw new Error(result?.message || 'Unable to start Revolut checkout.');
         }

         if (checkoutTab) {
            checkoutTab.location.href = result.checkout_url;
            // Poll WordPress so this tab reflects the payment the moment it completes.
            setPollingType(type);
            toast.info('Revolut checkout opened in a new tab. Complete the payment there, then return to this tab.');
         } else {
            // Fallback (popup blocked): navigate the current tab instead.
            window.top.location.href = result.checkout_url;
         }
      } catch (error) {
         toast.error(error?.message || 'Unable to start Revolut checkout.');
         if (checkoutTab) { try { checkoutTab.close(); } catch {} }
         setSubmitting(false);
         setPollingType(null);
      }
   };

   // While a Revolut checkout is open in another tab, poll WordPress until the
   // order is verified as paid/failed (or the polling window times out).
   useEffect(() => {
      if (!pollingType) return;

      let stopped = false;
      let attempts = 0;
      const MAX_ATTEMPTS = 75; // 75 x 4s = 5 minutes
      const interval = setInterval(tick, 4000);

      async function tick() {
         attempts += 1;
         try {
            const res = await getRevolutStatus(pollingType);
            if (stopped) return;

            const paid = pollingType === 'deposit' ? res?.deposit_paid : res?.rent_paid;
            if (paid) {
               clearInterval(interval);
               setPollingType(null);
               setSubmitting(false);
               toast.success(pollingType === 'deposit' ? 'Security deposit paid successfully!' : 'Rent payment received successfully!');
                if (pollingType === 'deposit') {
                   setDepositPaidNow(true);
                   setDepositMethod(2); // Revolut index
                   if (storageKey)       localStorage.setItem(storageKey, '1');
                   if (storageMethodKey) localStorage.setItem(storageMethodKey, String(2));
                   setActiveStep("Rent");
                } else {
                   setRentPaidNow(true);
                   if (rentStorageKey) localStorage.setItem(rentStorageKey, '1');
                   completeStep(7);
                }
                reloadPaymentUI(pollingType);
                refetch();
               return;
            }

            if (attempts >= MAX_ATTEMPTS) {
               clearInterval(interval);
               setPollingType(null);
               setSubmitting(false);
               toast.info('Payment is still pending verification. Please check back later.');
            }
         } catch (e) {
            if (stopped) return;
            if (attempts >= MAX_ATTEMPTS) {
               clearInterval(interval);
               setPollingType(null);
               setSubmitting(false);
            }
         }
      }

      tick(); // check immediately in case the webhook already marked it paid

      return () => { stopped = true; clearInterval(interval); };
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pollingType, storageKey, storageMethodKey, rentStorageKey]);

   // Shared chevron tabs used in every payment method panel
   const ChevronTabs = () => (
      <div className="chevron-tabs-container mb-4">
         <div
            className={`chevron-tab ${activeStep === "Security" ? "active" : "inactive"}`}
            onClick={() => setActiveStep("Security")}
            style={{ cursor: "pointer" }}
         >
            <div className="step-num">01</div>
            <div className="lh-1">
               <span className="text-uppercase fw-bold d-block mb-1 chevron-step-label">Process Step</span>
               <span className="fw-bold small">Security Deposit</span>
            </div>
         </div>
         <div
            className={`chevron-tab ${activeStep === "Rent" ? "active" : "inactive"} ${!clientLoading && !depositPaid ? "opacity-50" : ""}`}
            onClick={handleRentTabClick}
            style={{ cursor: (!clientLoading && !depositPaid) ? "not-allowed" : "pointer" }}
            title={!clientLoading && !depositPaid ? "Pay Security Deposit first" : ""}
         >
            <div className="step-num">02</div>
            <div className="lh-1">
               <span className="text-uppercase fw-bold d-block mb-1 chevron-step-label">
                  {depositPaid ? "Upcoming" : "Locked"}
               </span>
               <span className="fw-bold small">Pay Rent</span>
            </div>
         </div>
      </div>
   );

   // Shared settings box (recurring + save method checkboxes)
   const SettingsBox = () => (
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
   );

   // Amount input shown for Stripe / PayPal / Revolut
   const AmountInput = () => (
      <div className="mb-5">
         <label className="form-label small fw-bold text-muted mb-2">
            {activeStep === "Security" ? "Amount to Authorize" : "Rent Amount"}
         </label>
         <div className="amount_pay input-group">
            <input
               className="form-control p-3 fw-bold border-light bg-light"
               readOnly
               type="text"
               value={activeStep === "Security" ? depositAmount : rentAmount}
            />
            <span className="input-group-text bg-light border-light">
               <span className="material-symbols-outlined">payments</span>
            </span>
         </div>
      </div>
   );

   return (
      <PageLayout page="PaymentScreen">
         <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1">
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
                                 <h4 className="h6 mb-1 fw-bold">{unitLabel}</h4>
                                 <p className="small text-muted mb-2">
                                    {selectedRoom?.floor ? `Floor ${selectedRoom.floor}` : ''}{selectedRoom?.unit_number ? ` • Unit ${selectedRoom.unit_number}` : ''}{selectedRoom?.size_sq_ft ? ` • ${selectedRoom.size_sq_ft} sq.ft` : ''}{selectedRoom?.status ? ` • ${selectedRoom.status}` : ''}
                                 </p>
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
                              <span className="fw-medium">{startDate}</span>
                           </div>
                           <div className="d-flex justify-content-between small mb-4">
                              <span className="text-muted">Rent End Date</span>
                              <span className="fw-medium">{endDate}</span>
                           </div>
                           <hr className="my-4 opacity-10" />
                           <div className="d-flex justify-content-between small mb-2">
                              <span className="text-muted">Security Deposit</span>
                              <span className="fw-medium">{depositAmount}</span>
                           </div>
                           <div className="d-flex justify-content-between small mb-4">
                              <span className="text-muted">Rent Amount</span>
                              <span className="fw-medium">{rentAmount}</span>
                           </div>
                           <hr className="my-4 opacity-10" />
                           <div className="d-flex justify-content-between align-items-baseline pt-2">
                              <span className="fw-bold">Total Due Now</span>
                              <span className="h4 text-primary-container mb-0 fw-bold">
                                 {depositPaid ? rentAmount : depositAmount}
                              </span>
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
                           <p className="fw-medium mb-0">{clientName}</p>
                        </div>
                        <div className="row g-3 mb-3">
                           <div className="col-6">
                              <label className="text-uppercase text-muted fw-bold mb-1 form-label-micro">Contact Phone</label>
                              <p className="mb-0"><a className="text-primary-container text-decoration-none fw-medium" href={`tel:${clientPhone}`}>{clientPhone}</a></p>
                           </div>
                           <div className="col-6">
                              <label className="text-uppercase text-muted fw-bold mb-1 form-label-micro">Email Address</label>
                              <p className="mb-0 text-truncate fw-medium">{clientEmail}</p>
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
                        <a className="text-primary-container fw-bold small text-decoration-none d-flex align-items-center justify-content-center gap-2 mb-3" href="https://journeyrealty.com/contact/" target="_blank" rel="noopener noreferrer">
                           <span className="material-symbols-outlined fs-6">chat_bubble</span>
                           Customer Support {/* (Live Chat) */}
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
                           {visibleMethods.map((item) => {
                              const index = paymentMethods.findIndex(m => m.name === item.name);
                              return (
                                 <div className="col" key={item.name}>
                                    <button
                                       className={`payment-tile w-100 h-100 ${activePayment === index ? "active" : ""}`}
                                       onClick={() => setActivePayment(index)}
                                    >
                                       <span className="material-symbols-outlined">{item.icon}</span>
                                       <span className="small fw-bold">{item.name}</span>
                                    </button>
                                 </div>
                              );
                           })}
                        </div>

                        <div className="payment-method-details">

                           {/* ── STRIPE ── */}
                           {activePayment === 0 && (
                              <>
                                 <div className="paymentmethod_title">
                                    <h3>Stripe pay</h3>
                                    <div className="borderline"></div>
                                 </div>
                                 <SettingsBox />
                                 <ChevronTabs />
                                 <PaymentIframe method="stripe" section={activeStep === 'Rent' ? 'rent' : 'deposit'} iframeHtml={iframeHtml} iframeLoading={iframeLoading} iframeError={iframeError} />
                              </>
                           )}

                           {/* ── PAYPAL ── */}
                           {activePayment === 1 && (
                              <>
                                 <div className="paymentmethod_title">
                                    <h3>PayPal pay</h3>
                                    <div className="borderline"></div>
                                 </div>
                                 <SettingsBox />
                                 <ChevronTabs />
                                 <PaymentIframe method="paypal" section={activeStep === 'Rent' ? 'rent' : 'deposit'} iframeHtml={iframeHtml} iframeLoading={iframeLoading} iframeError={iframeError} />
                              </>
                           )}

                           {/* ── REVOLUT ── */}
                           {activePayment === 2 && (
                              <>
                                 <div className="paymentmethod_title">
                                    <h3>Revolut pay</h3>
                                    <div className="borderline"></div>
                                 </div>
                                 <SettingsBox />
                                 <ChevronTabs />
                                 {activeStep === 'Security' && depositPaid ? (
                                    <>
                                       <div className="d-flex gap-2 align-items-stretch">
                                          <div className="form-control bg-light d-flex align-items-center justify-content-center fw-bold">
                                             {depositAmount}
                                          </div>
                                          <button className="btn btn-success px-4 fw-bold" type="button" disabled>
                                             &#10003; Deposit Paid
                                          </button>
                                       </div>
                                       <PaymentIframe method="revolut" section="deposit" iframeHtml={iframeHtml} iframeLoading={iframeLoading} iframeError={iframeError} />
                                    </>
                                 ) : activeStep === 'Rent' && rentPaid ? (
                                    <>
                                       <div className="d-flex gap-2 align-items-stretch">
                                          <div className="form-control bg-light d-flex align-items-center justify-content-center fw-bold">
                                             {rentAmount}
                                          </div>
                                          <button className="btn btn-success px-4 fw-bold" type="button" disabled>
                                             &#10003; Rent Paid
                                          </button>
                                       </div>
                                       <PaymentIframe method="revolut" section="rent" iframeHtml={iframeHtml} iframeLoading={iframeLoading} iframeError={iframeError} />
                                    </>
                                 ) : (
                                    <div className="d-flex gap-2 align-items-stretch">
                                       <div className="form-control bg-light d-flex align-items-center justify-content-center fw-bold">
                                          {activeStep === 'Rent' ? rentAmount : depositAmount}
                                       </div>
                                       <button
                                          className="btn btn-dark px-4 fw-bold"
                                          type="button"
                                          onClick={handleRevolutCheckout}
                                          disabled={submitting}
                                       >
                                          {submitting
                                             ? pollingType ? 'Payment in progress...' : 'Opening Revolut...'
                                             : 'Pay Now'}
                                       </button>
                                    </div>
                                 )}
                              </>
                           )}

                           {/* ── BANK ── */}
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

                           {/* ── CASH ── */}
                           {activePayment === 4 && (
                              <>
                                 <div className="paymentmethod_title">
                                    <h3>Cash pay</h3>
                                    <div className="borderline"></div>
                                 </div>
                                 <div className="p-4 mb-4 payment-settings-box">
                                    <p className="mb-0">You can pay by cash directly at our office: <b>211E 43rd Street</b></p>
                                 </div>
                                 <ChevronTabs />
                                 <AmountInput />
                                 {!depositPaid && activeStep === "Security" && (
                                    <p className="small text-warning d-flex align-items-center gap-1 mb-3">
                                       <span className="material-symbols-outlined fs-6">info</span>
                                       Please pay the Security Deposit first before proceeding to Rent.
                                    </p>
                                 )}
                              </>
                           )}

                        </div>

                        {/* ── AUTHORIZE BUTTON — hidden for iframe methods (button is inside iframe) ── */}
                        {activePayment === 4 && (
                           <div className="pt-4 border-top">
                              {!depositPaid && activeStep === "Rent" ? (
                                 <button className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2 mb-3" disabled>
                                    <span className="material-symbols-outlined fs-5">lock</span>
                                    Pay Security Deposit First
                                 </button>
                              ) : (
                                 <button className="btn btn-primary-elite w-100 d-flex align-items-center justify-content-center gap-2 mb-3" disabled>
                                    <span className="material-symbols-outlined fs-5">payments</span>
                                    Pay at Office — 211E 43rd Street
                                 </button>
                              )}
                              <p className="text-center text-uppercase fw-bold text-muted d-flex align-items-center justify-content-center gap-1 mb-0 security-note">
                                 <span className="material-symbols-outlined icon-xs">shield</span>
                                 Secured by Journey Realty Escrow
                              </p>
                           </div>
                        )}

                     </div>
                  </section>
               </div>
            </div>
         </main>
      </PageLayout>
   );
}

// ── PaymentIframe: renders WP shortcode HTML inside srcdoc iframe ──────────────
function PaymentIframe({ method, section, iframeHtml, iframeLoading, iframeError }) {
   const key     = `${method}_${section}`;
   const html    = iframeHtml[key];
   const loading = iframeLoading[key];
   const error   = iframeError[key];

   if (loading) {
      return (
         <div className="mb-4 text-center py-4">
            <div className="spinner-border spinner-border-sm text-secondary" role="status" />
            <p className="small text-muted mt-2 mb-0">Loading payment form...</p>
         </div>
      );
   }

   if (error || !html) {
      return (
         <div className="mb-4 p-3 text-center border rounded">
            <p className="small text-muted mb-2">Payment form could not be loaded.</p>
            <button
               className="btn btn-sm btn-outline-secondary"
               onClick={() => window.location.reload()}
            >
               Retry
            </button>
         </div>
      );
   }

   return (
      <iframe
         srcDoc={html}
         style={{ width: '100%', minHeight: '220px', border: 'none', display: 'block' }}
         scrolling="no"
         title={`${method}-${section}-payment`}
         onLoad={e => {
            try {
               const h = e.target.contentDocument?.body?.scrollHeight;
               if (h) e.target.style.minHeight = h + 20 + 'px';
            } catch {}
         }}
      />
   );
}
