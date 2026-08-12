import { FaCheck, FaRegCircle } from "react-icons/fa6";

function VerificationTimeline({ data }) {
  return (
    <section className="ver-card ver-timeline-card vg-anim">
      <h2 className="ver-card-title">Verification Activity</h2>

      <ol className="ver-timeline">
        {data.activity.map((item, i) => {
          const isDone = item.status === "done";
          const isActive = item.status === "active";
          return (
            <li
              key={item.title}
              className={`ver-tl-item ${isDone ? "is-done" : ""} ${isActive ? "is-active" : ""}`}
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            >
              <span className="ver-tl-marker">
                {isDone ? <FaCheck /> : isActive ? <span className="ver-tl-dot"></span> : <FaRegCircle />}
              </span>
              <div className="ver-tl-content">
                <span className="ver-tl-title">{item.title}</span>
                <span className="ver-tl-time">{item.time}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default VerificationTimeline;
