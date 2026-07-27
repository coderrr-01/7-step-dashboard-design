import { createContext, useContext, useState, useEffect } from 'react';
import { getCachedClient } from '../services/api';

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

function getInitialCompleted() {
  try {
    const saved = localStorage.getItem('jrny_completed_steps');
    if (saved) return JSON.parse(saved);
  } catch {}

  // Bootstrap from cached Zoho client
  const client = getCachedClient();
  if (!client) return [1];

  const steps = [1, 2, 3];
  const leaseStatus   = client.lease_status   || '';
  const paymentStatus = client.payment_status || '';
  const signedLease   = client.signed_lease   || '';

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
    localStorage.setItem('jrny_completed_steps', JSON.stringify(completedSteps));
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
