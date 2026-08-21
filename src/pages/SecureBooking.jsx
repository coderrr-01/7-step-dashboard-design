import { useState } from "react";
import PageLayout from "../components/PageLayout";
import ResidenceSlider from "./Partial-element/ResidenceSlider";
import Calendar from "./Partial-element/Calendar.jsx";
import InterviewSchedule from "./Partial-element/InterviewSchedule.jsx";
import Timeslot from "./Partial-element/Timeslot.jsx";
import { useNavigate } from 'react-router-dom';
import { useClientData } from "../hooks/useClientData";
import { secureBooking } from "../services/api";
import { toast } from "react-toastify";
import { useSteps } from "../context/StepContext";

export default function SecureBooking() {
   const navigate = useNavigate();
   const { client } = useClientData();
   const { completeStep } = useSteps();

   const viewroombtn = () => {
      navigate('/view-room');
   }

   // Load selected room from localStorage — same as Interview
   const selectedRoom = (() => {
      try { return JSON.parse(localStorage.getItem('jrny_selected_room') || 'null'); } catch { return null; }
   })();
   const roomName = selectedRoom?.name || client?.room_name || '';
   const roomId   = selectedRoom?.id   || client?.room_id   || '';

   const [interviewProgres, setinterviewProgres] = useState(false);
   const [Avalableresidence, setAvalableresidence] = useState(true);
   const [submitting, setSubmitting]     = useState(false);
   const [confirmedDate, setConfirmedDate] = useState('');
   const [confirmedTime, setConfirmedTime] = useState('');
   const [meetLink, setMeetLink]           = useState('');

   const interview_btn = () => {
      setinterviewProgres(true);
      setAvalableresidence(false);
   };

   const handleConfirm = async (selectedDate, selectedTime, onSuccess) => {
      if (!selectedDate || !selectedTime) {
         toast.error('Please select a date and time slot.');
         return;
      }
      // Defensive guard: never submit a past date, even if one is supplied
      // programmatically. selectedDate.value is "dd/mm/yyyy".
      const [dd, mm, yyyy] = String(selectedDate.value).split('/').map(Number);
      const picked = new Date(yyyy, (mm || 1) - 1, dd || 1);
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      if (picked < startOfToday) {
         toast.error('Please select today or a future date.');
         return;
      }
      setSubmitting(true);
      try {
         const res = await secureBooking({
            date: selectedDate.value,
            time: selectedTime,
            booking_type: 'Apartment Tour',
            client_id: client?.id || '',
         });

         if (res.success) {
            setConfirmedDate(selectedDate.label);
            setConfirmedTime(selectedTime);
            setMeetLink(res.meet_link || '');
            completeStep(5);
            toast.success('Booking secured successfully!');
            onSuccess();
         } else {
            toast.error(res.message || 'Booking failed. Please try again.');
         }
      } catch (e) {
         toast.error(e.message || 'Network error. Please try again.');
      } finally {
         setSubmitting(false);
      }
   };

   // Dynamic labels — same pattern as Interview
   const unitLabel = client ? (client.unit ? `Unit ${client.unit}` : roomName) : roomName;
   const rentLabel = client?.rent_amount ? `$${Number(client.rent_amount).toLocaleString()}/mo` : (selectedRoom?.monthly_rent ? `$${Number(selectedRoom.monthly_rent).toLocaleString()}/mo` : (selectedRoom?.price ? `$${Number(selectedRoom.price).toLocaleString()}/mo` : ''));

   return (
      <PageLayout page="SecureBooking">
         {Avalableresidence && (
            <main className="container-fluid py-5 px-lg-5 flex-grow-1 scheduling-section bg-field">
               <div className="container container-narrow ">
                   <div className="row mb-5">
                      <div className="col-lg-12">
                         <h1 className="display-4 serif-heading heading-hero mb-3 hero-title">Available Residences</h1>
                         <p className="mb-0 text-muted fs-5 heading-lead-wide">Browse our curated collection of heritage-preserved living spaces. Each residence has been meticulously restored to offer contemporary comfort within a historical framework.</p>
                      </div>
                   </div>
                  <section className="residency-card">
                     {/* Selected Residence Summary */}
                     <div className="selected-residence-header">
                        <span className="selected-badge">SELECTED</span>
                        <ResidenceSlider />
                        <div className="p-3 w-50 d-flex flex-column" data-purpose="residence-details">
                           <div className="d-flex justify-content-between setPricingblock">
                              <div>
                                 <h4 className="serif-font mb-0 residence-title">{unitLabel}</h4>
                                 <p className="mb-0 residence-meta">
                                    {selectedRoom?.roomNumber ? `${selectedRoom.roomNumber}` : ''}
                                    {selectedRoom?.floor ? ` • Floor ${selectedRoom.floor}` : ''}
                                    {selectedRoom?.unit_number ? ` • Unit ${selectedRoom.unit_number}` : ''}
                                    {selectedRoom?.size_sq_ft ? ` • ${selectedRoom.size_sq_ft} sq.ft` : ''}
                                    {selectedRoom?.status ? ` • ${selectedRoom.status}` : ''}
                                 </p>
                              </div>
                              <div className="text-end">
                                 <div className="fw-bold residence-price">{rentLabel}</div>
                                 <div className="residence-price-note">Inclusive of Concierge</div>
                              </div>
                           </div>
                           <div className="d-flex gap-4 mt-3 residence-features">
                              <span><i className="bi bi-snow2 text-gold me-1"></i> Climate Controlled</span>
                              <span><i className="bi bi-wifi text-gold me-1"></i> Gigabit Fiber</span>
                           </div>
                           <div className="mt-4">
                              <button className="btn btn-gold mb-2 w-50" onClick={viewroombtn}>View Room</button>
                           </div>
                        </div>
                     </div>
                     <InterviewSchedule
                        datatext="securePlaneblock"
                        interview_progress={interview_btn}
                        onConfirm={handleConfirm}
                        confirmedDate={confirmedDate}
                        confirmedTime={confirmedTime}
                        meetLink={meetLink}
                        submitting={submitting}
                        roomName={roomName}
                     />
                  </section>
               </div>
            </main>
         )}
         {interviewProgres && (
            <>
               <section className="step-header">
                  <div className="container-fluid">
                     <div className="container container-narrow">
                        <div className="row">
                           <div className="col-lg-8">
                              <h1 className="display-4 serif-heading heading-hero mb-3">In Review</h1>
                              <p className="mb-0 text-muted fs-5 heading-lead-wide">Our specialist committee is currently verifying your submitted documentation and identity credentials for the 2026 intake cycle.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
               <main className="container-xxl py-5 my-lg-5">
                  <div className="row align-items-center g-5">
                     <div className="col-md-5 text-center">
                        <div className="orbitCard">
                           <div className="orbit-loader">
                              <div className="orbit-ring"></div>
                              <div className="orbit-line">
                                 <span className="orbit-dot"></span>
                              </div>
                              <div className="center-circle">
                                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M8 8h8v8H8z" stroke="#B8944F" strokeWidth="2" />
                                    <path d="M6 6l12 12" stroke="#B8944F" strokeWidth="2" />
                                 </svg>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="col-md-7">
                        <div className="verification-card">
                           <div className="guilloche-corner">
                              <svg className="text-primary w-100 h-100" viewBox="0 0 100 100">
                                 <path d="M100 0 Q 80 0 80 20 Q 80 40 100 40" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
                                 <path d="M100 10 Q 85 10 85 25 Q 85 40 100 40" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
                              </svg>
                           </div>
                           <div className="mb-4">
                              <div className="d-flex align-items-center gap-3 mb-3">
                                 <span className="status-badge">Current Status: Booking Secured</span>
                                 <span className="ref-number">Ref: HR-2024-0892</span>
                              </div>
                              <h3 className="display-serif h2 mb-3">Tour Booking Confirmed</h3>
                              <p className="fs-5 text-muted lh-base">
                                 Your apartment tour has been secured. Our concierge will be ready to welcome you at the scheduled time.
                              </p>
                           </div>
                           <hr className="my-4 review-divider" />
                           <div className="mb-5">
                              {confirmedDate && confirmedTime && (
                                 <div className="d-flex align-items-start gap-3 mb-4">
                                    <span className="material-symbols-outlined text-primary-container">event</span>
                                    <div>
                                       <h4 className="h6 mb-1">Scheduled: {confirmedDate} at {confirmedTime}</h4>
                                       {meetLink && (
                                          <a href={meetLink} target="_blank" rel="noreferrer" className="small text-primary-container">
                                             Join Google Meet →
                                          </a>
                                       )}
                                    </div>
                                 </div>
                              )}
                              <div className="d-flex align-items-start gap-3 mb-4">
                                 <span className="material-symbols-outlined text-primary-container">k</span>
                                 <div>
                                    <h4 className="h6 mb-1">Next Step: Sign Your Lease</h4>
                                    <p className="text-muted small mb-0">After your tour, proceed to sign your lease agreement to secure your residence.</p>
                                 </div>
                              </div>
                              <div className="d-flex align-items-start gap-3">
                                 <span className="material-symbols-outlined text-primary-container">k</span>
                                 <div>
                                    <h4 className="h6 mb-1">Document Integrity</h4>
                                    <p className="text-muted small mb-0">Your uploaded files have been encrypted and stored in our secure private vault.</p>
                                 </div>
                              </div>
                           </div>
                           <div>
                              <button
                                 className="btn btn-jrny-dark w-100 shadow-lg"
                                 onClick={() => { completeStep(5); navigate('/document-sign'); }}
                              >
                                 Sign Lease
                              </button>
                           </div>
                        </div>
                        <p className="mt-4 text-center text-md-start fst-italic text-muted small">
                           "Preserving legacy through meticulous verification."
                        </p>
                     </div>
                  </div>
               </main>
            </>
         )}
      </PageLayout>
   );
}
