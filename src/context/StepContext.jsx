import { createContext, useContext, useState, useEffect } from 'react';
import { getCachedClient, getToken } from '../services/api';

export const STEP_PATHS = {
  1: '/apply',
  2: '/review',
  3: '/room-search',
  4: '/interview',
  5: '/secure-booking',
  6: '/document-sign',
  7: '/payment-screen',
};

const StepContext = createContext(null);

// Returns a user-scoped localStorage key so different accounts never share state.
function stepsKey() {
  try {
    const token = getToken();
    if (token) {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      );
      // Use WordPress user ID (sub) as the unique identifier.
      if (payload.sub) return `jrny_completed_steps_${payload.sub}`;
    }
  } catch {}
  return 'jrny_completed_steps';
}

function getInitialCompleted() {
  const key = stepsKey();

  // If we have a user-scoped key, clear the legacy global key so it can
  // never be read by a different user who falls back to the generic name.
  if (key !== 'jrny_completed_steps') {
    localStorage.removeItem('jrny_completed_steps');
  }

  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}

  // Bootstrap from cached Zoho client — derive only what the server confirms.
  // A brand-new user with no record starts with NO completed steps.
  const client = getCachedClient();
  if (!client) return [];

  const steps = [];
  const leaseStatus   = client.lease_status   || '';
  const paymentStatus = client.payment_status || '';
  const signedLease   = client.signed_lease   || '';

  // Step 1 (Apply) is only complete when the backend has an actual record.
  // Any non-empty lease_status means the application was submitted.
  const hasSubmitted = !!leaseStatus || !!client.email;
  if (hasSubmitted) steps.push(1);

  // Steps 2 and 3 (Review, Room Search) are unlocked once application exists.
  if (hasSubmitted) steps.push(2, 3);

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
  if (['Pending for Verification', 'Paid', 'completed'].includes(paymentStatus) && !steps.includes(7)) {
    steps.push(7);
  }

  return [...new Set(steps)].sort((a, b) => a - b);
}

export function StepProvider({ children }) {
  const [completedSteps, setCompletedSteps] = useState(getInitialCompleted);

  useEffect(() => {
    localStorage.setItem(stepsKey(), JSON.stringify(completedSteps));
  }, [completedSteps]);

  const completeStep = (stepNumber) => {
    setCompletedSteps(prev => {
      const updated = [...new Set([...prev, stepNumber])].sort((a, b) => a - b);
      return updated;
    });
  };

  // Step N is accessible only if step N-1 is completed (step 1 always accessible)
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
    <StepContext.Provider value={{ completedSteps, completeStep, canAccessStep, currentStep }}>
      {children}
    </StepContext.Provider>
  );
}

export function useSteps() {
  const ctx = useContext(StepContext);
  if (!ctx) throw new Error('useSteps must be used inside StepProvider');
  return ctx;
}
