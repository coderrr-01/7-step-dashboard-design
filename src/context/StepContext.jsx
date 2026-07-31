import { createContext, useContext, useState, useEffect } from 'react';
import { getCachedClient, getClientData, getToken } from '../services/api';

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
      if (payload.sub) return `jrny_completed_steps_${payload.sub}`;
    }
  } catch {}
  return 'jrny_completed_steps';
}

// Decode JWT payload — returns null on any error.
function getJwtPayload() {
  try {
    const token = getToken();
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch { return null; }
}

function getInitialCompleted() {
  const key = stepsKey();

  if (key !== 'jrny_completed_steps') {
    localStorage.removeItem('jrny_completed_steps');
  }

  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}

  // Fast path: JWT payload contains `applied` flag set by WordPress on form submit.
  // This is synchronous — no async fetch needed — so the correct screen shows
  // immediately on every page load including after logout/login.
  const jwt = getJwtPayload();
  if (jwt?.applied) return [1, 2, 3];

  // Fallback: derive from cached Zoho client data if available.
  const client = getCachedClient();
  if (!client) return [];

  const steps = [];
  const leaseStatus   = client.lease_status   || '';
  const paymentStatus = client.payment_status || '';
  const signedLease   = client.signed_lease   || '';

  const hasSubmitted = !!leaseStatus || !!client.email;
  if (hasSubmitted) steps.push(1);
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
  // Only block rendering when we have a token but no fast-path answer from the JWT.
  // If jwt.applied is set we already know the answer synchronously.
  const [clientLoading, setClientLoading] = useState(() => {
    if (!getToken()) return false;
    const jwt = getJwtPayload();
    // If JWT says applied, we know immediately — no need to block.
    if (jwt?.applied) return false;
    // Otherwise block until the async fetch confirms the state.
    return true;
  });

  useEffect(() => {
    if (!getToken()) {
      setClientLoading(false);
      return;
    }
    // Always fetch fresh client data in background to keep cache current.
    // Only update completedSteps from the result when we were blocking (loading).
    getClientData().then(() => {
      setCompletedSteps(getInitialCompleted());
    }).catch(() => {}).finally(() => {
      setClientLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <StepContext.Provider value={{ completedSteps, completeStep, canAccessStep, currentStep, clientLoading }}>
      {children}
    </StepContext.Provider>
  );
}

export function useSteps() {
  const ctx = useContext(StepContext);
  if (!ctx) throw new Error('useSteps must be used inside StepProvider');
  return ctx;
}
