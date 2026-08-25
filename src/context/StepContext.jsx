import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getClientData, getUserSub, getToken, getLastRoute } from '../services/api';

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

function stepsKey() {
  const sub = getUserSub();
  return sub ? `jrny_completed_steps_${sub}` : 'jrny_completed_steps';
}

function deriveStepsFromClient(client) {
  if (!client) return null;
  const steps = [];
  const leaseStatus = client.lease_status || '';
  const signedLease = client.signed_lease || '';

  const hasSubmitted = !!leaseStatus;
  if (hasSubmitted) steps.push(1, 2);

  const map = {
    'Interview Scheduled': 4,
    'Booking Secured': 5,
    'Signed': 6,
    'Extended': 6,
    'Payment Complete': 7,
  };

  for (const [status, step] of Object.entries(map)) {
    if (leaseStatus === status || leaseStatus.includes(status)) {
      for (let i = 4; i <= step; i++) steps.push(i);
      break;
    }
  }
  if (signedLease && !steps.includes(6)) steps.push(6);
  if (client.deposit_paid && client.rent_paid) {
    return [1, 2, 3, 4, 5, 6, 7];
  }
  return [...new Set(steps)].sort((a, b) => a - b);
}

function getInitialCompleted() {
  try {
    const saved = localStorage.getItem(stepsKey());
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

// Read last route from localStorage (same-device, instant)
function getLocalLastRoute() {
  try {
    const raw = JSON.parse(localStorage.getItem('jrny_last_route') || 'null');
    if (raw && raw.path && raw.path.length > 1 && raw.sub === (getUserSub() || '')) {
      return raw.path;
    }
  } catch {}
  return null;
}

export function StepProvider({ children }) {
  const [completedSteps, setCompletedSteps] = useState(getInitialCompleted);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    localStorage.setItem(stepsKey(), JSON.stringify(completedSteps));
  }, [completedSteps]);

  // Single mount effect — decides where the user should be.
  // Priority:
  // 1. localStorage last route (same-device, instant)
  // 2. Server last route (cross-device, async)
  // 3. Home `/` (new user, no history)
  // Once the correct screen is determined, update completed steps from server
  // but NEVER force-redirect away from the user's chosen/resumed screen.
  useEffect(() => {
    const landedPath = pathname;
    if (!getToken()) return;

    // Step 1: check localStorage (same-device fast path)
    const localRoute = getLocalLastRoute();
    if (localRoute && localRoute !== landedPath) {
      navigate(localRoute, { replace: true });
      return;
    }

    // Step 2: if on home and no local route, try server (cross-device)
    if (landedPath === '/' && !localRoute) {
      getLastRoute().then(serverPath => {
        if (serverPath && serverPath !== '/') {
          navigate(serverPath, { replace: true });
        }
      }).catch(() => {});
    }

    // Step 3: fetch client data to sync completed steps (for timeline, etc.)
    // but NEVER redirect based on server data — the route is already decided
    // by localStorage (step 1) or server (step 2) or home (default).
    getClientData()
      .then(data => {
        if (!data?.success) return;
        const serverSteps = deriveStepsFromClient(data.data);
        if (!serverSteps) return;
        setCompletedSteps(prev => {
          const merged = [...new Set([...prev, ...serverSteps])].sort((a, b) => a - b);
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
