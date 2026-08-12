import { useEffect, useState } from "react";
import { FaCheck, FaRegCircle } from "react-icons/fa6";

function VerificationProgress({ data }) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(data.progress), 250);
    return () => clearTimeout(t);
  }, [data.progress]);

  const activeStep = data.steps.find((s) => s.status === "active");
  const activeName = activeStep ? activeStep.name : data.steps[0].name;

  return (
    <section className="ver-card ver-progress-card vg-progress vg-anim">
      <h2 className="ver-card-title">Verification Progress</h2>

      <ol className="ver-steps">
        {data.steps.map((step, i) => {
          const isDone = step.status === "done";
          const isActive = step.status === "active";
          return (
            <li
              key={step.name}
              className={`ver-step ${isDone ? "is-done" : ""} ${isActive ? "is-active" : ""}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <span className="ver-step-icon">
                {isDone ? <FaCheck /> : <span className="ver-step-num">{i + 1}</span>}
                {isActive && <span className="ver-step-pulse"></span>}
              </span>
              <span className="ver-step-label">{step.name}</span>
            </li>
          );
        })}
      </ol>

      <div className="ver-current">
        <div className="ver-current-head">
          <h3 className="ver-current-title">{activeName}</h3>
          <span className="ver-current-pct">{data.progress}% Complete</span>
        </div>
        <p className="ver-current-text">
          Our team is checking your submitted details.
        </p>
        <div className="ver-progress-track">
          <div
            className="ver-progress-fill"
            style={{ width: `${barWidth}%` }}
          >
            <span className="ver-progress-shimmer"></span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerificationProgress;
