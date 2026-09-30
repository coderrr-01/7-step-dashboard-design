import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getClientData, getToken, getUserSub } from '../services/api';

export const STEP_PATHS = {
  1: '/',
  2: '/review',
  3: '/interview',
  4: '/room-search',
  5: '/secure-booking',
  6: '/document-sign',
  7: '/payment-screen',
};

const StepContext = createContext(null);

function deriveStepsFromClient(client) {
  if (!client) return null;
  const steps = [];
  const leaseStatus = client.lease_status || '';
  const signedLease = client.signed_lease || '';
  const depositPaid = !!client.deposit_paid;
  const rentPaid = !!client.rent_paid;

  if (!!leaseStatus) steps.push(1, 2);

  const map = {
    // Zoho → wizard step reached. Every status the backend may produce is
    // mapped so the screen reflects exactly what reached Zoho.
    'Interview Scheduled': 3,
    'Interview Approved': 3,
    'Interview Complete': 3,
    'Booking Secured': 5,
    'Lease Signed': 6,
    'Signed': 6,
    'Extended': 6,
    'Payment Complete': 7,
  };

  for (const [status, step] of Object.entries(map)) {
    if (leaseStatus === status || leaseStatus.includes(status)) {
      const maxStep = (step === 7 && !rentPaid) ? 6 : step;
      for (let i = 3; i <= maxStep; i++) steps.push(i);
      break;
    }
  }
  if (signedLease && !steps.includes(6)) steps.push(6);

  if (depositPaid && rentPaid) {
    return [1, 2, 3, 4, 5, 6, 7];
  }

  return [...new Set(steps)].sort((a, b) => a - b);
}

function findFirstIncompleteStep(serverSteps) {
  for (let i = 1; i <= 7; i++) {
    if (!serverSteps.includes(i)) return STEP_PATHS[i];
  }
  return STEP_PATHS[7];
}

// Hold key — the user is currently working inside Secure Booking. Scoped per
// user (same pattern as jrny_room_search_entered_<sub>) so accounts on the
// same device don't inherit each other's hold.
const SECURE_BOOKING_HOLD = 'jrny_secure_booking_hold';

function secureBookingHoldKey() {
  const sub = getUserSub();
  return sub ? `${SECURE_BOOKING_HOLD}_${sub}` : SECURE_BOOKING_HOLD;
}

// Called by the Secure Booking page while it is open.
export function markSecureBookingHold() {
  try { localStorage.setItem(secureBookingHoldKey(), '1'); } catch { /* ignore */ }
}

function hasSecureBookingHold() {
  try { return localStorage.getItem(secureBookingHoldKey()) === '1'; } catch { return false; }
}

function clearSecureBookingHold() {
  try { localStorage.removeItem(secureBookingHoldKey()); } catch { /* ignore */ }
}

// Single place that turns the derived step list into the screen to show, so
// both redirect paths below (first '/' hit, later re-entry) resolve
// identically. Room Search keeps its hard gate; Secure Booking gets the same
// treatment so a refresh there does not jump to Lease Sign.
function resolveNextStep(serverSteps) {
  let nextStep = findFirstIncompleteStep(serverSteps);
  if (nextStep === '/room-search') {
    const sub = getUserSub();
    const entered = sub ? localStorage.getItem(`jrny_room_search_entered_${sub}`) === '1' : false;
    if (!entered) nextStep = '/interview';
  }
  // The app is a MemoryRouter, so a refresh always restarts at '/' — and once
  // the tour is booked, lease_status is 'Booking Secured', which makes step 6
  // (/document-sign) the first incomplete step. While the user is still on
  // Secure Booking, hold them there. The hold is dropped as soon as they
  // actually reach Lease Sign (see the effect below), so the SIGN LEASE NOW
  // flow and every later step behave exactly as before.
  if (nextStep === '/document-sign' && hasSecureBookingHold()) {
    nextStep = '/secure-booking';
  }
  return nextStep;
}

export function StepProvider({ children }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Mount pe server se data fetch karo, tab tak loader dikhao
  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    getClientData()
      .then(data => {
        if (!data?.success) { setLoading(false); return; }
        const serverSteps = deriveStepsFromClient(data.data);
        if (serverSteps) setCompletedSteps(serverSteps);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Jab bhi user / pe aaye, fresh data leke sahi screen pe bhejo — based on the
  // data that actually reached Zoho (server-derived steps). Hard rule: the app
  // NEVER auto-navigates to /room-search. The user must click "Search your room"
  // to advance past the interview gate — even if the interview is already
  // approved.
  // De-duped: the mount effect already fetched client-data, so reuse that
  // result for the initial '/' redirect instead of firing a second identical
  // request. Only re-fetch if navigating back to '/' later.
  const hasFetchedRef = useState(() => ({ done: false }))[0];

  // Reaching Lease Sign means the user is done with Secure Booking — drop the
  // hold so a refresh on step 6 resumes at step 6 instead of bouncing back.
  useEffect(() => {
    if (pathname !== '/document-sign') return;
    clearSecureBookingHold();
  }, [pathname]);

  useEffect(() => {
    if (!getToken() || pathname !== '/' || loading) return;
    // First hit on '/' right after mount — steps already derived, just redirect
    if (!hasFetchedRef.done) {
      hasFetchedRef.done = true;
      const nextStep = resolveNextStep(completedSteps);
      if (nextStep && nextStep !== pathname) {
        navigate(nextStep, { replace: true });
      }
      return;
    }
    getClientData()
      .then(data => {
        if (!data?.success) return;
        const serverSteps = deriveStepsFromClient(data.data);
        if (!serverSteps) return;
        setCompletedSteps(serverSteps);
        const nextStep = resolveNextStep(serverSteps);
        if (nextStep && nextStep !== pathname) {
          navigate(nextStep, { replace: true });
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, loading, completedSteps]);

  const completeStep = (stepNumber) => {
    setCompletedSteps(prev =>
      [...new Set([...prev, stepNumber])].sort((a, b) => a - b)
    );
  };

  const canAccessStep = (stepNumber) => {
    if (stepNumber === 1) return true;
    return completedSteps.includes(stepNumber - 1);
  };

  const currentStep = (() => {
    for (let i = 1; i <= 7; i++) {
      if (!completedSteps.includes(i)) return i;
    }
    return 7;
  })();

  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#fff', zIndex: 9999,
      }}>
        <div style={{
          width: 40, height: 40, border: '4px solid #e0e0e0',
          borderTopColor: '#0071e3', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <StepContext.Provider value={{ completedSteps, completeStep, canAccessStep, currentStep, clientLoading: false }}>
      {children}
    </StepContext.Provider>
  );
}

export function useSteps() {
  const ctx = useContext(StepContext);
  if (!ctx) throw new Error('useSteps must be used inside StepProvider');
  return ctx;
}
