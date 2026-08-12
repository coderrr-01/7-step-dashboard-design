import { FaFileArrowUp, FaTriangleExclamation } from "react-icons/fa6";

function VerificationActionRequired({ data }) {
  const info = data.actionRequired || {};
  return (
    <section className="ver-card ver-action-card vg-action vg-anim">
      <div className="ver-card-top">
        <h2 className="ver-card-title">Action Required</h2>
        <span className="ver-badge is-red">Action Required</span>
      </div>

      <div className="ver-action-body">
        <span className="ver-action-icon">
          <FaTriangleExclamation />
        </span>
        <p className="ver-action-text">
          {info.description || "We need a little more information from you."}
        </p>

        <div className="ver-action-missing">
          <span className="ver-meta-label">Missing document</span>
          <strong>{info.missingDocument || "Proof of Address"}</strong>
        </div>

        <button type="button" className="ver-action-btn">
          <FaFileArrowUp /> Upload Document
        </button>
      </div>
    </section>
  );
}

export default VerificationActionRequired;
