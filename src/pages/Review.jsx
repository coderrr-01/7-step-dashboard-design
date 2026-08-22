import { useEffect, useState, useRef } from "react";
import PageLayout from "../components/PageLayout";
import ApplicationOverview from "../components/review/ApplicationOverview";
import VerificationHeader from "../components/review/VerificationHeader";
import VerificationStatus from "../components/review/VerificationStatus";
import VerificationProgress from "../components/review/VerificationProgress";
import VerificationChecklist from "../components/review/VerificationChecklist";
import CurrentVerification from "../components/review/CurrentVerification";
import VerificationTimeline from "../components/review/VerificationTimeline";
import ReviewTimeline from "../components/review/ReviewTimeline";
import VerificationComplete from "../components/review/VerificationComplete";
import VerificationActionRequired from "../components/review/VerificationActionRequired";
import VerificationFailed from "../components/review/VerificationFailed";
import TrustSecurity from "../components/review/TrustSecurity";
import { verificationData } from "../components/review/verificationData";
import "../components/review/review.css";
import { useNavigate } from "react-router-dom";
import { useSteps } from "../context/StepContext";
import { getApplicationStatus, getUserSub } from "../services/api";
import { useClientData } from "../hooks/useClientData";

export default function Review() {
   const navigate = useNavigate();
   const { completeStep } = useSteps();
   const { client } = useClientData();
   const [status, setStatus]     = useState('Submitted');
   const [approved, setApproved] = useState(false);
   const [loading, setLoading]   = useState(true);
   const pollRef = useRef(null);

   // ── Stable, user-scoped Application ID ──────────────────────────────────────
   // Generated exactly once per user and persisted, so it never regenerates on
   // render/remount/refresh/logout-login, and VerificationProgress/Status and
   // VerificationComplete all show the same value. Scoped by the existing user
   // sub so it never leaks between users on a shared browser.
   const [applicationId] = useState(() => {
      const sub = getUserSub();
      const key = sub ? `jrny_application_id_${sub}` : null;
      if (!key) return '';
      try {
         const existing = localStorage.getItem(key);
         if (existing) return existing;
         const rand = (Math.random().toString(36) + Math.random().toString(36))
            .replace(/[^a-z0-9]/gi, '').slice(0, 9).toUpperCase();
         const gen = `APP-${rand}`;
         localStorage.setItem(key, gen);
         return gen;
      } catch { return ''; }
   });

   // ── "Verified On" date ──────────────────────────────────────────────────────
   // Set ONCE to the current date at the moment approval is first detected, then
   // persisted (user-scoped) and reused. Empty until approved.
   const [verifiedOn, setVerifiedOn] = useState(() => {
      const sub = getUserSub();
      const key = sub ? `jrny_verified_on_${sub}` : null;
      if (!key) return '';
      try { return localStorage.getItem(key) || ''; } catch { return ''; }
   });

   // User-scoped cache key — User A's approval never leaks to User B
   const statusCacheKey = () => {
      const sub = getUserSub();
      return sub ? `jrny_application_status_${sub}` : null;
   };

   const getCachedApproved = () => {
      const key = statusCacheKey();
      if (!key) return false;
      try {
         const raw = localStorage.getItem(key);
         if (!raw) return false;
         const parsed = JSON.parse(raw);
         return !!parsed && parsed.status === "Approved";
      } catch {
         return false;
      }
   };

   const saveCachedApproved = () => {
      const key = statusCacheKey();
      if (!key) return;
      try {
         localStorage.setItem(key, JSON.stringify({ status: "Approved" }));
      } catch {}
   };

   const fetchStatus = async () => {
      try {
         const res = await getApplicationStatus();
         if (res.success) {
            setStatus(res.status || 'Submitted');
            setApproved(!!res.approved);
            if (res.approved) {
               clearInterval(pollRef.current);
               saveCachedApproved();
               completeStep(2);
            }
         }
      } catch {}
      finally { setLoading(false); }
   };

   useEffect(() => {
      // Already approved for THIS user/application — use cached status,
      // do not keep polling Zoho for the same approved application.
      if (getCachedApproved()) {
         setStatus('Approved');
         setApproved(true);
         setLoading(false);
         completeStep(2);
         return;
      }

      fetchStatus();
      pollRef.current = setInterval(fetchStatus, 15000);
      return () => clearInterval(pollRef.current);
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // Stamp the Verified On date once, only after approval is actually detected.
   useEffect(() => {
      if (!approved || verifiedOn) return;
      const sub = getUserSub();
      const key = sub ? `jrny_verified_on_${sub}` : null;
      const now = new Date().toISOString();
      if (key) { try { localStorage.setItem(key, now); } catch {} }
      setVerifiedOn(now);
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [approved]);

   const handleNext = () => {
      completeStep(2);
      navigate('/room-search');
   };

   // Merge server status + client data over the static mock so the new UI stays data-driven
   const data = {
      ...verificationData,
      status: approved ? 'completed' : verificationData.status,
      // Dynamic, non-static values (no mock fallbacks):
      applicationId: applicationId,                 // stable per-user ID
      submittedAt:   client?.submitted_at || '',    // Zoho Created_Time (Submitted)
      lastUpdated:   verifiedOn || '',              // Verified On (set at approval)
      applicant: {
         ...verificationData.applicant,
         fullName:       client?.name || verificationData.applicant.fullName,
         email:          client?.email || verificationData.applicant.email,
         phone:          client?.phone || verificationData.applicant.phone,
         dateOfBirth:    client?.date_of_birth || verificationData.applicant.dateOfBirth,
         moveInDate:     client?.move_in_date || verificationData.applicant.moveInDate,
         currentAddress: client?.current_address || verificationData.applicant.currentAddress,
         employmentStatus: client?.employment_status || verificationData.applicant.employmentStatus,
         monthlyIncome:  client?.monthly_income ? `$${client.monthly_income}` : verificationData.applicant.monthlyIncome,
         message:        client?.message || verificationData.applicant.message,
      },
   };

   const showDashboard =
      data.status === "pending" ||
      data.status === "in-progress" ||
      data.status === "action-required";

   return (
      <PageLayout page="Review">
         <main className="review-page-bg">
            <div className="review-ambient">
               <span className="rev-blob rev-blob-1"></span>
               <span className="rev-blob rev-blob-2"></span>
               <span className="rev-blob rev-blob-3"></span>
               <span className="rev-grid"></span>
               <span className="rev-spark rev-spark-1"></span>
               <span className="rev-spark rev-spark-2"></span>
               <span className="rev-spark rev-spark-3"></span>
               <span className="rev-spark rev-spark-4"></span>
               <span className="rev-spark rev-spark-5"></span>
            </div>

            <div className="verification-center">
               <VerificationHeader />

               {approved ? (
                  <VerificationComplete data={data} />
               ) : data.status === "failed" ? (
                  <VerificationFailed data={data} />
               ) : (
               <>
                  <ApplicationOverview data={data} />

                  <div className={`verification-grid ${data.status === "action-required" ? "has-action" : ""}`}>
                        <VerificationStatus data={data} />
                        <VerificationProgress data={data} />
                        {data.status === "action-required" && (
                           <VerificationActionRequired data={data} />
                        )}
                        <CurrentVerification data={data} />
                        <VerificationChecklist data={data} />
                     </div>

                     <div className="verification-grid-bottom">
                        <ReviewTimeline data={data} />
                        <TrustSecurity />
                     </div>

                     {!approved && (
                        <p className="ver-complete-sub text-center mt-4 mb-0">
                           Checking automatically every 15 seconds.
                        </p>
                     )}
                     {approved && (
                        <button className="btn btn-jrny-dark w-100 shadow-lg mt-4" onClick={handleNext}>
                           Continue to Room Search
                        </button>
                     )}
                  </>
               )}
            </div>
         </main>
      </PageLayout>
   );
}
