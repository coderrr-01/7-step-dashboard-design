import { createContext, useContext, useState, useEffect } from 'react';
import { getClientData, getUserSub, getToken } from '../services/api';

export const STEP_PATHS = {
  1: '/',
  2: '/review',
  3: '/room-search',
  4: '/interview',
  5: '/secure-booking',
  6: '/document-sign',
  7: '/payment-screen',
};

const StepContext = createContext(null);

// User-scoped key — different users never share step state
function stepsKey() {
  const sub = getUserSub();
  return sub ? `jrny_completed_steps_${sub}` : 'jrny_completed_steps';
}

// Derive completed steps from WP client data
function deriveStepsFromClient(client) {
  if (!client) return null;
  const steps = [];
  const leaseStatus   = client.lease_status   || '';
  const signedLease   = client.signed_lease   || '';

  const hasSubmitted = !!leaseStatus;
  // Only 1–2 are automatic (form submitted + Zoho verification). Step 3
  // (ROOM SEARCH) needs a real user action — RoomSearch.jsx calls completeStep(3)
  // when a room is chosen — so it must never be derived as done from server data.
  // Auto-pushing it made fresh approved users see Room Search as "Completed"
  // in the timeline before ever visiting it.
  if (hasSubmitted) steps.push(1, 2);

  const map = {
    'Interview Scheduled': 4,
    'Booking Secured':     5,
    'Signed':              6,
    'Extended':            6,
    'Payment Complete':    7,
  };

  for (const [status, step] of Object.entries(map)) {
    if (leaseStatus === status || leaseStatus.includes(status)) {
      for (let i = 4; i <= step; i++) steps.push(i);
      break;
    }
  }
  if (signedLease && !steps.includes(6)) steps.push(6);
  // Step 7 completes ONLY when both payments are actually done — the same
  // condition that makes PaymentScreen show "Total Due Now: 0". A status
  // string like 'Pending for Verification' must never finish the whole
  // timeline while rent is still unpaid.
  if (client.deposit_paid && client.rent_paid && !steps.includes(7)) {
    steps.push(7);
  }
  return [...new Set(steps)].sort((a, b) => a - b);
}

// Instant read from user-scoped localStorage key
function getInitialCompleted() {
  try {
    const saved = localStorage.getItem(stepsKey());
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

export function StepProvider({ children }) {
  const [completedSteps, setCompletedSteps] = useState(getInitialCompleted);

  // Persist to user-scoped key whenever steps change
  useEffect(() => {
    localStorage.setItem(stepsKey(), JSON.stringify(completedSteps));
  }, [completedSteps]);

  // Background fetch from WP on mount — syncs steps with server state
  useEffect(() => {
    if (!getToken()) return;
    getClientData()
      .then(data => {
        if (!data?.success) return;
        const serverSteps = deriveStepsFromClient(data.data);
        if (!serverSteps) return;
        // Merge: keep any locally completed steps + add server steps
        setCompletedSteps(prev => {
          const merged = [...new Set([...prev, ...serverSteps])].sort((a, b) => a - b);
          // Only update if different to avoid unnecessary re-renders
          return JSON.stringify(merged) !== JSON.stringify(prev) ? merged : prev;
        });
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
