import { useState, useEffect } from "react";
import PageLayout from "../components/PageLayout";
import stripeIcon from "../assets/icons/stripe.svg";
import paypalIcon from "../assets/icons/paypal.svg";
import Revoulticon from "../assets/icons/revsult.svg";
import bankicon from "../assets/icons/bank.svg";
import CashIcon from "../assets/icons/cash.svg";
import { useClientData } from "../hooks/useClientData";
import { submitStripePayment, submitPaypalPayment, submitRevolutPayment, createRevolutCheckout, getRevolutStatus, getPaymentUI } from "../services/api";
import { toast } from "react-toastify";
import { useSteps } from "../context/StepContext";

export default function PaymentScreen() {
   const { client, loading: clientLoading, refetch } = useClientData();
   const { completeStep } = useSteps();
   const [activeStep, setActiveStep] = useState("Security");
   const [activePayment, setActivePayment] = useState(0);
   const [submitting, setSubmitting] = useState(false);
   const [pollingType, setPollingType] = useState(null);
   const [iframeHtml, setIframeHtml] = useState({});
   const [iframeLoading, setIframeLoading] = useState({});
   const [iframeError, setIframeError] = useState({});
   const methodNames = ['stripe', 'paypal', 'revolut', 'bank', 'cash'];

   const methodIndexFor = (method) => {
      const normalized = String(method || '').trim().toLowerCase();
      if (!normalized) return -1;
      return paymentMethods.findIndex(m => m.name.toLowerCase() === normalized);
   };

   const loadPaymentUI = async (method, section, force = false) => {
      const key = `${method}_${section}`;
      if (!force && iframeHtml[key]) return;
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

   useEffect(() => {
      const method = methodNames[activePayment];
      if (!method || method === 'cash') return;
      loadPaymentUI(method, activeStep === 'Rent' ? 'rent' : 'deposit');
   }, [activePayment, activeStep]);

   const [selectedRoom] = useState(() => {
      try { return JSON.parse(localStorage.getItem('jrny_selected_room') || 'null'); }
      catch { return null; }
   });

   const storageKey = client?.id ? `jrny_deposit_paid_${client.id}` : null;
   const storageMethodKey = client?.id ? `jrny_deposit_method_${client.id}` : null;
   const rentStorageKey = client?.id ? `jrny_rent_paid_${client.id}` : null;

   const [depositPaidNow, setDepositPaidNow] = useState(() => {
      if (!storageKey) return false;
      return localStorage.getItem(storageKey) === '1';
   });

   const [depositMethod, setDepositMethod] = useState(() => {
      if (!storageMethodKey) return null;
      const v = localStorage.getItem(storageMethodKey);
      return v !== null ? parseInt(v, 10) : null;
   });

   const [rentPaidNow, setRentPaidNow] = useState(() => {
      if (!rentStorageKey) return false;
      return localStorage.getItem(rentStorageKey) === '1';
   });

   // Celebration screen is shown first when everything is paid; "View Details"
   // dismisses it for the session so the user can inspect the checkout UI.
   const [successDismissed, setSuccessDismissed] = useState(false);

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

   useEffect(() => {
      if (client?.rent_paid && !rentPaidNow) {
         setRentPaidNow(true);
         if (rentStorageKey) localStorage.setItem(rentStorageKey, '1');
         reloadPaymentUI('rent');
      }
   }, [client?.rent_paid, client?.rent_method, rentStorageKey]);

   const paymentMethods = [
      { name: "Stripe", icon: stripeIcon },
      { name: "PayPal", icon: paypalIcon },
      { name: "Revolut", icon: Revoulticon },
      { name: "Bank", icon: bankicon },
      { name: "Cash", icon: CashIcon },
   ];

   useEffect(() => {
      if (clientLoading) return;

      const preferredIndex = depositMethod ?? methodIndexFor(client?.deposit_method || client?.rent_method);
      if (preferredIndex >= 0 && activePayment !== preferredIndex) {
         setActivePayment(preferredIndex);
      }
   }, [activeStep, clientLoading, client?.deposit_method, client?.rent_method, depositMethod]);

   const depositPaid = depositPaidNow || !!client?.deposit_paid;
   const rentPaid = rentPaidNow || !!client?.rent_paid;

   // "Total Due Now: 0" (both payments done) must mark SECURE PAYMENT as
   // completed in the timeline — covers users returning to an already-paid
   // account where no payment handler runs again.
   useEffect(() => {
      if (!clientLoading && depositPaid && rentPaid) completeStep(7);
   }, [clientLoading, depositPaid, rentPaid]);

   const visibleMethods = depositPaid && depositMethod !== null
      ? paymentMethods.filter((_, i) => i === depositMethod || i === 4)
      : paymentMethods;

   const rawDeposit = client?.security_deposit
      ? parseFloat(client.security_deposit)
      : (selectedRoom?.security_deposit ? parseFloat(selectedRoom.security_deposit) : 0);
   const rawRent = client?.rent_amount
      ? parseFloat(client.rent_amount)
      : (selectedRoom?.monthly_rent ? parseFloat(selectedRoom.monthly_rent) : (selectedRoom?.price ? parseFloat(selectedRoom.price) : 0));

   const depositAmount = `$ ${rawDeposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
   const rentAmount = `$ ${rawRent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

   const clientName = client?.name || '';
   const clientPhone = client?.phone || '';
   const clientEmail = client?.email || '';
   const startDate = client?.start_date || '';
   const endDate = client?.end_date || '';
   const unitLabel = selectedRoom?.name || client?.unit || client?.room_name || '';

   const roomMeta = (() => {
      if (!selectedRoom) return '';
      const parts = [
         selectedRoom.floor ? `Floor ${selectedRoom.floor}` : null,
         selectedRoom.unit_number ? `Unit ${selectedRoom.unit_number}` : null,
         selectedRoom.size_sq_ft ? `${selectedRoom.size_sq_ft} sq.ft` : null,
         selectedRoom.status ? selectedRoom.status : null,
      ].filter(Boolean);
      if (parts.length) return parts.join(' • ');
      return [selectedRoom.roomNumber, selectedRoom.city].filter(Boolean).join(' • ');
   })();

   const handleRentTabClick = () => {
      if (!clientLoading && !depositPaid) {
         toast.warning('Please pay the Security Deposit first.');
         return;
      }
      setActiveStep("Rent");
   };

   const handleAuthorize = async () => {
      const type = activeStep === 'Rent' ? 'rent' : 'deposit';
      const amount = type === 'deposit' ? rawDeposit : rawRent;
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
               if (storageKey) localStorage.setItem(storageKey, '1');
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
            setPollingType(type);
            toast.info('Revolut checkout opened in a new tab. Complete the payment there, then return to this tab.');
         } else {
            window.top.location.href = result.checkout_url;
         }
      } catch (error) {
         toast.error(error?.message || 'Unable to start Revolut checkout.');
         if (checkoutTab) { try { checkoutTab.close(); } catch { } }
         setSubmitting(false);
         setPollingType(null);
      }
   };

   useEffect(() => {
      if (!pollingType) return;

      let stopped = false;
      let attempts = 0;
      const MAX_ATTEMPTS = 75;
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
                  setDepositMethod(2);
                  if (storageKey) localStorage.setItem(storageKey, '1');
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

      tick();

      return () => { stopped = true; clearInterval(interval); };
   }, [pollingType, storageKey, storageMethodKey, rentStorageKey]);

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

   const SettingsBox = () => (
      <div className="p-4 mb-4 payment-settings-box">
         <div className="form-check p-0 d-flex gap-3 mb-4">
            <div>
               <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="19" height="19" rx="1.5" fill="#C5A365" stroke="#C5A365" />
                  <path d="M14.1934 7.05078C14.3105 7.18099 14.3691 7.33073 14.3691 7.5V7.5C14.3691 7.66927 14.3105 7.81901 14.1934 7.94922L9.19336 12.9492C9.06315 13.0664 8.91341 13.125 8.74414 13.125C8.57487 13.125 8.42513 13.0664 8.29492 12.9492L5.79492 10.4492C5.67773 10.319 5.61914 10.1693 5.61914 10C5.61914 9.83073 5.67773 9.68099 5.79492 9.55078C5.92513 9.43359 6.07487 9.375 6.24414 9.375C6.41341 9.375 6.56315 9.43359 6.69336 9.55078L8.74414 11.6211L13.2949 7.05078C13.4251 6.93359 13.5749 6.875 13.7441 6.875C13.9134 6.875 14.0632 6.93359 14.1934 7.05078V7.05078V7.05078" fill="white" />
               </svg>
            </div>
            <label className="form-check-label" htmlFor="recurringCheck">
               <span className="d-block fw-bold mb-1">Recurring Monthly Automatic Payment</span>
               <span className="d-block small text-muted">Your subsequent rent payments will be automatically charged using this method.</span>
            </label>
         </div>
         <div className="form-check p-0 d-flex gap-3">
            <div>
               <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="19" height="19" rx="1.5" fill="#C5A365" stroke="#C5A365" />
                  <path d="M14.1934 7.05078C14.3105 7.18099 14.3691 7.33073 14.3691 7.5V7.5C14.3691 7.66927 14.3105 7.81901 14.1934 7.94922L9.19336 12.9492C9.06315 13.0664 8.91341 13.125 8.74414 13.125C8.57487 13.125 8.42513 13.0664 8.29492 12.9492L5.79492 10.4492C5.67773 10.319 5.61914 10.1693 5.61914 10C5.61914 9.83073 5.67773 9.68099 5.79492 9.55078C5.92513 9.43359 6.07487 9.375 6.24414 9.375C6.41341 9.375 6.56315 9.43359 6.69336 9.55078L8.74414 11.6211L13.2949 7.05078C13.4251 6.93359 13.5749 6.875 13.7441 6.875C13.9134 6.875 14.0632 6.93359 14.1934 7.05078V7.05078V7.05078" fill="white" />
               </svg>
            </div>

            <label className="form-check-label fw-bold small" htmlFor="saveMethodCheck">
               Save your preferred payment method for future transactions
            </label>
         </div>
      </div>
   );

   const AmountInput = () => (
      <div className="mb-2">
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
   );

   // ── Fully paid → Celebration view ───────────────────────────────────────────
   // Once BOTH payments are done ("Total Due Now: 0") the checkout UI is
   // replaced by a congratulatory membership confirmation. Shown on every
   // visit while payments stay complete — server flags drive this, so it
   // survives logout/login and wiped browser caches.
   if (!clientLoading && depositPaid && rentPaid && !successDismissed) {
      const methodUsed = paymentMethods[depositMethod]?.name || 'Online';
      const firstName = clientName ? clientName.split(' ')[0] : '';
      return (
         <PageLayout page="PaymentScreen">
            <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1">
               <div className="container container-narrow py-5 px-lg-5 secure-payment-details">
                  <section className="pay-success" aria-live="polite">
                     <span className="pay-spark pay-spark-1" aria-hidden="true"></span>
                     <span className="pay-spark pay-spark-2" aria-hidden="true"></span>
                     <span className="pay-spark pay-spark-3" aria-hidden="true"></span>
                     <span className="pay-spark pay-spark-4" aria-hidden="true"></span>
                     <span className="pay-spark pay-spark-5" aria-hidden="true"></span>

                     <div className="pay-success-card">
                        <div className="pay-check-wrap" aria-hidden="true">
                           <span className="pay-halo pay-halo-1"></span>
                           <span className="pay-halo pay-halo-2"></span>
                           <div className="pay-check">
                              <svg viewBox="0 0 52 52" width="44" height="44" fill="none"
                                 stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                                 <path d="M13 27l9 9 17-19" />
                              </svg>
                           </div>
                        </div>

                        <p className="pay-eyebrow">Payment Successful</p>
                        <h1 className="pay-title">
                           Congratulations{firstName ? `, ${firstName}` : ''}!
                        </h1>
                        <p className="pay-sub">
                           You are now an official member of the  community.
                           Your reservation is confirmed and your spot is secured.
                        </p>

                        <div className="pay-details">
                           <div className="pay-row"><span>Member</span><b>{clientName}</b></div>
                           <div className="pay-row"><span>Residence</span><b>{unitLabel}</b></div>
                           {roomMeta ? <div className="pay-row"><span>Details</span><b>{roomMeta}</b></div> : null}
                           <div className="pay-row"><span>Security Deposit</span><b>{depositAmount} <em className="pay-paid-tag">Paid</em></b></div>
                           <div className="pay-row"><span>First Month Rent</span><b>{rentAmount} <em className="pay-paid-tag">Paid</em></b></div>
                           <div className="pay-row"><span>Paid Via</span><b>{methodUsed}</b></div>
                           <div className="pay-row">
                              <span>Membership Valid</span>
                              <b>{startDate}{startDate && endDate ? '  →  ' : ''}{endDate || 'Active'}</b>
                           </div>
                        </div>

                        <p className="pay-validity">
                           ✨ Your residency is valid through <b>{endDate || 'your lease term'}</b>.
                           Welcome aboard — we can't wait to have you home!
                        </p>

                        <button
                           type="button"
                           className="pay-view-btn"
                           onClick={() => setSuccessDismissed(true)}
                        >
                           View Details
                           <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8"
                                 strokeLinecap="round" strokeLinejoin="round" />
                           </svg>
                        </button>
                     </div>
                  </section>
               </div>
            </main>
         </PageLayout>
      );
   }

   // Payment status is not yet known (fresh login — local flags were cleared on
   // logout). Hold on a spinner instead of flashing the checkout UI, so users
   // with both payments done land straight on the celebration screen.
   if (clientLoading) {
      return (
         <PageLayout page="PaymentScreen">
            <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1">
               <div className="container container-narrow py-5 px-lg-5 secure-payment-details">
                  <div className="pay-loading" role="status" aria-live="polite">
                     <span className="pay-loading-ring" aria-hidden="true"></span>
                     <p>Loading your reservation…</p>
                  </div>
               </div>
            </main>
         </PageLayout>
      );
   }

   return (
      <PageLayout page="PaymentScreen">
         <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1">
            <div className="container container-narrow py-5 px-lg-5 secure-payment-details">
               <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                  <div>
                     <h1 className="display-4 serif-heading heading-hero mb-2 hero-title">
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
                                 <p className="small text-muted mb-2">{roomMeta}</p>
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
                           <div className="d-flex justify-content-between align-items-baseline  ">
                              <span className="fw-bold">Total Due Now</span>
                              <span className="h4 text-primary-container mb-0 fw-bold">
                                 {depositPaid && rentPaid ? 0 : depositPaid ? rentAmount : depositAmount}
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
                     </div>
                     <div className="merchant-footer text-center">
                        <p className="text-uppercase text-primary-container fw-bold mb-1 security-note">Official Merchant</p>
                        <h4 className="h6 fw-bold mb-2">Journey Realty LLC</h4>
                        <div className="small text-muted mb-3">
                           <p className="mb-0">211 E 43rd Street, New York, NY 10029</p>
                           <p className="mb-0">Tel: <a className="text-primary-container fw-bold text-decoration-none" href="tel:+12125550198">+1 (212) 555-0198</a></p>
                        </div>
                        <a className="text-primary-container fw-bold small text-decoration-none d-flex align-items-center justify-content-center gap-2 mb-3">
                           <span className="material-symbols-outlined fs-6">
                              <svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M3.44146 12.0703C3.83202 11.2891 3.74089 10.5599 3.16808 9.88281C2.30886 8.9974 1.87925 7.99479 1.87925 6.875C1.90529 5.57292 2.4781 4.42708 3.59768 3.4375C4.71727 2.44792 6.22741 1.92708 8.1281 1.875C10.0288 1.92708 11.5389 2.44792 12.6585 3.4375C13.7781 4.42708 14.3509 5.57292 14.377 6.875C14.3509 8.17708 13.7781 9.32292 12.6585 10.3125C11.5389 11.3021 10.0288 11.8229 8.1281 11.875C7.60736 11.875 7.11266 11.8229 6.644 11.7188C6.22741 11.6406 5.83686 11.7057 5.47234 11.9141C5.29008 11.9922 5.12084 12.0703 4.96462 12.1484C4.33974 12.4349 3.68881 12.6693 3.01185 12.8516C3.116 12.6693 3.22015 12.487 3.3243 12.3047C3.37637 12.2266 3.41543 12.1484 3.44146 12.0703ZM0.00459474 6.875C0.0306316 8.54167 0.62948 9.97396 1.80114 11.1719C1.74907 11.25 1.71001 11.3151 1.68397 11.3672C1.29342 12.1224 0.824756 12.8125 0.277982 13.4375C-0.0084237 13.724 -0.0735159 14.0495 0.0827054 14.4141C0.264964 14.7786 0.551369 14.974 0.941922 15C2.66036 14.9219 4.26162 14.5312 5.74573 13.8281C5.92798 13.75 6.11024 13.6719 6.2925 13.5938C6.89135 13.6979 7.50322 13.75 8.1281 13.75C10.4193 13.6979 12.3331 13.0208 13.8692 11.7188C15.4054 10.4427 16.1995 8.82812 16.2516 6.875C16.1995 4.92188 15.4054 3.30729 13.8692 2.03125C12.3331 0.729167 10.4193 0.0520833 8.1281 0C5.83686 0.0520833 3.92315 0.729167 2.38697 2.03125C0.850793 3.30729 0.0566685 4.92188 0.00459474 6.875ZM16.8765 18.75C17.5014 18.75 18.1132 18.6979 18.7121 18.5938C18.8944 18.6719 19.0766 18.75 19.2589 18.8281C20.743 19.5312 22.3442 19.9219 24.0627 20C24.4532 19.974 24.7396 19.7917 24.9219 19.4531C25.0521 19.0625 24.987 18.724 24.7266 18.4375C24.1798 17.8125 23.7112 17.1354 23.3206 16.4062C23.2946 16.3542 23.2685 16.3151 23.2425 16.2891C23.2425 16.263 23.2295 16.224 23.2035 16.1719C24.3751 14.974 24.974 13.5417 25 11.875C24.9479 9.97396 24.1929 8.38542 22.7348 7.10938C21.3028 5.83333 19.4802 5.13021 17.267 5C17.4233 5.59896 17.5014 6.22396 17.5014 6.875V6.91406C19.2198 7.07031 20.5867 7.63021 21.6022 8.59375C22.5916 9.55729 23.0993 10.651 23.1253 11.875C23.1253 12.9948 22.6957 13.9974 21.8365 14.8828C21.2637 15.5599 21.1726 16.2891 21.5631 17.0703C21.5892 17.1484 21.6282 17.2266 21.6803 17.3047C21.7584 17.4349 21.8365 17.5651 21.9146 17.6953C21.9407 17.7474 21.9667 17.7995 21.9927 17.8516C21.3158 17.6693 20.6649 17.4349 20.04 17.1484C19.8838 17.0703 19.7145 16.9922 19.5323 16.9141C19.1677 16.7057 18.7772 16.6406 18.3606 16.7188C17.8919 16.8229 17.3972 16.875 16.8765 16.875C15.6528 16.849 14.5852 16.6146 13.674 16.1719C12.7627 15.7292 12.0467 15.1562 11.5259 14.4531C10.901 14.6615 10.2501 14.8047 9.57315 14.8828C10.2501 16.0547 11.2395 16.9922 12.5414 17.6953C13.8172 18.3724 15.2622 18.724 16.8765 18.75Z" fill="#B8924A" />
                              </svg>
                           </span>
                           Customer Support
                        </a>
                        <div className="d-flex justify-content-center gap-3 opacity-50 payment-card-logos">

                           {/* Facebook */}
                           <a href="#" target="_blank" rel="noreferrer">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="20"
                                 height="20"
                                 viewBox="0 0 16 16"
                                 fill="none"
                              >
                                 <path
                                    fill="#1877F2"
                                    d="M15 8a7 7 0 00-7-7 7 7 0 00-1.094 13.915v-4.892H5.13V8h1.777V6.458c0-1.754 1.045-2.724 2.644-2.724.766 0 1.567.137 1.567.137v1.723h-.883c-.87 0-1.14.54-1.14 1.093V8h1.941l-.31 2.023H9.094v4.892A7.001 7.001 0 0015 8z"
                                 />
                                 <path
                                    fill="#ffffff"
                                    d="M10.725 10.023L11.035 8H9.094V6.687c0-.553.27-1.093 1.14-1.093h.883V3.87s-.801-.137-1.567-.137c-1.6 0-2.644.97-2.644 2.724V8H5.13v2.023h1.777v4.892a7.037 7.037 0 002.188 0v-4.892h1.63z"
                                 />
                              </svg>
                           </a>

                           {/* Twitter */}
                           <a href="#" target="_blank" rel="noreferrer">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="20"
                                 height="20"
                                 viewBox="0 -4 48 48"
                                 fill="none"
                              >
                                 <g
                                    stroke="none"
                                    strokeWidth="1"
                                    fill="none"
                                    fillRule="evenodd"
                                 >
                                    <g
                                       transform="translate(-300.000000, -164.000000)"
                                       fill="#00AAEC"
                                    >
                                       <path
                                          d="M348,168.735283 C346.236309,169.538462 344.337383,170.081618 342.345483,170.324305 C344.379644,169.076201 345.940482,167.097147 346.675823,164.739617 C344.771263,165.895269 342.666667,166.736006 340.418384,167.18671 C338.626519,165.224991 336.065504,164 333.231203,164 C327.796443,164 323.387216,168.521488 323.387216,174.097508 C323.387216,174.88913 323.471738,175.657638 323.640782,176.397255 C315.456242,175.975442 308.201444,171.959552 303.341433,165.843265 C302.493397,167.339834 302.008804,169.076201 302.008804,170.925244 C302.008804,174.426869 303.747139,177.518238 306.389857,179.329722 C304.778306,179.280607 303.256911,178.821235 301.9271,178.070061 L301.9271,178.194294 C301.9271,183.08848 305.322064,187.17082 309.8299,188.095341 C309.004402,188.33225 308.133826,188.450704 307.235077,188.450704 C306.601162,188.450704 305.981335,188.390033 305.381229,188.271578 C306.634971,192.28169 310.269414,195.2026 314.580032,195.280607 C311.210424,197.99061 306.961789,199.605634 302.349709,199.605634 C301.555203,199.605634 300.769149,199.559408 300,199.466956 C304.358514,202.327194 309.53689,204 315.095615,204 C333.211481,204 343.114633,188.615385 343.114633,175.270495 C343.114633,174.831347 343.106181,174.392199 343.089276,173.961719 C345.013559,172.537378 346.684275,170.760563 348,168.735283"
                                       />
                                    </g>
                                 </g>
                              </svg>
                           </a>

                           {/* YouTube */}
                           <a href="#" target="_blank" rel="noreferrer">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="20"
                                 height="20"
                                 viewBox="0 0 16 16"
                                 fill="none"
                              >
                                 <path
                                    fill="red"
                                    d="M14.712 4.633a1.754 1.754 0 00-1.234-1.234C12.382 3.11 8 3.11 8 3.11s-4.382 0-5.478.289c-.6.161-1.072.634-1.234 1.234C1 5.728 1 8 1 8s0 2.283.288 3.367c.162.6.635 1.073 1.234 1.234C3.618 12.89 8 12.89 8 12.89s4.382 0 5.478-.289a1.754 1.754 0 001.234-1.234C15 10.272 15 8 15 8s0-2.272-.288-3.367z"
                                 />
                                 <path
                                    fill="#ffffff"
                                    d="M6.593 10.11l3.644-2.098-3.644-2.11v4.208z"
                                 />
                              </svg>
                           </a>

                           {/* Instagram */}
                           <a href="#" target="_blank" rel="noreferrer">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="20"
                                 height="20"
                                 viewBox="0 0 2500 2500"
                              >
                                 <defs>
                                    <radialGradient
                                       id="instagramGradient1"
                                       cx="332.14"
                                       cy="2511.81"
                                       r="3263.54"
                                       gradientUnits="userSpaceOnUse"
                                    >
                                       <stop offset=".09" stopColor="#fa8f21" />
                                       <stop offset=".78" stopColor="#d82d7e" />
                                    </radialGradient>

                                    <radialGradient
                                       id="instagramGradient2"
                                       cx="1516.14"
                                       cy="2623.81"
                                       r="2572.12"
                                       gradientUnits="userSpaceOnUse"
                                    >
                                       <stop
                                          offset=".64"
                                          stopColor="#8c3aaa"
                                          stopOpacity="0"
                                       />
                                       <stop
                                          offset="1"
                                          stopColor="#8c3aaa"
                                       />
                                    </radialGradient>
                                 </defs>

                                 <path
                                    d="M833.4,1250c0-230.11,186.49-416.7,416.6-416.7s416.7,186.59,416.7,416.7-186.59,416.7-416.7,416.7S833.4,1480.11,833.4,1250m-225.26,0c0,354.5,287.36,641.86,641.86,641.86S1891.86,1604.5,1891.86,1250,1604.5,608.14,1250,608.14,608.14,895.5,608.14,1250M1767.27,582.69a150,150,0,1,0,150.06-149.94h-0.06a150.07,150.07,0,0,0-150,149.94M745,2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28,7.27-505.15c5.55-121.87,26-188,43-232.13,22.72-58.36,49.78-100,93.5-143.78s85.32-70.88,143.78-93.5c44-17.16,110.26-37.46,232.13-43,131.76-6.06,171.34-7.27,505-7.27s373.28,1.31,505.15,7.27c121.87,5.55,188,26,232.13,43,58.36,22.62,100,49.78,143.78,93.5s70.78,85.42,93.5,143.78c17.16,44,37.46,110.26,43,232.13,6.06,131.87,7.27,171.34,7.27,505.15s-1.21,373.28-7.27,505.15c-5.55,121.87-25.95,188.11-43,232.13-22.72,58.36-49.78,100-93.5,143.68s-85.42,70.78-143.78,93.5c-44,17.16-110.26,37.46-232.13,43-131.76,6.06-171.34,7.27-505.15,7.27s-373.28-1.21-505-7.27M734.65,7.57c-133.07,6.06-224,27.16-303.41,58.06C349,97.54,279.38,140.35,209.81,209.81S97.54,349,65.63,431.24c-30.9,79.46-52,170.34-58.06,303.41C1.41,867.93,0,910.54,0,1250s1.41,382.07,7.57,515.35c6.06,133.08,27.16,223.95,58.06,303.41,31.91,82.19,74.62,152,144.18,221.43S349,2402.37,431.24,2434.37c79.56,30.9,170.34,52,303.41,58.06C868,2498.49,910.54,2500,1250,2500s382.07-1.41,515.35-7.57c133.08-6.06,223.95-27.16,303.41-58.06,82.19-32,151.86-74.72,221.43-144.18s112.18-139.24,144.18-221.43c30.9-79.46,52.1-170.34,58.06-303.41,6.06-133.38,7.47-175.89,7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95,97.54,2068.86,65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17,1.51,1589.56,0,1250.1,0S868,1.41,734.65,7.57"
                                    fill="url(#instagramGradient1)"
                                 />

                                 <path
                                    d="M833.4,1250c0-230.11,186.49-416.7,416.6-416.7s416.7,186.59,416.7,416.7-186.59,416.7-416.7,416.7S833.4,1480.11,833.4,1250m-225.26,0c0,354.5,287.36,641.86,641.86,641.86S1891.86,1604.5,1891.86,1250,1604.5,608.14,1250,608.14,608.14,895.5,608.14,1250M1767.27,582.69a150,150,0,1,0,150.06-149.94h-0.06a150.07,150.07,0,0,0-150,149.94M745,2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28,7.27-505.15c5.55-121.87,26-188,43-232.13,22.72-58.36,49.78-100,93.5-143.78s85.32-70.88,143.78-93.5c44-17.16,110.26-37.46,232.13-43,131.76-6.06,171.34-7.27,505-7.27s373.28,1.31,505.15,7.27c121.87,5.55,188,26,232.13,43,58.36,22.62,100,49.78,143.78,93.5s70.78,85.42,93.5,143.78c17.16,44,37.46,110.26,43,232.13,6.06,131.87,7.27,171.34,7.27,505.15s-1.21,373.28-7.27,505.15c-5.55,121.87-25.95,188.11-43,232.13-22.72,58.36-49.78,100-93.5,143.68s-85.42,70.78-143.78,93.5c-44,17.16-110.26,37.46-232.13,43-131.76,6.06-171.34,7.27-505.15,7.27s-373.28-1.21-505-7.27M734.65,7.57c-133.07,6.06-224,27.16-303.41,58.06C349,97.54,279.38,140.35,209.81,209.81S97.54,349,65.63,431.24c-30.9,79.46-52,170.34-58.06,303.41C1.41,867.93,0,910.54,0,1250s1.41,382.07,7.57,515.35c6.06,133.08,27.16,223.95,58.06,303.41,31.91,82.19,74.62,152,144.18,221.43S349,2402.37,431.24,2434.37c79.56,30.9,170.34,52,303.41,58.06C868,2498.49,910.54,2500,1250,2500s382.07-1.41,515.35-7.57c133.08-6.06,223.95-27.16,303.41-58.06,82.19-32,151.86-74.72,221.43-144.18s112.18-139.24,144.18-221.43c30.9-79.46,52.1-170.34,58.06-303.41,6.06-133.38,7.47-175.89,7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95,97.54,2068.86,65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17,1.51,1589.56,0,1250.1,0S868,1.41,734.65,7.57"
                                    fill="url(#instagramGradient2)"
                                 />
                              </svg>
                           </a>

                           {/* WhatsApp */}
                           <a
                              href="https://wa.me/19292419530"
                              target="_blank"
                              rel="noreferrer"
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="20"
                                 height="20"
                                 viewBox="0 0 418.135 418.135"
                              >
                                 <g>
                                    <path
                                       style={{ fill: "#7AD06D" }}
                                       d="M198.929,0.242C88.5,5.5,1.356,97.466,1.691,208.02c0.102,33.672,8.231,65.454,22.571,93.536L2.245,408.429c-1.191,5.781,4.023,10.843,9.766,9.483l104.723-24.811c26.905,13.402,57.125,21.143,89.108,21.631c112.869,1.724,206.982-87.897,210.5-200.724C420.113,93.065,320.295-5.538,198.929,0.242z M323.886,322.197c-30.669,30.669-71.446,47.559-114.818,47.559c-25.396,0-49.71-5.698-72.269-16.935l-14.584-7.265l-64.206,15.212l13.515-65.607l-7.185-14.07c-11.711-22.935-17.649-47.736-17.649-73.713c0-43.373,16.89-84.149,47.559-114.819c30.395-30.395,71.837-47.56,114.822-47.56c43.373,0,84.148,16.89,114.817,47.559c30.669,30.669,47.559,71.445,47.56,114.817C371.446,250.361,354.281,291.803,323.886,322.197z"
                                    />
                                    <path
                                       style={{ fill: "#7AD06D" }}
                                       d="M309.712,252.351l-40.169-11.534c-5.281-1.516-10.968-0.018-14.816,3.903l-9.823,10.008c-4.142,4.22-10.427,5.576-15.909,3.358c-19.002-7.69-58.974-43.23-69.182-61.007c-2.945-5.128-2.458-11.539,1.158-16.218l8.576-11.095c3.36-4.347,4.069-10.185,1.847-15.21l-16.9-38.223c-4.048-9.155-15.747-11.82-23.39-5.356c-11.211,9.482-24.513,23.891-26.13,39.854c-2.851,28.144,9.219,63.622,54.862,106.222c52.73,49.215,94.956,55.717,122.449,49.057c15.594-3.777,28.056-18.919,35.921-31.317C323.568,266.34,319.334,255.114,309.712,252.351z"
                                    />
                                 </g>
                              </svg>
                           </a>

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
                                       <div>
                                          <img src={item.icon} alt={item.name} />
                                       </div>
                                       <span className="small fw-bold">
                                          {item.name}
                                       </span>
                                    </button>
                                 </div>
                              );
                           })}
                        </div>

                        <div className="payment-method-details">

                           {activePayment === 0 && (
                              <>
                                 <div className="paymentmethod_title">
                                    <h3>Stripe pay</h3>
                                    <div className="borderline"></div>
                                 </div>
                                 <SettingsBox />
                                 <ChevronTabs />
                                 <AmountInput />
                                 <PaymentIframe method="stripe" section={activeStep === 'Rent' ? 'rent' : 'deposit'} iframeHtml={iframeHtml} iframeLoading={iframeLoading} iframeError={iframeError} />
                              </>
                           )}

                           {activePayment === 1 && (
                              <>
                                 <div className="paymentmethod_title">
                                    <h3>PayPal pay</h3>
                                    <div className="borderline"></div>
                                 </div>
                                 <SettingsBox />
                                 <ChevronTabs />
                                 <AmountInput />
                                 <PaymentIframe method="paypal" section={activeStep === 'Rent' ? 'rent' : 'deposit'} iframeHtml={iframeHtml} iframeLoading={iframeLoading} iframeError={iframeError} />
                              </>
                           )}

                           {activePayment === 2 && (
                              <>
                                 <div className="paymentmethod_title">
                                    <h3>Revolut pay</h3>
                                    <div className="borderline"></div>
                                 </div>
                                 <SettingsBox />
                                 <ChevronTabs />
                                 <AmountInput />
                                 {activeStep === 'Security' && depositPaid ? (
                                    <>
                                       <div className="d-flex gap-2 align-items-stretch">
                                          <button className="btn btn-success px-4 fw-bold" type="button" disabled>
                                             &#10003; Deposit Paid
                                          </button>
                                       </div>
                                       <PaymentIframe method="revolut" section="deposit" iframeHtml={iframeHtml} iframeLoading={iframeLoading} iframeError={iframeError} />
                                    </>
                                 ) : activeStep === 'Rent' && rentPaid ? (
                                    <>
                                       <div className="d-flex gap-2 align-items-stretch">
                                          <button className="btn btn-success px-4 fw-bold" type="button" disabled>
                                             &#10003; Rent Paid
                                          </button>
                                       </div>
                                       <PaymentIframe method="revolut" section="rent" iframeHtml={iframeHtml} iframeLoading={iframeLoading} iframeError={iframeError} />
                                    </>
                                 ) : (
                                    <div className="d-flex gap-2 align-items-stretch">
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

                           {activePayment === 3 && (
                              <>
                                 <div className="paymentmethod_title">
                                    <h3>Bank pay</h3>
                                    <div className="borderline"></div>
                                 </div>
                                 <SettingsBox />
                                 <ChevronTabs />
                                 <PaymentIframe
                                    method="bank"
                                    section={activeStep === 'Rent' ? 'rent' : 'deposit'}
                                    iframeHtml={iframeHtml}
                                    iframeLoading={iframeLoading}
                                    iframeError={iframeError}
                                 />
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
                                 <ChevronTabs />
                                 <AmountInput />
                                 {!depositPaid && activeStep === "Security" && (
                                    <p className="small text-warning d-flex align-items-center gap-1 mb-3">
                                       <span className="material-symbols-outlined fs-6">info</span>
                                       Please pay the Security Deposit first before proceeding to Rent.
                                    </p>
                                 )}
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
                              </>
                           )}

                        </div>
                     </div>
                  </section>
               </div>
            </div>

         </main>

      </PageLayout>
   );
}

function PaymentIframe({ method, section, iframeHtml, iframeLoading, iframeError }) {
   const key = `${method}_${section}`;
   const html = iframeHtml[key];
   const loading = iframeLoading[key];
   const error = iframeError[key];

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
            } catch { }
         }}
      />
   );
}
