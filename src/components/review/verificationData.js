// Mock verification data matching the expected future API response shape.
// Replace with a real API fetch later — the UI reads the same fields.

export const verificationData = {
  applicationId: "APP-10245",
  status: "in-progress", // pending | in-progress | action-required | completed | failed
  progress: 100,
  submittedAt: "2026-08-10T10:42:00",
  lastUpdated: "2026-08-10T10:45:00",
  estimatedTime: "24–48 hours",

  // The application form the user submitted — every field below gets verified.
  applicant: {
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    moveInDate: "",
    currentAddress: "",
    employmentStatus: "",
    monthlyIncome: "$0",
    message: "Looking forward to staying with JRNY.",
  },

  // High-level progress steps
  steps: [
    { name: "Application Submitted", status: "done" },
    { name: "Details Verified", status: "active" },
    { name: "Application Approved", status: "pending" },
  ],

  // Verification checklist — one item per submitted form field
  checklist: [
    { name: "Full Name", status: "under-review" },
    { name: "Email Address", status: "under-review" },
    { name: "Phone Number", status: "under-review" },
    { name: "Date of Birth", status: "under-review" },
    { name: "Move-in Date", status: "under-review" },
    { name: "Current Address", status: "under-review" },
    { name: "Employment Status", status: "under-review" },
    { name: "Monthly Income", status: "under-review" },
  ],

  // Live-feeling activity timeline
  activity: [
    { title: "Application submitted", time: "Today, 10:42 AM", status: "done" },
    { title: "Personal details received", time: "Today, 10:43 AM", status: "done" },
    { title: "Contact details verified", time: "Today, 10:44 AM", status: "done" },
    { title: "Verifying your details", time: "In progress", status: "active" },
    { title: "Verification complete", time: "Pending", status: "pending" },
  ],

  currentlyReviewing: {
    title: "Your Personal Details",
    description: "Checking your submitted details and information...",
  },

  actionRequired: {
    missingDocument: "Proof of Address",
    description: "We need a little more information from you.",
  },

  failed: {
    description: "Some of your submitted details could not be verified.",
  },
};

export const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
