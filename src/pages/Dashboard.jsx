import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { IoCalendarOutline, IoHomeOutline, IoCashOutline, IoClose, IoDocumentTextOutline, IoNewspaperOutline, IoChatbubbleEllipsesOutline, IoCheckmarkDoneOutline, IoMailOutline, IoCallOutline, IoLockClosedOutline, IoHeadsetOutline } from "react-icons/io5";
import { FaDownload, FaBolt, FaRegClock } from "react-icons/fa";
import PageLayout from "../components/PageLayout";
import { useClientData } from "../hooks/useClientData";
import { getPaymentState, normalizePaymentMethod } from "../utils/paymentState";
import { getPaymentHistory, isPaymentRecordDone } from "../utils/paymentHistory";
import { getRoomById, getUserSub } from "../services/api";

const MONTH_MS = 1000 * 60 * 60 * 24 * 30.44;

function monthSpan(from, to) {
  if (!from || !to) return 0;
  const a = new Date(from);
  const b = new Date(to);
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return 0;
  return Math.round((b - a) / MONTH_MS);
}

// 0-5 months elapsed → green · 6-9 → yellow · 10+ → red (expiry nearing)
function progressTone(elapsed) {
  if (elapsed >= 10) return "red";
  if (elapsed >= 6) return "yellow";
  return "green";
}
function formatPretty(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const METHOD_LABELS = {
  stripe: "Stripe",
  paypal: "PayPal",
  revolut: "Revolut",
  bank: "Bank Transfer",
  cash: "Cash",
};

function modularity(value) {
  const normalized = normalizePaymentMethod(value);
  return METHOD_LABELS[normalized] || value || "—";
}

export default function Dashboard() {
  const { client, loading, refetch } = useClientData({ preferCachedData: false });
  const navigate = useNavigate();
  const [fallbackRoom, setFallbackRoom] = useState(null);

  const [selectedRoom] = useState(() => {
    try { return JSON.parse(localStorage.getItem("jrny_selected_room") || "null"); }
    catch { return null; }
  });

  // Profile avatar — edited image lives locally (no backend update endpoint).
  const sub = getUserSub();
  const profileImgKey = sub ? `jrny_profile_img_${sub}` : null;
  const [profileImg, setProfileImg] = useState(() => {
    if (!profileImgKey) return "";
    try { return localStorage.getItem(profileImgKey) || ""; } catch { return ""; }
  });
  const [profileMsg, setProfileMsg] = useState("");
  const [localSignedPdf, setLocalSignedPdf] = useState(() => {
    try { return localStorage.getItem("jrny_signed_lease") || ""; } catch { return ""; }
  });
  const [historyType, setHistoryType] = useState(null); // "deposit" | "rent" | null

  // Paid users only — anyone without BOTH payments done is sent back to the
  // payment screen. Waits for fresh server data (no cached-flag shortcut).
  useEffect(() => {
    if (loading || !client) return;
    const ps = getPaymentState(client);
    if (!ps.depositPaid || !ps.rentPaid) {
      navigate("/payment-screen", { replace: true });
    }
  }, [loading, client, navigate]);

  useEffect(() => {
    if (selectedRoom || !client?.room_id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await getRoomById(client.room_id);
        if (res?.success && res.room && !cancelled) setFallbackRoom(res.room);
      } catch { }
    })();
    return () => { cancelled = true; };
  }, [selectedRoom, client?.room_id]);

  useEffect(() => {
    if (!loading) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !client) {
    return (
      <PageLayout page="Dashboard">
        <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1 min-vh-100">
          <div className="container container-narrow py-5" style={{ textAlign: "center" }}>
            <span className="pay-loading-ring" aria-hidden="true"></span>
            <p style={{ marginTop: 18, fontFamily: "Poppins, sans-serif", color: "#8d8272" }}>Loading your dashboard…</p>
          </div>
        </main>
      </PageLayout>
    );
  }

  const activeRoom = selectedRoom || fallbackRoom;
  const roomImages = (() => {
    if (Array.isArray(activeRoom?.images) && activeRoom.images.length) return activeRoom.images;
    if (activeRoom?.img) return [activeRoom.img];
    return [];
  })();
  const roomImage = client?.room_img || roomImages[0] || "";

  const firstName = (client?.name || "").split(" ")[0] || "Member";

  const extStatus = client?.extension_status || "";
  const resolvedStartDate =
    extStatus === "Approved" && client?.requested_start_date
      ? client.requested_start_date
      : client?.start_date || "";
  const resolvedEndDate =
    extStatus === "Approved" && client?.requested_end_date
      ? client.requested_end_date
      : client?.end_date || "";

  let startDate = resolvedStartDate;
  let endDate = resolvedEndDate;
  if (!startDate && client?.move_in_date) startDate = client.move_in_date;
  if (!endDate && startDate) {
    const d = new Date(startDate);
    if (!isNaN(d.getTime())) {
      d.setFullYear(d.getFullYear() + 1);
      endDate = d.toISOString().slice(0, 10);
    }
  }

  const paymentState = getPaymentState(client);
  const depositAmount = client?.security_deposit
    ? `$ ${parseFloat(client.security_deposit).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    : "—";
  const rentAmount = client?.rent_amount
    ? `$ ${parseFloat(client.rent_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    : "—";
  const depositMethod = modularity(paymentState.depositMethod);
  const rentMethod = modularity(paymentState.rentMethod);
  const totalPaid = client?.security_deposit && client?.rent_amount
    ? (parseFloat(client.security_deposit) + parseFloat(client.rent_amount)).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
    : "—";

  const unitLabel = activeRoom?.name || client?.unit || client?.room_name || "Your residence";
  const roomMeta = (() => {
    if (!activeRoom) return "";
    const parts = [
      activeRoom.floor ? `Floor ${activeRoom.floor}` : null,
      activeRoom.unit_number ? `Unit ${activeRoom.unit_number}` : null,
      activeRoom.size_sq_ft ? `${activeRoom.size_sq_ft} sq.ft` : null,
    ].filter(Boolean);
    if (parts.length) return parts.join(" • ");
    return [activeRoom.roomNumber, activeRoom.city].filter(Boolean).join(" • ");
  })();

  const totalMonths = monthSpan(startDate, endDate) || 12;
  const today = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  let elapsedMonths = start ? monthSpan(start, today) : 0;
  if (elapsedMonths > totalMonths) elapsedMonths = totalMonths;
  if (elapsedMonths < 0) elapsedMonths = 0;
  const remainingMonths = totalMonths - elapsedMonths;
  const pct = totalMonths > 0 ? Math.round((elapsedMonths / totalMonths) * 100) : 0;
  const expired = !!(end && today > end);
  const tone = expired ? "red" : progressTone(elapsedMonths);
  // Extend unlocks only from month 10 (within two months of expiry).
  const extendEnabled = expired || elapsedMonths >= 10;

  // Sanity: a fully-overdue term should never overflow past the track.
  // When the term has barely started (< 3%), still show a thin sliver of fill
  // so the bar never looks completely empty — the lease is in progress.
  const barPct = Math.min(100, Math.max(3, pct));

  // ── Journey timeline — what actually happened, in real order ───────────────
  // Signed lease PDF: prefer the server value, fall back to the local copy
  // stored by the lease-signing flow (same pattern as DocumentSign).
  const signedPdf = client?.signed_lease || localSignedPdf || "";
  const extensionPdf = client?.extension_signed_pdf || "";
  const interviewDate = client?.interview_date ? formatPretty(client.interview_date) : "";
  const interviewTime = client?.interview_time || "";
  const appliedDate = client?.submitted_at ? formatPretty(client.submitted_at) : "";
  const leaseSignedDate = signedPdf ? (client?.effective_date ? formatPretty(client.effective_date) : (startDate ? formatPretty(startDate) : "")) : "";
  const bothPaid = paymentState.depositPaid && paymentState.rentPaid;

  // Payment history — parsed from backend arrays or from flat paid flags.
  const payHistory = getPaymentHistory(client);
  const depositHistory = payHistory.filter((r) => r.type === "deposit");
  const rentHistory = payHistory.filter((r) => r.type === "rent");
  const shownHistory = historyType === "deposit" ? depositHistory : historyType === "rent" ? rentHistory : [];

  const JOURNEY_MILESTONES = 5;

  const timeline = [];
  if (appliedDate) timeline.push({ icon: "form", title: "Application Submitted", text: "Tenant application received by the Board.", date: appliedDate });
  if (interviewDate) timeline.push({ icon: "chat", title: "Interview Scheduled", text: `Board review session ${interviewTime ? `at ${interviewTime}` : ""}.`.replace(/\s+/g, " "), date: interviewDate });
  if (unitLabel) timeline.push({ icon: "home", title: "Residence Selected", text: roomMeta || "Residence booking confirmed.", date: client?.move_in_date ? formatPretty(client.move_in_date) : "" });
  if (signedPdf) timeline.push({ icon: "file", title: "Lease Signed", text: "Residency agreement executed.", date: leaseSignedDate });
  if (bothPaid) timeline.push({ icon: "pay", title: "Payments Complete", text: "Security deposit + first month's rent settled.", date: "" });

  const journeyPct = Math.round((timeline.length / JOURNEY_MILESTONES) * 100);

  // Stepper version of the same journey — each milestone has a done flag so the
  // indicator shows green circles with ticks for finished steps.
  const journeySteps = [
    { label: "Application Submitted", done: !!appliedDate },
    { label: "Interview Scheduled", done: !!interviewDate },
    { label: "Residence Selected", done: !!unitLabel },
    { label: "Lease Signed", done: !!signedPdf },
    { label: "Payments Completed", done: bothPaid },
  ];

  const profileEmail = client?.email || "—";
  const profilePhone = client?.phone || "—";
  const profileDob = client?.date_of_birth ? formatPretty(client.date_of_birth) : "—";

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileMsg("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setProfileImg(dataUrl);
      if (profileImgKey) {
        try { localStorage.setItem(profileImgKey, dataUrl); } catch { }
      }
      setProfileMsg("Profile picture updated (saved on this device).");
      setTimeout(() => setProfileMsg(""), 3500);
    };
    reader.onerror = () => setProfileMsg("Could not read the image.");
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const statCards = [
    { label: "Residence", value: unitLabel, meta: roomMeta || "Booked", icon: <IoHomeOutline /> },
    { label: "Lease Ends", value: endDate ? formatPretty(endDate) : "—", meta: `${remainingMonths} month${remainingMonths === 1 ? "" : "s"} left`, icon: <IoCalendarOutline /> },
    { label: "Deposit Paid", value: client?.security_deposit ? `$${parseFloat(client.security_deposit).toLocaleString("en-US")}` : "—", meta: paymentState.depositPaid ? `via ${depositMethod}` : "Pending", icon: <IoCashOutline /> },
  ];

  return (
    <PageLayout page="Dashboard">
      <main className="db-main">
        <div className="container py-4 py-lg-5">

          {/* Welcome banner — room image backdrop, text layered on top */}
          <section
            className="db-hero"
            style={roomImage ? { backgroundImage: `url(${roomImage})` } : undefined}
          >
            <span className="db-hero-shade"></span>
            <div className="db-hero-glow"></div>
            <div className="db-hero-copy">
              <p className="db-hero-eyebrow">Welcome back</p>
              <h1 className="db-hero-title">Hello, {firstName}!</h1>
              <p className="db-hero-sub">
                Your residency is live. Here is everything that happened on your
                journey, how your lease is tracking, and your membership details.
              </p>
            </div>
            {/* <span className="db-complete-badge">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Membership Active
            </span> */}
          </section>

          {/* ---- two-column layout ---- */}
          <section className="db-stats">
            {statCards.map((card) => (
              <div key={card.label} className="db-stat-card">
                <span className="db-stat-icon">{card.icon}</span>
                <span className="db-stat-body">
                  <p className="db-stat-label">{card.label}</p>
                  <h3 className="db-stat-value" title={card.value}>{card.value}</h3>
                  <p className="db-stat-meta">{card.meta}</p>
                </span>
              </div>
            ))}
          </section>
          <div className="db-dash-grid">

            {/* ===== LEFT: main content ===== */}
            <div className="db-dash-main">

              {/* Stat cards — icon chip + value */}


              {/* Lease progress */}
              <section className={`db-progress-card ${tone}`}>
                <div className="db-progress-head">
                  <div className="db-progress-title">
                    <div className="db-section-head-icon">
                      <IoDocumentTextOutline />
                    </div>
                    <div>
                      <p className="db-section-eyebrow">Lease Progress</p>
                      <h2 className="db-section-title">Rental Term</h2>
                    </div>
                  </div>
                  <div className="db-progress-meta">
                    <span>{startDate ? formatPretty(startDate) : "—"} → {endDate ? formatPretty(endDate) : "—"}</span>
                  </div>
                </div>

                <div className="db-progress-bar-wrap">
                  <div className="db-progress-track">
                    <div className="db-progress-fill" style={{ width: `${barPct}%` }}></div>
                  </div>
                  <div className="db-progress-labels">
                    <span>{elapsedMonths} month{elapsedMonths === 1 ? "" : "s"} elapsed</span>
                    <span>{remainingMonths} month{remainingMonths === 1 ? "" : "s"} left</span>
                  </div>
                </div>

                <div className="db-progress-foot">
                  <p className={`db-tone-note ${tone}`}>
                    <IoCalendarOutline size={15} />
                    <span>
                      {expired
                        ? "Your lease term has ended."
                        : tone === "red"
                          ? "Your lease is nearing its end — consider extending soon."
                          : tone === "yellow"
                            ? "Over half of your lease has passed."
                            : "You're early in your lease term."}
                    </span>
                  </p>
                  <button
                    type="button"
                    className="db-extend-btn"
                    disabled={!extendEnabled}
                    title={extendEnabled ? "Request a lease extension" : "Extension unlocks in the final 2 months"}
                  >
                    {extendEnabled ? "Extend Lease" : "Extend Available at 10 months"}
                  </button>
                </div>
              </section>

              {/* Journey progress — stepper, green circles with ticks */}
              <section className="db-card db-journey-progress">
                <div className="db-section-title-row">
                  <div>
                    <p className="db-section-eyebrow">Application Progress</p>
                    <h2 className="db-section-title">Your journey so far</h2>
                  </div>
                  <span className="db-journey-pct">{journeyPct}%</span>
                </div>
                <div className="db-stepper-horizontal">
                  {journeySteps.map((step, i) => (
                    <div
                      key={step.label}
                      className={`db-journey-step ${step.done ? "is-done" : ""}`}
                    >
                      <div className="db-journey-step-top">
                        {i > 0 && (
                          <span className={`db-journey-line ${journeySteps[i - 1].done ? "is-done" : ""}`}></span>
                        )}
                        <span className="db-journey-circle">
                          {step.done && (
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                              <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        {i < journeySteps.length - 1 && (
                          <span className={`db-journey-line ${step.done ? "is-done" : ""}`}></span>
                        )}
                      </div>
                      <p className="db-journey-step-label">{step.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Journey timeline */}
              <section className="db-card db-journey-card">
                <div className="db-section-title-row">
                  <div>
                    <p className="db-section-eyebrow">Your Journey</p>
                    <h2 className="db-section-title">What happened so far</h2>
                  </div>
                </div>

                {timeline.length ? (
                  <div className="db-timeline">
                    {timeline.map((ev, i) => (
                      <div key={ev.title} className="db-timeline-item">
                        <div className="db-timeline-rail">
                          <span className={`db-timeline-dot ${ev.icon}`}>
                            {ev.icon === "form" && <IoNewspaperOutline size={16} />}
                            {ev.icon === "chat" && <IoChatbubbleEllipsesOutline size={16} />}
                            {ev.icon === "home" && <IoHomeOutline size={16} />}
                            {ev.icon === "file" && <IoDocumentTextOutline size={16} />}
                            {ev.icon === "pay" && <IoCashOutline size={16} />}
                            {i === timeline.length - 1 && <span className="db-timeline-tick"><IoCheckmarkDoneOutline size={9} /></span>}
                          </span>
                          {i < timeline.length - 1 && <span className="db-timeline-line"></span>}
                        </div>
                        <div className="db-timeline-body">
                          <h3>{ev.title}</h3>
                          <p>{ev.text}</p>
                          {ev.date && <span className="db-timeline-date">{ev.date}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="db-empty">No journey events recorded yet.</p>
                )}

                {/* Signed lease documents */}
                <div className="db-docs">
                  <div className="db-doc-item">
                    <div className="db-doc-icon">
                      <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M5 1h7l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                        <path d="M12 1v4h4M7 8h6M7 11h6M7 14h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="db-doc-info">
                      <strong>Signed Lease Agreement</strong>
                      <span>{signedPdf ? (leaseSignedDate ? `Signed ${leaseSignedDate}` : "Your signed lease PDF") : "Not available yet"}</span>
                    </div>
                    {signedPdf ? (
                      <a className="db-doc-dl-btn" href={signedPdf} download target="_blank" rel="noreferrer">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M8 1v9M4 7l4 4 4-4M2 14h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Download
                      </a>
                    ) : (
                      <span className="db-doc-na">—</span>
                    )}
                  </div>

                  {extensionPdf && (
                    <div className="db-doc-item">
                      <div className="db-doc-icon">
                        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path d="M5 1h7l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                          <path d="M12 1v4h4M7 8h6M7 11h6M7 14h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="db-doc-info">
                        <strong>Extension Lease Agreement</strong>
                        <span>Signed extension lease PDF</span>
                      </div>
                      <a className="db-doc-dl-btn" href={extensionPdf} download target="_blank" rel="noreferrer">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M8 1v9M4 7l4 4 4-4M2 14h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Download
                      </a>
                    </div>
                  )}
                </div>
              </section>

            </div>
            {/* ===== END LEFT ===== */}

            {/* ===== RIGHT: Membership Fees + Profile sidebar ===== */}
            <div className="db-dash-aside">

              {/* Membership fees breakdown */}
              <section className="db-card db-pay-card">
                {/* <p className="db-section-eyebrow">Payments</p> */}
                <h2 className="db-section-title">Your Amount</h2>
                <div className="db-pay-grid">
                  <div className="db-pay-box">
                    <span className="db-pay-box-label">Security Deposit</span>
                    <span className="db-pay-box-value">{depositAmount}</span>
                    <span className={`db-pay-box-status ${paymentState.depositPaid ? "is-paid" : "is-pending"}`}>
                      {paymentState.depositPaid ? `Paid · ${depositMethod}` : "Pending"}
                    </span>
                    <button type="button" className="db-view-detail details-top-right" onClick={() => setHistoryType("deposit")}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M2 6l6 5 6-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      View Details
                    </button>
                  </div>
                  <div className="db-pay-box">
                    <span className="db-pay-box-label">First Month Rent</span>
                    <span className="db-pay-box-value">{rentAmount}</span>
                    <span className={`db-pay-box-status ${paymentState.rentPaid ? "is-paid" : "is-pending"}`}>
                      {paymentState.rentPaid ? `Paid · ${rentMethod}` : "Pending"}
                    </span>
                    <button type="button" className="db-view-detail details-top-right" onClick={() => setHistoryType("rent")}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M2 6l6 5 6-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      View Details
                    </button>
                  </div>
                  <div className="db-pay-box db-pay-box-total">
                    <span className="db-pay-box-label">Total Paid</span>
                    <span className="db-pay-box-value">{totalPaid}</span>
                    <span className={`db-pay-box-status ${bothPaid ? "is-paid" : "is-pending"}`}>
                      {bothPaid ? "Settled" : "Partial"}
                    </span>
                  </div>
                </div>
              </section>

              {/* Profile */}
              <section className="db-card db-profile-card">
                <div className="db-profile-head">
                  <label className="db-profile-avatar" htmlFor="db-avatar-input" title="Click to change picture">
                    {profileImg ? (
                      <img src={profileImg} alt="Profile" />
                    ) : (
                      <span>{(client?.name || "U").charAt(0).toUpperCase()}</span>
                    )}
                    <span className="db-profile-cam">
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M1 5a2 2 0 0 1 2-2h1l1.5-2h3L10 3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                        <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </span>
                    <input id="db-avatar-input" type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
                  </label>
                  <div>
                    <p className="db-section-eyebrow">Profile</p>
                    <h2 className="db-section-title">{client?.name || "Member"}</h2>
                    <p className="db-profile-msg">
                      You can update your profile picture. Email and password are locked
                      and can only be changed by the community team.
                    </p>
                    {profileMsg && <p className="db-profile-toast">{profileMsg}</p>}
                  </div>
                </div>

                <div className="db-profile-fields">
                  <div className="db-profile-field">
                    <span className="db-field-label"><IoMailOutline className="db-field-icon" /> Email</span>
                    <div className="db-profile-value">
                      <b>{profileEmail}</b>
                      <em className="db-lock"><IoLockClosedOutline size={10} /> Locked</em>
                    </div>
                  </div>
                  <div className="db-profile-field">
                    <span className="db-field-label"><IoCallOutline className="db-field-icon" /> Phone</span>
                    <div className="db-profile-value">
                      <b>{profilePhone}</b>
                    </div>
                  </div>
                  <div className="db-profile-field">
                    <span className="db-field-label"><IoCalendarOutline className="db-field-icon" /> Date of Birth</span>
                    <div className="db-profile-value">
                      <b>{profileDob}</b>
                    </div>
                  </div>
                  <div className="db-profile-field">
                    <span className="db-field-label"><IoLockClosedOutline className="db-field-icon" /> Password</span>
                    <div className="db-profile-value">
                      <b className="db-password">••••••••••</b>
                      <em className="db-lock"><IoLockClosedOutline size={10} /> Locked</em>
                    </div>
                  </div>
                </div>
              </section>

              {/* Need help */}
              <aside className="db-help-card">
                <span className="db-help-glow"></span>
                <div className="icon-content-set">
                  <div>
 <span className="db-help-icon">
                    <IoHeadsetOutline size={24} />
                  </span>
                  </div>
                 
                  <div>
                      <h3 className="db-help-title">Need a help?</h3>
                <p className="db-help-text">
                  Our community team is here for you — reach out any time and we'll
                  assist with your residency.
                </p>
                  </div>
                </div>

              
                <a className="db-help-btn" href="tel:+0000000000">
                  <IoCallOutline size={14} />
                  Contact Us
                </a>
              </aside>

            </div>
            {/* ===== END RIGHT ===== */}
          </div>
          {/* ---- /two-column layout ---- */}

          {/* Payment history modal — deposit / rent */}
          {historyType &&
            createPortal(
              <div className="db-modal-backdrop" onClick={() => setHistoryType(null)}>
                <div className="db-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                  <div className="db-modal-head">
                    <div>
                      <p className="db-section-eyebrow">Payment History</p>
                      <h2 className="db-section-title" style={{ textTransform: "capitalize" }}>
                        {historyType === "deposit" ? "Security Deposit" : "Rent Payments"}
                      </h2>
                    </div>
                    <button type="button" className="db-modal-close" onClick={() => setHistoryType(null)} aria-label="Close">
                      <IoClose size={20} />
                    </button>
                  </div>

                  <div className="db-pay-history">
                    {shownHistory.length ? (
                      shownHistory.map((rec, i) => {
                        const done = isPaymentRecordDone(rec);
                        const amount = typeof rec.amount === "number"
                          ? `$ ${rec.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                          : rec.amount || "—";
                        const method = modularity(rec.method);
                        return (
                          <div key={`${historyType}-${i}`} className={`db-pay-row ${done ? "is-paid" : "is-pending"}`}>
                            <span className="db-pay-row-dot"></span>
                            <div className="db-pay-row-main">
                              <strong>{done ? "Payment complete" : "Payment pending"}</strong>
                              <span className="db-pay-row-sub">
                                <FaRegClock size={11} /> {rec.date || (done ? "Confirmed" : "Awaiting confirmation")}
                                {method !== "—" && method ? ` · ${method}` : ""}
                              </span>
                              {rec.txnId && (
                                <span className="db-pay-row-txn">
                                  Transaction ID: <b>{rec.txnId}</b>
                                </span>
                              )}
                            </div>
                            <div className="db-pay-row-right">
                              <span className="db-pay-row-amount">{amount}</span>
                              <span className={`db-pay-row-badge ${done ? "is-paid" : "is-pending"}`}>
                                <FaBolt size={9} /> {done ? "Paid" : "Pending"}
                              </span>
                              {rec.receipt && (
                                <a
                                  className="db-pay-row-receipt"
                                  href={rec.receipt}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <FaDownload size={11} /> Receipt
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="db-empty">No payment records yet. Your payments will appear here as soon as they are recorded.</p>
                    )}
                  </div>
                </div>
              </div>,
              document.body
            )}

        </div>
      </main>
    </PageLayout>
  );
}