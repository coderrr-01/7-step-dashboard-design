import { FaRegCircleCheck, FaRegCircle } from "react-icons/fa6";
import { formatDate } from "./verificationData";

const STATUS_META = {
  "in-progress": {
    label: "In Progress",
    tone: "amber",
    title: "Verification in Progress",
    text: "Your application is currently being reviewed.",
    icon: <span className="ver-status-dot amber"></span>,
  },
  pending: {
    label: "Pending",
    tone: "grey",
    title: "Verification Pending",
    text: "Your application is queued for review.",
    icon: <FaRegCircle />,
  },
  "action-required": {
    label: "Action Required",
    tone: "red",
    title: "Action Required",
    text: "We need a little more information from you.",
    icon: <span className="ver-status-dot red"></span>,
  },
  completed: {
    label: "Verified",
    tone: "green",
    title: "Verification Complete",
    text: "Your application has been successfully verified.",
    icon: <FaRegCircleCheck />,
  },
  failed: {
    label: "Needs Attention",
    tone: "red",
    title: "Verification Needs Attention",
    text: "We couldn't complete verification with the information provided.",
    icon: <span className="ver-status-dot red"></span>,
  },
};

function VerificationStatus({ data }) {
  const meta = STATUS_META[data.status] || STATUS_META["in-progress"];
  const metaClass = meta.tone ? ` is-${meta.tone}` : "";

  return (
    <section className="ver-card ver-status-card vg-status vg-anim">
      <div className="ver-card-top">
        <h2 className="ver-card-title">Verification Status</h2>
        <span className={`ver-badge${metaClass}`}>{meta.label}</span>
      </div>

      <div className="ver-status-body">
        <div className="ver-status-icon">
          <span className="ver-status-glyph">{meta.icon}</span>
        </div>
        <h3 className="ver-status-title">{meta.title}</h3>
        <p className="ver-status-text">{meta.text}</p>
      </div>

      <div className="ver-meta-grid">
        <div className="ver-meta-item">
          <span className="ver-meta-label">Application ID</span>
          <span className="ver-meta-value">{data.applicationId}</span>
        </div>
        <div className="ver-meta-item">
          <span className="ver-meta-label">Submitted</span>
          <span className="ver-meta-value">{formatDate(data.submittedAt)}</span>
        </div>
        <div className="ver-meta-item">
          <span className="ver-meta-label">Last updated</span>
          <span className="ver-meta-value">Just now</span>
        </div>
      </div>
    </section>
  );
}

export default VerificationStatus;
