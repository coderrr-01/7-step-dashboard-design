import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { formatDate } from "./verificationData";

function VerificationComplete({ data }) {
  return (
    <header className="verification-hero vg-anim">
      <div className="verification-hero-icon">
        <span className="verification-orbit-ring r1"></span>
        <span className="verification-orbit-ring r2"></span>
        <span className="verification-orbit-dot d1"></span>
        <span className="verification-orbit-dot d2"></span>
        <div className="verification-shield">
          <FaShieldHalved />
        </div>
        <span className="verification-shield-pulse"></span>
      </div>

      <span className="verification-eyebrow">Secure Application Review</span>

      <section className="ver-card ver-complete-card vg-anim">
        <div className="ver-complete-check">
          <span className="ver-complete-ring"></span>
          <FaCheck />
        </div>

        <h2 className="ver-complete-title">Verification Complete</h2>
        <p className="ver-complete-sub">
          Your application has been successfully verified.
        </p>
        <p className="ver-complete-text">
          All required information and documents have been reviewed successfully.
        </p>

        <div className="ver-complete-meta">
          <div className="ver-meta-item">
            <span className="ver-meta-label">Verified on</span>
            <span className="ver-meta-value">{formatDate(data.lastUpdated)}</span>
          </div>
          <div className="ver-meta-item">
            <span className="ver-meta-label">Application ID</span>
            <span className="ver-meta-value">{data.applicationId}</span>
          </div>
          <div className="ver-meta-item">
            <span className="ver-meta-label">Verification status</span>
            <span className="ver-meta-value">Verified</span>
          </div>
        </div>

        <Link to="/room-search" className="ver-complete-cta">
          Continue to Room Search
        </Link>
      </section>
    </header>
  );
}

export default VerificationComplete;
