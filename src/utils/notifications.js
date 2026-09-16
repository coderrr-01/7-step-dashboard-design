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

const STEP_PATHS = {
  1: "/",
  2: "/review",
  3: "/interview",
  4: "/room-search",
  5: "/secure-booking",
  6: "/document-sign",
  7: "/payment-screen",
};

const APPROVED_WORDS = ["approved", "approve", "complete", "completed", "verified", "successful", "success", "accepted", "active"];
const REJECTED_WORDS = ["rejected", "denied", "declined", "failed", "failure"];
const REVIEW_WORDS = ["pending", "review", "await", "awaiting", "submitted", "processing", "inprogress", "in_process", "verification"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function normalizeKey(value) {
  return String(value || "").replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function includesAny(text, words) {
  const normalized = normalizeKey(text);
  if (!normalized) return false;
  return words.some((word) => normalized.includes(normalizeKey(word)));
}

function dateLabel(value) {
  if (!value) return "";
  const [y, m, d] = String(value).split("-").map(Number);
  if (!y || !m || !d) return value;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function fmtMoney(value) {
  const n = Number(value);
  if (!isFinite(n) || n <= 0) return "";
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
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

function nextStepPath(steps) {
  const pending = firstIncomplete(steps);
  if (pending === 4 && !isInterviewApprovedCached() && steps.includes(3)) return STEP_PATHS[3];
  return STEP_PATHS[pending] || "/";
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

  // Application approved / rejected
  if (appApproved) {
    notifs.push({
      id: "app-approved", kind: "success", icon: "app",
      title: "Application Approved",
      message: "Your application has been approved — your residency journey continues.",
      action: "/review",
    });
  } else if (appRejected) {
    notifs.push({
      id: "app-rejected", kind: "error", icon: "app",
      title: "Application Update",
      message: "Your application was not approved. Contact the residency office for details.",
      action: "/review",
    });
  }

  // Interview scheduled
  if (data.interview_date && data.interview_time) {
    notifs.push({
      id: "interview-scheduled", kind: "info", icon: "interview",
      title: "Interview Scheduled",
      message: `Your board interview is confirmed for ${dateLabel(data.interview_date)} at ${data.interview_time}.`,
      action: "/interview",
    });
  }

  // Interview approved → room search unlocked
  if (isInterviewApprovedCached() && clientSteps.includes(3)) {
    notifs.push({
      id: "interview-approved", kind: "success", icon: "interview",
      title: "Interview Approved",
      message: "Interview approved — Room Search is now unlocked.",
      action: "/interview",
    });
  }

  // Lease signed
  const signedLease = data.signed_lease || "";
  const localSignedLease = (() => {
    try { return localStorage.getItem("jrny_signed_lease") || ""; } catch { return ""; }
  })();
  if (signedLease || localSignedLease) {
    notifs.push({
      id: "lease-signed", kind: "success", icon: "lease",
      title: "Lease Signed",
      message: "Your residency agreement is executed. Download it anytime from the dashboard.",
      action: "/dashboard",
    });
  }

  // Extension request → approved / under review
  const extStatus = data.extension_status || "";
  if (extStatus) {
    const extEnd = data.requested_end_date || "";
    if (includesAny(extStatus, APPROVED_WORDS)) {
      notifs.push({
        id: "extension-approved", kind: "success", icon: "ext",
        title: "Extension Approved",
        message: `Your lease extension is approved${extEnd ? ` — new term runs through ${dateLabel(extEnd)}` : ""}.`,
        action: "/dashboard",
      });
    } else if (includesAny(extStatus, REVIEW_WORDS)) {
      notifs.push({
        id: "extension-pending", kind: "info", icon: "ext",
        title: "Extension Under Review",
        message: "Your extension request is being reviewed by the board.",
        action: "/dashboard",
      });
    }
  }

  // Deposit / rent — pending, pending-verification, or verified (post-booking stages only)
  const payStage = clientSteps.includes(6) || clientSteps.includes(7);
  const allPaid = ps.depositPaid && ps.rentPaid;
  if (payStage) {
    const depositStatus = readFieldIgnoreCase(data, [
      "deposit_payment_status", "security_deposit_payment_status",
      "deposit_status", "security_deposit_status", "payment_status", "payment_state",
    ]) || "";
    const rentStatus = readFieldIgnoreCase(data, [
      "rent_payment_status", "monthly_rent_payment_status",
      "rent_status", "subscription_status", "subscription_payment_status",
      "payment_status", "payment_state",
    ]) || "";
    const depositVerifying = !ps.depositPaid && includesAny(depositStatus, REVIEW_WORDS);
    const rentVerifying = !ps.rentPaid && includesAny(rentStatus, REVIEW_WORDS);

    if (ps.depositPaid) {
      notifs.push({
        id: "deposit-verified", kind: "success", icon: "pay",
        title: "Deposit Verified",
        message: `Security deposit received${ps.depositMethod ? ` via ${ps.depositMethod}` : ""}.`,
        action: "/payment-screen",
      });
    } else if (depositVerifying) {
      notifs.push({
        id: "deposit-verifying", kind: "info", icon: "pay",
        title: "Deposit Pending Verification",
        message: "Your security deposit payment was recorded and is awaiting verification.",
        action: "/payment-screen",
      });
    } else {
      notifs.push({
        id: "deposit-pending", kind: "warning", icon: "pay",
        title: "Security Deposit Due",
        message: `Complete step 7 to pay your ${fmtMoney(data.security_deposit) || "security deposit"}.`,
        action: nextStepPath(clientSteps),
      });
    }

    if (ps.rentPaid) {
      notifs.push({
        id: "rent-verified", kind: "success", icon: "pay",
        title: "Rent Verified",
        message: `First month rent received${ps.rentMethod ? ` via ${ps.rentMethod}` : ""}.`,
        action: "/payment-screen",
      });
    } else if (rentVerifying) {
      notifs.push({
        id: "rent-verifying", kind: "info", icon: "pay",
        title: "Rent Pending Verification",
        message: "Your rent payment was recorded and is awaiting verification.",
        action: "/payment-screen",
      });
    } else {
      notifs.push({
        id: "rent-pending", kind: "warning", icon: "pay",
        title: "First Month Rent Due",
        message: `Complete step 7 to pay your ${fmtMoney(data.rent_amount) || "first month rent"}.`,
        action: nextStepPath(clientSteps),
      });
    }
  }

  // Lease ending soon / expired (existing members)
  if (signedLease || data.start_date || data.move_in_date || clientSteps.includes(6) || clientSteps.includes(7)) {
    let startDate = data.start_date || data.move_in_date || "";
    let endDate = data.end_date || "";
    if (!endDate && startDate) {
      const d = new Date(startDate);
      if (!isNaN(d.getTime())) {
        d.setFullYear(d.getFullYear() + 1);
        endDate = d.toISOString().slice(0, 10);
      }
    }
    if (endDate) {
      const end = new Date(endDate);
      if (!isNaN(end.getTime())) {
        const today = new Date();
        const diffMonths =
          (end.getFullYear() - today.getFullYear()) * 12 +
          (end.getMonth() - today.getMonth()) +
          (end.getDate() < today.getDate() ? -1 : 0);
        if (end < today) {
          notifs.push({
            id: "lease-expired", kind: "error", icon: "expiry",
            title: "Lease Term Ended",
            message: `Your lease term ended ${dateLabel(endDate)}. Renew or extend your residency.`,
            action: "/dashboard",
          });
        } else if (diffMonths <= 2) {
          notifs.push({
            id: "lease-ending", kind: "warning", icon: "expiry",
            title: "Lease Ending Soon",
            message: `Your lease ends ${dateLabel(endDate)} — ${diffMonths} month${diffMonths === 1 ? "" : "s"} left. Extending is unlocked.`,
            action: "/dashboard",
          });
        }
      }
    }
  }

  // Step pending reminder (skip pre-CRM and blocked stages)
  if (clientSteps.length > 0 && !appRejected) {
    const pending = firstIncomplete(clientSteps);
    if (pending === 2 && !appApproved) {
      notifs.push({
        id: "app-review", kind: "info", icon: "app",
        title: "Application Under Review",
        message: "The board is reviewing your application — you will be notified once approved.",
        action: "/review",
      });
    } else if (pending === 4 && !isInterviewApprovedCached() && clientSteps.includes(3)) {
      notifs.push({
        id: "interview-gate", kind: "warning", icon: "room",
        title: "Room Search Locked",
        message: "Room Search unlocks once your interview is approved.",
        action: "/interview",
      });
    } else if (pending >= 2 && pending < 7) {
      notifs.push({
        id: `step-pending-${pending}`, kind: "info", icon: "step",
        title: `Next Step: ${STEP_LABELS[pending]}`,
        message: STEP_HINTS[pending] || "Continue your JRNY onboarding.",
        action: STEP_PATHS[pending],
      });
    }
  }

  // Onboarding complete
  if (clientSteps.includes(7) && allPaid) {
    notifs.push({
      id: "welcome", kind: "success", icon: "welcome",
      title: "Welcome to the Community",
      message: "Your onboarding is complete — welcome to the JRNY residency!",
      action: "/dashboard",
    });
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