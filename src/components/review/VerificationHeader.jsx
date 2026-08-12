import { FaShieldHalved } from "react-icons/fa6";

function VerificationHeader() {
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
      <h1 className="verification-title">Application Verification</h1>
      <p className="verification-subtitle">
        We're carefully reviewing your application
      </p>
      <p className="verification-support">
        Your submitted information and details are being checked to make sure
        everything is complete and accurate.
      </p>

      <div className="verification-live">
        <span className="verification-live-dot"></span>
        Live verification in progress
      </div>
    </header>
  );
}

export default VerificationHeader;
