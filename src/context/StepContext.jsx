import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getClientData, getToken } from '../services/api';

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

// Zoho/server data se completed steps nikalo
function deriveStepsFromClient(client) {
  if (!client) return null;
  const steps = [];
  const leaseStatus = client.lease_status || '';
  const signedLease = client.signed_lease || '';
  const depositPaid = !!client.deposit_paid;
  const rentPaid = !!client.rent_paid;

  if (!!leaseStatus) steps.push(1, 2);

  const map = {
    'Interview Scheduled': 4,
    'Booking Secured': 5,
    'Signed': 6,
    'Extended': 6,
    'Payment Complete': 7,
  };

  for (const [status, step] of Object.entries(map)) {
    if (leaseStatus === status || leaseStatus.includes(status)) {
      // Step 7 (Payment) sirf tab complete jab DONO payments ho jayein
      const maxStep = (step === 7 && !rentPaid) ? 6 : step;
      for (let i = 3; i <= maxStep; i++) steps.push(i);
      break;
    }
  }
  if (signedLease && !steps.includes(6)) steps.push(6);

  // Dono payments done → journey complete
  if (depositPaid && rentPaid) {
    return [1, 2, 3, 4, 5, 6, 7];
  }

  return [...new Set(steps)].sort((a, b) => a - b);
}

// Pehla incomplete step nikalo
function findFirstIncompleteStep(serverSteps) {
  for (let i = 1; i <= 7; i++) {
    if (!serverSteps.includes(i)) return STEP_PATHS[i];
  }
  return null; // sab complete
}

export function StepProvider({ children }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Mount pe server se data fetch karo
  useEffect(() => {
    if (!getToken()) return;
    getClientData()
      .then(data => {
        if (!data?.success) return;
        const serverSteps = deriveStepsFromClient(data.data);
        if (serverSteps) setCompletedSteps(serverSteps);
      })
      .catch(() => {});
  }, []);

  // Jab bhi user / pe aaye, FRESH server data leke sahi step pe bhejo
  useEffect(() => {
    if (!getToken() || pathname !== '/') return;
    getClientData()
      .then(data => {
        if (!data?.success) return;
        const serverSteps = deriveStepsFromClient(data.data);
        if (!serverSteps) return;
        setCompletedSteps(serverSteps);
        const nextStep = findFirstIncompleteStep(serverSteps);
        if (nextStep && nextStep !== '/') {
          navigate(nextStep, { replace: true });
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
