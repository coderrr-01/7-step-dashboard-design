import { FaCheck, FaTriangleExclamation } from "react-icons/fa6";

const CHECKLIST_STATES = {
  verified: { label: "Verified", cls: "ok", icon: <FaCheck /> },
  confirmed: { label: "Confirmed", cls: "ok", icon: <FaCheck /> },
  "under-review": { label: "Under Review", cls: "review", icon: <span className="ver-list-dot"></span> },
  pending: { label: "Pending", cls: "pending", icon: <FaTriangleExclamation /> },
  "action-required": { label: "Action Required", cls: "warn", icon: <FaTriangleExclamation /> },
};

function VerificationChecklist({ data }) {
  return (
    <section className="ver-card ver-checklist-card vg-checklist vg-anim">
      <div className="ver-card-top">
        <h2 className="ver-card-title">Verification Checklist</h2>
      </div>

      <ul className="ver-checklist">
        {data.checklist.map((item, i) => {
          const st = CHECKLIST_STATES[item.status] || CHECKLIST_STATES.pending;
          return (
            <li
              key={item.name}
              className={`ver-check-item is-${st.cls}`}
              style={{ animationDelay: `${0.15 + i * 0.09}s` }}
            >
              <span className="ver-check-icon">{st.icon}</span>
              <span className="ver-check-name">{item.name}</span>
              <span className="ver-check-label">{st.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default VerificationChecklist;
