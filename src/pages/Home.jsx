import PageLayout from "../components/PageLayout";
import ChatCard from "./Partial-element/Chatcard";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSteps } from "../context/StepContext";
import { applyForm, getCachedClient, getToken, getUserSub } from "../services/api";
import { toast } from "react-toastify";
import {
  FaFilePen,
  FaArrowRight,
  FaShieldHalved,
  FaCircleCheck,
  FaUserCheck,
} from "react-icons/fa6";
import "../assets/styles/home-style.css";

const EMPLOYMENT_OPTIONS = ["Employed", "Self-Employed", "Student", "Other"];

function getEmailFromToken() {
  try {
    const token = getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.email || '';
  } catch { return ''; }
}

function OverviewPanel({ client, submitted }) {
  const overviewFields = [
    { label: "Full Name", value: client?.name || "—" },
    { label: "Email", value: client?.email || "—" },
    { label: "Phone", value: client?.phone || "—" },
    { label: "Date of Birth", value: client?.date_of_birth || "—" },
    { label: "Move-in Date", value: client?.move_in_date || "—" },
    { label: "Current Address", value: client?.current_address || "—" },
  ];

  return (
    <aside className="home-overview">
      <div className="home-overview-head">
        <span className="home-overview-icon">
          <FaFilePen />
        </span>
        <div>
          <h2 className="home-overview-title">Application Overview</h2>
          <p className="home-overview-section">Personal Details</p>
        </div>
      </div>

      <div className="home-overview-note">
        <span className="home-overview-note-icon">
          <FaShieldHalved />
        </span>
        <p>
          {submitted
            ? "Your application has been submitted and is currently under review."
            : <>You are completing the <strong>Personal Details</strong> section. Our systems will verify this information against your records.</>}
        </p>
      </div>

      <div className="home-overview-fields">
        {overviewFields.map((f) => (
          <div className="home-overview-field" key={f.label}>
            <span className="home-overview-label">{f.label}</span>
            <span className="home-overview-value">{f.value}</span>
          </div>
        ))}
      </div>

      {client && (  
        <div className="home-overview-verified">
          <span className="home-overview-verified-dot"></span>
          <span className="home-overview-verified-label">Visa Status</span>
          <span className="home-overview-verified-value">Verified</span>
        </div>  
      )}

      {client && (
        <Link to="/review" className="home-overview-cta">
          {submitted ? "View Review Status" : ""}
          <FaArrowRight />
        </Link>
      )}
    </aside>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { completeStep, completedSteps } = useSteps();

  const alreadySubmitted = completedSteps.includes(1);

  const [cachedEmail, setCachedEmail] = useState(() => getEmailFromToken());
  const [client, setClient] = useState(null);
  const [form, setForm] = useState({
    name:              "",
    email:             getEmailFromToken(),
    phone:             "",
    date_of_birth:     "",
    current_address:   "",
    employment_status: "",
    monthly_income:    "",
    move_in_date:      "",
    message:           "",
  });

  useEffect(() => {
    const cached = getCachedClient();
    if (cached) setClient(cached);
    if (!cached) return;
    const email = cached.email || getEmailFromToken() || '';
    setCachedEmail(email);
    setForm(prev => ({
      name:              prev.name              || cached.name              || "",
      email:             email,
      phone:             prev.phone             || cached.phone             || "",
      date_of_birth:     prev.date_of_birth     || cached.date_of_birth     || "",
      current_address:   prev.current_address   || cached.current_address   || "",
      employment_status: prev.employment_status || cached.employment_status || "",
      monthly_income:    prev.monthly_income    || (cached.monthly_income != null ? String(cached.monthly_income) : ""),
      move_in_date:      prev.move_in_date      || cached.move_in_date      || "",
      message:           prev.message           || cached.message           || "",
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedSteps, getUserSub()]);

  // useEffect(() => {
  //   const hideLauncher = () => {
  //     if (window.$zoho && window.$zoho.salesiq && window.$zoho.salesiq.chatbutton) {
  //       window.$zoho.salesiq.chatbutton.visible("hide");
  //       return true;
  //     }
  //     return false;
  //   };
  //   if (hideLauncher()) return;
  //   const id = setInterval(hideLauncher, 500);
  //   return () => clearInterval(id);
  // }, []);

  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      toast.error("Full name, email and phone are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await applyForm({
        name:              form.name,
        email:             form.email,
        phone:             form.phone,
        date_of_birth:     form.date_of_birth,
        current_address:   form.current_address,
        employment_status: form.employment_status,
        monthly_income:    parseFloat(form.monthly_income) || 0,
        move_in_date:      form.move_in_date,
        message:           form.message,
      });
      if (res.success) {
        toast.success("Application submitted successfully!");
        completeStep(1);
        navigate("/review");
      } else {
        toast.error(res.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      toast.error(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout page="Home">
      <main className="home-page-bg">
        <div className="home-ambient">
          <span className="home-blob home-blob-1"></span>
          <span className="home-blob home-blob-2"></span>
        </div>

        <div className="home-layout">
          <div className="home-chat-column">
            {alreadySubmitted ? (
              <div className="home-submitted">
                <div className="home-overview-note mb-3">
                  <span className="home-overview-note-icon"><FaCircleCheck /></span>
                  <p>
                    <strong>Application Submitted</strong> — your application has
                    already been submitted and is under review.
                  </p>
                </div>
                <button className="btn btn-jrny-dark w-100 shadow-lg" onClick={() => navigate('/review')}>
                  View Review Status
                </button>
              </div>
            ) : (
              <>
                <ChatCard />
                <form onSubmit={handleSubmit} noValidate className="home-form-card">
                  <h3 className="home-overview-title mb-3">Application Details</h3>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-uppercase text-muted">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" value={form.name} onChange={set("name")} placeholder="John Smith" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-uppercase text-muted">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input type="email" className="form-control" value={form.email} onChange={cachedEmail ? undefined : set("email")} readOnly={!!cachedEmail} placeholder="john@example.com" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-uppercase text-muted">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input type="tel" className="form-control" value={form.phone} onChange={set("phone")} placeholder="+1 (212) 555-0100" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-uppercase text-muted">Date of Birth <span className="text-danger">*</span> </label>
                      <input type="date" className="form-control" value={form.date_of_birth} onChange={set("date_of_birth")} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-uppercase text-muted">Desired Move-in Date <span className="text-danger">*</span> </label>
                      <input type="date" className="form-control" value={form.move_in_date} onChange={set("move_in_date")} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold small text-uppercase text-muted">Current Address <span className="text-danger">*</span> </label>
                      <textarea className="form-control" rows={2} value={form.current_address} onChange={set("current_address")} placeholder="123 Main St, New York, NY 10001" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-uppercase text-muted">Employment Status <span className="text-danger">*</span> </label>
                      <select className="form-select" value={form.employment_status} onChange={set("employment_status")} required>
                        <option value="">Select...</option>
                        {EMPLOYMENT_OPTIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-uppercase text-muted">Monthly Income ($)<span className="text-danger">*</span> </label>
                      <input type="number" className="form-control" value={form.monthly_income} onChange={set("monthly_income")} placeholder="5000" min="0" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold small text-uppercase text-muted">Message (Optional)</label>
                      <textarea className="form-control" rows={3} value={form.message} onChange={set("message")} placeholder="Tell us anything relevant about your application..." />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button type="submit" className="btn btn-jrny-dark w-100 shadow-lg" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>

                {/* <div className="salesiq-chat-container" id="salesiq-inline-section">
                  <div className="salesiq-section-header">
                    <span className="salesiq-section-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                    </span>
                    <div>
                      <h3 className="salesiq-section-title">Need Help?</h3>
                      <p className="salesiq-section-subtitle">Chat with our support team in real time</p>
                    </div>
                  </div>
                  <div className="salesiq-widget-mount" id="salesiq-widget-container">
                    <button
                      type="button"
                      className="salesiq-start-chat-btn"
                      onClick={() => {
                        if (window.$zoho && window.$zoho.salesiq && window.$zoho.salesiq.floatwindow) {
                          window.$zoho.salesiq.floatwindow.open();
                        }
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                      Start Live Chat
                    </button>
                    <p className="salesiq-chat-hint">Click above to open the live chat window</p>
                  </div>
                </div> */}
              </>
            )}
          </div>
          <div className="home-overview-column">
            <OverviewPanel client={client} submitted={alreadySubmitted} />
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
