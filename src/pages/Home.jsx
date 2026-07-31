import { useState, useEffect } from "react";
import PageLayout from "../components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useSteps } from "../context/StepContext";
import { applyForm, getCachedClient, getToken } from "../services/api";
import { toast } from "react-toastify";

const EMPLOYMENT_OPTIONS = ["Employed", "Self-Employed", "Student", "Other"];

function getEmailFromToken() {
  try {
    const token = getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.email || '';
  } catch { return ''; }
}

export default function Home() {
  const navigate = useNavigate();
  const { completeStep, completedSteps, clientLoading } = useSteps();

  const alreadySubmitted = completedSteps.includes(1);

  const cached = getCachedClient();
  const tokenEmail = getEmailFromToken();
  const cachedEmail = cached?.email || tokenEmail || '';

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name:              cached?.name              || "",
    email:             cachedEmail,
    phone:             cached?.phone             || "",
    date_of_birth:     cached?.date_of_birth     || "",
    current_address:   cached?.current_address   || "",
    employment_status: cached?.employment_status || "",
    monthly_income:    cached?.monthly_income    != null ? String(cached.monthly_income) : "",
    move_in_date:      cached?.move_in_date      || "",
    message:           cached?.message           || "",
  });

  // Re-populate form if client data loads asynchronously (e.g. after WP redirect login)
  useEffect(() => {
    const client = getCachedClient();
    if (!client) return;
    setForm(prev => ({
      name:              prev.name              || client.name              || "",
      email:             prev.email             || client.email             || "",
      phone:             prev.phone             || client.phone             || "",
      date_of_birth:     prev.date_of_birth     || client.date_of_birth     || "",
      current_address:   prev.current_address   || client.current_address   || "",
      employment_status: prev.employment_status || client.employment_status || "",
      monthly_income:    prev.monthly_income    || (client.monthly_income != null ? String(client.monthly_income) : ""),
      move_in_date:      prev.move_in_date      || client.move_in_date      || "",
      message:           prev.message           || client.message           || "",
    }));
  }, [completedSteps]);

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

  // Wait for async client-data fetch before deciding which screen to show.
  // Return a blank content area (inside PageLayout so header/logout still render)
  // to prevent a flash of the form for users who already submitted.
  if (clientLoading) {
    return (
      <PageLayout page="Home">
        <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1 bg-field" />
      </PageLayout>
    );
  }

  // Already submitted — show read-only summary, no form
  if (alreadySubmitted) {
    return (
      <PageLayout page="Home">
        <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1 bg-field">
          <div className="container container-narrow homepage-screen">
            <div className="row g-5">
              <div className="col-lg-8">
                <div className="mb-5">
                  <h1 className="display-4 serif-heading heading-hero hero-title mb-3">Application Submitted</h1>
                  <p className="lead text-secondary heading-lead">Your application has already been submitted.</p>
                </div>
                <div className="p-4 rounded-3 border application-view-highlight mb-4">
                  <p className="mb-1"><strong>Email:</strong> {cachedEmail}</p>
                  <p className="mb-0 text-muted small">This step is complete. Your application is under review.</p>
                </div>
                <button className="btn btn-jrny-dark shadow-lg" onClick={() => navigate('/review')}>
                  View Review Status
                </button>
              </div>
            </div>
          </div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout page="Home">
      <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1 bg-field">
        <div className="container container-narrow homepage-screen">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="mb-5">
                <h1 className="display-4 serif-heading heading-hero hero-title mb-3">
                  Apply to Stay with Journey
                </h1>
                <p className="lead text-secondary heading-lead">
                  Fill in your details below to begin your application.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  {/* Full Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-uppercase text-muted">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="John Smith"
                      required
                    />
                  </div>

                  {/* Email — pre-filled from JWT, readonly */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-uppercase text-muted">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={cachedEmail ? undefined : set("email")}
                      readOnly={!!cachedEmail}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-uppercase text-muted">
                      Phone <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+1 (212) 555-0100"
                      required
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-uppercase text-muted">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.date_of_birth}
                      onChange={set("date_of_birth")}
                    />
                  </div>

                  {/* Desired Move-in Date */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-uppercase text-muted">
                      Desired Move-in Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.move_in_date}
                      onChange={set("move_in_date")}
                    />
                  </div>

                  {/* Current Address */}
                  <div className="col-12">
                    <label className="form-label fw-bold small text-uppercase text-muted">
                      Current Address
                    </label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={form.current_address}
                      onChange={set("current_address")}
                      placeholder="123 Main St, New York, NY 10001"
                    />
                  </div>

                  {/* Employment Status */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-uppercase text-muted">
                      Employment Status
                    </label>
                    <select
                      className="form-select"
                      value={form.employment_status}
                      onChange={set("employment_status")}
                    >
                      <option value="">Select...</option>
                      {EMPLOYMENT_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  {/* Monthly Income */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-uppercase text-muted">
                      Monthly Income ($)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.monthly_income}
                      onChange={set("monthly_income")}
                      placeholder="5000"
                      min="0"
                    />
                  </div>

                  {/* Message */}
                  <div className="col-12">
                    <label className="form-label fw-bold small text-uppercase text-muted">
                      Message (Optional)
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Tell us anything relevant about your application..."
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-jrny-dark w-100 shadow-lg"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right sidebar — unchanged layout */}
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-4 revrese-column">
                <div className="application-view">
                  <div className="d-flex gap-3 mb-4 align-items-center">
                    <div className="p-3 rounded-3 badges-icon">
                      <svg fill="none" height="24" stroke="currentColor" viewBox="0 0 24 24" width="24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="serif-heading h5 mb-1">Application Overview</h4>
                    </div>
                  </div>
                  <div className="p-3 mb-4 rounded-3 border application-view-highlight">
                    <p>
                      You are completing the{" "}
                      <span className="fw-bold text-dark">Personal Details</span> section.
                      Our systems will verify this information against your records.
                    </p>
                  </div>
                  <div className="d-flex justify-content-between verified-status align-items-center pt-3">
                    <span className="text-label-uppercase">Visa Status</span>
                    <div className="d-flex align-items-center gap-1">
                      <div className="verified-dot"></div>
                      <span className="text-verified">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
