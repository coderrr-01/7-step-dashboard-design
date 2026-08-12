import { FaFileLines } from "react-icons/fa6";

function CurrentVerification({ data }) {
  return (
    <section className="ver-card ver-reviewing-card vg-review vg-anim">
      <h2 className="ver-card-title">Currently Being Reviewed</h2>

      <div className="ver-scan">
        <div className="ver-scan-doc">
          <FaFileLines />
          <span className="ver-scan-line"></span>
          <span className="ver-scan-shimmer"></span>
        </div>
        <div className="ver-scan-icon-pulse">
          <span></span>
        </div>
      </div>

      <h3 className="ver-scan-title">{data.currentlyReviewing.title}</h3>
      <p className="ver-scan-text">{data.currentlyReviewing.description}</p>

      <div className="ver-scan-status">
        <span className="ver-scan-live"></span>
        Scanning…
      </div>
    </section>
  );
}

export default CurrentVerification;
