import { useState } from "react";
import PageLayout from "../components/PageLayout";
import ChatCard from "./Partial-element/Chatcard";

export default function Home() {
   const [message, setMessage] = useState("");
   const [messages, setMessages] = useState([]);
   const sendMessage = () => {
      const text = message.trim();
      if (!text) return;
      setMessages((items) => [...items, { text, type: "user" }, { text: "Thanks for your message. How can I help you?", type: "bot" }]);
      setMessage("");
   };
   return (
      <PageLayout page="Home">
         <main className="container-fluid py-5 px-lg-5 flex-grow-1 bg-field">
            <div className="container container-narrow homepage-screen">
               <div className="row g-5">
                  <div className="col-lg-8">
                     <div className="mb-5">
                        <h1 className="display-4 serif-heading heading-hero hero-title mb-3">Apply to Stay with Journey</h1>
                        <p className="lead text-secondary heading-lead">Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
                     </div>
                     <ChatCard />
                  </div>
                  <div className="col-lg-4">
                     <div className="d-flex flex-column gap-4 revrese-column">
                        <div className=" application-view ">
                           <div className="d-flex gap-3 mb-4 align-items-center">
                              <div className="p-3 rounded-3 badges-icon">
                                 <svg fill="none" height="24" stroke="currentColor" viewBox="0 0 24 24" width="24">
                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                 </svg>
                              </div>
                              <div>
                                 <h4 className="serif-heading h5 mb-1">Application overview</h4>
                              </div>
                           </div>
                           <div className="p-3 mb-4 rounded-3 border application-view-highlight">
                              <p>
                                 You are currently completing the <span className="fw-bold text-dark">Personal Details</span> section. Our systems will verify this information against your passport records.
                              </p>
                           </div>
                           <div className="d-flex justify-content-between verified-status align-items-center pt-3 ">
                              <span className="text-label-uppercase">Visa Status</span>
                              <div className="d-flex align-items-center gap-1">
                                 <div className="verified-dot"></div>
                                 <span className="text-verified">Verified</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="mt-4">
                        <a href="/review"><button className="btn btn-jrny-dark w-100 shadow-lg">
                           Next
                        </button>
                        </a>
                     </div>

                  </div>
               </div>
            </div>
         </main>

      </PageLayout>
   );
}
