import { FaFilePen } from "react-icons/fa6";

function ApplicationOverview({ data }) {
  const a = data.applicant;

  const fields = [
    { label: "Full Name", value: a.fullName },
    { label: "Email", value: a.email },
    { label: "Phone", value: a.phone },
    { label: "Date of Birth", value: a.dateOfBirth },
    { label: "Desired Move-in Date", value: a.moveInDate },
    { label: "Current Address", value: a.currentAddress },
    { label: "Employment Status", value: a.employmentStatus },
    { label: "Monthly Income", value: a.monthlyIncome },
  ];

  return (
    <section className="ver-card ver-overview-card vg-overview vg-anim">
      <div className="ver-card-top">
        <h2 className="ver-card-title">
          <FaFilePen className="ver-overview-title-icon" />
          Application Overview
        </h2>
        <span className="ver-overview-section">Personal Details</span>
      </div>

      <p className="ver-overview-note">
        You are completing the <strong>Personal Details</strong> section. Our
        systems will verify this information against your records.
      </p>

      <div className="ver-overview-grid">
        {fields.map((f) => (
          <div className="ver-overview-item" key={f.label}>
            <span className="ver-overview-label">{f.label}</span>
            <span className="ver-overview-value">{f.value}</span>
          </div>
        ))}
      </div>

      {a.message && (
        <div className="ver-overview-message">
          <span className="ver-overview-label">Message</span>
          <p>{a.message}</p>
        </div>
      )}
    </section>
  );
}

export default ApplicationOverview;
