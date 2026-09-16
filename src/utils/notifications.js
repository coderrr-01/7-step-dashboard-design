import { getUserSub, isInterviewApprovedCached } from "../services/api";
import { getPaymentState, readFieldIgnoreCase } from "./paymentState";

const STEP_LABELS = {
  2: "Review & Verification",
  3: "Board Interview",
  4: "Room Search",
  5: "Secure Booking",
  6: "Lease Sign",
  7: "Secure Payment",
};

const STEP_HINTS = {
  2: "Finish identity verification and profile setup.",
  3: "Book and attend your board interview.",
  4: "Browse and select your preferred residence and floor plan.",
  5: "Secure your booking with the required deposit.",
  6: "Review and sign your residence agreement.",
  7: "Complete your security deposit and first month rent.",
};

const APPROVED_WORDS = ["approved", "approve", "complete", "completed", "verified", "successful", "success", "accepted", "active"];
const REJECTED_WORDS = ["rejected", "denied", "declined", "failed", "failure"];

function normalizeKey(value) {
  return String(value || "").replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function includesAny(text, words) {
  const normalized = normalizeKey(text);
  if (!normalized) return false;
  return words.some((word) => normalized.includes(normalizeKey(word)));
}

function relativeTime(ts) {
  if (!ts) return "Just now";
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function subKeys() {
  const sub = getUserSub();
  return {
    read: sub ? `jrny_notif_read_${sub}` : "jrny_notif_read",
    created: sub ? `jrny_notif_created_${sub}` : "jrny_notif_created",
  };
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function getReadNotifIds() {
  const { read } = subKeys();
  const arr = readJson(read, []);
  return Array.isArray(arr) ? arr : [];
}

export function markNotifRead(id) {
  const { read } = subKeys();
  const ids = getReadNotifIds();
  if (!ids.includes(id)) {
    try { localStorage.setItem(read, JSON.stringify([...ids, id])); } catch { /* non-blocking */ }
  }
}

export function markAllNotifsRead(ids) {
  const { read } = subKeys();
  try { localStorage.setItem(read, JSON.stringify(ids)); } catch { /* non-blocking */ }
}

/* Same derivation as StepContext.deriveStepsFromClient — copied here so the bell
   never touches the wizard's own state; it only reads the same server signals. */
function deriveStepsFromClient(client) {
  if (!client) return [];
  const steps = [];
  const leaseStatus = client.lease_status || "";
  const signedLease = client.signed_lease || "";
  const depositPaid = !!client.deposit_paid;
  const rentPaid = !!client.rent_paid;

  if (!!leaseStatus) steps.push(1, 2);

  const map = {
    "Interview Scheduled": 3,
    "Interview Approved": 3,
    "Interview Complete": 3,
    "Booking Secured": 5,
    "Lease Signed": 6,
    "Signed": 6,
    "Extended": 6,
    "Payment Complete": 7,
  };

  for (const [status, step] of Object.entries(map)) {
    if (leaseStatus === status || leaseStatus.includes(status)) {
      const maxStep = step === 7 && !rentPaid ? 6 : step;
      for (let i = 3; i <= maxStep; i++) steps.push(i);
      break;
    }
  }
  if (signedLease && !steps.includes(6)) steps.push(6);
  if (depositPaid && rentPaid) return [1, 2, 3, 4, 5, 6, 7];
  return [...new Set(steps)].sort((a, b) => a - b);
}

function firstIncomplete(steps) {
  for (let i = 1; i <= 7; i++) {
    if (!steps.includes(i)) return i;
  }
  return 7;
}

export function buildNotifications({ client } = {}) {
  const data = client || {};
  const clientSteps = deriveStepsFromClient(data);
  const ps = getPaymentState(data);
  const notifs = [];

  const appKey = (() => {
    const sub = getUserSub();
    return sub ? `jrny_application_status_${sub}` : null;
  })();

  let appApproved = false;
  let appRejected = false;
  if (appKey) {
    const cached = readJson(appKey, null);
    if (cached && cached.status === "Approved") appApproved = true;
  }
  const appStatus = readFieldIgnoreCase(data, [
    "application_status", "status", "application_state",
    "verification_status", "review_status", "stage",
  ]) || "";
  if (!appApproved) appApproved = includesAny(appStatus, APPROVED_WORDS);
  appRejected = !appApproved && includesAny(appStatus, REJECTED_WORDS);

  // Only the next onboarding step — nothing else in the bell.
  const onboardingComplete = clientSteps.includes(7) && ps.depositPaid && ps.rentPaid;
  if (clientSteps.length > 0 && !appRejected && !onboardingComplete) {
    let step = firstIncomplete(clientSteps);
    if (step === 4 && !isInterviewApprovedCached() && clientSteps.includes(3)) {
      step = 3; // interview approval gates Room Search
    }
    if (step >= 2 && step <= 7) {
      notifs.push({
        id: `step-pending-${step}`,
        kind: "info",
        icon: "step",
        title: `Next Step: ${STEP_LABELS[step]}`,
        message: STEP_HINTS[step] || "Continue your JRNY onboarding.",
      });
    }
  }

  // Stamp first-seen timestamps so the panel can show relative times.
  const { created } = subKeys();
  try {
    const createdMap = readJson(created, {}) || {};
    let changed = false;
    notifs.forEach((n) => {
      if (!createdMap[n.id]) {
        createdMap[n.id] = Date.now();
        changed = true;
      }
    });
    if (changed) localStorage.setItem(created, JSON.stringify(createdMap));
    notifs.forEach((n) => {
      n.time = relativeTime(createdMap[n.id]);
    });
  } catch {
    notifs.forEach((n) => { n.time = relativeTime(null); });
  }

  return notifs;
}