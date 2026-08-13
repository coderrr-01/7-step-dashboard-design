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
import { getApplicationStatus } from "../services/api";
import { useClientData } from "../hooks/useClientData";

export default function Review() {
   const navigate = useNavigate();
   const { completeStep } = useSteps();
   const { client } = useClientData();
   const [status, setStatus]     = useState('Submitted');
   const [approved, setApproved] = useState(false);
   const [loading, setLoading]   = useState(true);
   const pollRef = useRef(null);

   const fetchStatus = async () => {
      try {
         const res = await getApplicationStatus();
         if (res.success) {
            setStatus(res.status || 'Submitted');
            setApproved(!!res.approved);
            if (res.approved) {
               clearInterval(pollRef.current);
               completeStep(2);
            }
         }
      } catch {}
      finally { setLoading(false); }
   };

   useEffect(() => {
      fetchStatus();
      pollRef.current = setInterval(fetchStatus, 15000);
      return () => clearInterval(pollRef.current);
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleNext = () => {
      completeStep(2);
      navigate('/room-search');
   };

   // Merge server status + client data over the static mock so the new UI stays data-driven
   const data = {
      ...verificationData,
      status: approved ? 'completed' : verificationData.status,
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
