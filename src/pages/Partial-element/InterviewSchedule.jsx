import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import Timeslot, { TIME_SLOTS } from "./Timeslot";
import { useNavigate } from 'react-router-dom';
import tourImg from "../../assets/images/tour-img.png";
import interviewImg from "../../assets/images/interview-img.png";

const WP_BASE = 'https://wordpress-1608288-6566160.cloudwaysapps.com/wp-json/jrny/v1';

// Today's date in the exact { label, value } shape the Calendar's onSelectDate
// emits, so the schedule opens with today already selected (and its slots
// fetched) without the user having to click. label e.g. "Aug 24, 2026",
// value "dd/mm/yyyy" — the format the booked-slots API expects.
const buildToday = () => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = now.getDate();
    const mo = now.getMonth();
    const yr = now.getFullYear();
    const padded = String(d).padStart(2, '0');
    const moPadded = String(mo + 1).padStart(2, '0');
    return { label: `${months[mo]} ${d}, ${yr}`, value: `${padded}/${moPadded}/${yr}` };
};

function InterviewSchedule({ interview_progress, datatext, onConfirm, onReschedule, confirmedDate, confirmedTime, meetLink, submitting, roomName }) {
    const [activeTab, setActiveTab] = useState("schedule");
    // Today is selected by default (Calendar already highlights today; this makes
    // it the real selected date so today's slots load on open).
    const [selectedDate, setSelectedDate] = useState(buildToday);
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [error, setError] = useState('');
    // Booking lifecycle: once confirmed, the schedule tab is locked; Reschedule
    // releases the old slot and reopens scheduling. slotsLoading/slotsError let
    // us distinguish "all slots booked" from a loading or failed fetch.
    const [booked, setBooked] = useState(false);
    const [lastBooked, setLastBooked] = useState(null);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const contentMap = {
        securePlaneblock: {
            img: tourImg,
            title: "Your Private Tour is Confirmed!",
            alt: "Private Tour",
            discription: "An exclusive viewing of your future residence has been scheduled. A concierge will be waiting at the grand entrance."
        },
        interview: {
            img: interviewImg,
            title: "Your Interview is Confirmed!",
            alt: "Interview Schedule",
            discription: "An exclusive viewing of your future residence has been scheduled. A concierge will be waiting at the grand entrance."

        },
    };

    const content = contentMap[datatext] || contentMap.interview;
    const navigate = useNavigate();

    useEffect(() => {
        if (!selectedDate) { setBookedSlots([]); return; }
        // `active` guards against a race: if the user switches dates quickly, the
        // cleanup flips it false so a slower earlier response can't overwrite the
        // slots for the newer date.
        let active = true;
        setSlotsLoading(true);
        setSlotsError('');
        setBookedSlots([]); // clear stale slots immediately so they never show for the new date
        fetch(`${WP_BASE}/booked-slots?date=${encodeURIComponent(selectedDate.value)}`)
            .then(r => r.json())
            .then(data => {
                if (!active) return;
                if (data.success) setBookedSlots(data.booked || []);
                else setSlotsError('Could not load slots.');
            })
            .catch(() => { if (active) setSlotsError('Could not load slots.'); })
            .finally(() => { if (active) setSlotsLoading(false); });
        return () => { active = false; };
    }, [selectedDate, refreshKey]);

    // True only when the fetch succeeded and every slot for the date is booked —
    // never during loading or after a failed request.
    const allSlotsBooked =
        !!selectedDate && !slotsLoading && !slotsError &&
        TIME_SLOTS.every((t) => bookedSlots.includes(t));

    const handleConfirmClick = () => {
        if (!selectedDate || !selectedTime) {
            setError('Please select a date and time slot.');
            return;
        }
        setError('');
        if (onConfirm) {
            onConfirm(selectedDate, selectedTime, () => {
                // Lock the confirmed state and remember the exact slot so it can
                // be released if the user reschedules.
                setBooked(true);
                setLastBooked({ date: selectedDate.value, time: selectedTime });
                setActiveTab("confirm");
            });
        } else {
            setActiveTab("confirm");
        }
    };

    // Reschedule: release the previously booked slot server-side, then return to
    // scheduling with a fresh booked-slots fetch so the old slot is selectable.
    const handleReschedule = async () => {
        if (lastBooked && onReschedule) {
            try { await onReschedule(lastBooked); } catch { /* non-blocking */ }
        }
        setBooked(false);
        setLastBooked(null);
        setSelectedTime(null);
        // Reset the selected date back to today so the "AVAILABLE SLOTS FOR ..."
        // heading and the fetched slots reflect today (matching the freshly
        // remounted Calendar, which highlights today) instead of the previously
        // booked date.
        setSelectedDate(buildToday());
        setActiveTab("schedule");
        setRefreshKey((k) => k + 1);
    };

    const leasebtn = () => {
        navigate('/document-sign');
    }
    const securebtn = () => {
        navigate('/secure-booking');
    }
    return (
        <div>
            {/* Tabs */}
            <div className="scheduling-tabs">
                <div
                    className={`tab-item ${activeTab === "schedule" ? "active" : ""}`}
                    onClick={() => { if (booked) return; setActiveTab("schedule"); }}
                    style={{ cursor: booked ? 'not-allowed' : 'pointer' }}
                    aria-disabled={booked ? 'true' : undefined}
                >
                    <i className="bi bi-calendar3 fs-5"></i>
                    {
                        datatext === "securePlaneblock"
                            ?
                            "SCHEDULE ROOM TOUR"
                            :
                            "SCHEDULE INTERVIEW"
                    }
                </div>
                <div
                    className={
                        `tab-item ${activeTab === "confirm" ? "active" : ""}`
                    }
                >
                    <i className="bi bi-check-circle fs-5"></i>
                    CONFIRMED!
                </div>
            </div>
            <div className="tab-content">
                {
                    activeTab === "schedule" && (
                        <div className="tab_schedule_room">
                            <div className="row">
                                <div className="col-md-6 pe-md-4">
                                    <Calendar onSelectDate={(d) => { setSelectedDate(d); setError(''); }} />
                                </div>
                                {/* Slots */}
                                <div className="col-md-6 ps-md-2 mt-4 mt-md-0">
                                    <h6 className="slots-heading">
                                        AVAILABLE SLOTS FOR {selectedDate ? selectedDate.label : 'TODAY'}
                                    </h6>
                                    {slotsLoading ? (
                                        <p className="text-muted small mb-3">Loading available slots…</p>
                                    ) : (
                                        <Timeslot
                                            selectedTime={selectedTime}
                                            onSelectTime={(t) => { setSelectedTime(t); setError(''); }}
                                            bookedSlots={bookedSlots}
                                        />
                                    )}
                                    {allSlotsBooked && (
                                        <p className="text-danger small mb-2">All slots are booked for this date. Please select another date.</p>
                                    )}
                                    {error && <p className="text-danger small mb-2">{error}</p>}
                                    <button
                                        className="btn btn-gold mb-2 mt-3"
                                        onClick={handleConfirmClick}
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Booking...' : 'Confirm Time Slot'}
                                    </button>
                                    <div className="divider-text">
                                        OR
                                    </div>
                                    <button type="button" className="btn btn-black" onClick={leasebtn}>
                                        SIGN LEASE NOW
                                        <i className="bi bi-arrow-right"></i>
                                    </button>
                                    <div className="text-center mt-3 tour-note">
                                        Proceeds directly to step 6 (Lease Signing).
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    activeTab === "confirm" && (
                        <div className="tab_confirm-roomtour">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="confirmation-card">
                                        <div className="img-set-info">
                                            <img src={content.img} alt={content.alt} />
                                        </div>

                                        <h2 className="conf-title">
                                            {content.title}
                                        </h2>
                                        <p className="text-muted small">{content.discription}</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="conf-details-table mb-4">
                                        <div className="detail-row">
                                            <span className="detail-label">
                                                Date
                                            </span>
                                            <span className="detail-value">
                                                {confirmedDate || (selectedDate ? selectedDate.label : '')}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">
                                                Time
                                            </span>
                                            <span className="detail-value">
                                                {confirmedTime || selectedTime || ''}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">
                                                Room
                                            </span>
                                            <span className="detail-value">
                                                {roomName || ''}
                                            </span>
                                        </div>
                                    </div>
                                    {meetLink ? (
                                        <a href={meetLink} target="_blank" rel="noreferrer" className="btn btn-whatsapp mb-3 d-inline-block">
                                            <i className="bi bi-whatsapp me-2"></i>
                                            Join Google Meet
                                        </a>
                                    ) : (
                                        <button type="button" className="btn btn-whatsapp mb-3" onClick={interview_progress}>
                                            <i className="bi bi-whatsapp me-2"></i>
                                            Interview with Najat
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="btn btn-black mb-3"
                                        onClick={handleReschedule}
                                    >
                                        Reschedule
                                    </button>
                                    {/* "Secure Booking Now" belongs only to the Interview
                                        Booking context. This component is shared: the Secure
                                        Booking page renders it with datatext="securePlaneblock",
                                        and in that case the button must not appear. */}
                                    {datatext !== "securePlaneblock" && (
                                        <button
                                            type="button"
                                            className="btn btn-black mobile-view-btn"
                                            onClick={securebtn}
                                        >
                                            SECURE BOOKING NOW
                                            <i className="bi bi-arrow-right"></i>
                                        </button>
                                    )}
                                    <div className="divider-text">
                                        OR
                                    </div>
                                    <button type="button" onClick={leasebtn} className="btn btn-black">
                                        SIGN LEASE NOW
                                        <i className="bi bi-arrow-right"></i>
                                    </button>
                                    <div className="text-center mt-2 tour-note">
                                        Proceeds directly to step 6 (Lease Signing).
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
export default InterviewSchedule;