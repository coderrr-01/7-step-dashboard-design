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

export default function Review() {
   const data = verificationData;
   const status = data.status;

   const showDashboard =
      status === "pending" ||
      status === "in-progress" ||
      status === "action-required";

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

               {status === "completed" ? (
                  <VerificationComplete data={data} />
               ) : status === "failed" ? (
                  <VerificationFailed data={data} />
               ) : (
               <>
                  <ApplicationOverview data={data} />

                  <div className={`verification-grid ${status === "action-required" ? "has-action" : ""}`}>
                        <VerificationStatus data={data} />
                        <VerificationProgress data={data} />
                        {status === "action-required" && (
                           <VerificationActionRequired data={data} />
                        )}
                        <CurrentVerification data={data} />
                        <VerificationChecklist data={data} />
                     </div>

                     {/* <VerificationTimeline data={data} /> */}

                     <div className="verification-grid-bottom">
                        <ReviewTimeline data={data} />
                        <TrustSecurity />
                     </div>
                  </>
               )}
            </div>
         </main>
      </PageLayout>
   );
}
