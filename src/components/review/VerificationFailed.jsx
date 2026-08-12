import { FaCircleInfo } from "react-icons/fa6";

function VerificationFailed({ data }) {
  const info = data.failed || {};
  return (
    <section className="ver-card ver-failed-card vg-anim">
      <div className="ver-failed-icon">
        <FaCircleInfo />
      </div>

      <h2 className="ver-failed-title">Verification Needs Attention</h2>
      <p className="ver-failed-sub">
        We couldn't complete verification with the information provided.
      </p>

      <div className="ver-failed-box">
        <span className="ver-meta-label">What needs attention?</span>
        <p>{info.description || "Some of your submitted information could not be verified."}</p>
      </div>

      <button type="button" className="ver-action-btn">
        Update Information
      </button>
      <p className="ver-failed-note">
        This doesn't affect your application — you can review and update the
        details below.
      </p>
    </section>
  );
}

export default VerificationFailed;
