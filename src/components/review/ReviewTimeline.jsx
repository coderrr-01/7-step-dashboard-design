import { FaClock } from "react-icons/fa6";

function ReviewTimeline({ data }) {
  return (
    <section className="ver-card ver-time-card vg-anim">
      <div className="ver-time-icon">
        <FaClock />
      </div>
      <h3 className="ver-time-title">Review Timeline</h3>
      <span className="ver-time-label">Estimated review time</span>
      <div className="ver-time-value">{data.estimatedTime}</div>
      <p className="ver-time-text">
        We'll notify you when your verification is complete or if we need any
        additional information.
      </p>
    </section>
  );
}

export default ReviewTimeline;
