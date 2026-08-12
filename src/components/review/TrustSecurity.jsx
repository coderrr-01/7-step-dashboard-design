import { FaLock, FaCheck, FaUserShield } from "react-icons/fa6";

const ITEMS = [
  { icon: <FaLock />, label: "Secure" },
  { icon: <FaCheck />, label: "Protected" },
  { icon: <FaUserShield />, label: "Private Review" },
];

function TrustSecurity() {
  return (
    <section className="ver-card ver-trust-card vg-anim">
      <h3 className="ver-trust-title">Your Information Is Secure</h3>
      <p className="ver-trust-text">
        Your submitted information is handled securely and is only used for
        application verification and processing.
      </p>

      <div className="ver-trust-items">
        {ITEMS.map((item) => (
          <span key={item.label} className="ver-trust-item">
            <span className="ver-trust-item-icon">{item.icon}</span>
            {item.label}
          </span>
        ))}
      </div>
    </section>
  );
}

export default TrustSecurity;
