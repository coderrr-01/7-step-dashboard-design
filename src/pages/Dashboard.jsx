import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { useClientData } from "../hooks/useClientData";
import { getPaymentState, normalizePaymentMethod } from "../utils/paymentState";
import { getRoomById } from "../services/api";
import stepsConfig from "../config/stepsConfig";
import { useSteps } from "../context/StepContext";

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
  const { completedSteps } = useSteps();

  const [fallbackRoom, setFallbackRoom] = useState(null);

  const [selectedRoom] = useState(() => {
    try { return JSON.parse(localStorage.getItem("jrny_selected_room") || "null"); }
    catch { return null; }
  });

  // Paid users only — anyone without BOTH payments done is sent back to the
  // payment screen. Waits for fresh server data (no cached-flag shortcut).
  // NOTE: temporarily disabled so the dashboard design can be previewed by
  // any logged-in user. Re-enable when the dashboard is ready for production.
  //
  // useEffect(() => {
  //   if (loading || !client) return;
  //   const ps = getPaymentState(client);
  //   if (!ps.depositPaid || !ps.rentPaid) {
  //     navigate("/payment-screen", { replace: true });
  //   }
  // }, [loading, client, navigate]);

  useEffect(() => {
    if (selectedRoom || !client?.room_id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await getRoomById(client.room_id);
        if (res?.success && res.room && !cancelled) setFallbackRoom(res.room);
      } catch {}
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

  const journeyComplete = stepsConfig.every((s) => completedSteps.includes(s.number));
  const completedCount = stepsConfig.filter((s) => completedSteps.includes(s.number)).length;
  const completedStepsToday = [...completedSteps].sort((a, b) => a - b);

  const statCards = [
    { label: "Journey Steps", value: `${completedCount}/${stepsConfig.length}`, done: journeyComplete },
    { label: "Residence", value: unitLabel, done: !!unitLabel },
    { label: "Lease Ends", value: endDate ? new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—", done: !!endDate },
  ];

  return (
    <PageLayout page="Dashboard">
      <main className="db-main">
        <div className="container py-4 py-lg-5">

          {/* Welcome banner */}
          <section className="db-hero">
            <div className="db-hero-glow"></div>
            <div>
              <p className="db-hero-eyebrow">Welcome back</p>
              <h1 className="db-hero-title">Hello, {firstName}!</h1>
              <p className="db-hero-sub">
                Your membership journey is complete — here is everything that happened
                along the way, and how your lease is tracking.
              </p>
            </div>
            {journeyComplete ? (
              <span className="db-complete-badge">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Journey Complete
              </span>
            ) : (
              <span className="db-complete-badge db-complete-badge-progress">
                {Math.round((completedCount / stepsConfig.length) * 100)}% complete
              </span>
            )}
          </section>

          {/* Stat cards */}
          <section className="db-stats">
            {statCards.map((card) => (
              <div key={card.label} className="db-stat-card">
                <p className="db-stat-label">{card.label}</p>
                <h3 className="db-stat-value">{card.value}</h3>
                <p className="db-stat-meta">{card.done ? "Confirmed" : "—"}</p>
              </div>
            ))}
          </section>

          {/* Lease progress */}
          <section className={`db-progress-card ${tone}`}>
            <div className="db-progress-head">
              <div>
                <p className="db-section-eyebrow">Lease Progress</p>
                <h2 className="db-section-title">Membership Term</h2>
              </div>
              <div className="db-progress-meta">
                <span>{startDate ? new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"} → {endDate ? new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
              </div>
            </div>

            <div className="db-progress-bar-wrap">
              <div className="db-progress-track">
                <div className="db-progress-fill" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}></div>
              </div>
              <div className="db-progress-labels">
                <span>{elapsedMonths} month{elapsedMonths === 1 ? "" : "s"} elapsed</span>
                <span>{remainingMonths} month{remainingMonths === 1 ? "" : "s"} left</span>
              </div>
            </div>

            <div className="db-progress-foot">
              <p className="db-tone-note">
                {expired
                  ? "Your lease term has ended."
                  : tone === "red"
                    ? "Your lease is nearing its end — consider extending soon."
                    : tone === "yellow"
                      ? "Over half of your lease has passed."
                      : "You're early in your lease term."}
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

          {/* Journey summary */}
          <section className="db-grid-row">
            <div className="db-card">
              <p className="db-section-eyebrow">Your Journey</p>
              <h2 className="db-section-title">7-Step Completion</h2>
              <div className="db-steps-list">
                {completedStepsToday.map((n) => {
                  const step = stepsConfig.find((s) => s.number === n);
                  if (!step) return null;
                  return (
                    <div key={n} className="db-step-item">
                      <span className="db-step-num">{String(n).padStart(2, "0")}</span>
                      <div className="db-step-info">
                        <strong>{step.label}</strong>
                        <span>{step.description}</span>
                      </div>
                      <span className="db-step-check">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  );
                })}
                {completedStepsToday.length === 0 && (
                  <p className="db-empty">No steps completed yet.</p>
                )}
              </div>
            </div>

            {/* Residence */}
            <div className="db-card">
              <p className="db-section-eyebrow">Residence</p>
              <h2 className="db-section-title">Booked Room</h2>
              <div className="db-room">
                {roomImage ? (
                  <img src={roomImage} alt={unitLabel} className="db-room-img" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <div className="db-room-img db-room-img-empty">
                    <span>{Array.from(unitLabel)[0] || "R"}</span>
                  </div>
                )}
                <div>
                  <h3 className="db-room-name">{unitLabel}</h3>
                  <p className="db-room-meta">{roomMeta || "Residence confirmed"}</p>
                </div>
              </div>
            </div>

            {/* Payments */}
            <div className="db-card">
              <p className="db-section-eyebrow">Payments</p>
              <h2 className="db-section-title">Membership Fees</h2>
              <div className="db-pay-rows">
                <div className="db-pay-row">
                  <span>Security Deposit</span>
                  <b>{depositAmount} <em>Paid · {depositMethod}</em></b>
                </div>
                <div className="db-pay-row">
                  <span>First Month Rent</span>
                  <b>{rentAmount} <em>Paid · {rentMethod}</em></b>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </PageLayout>
  );
}