import { useState } from "react";
import Calendar from "./Calendar";
import Timeslot from "./Timeslot";
import { useNavigate } from 'react-router-dom';
import tourImg from "../../assets/images/tour-img.png";
import interviewImg from "../../assets/images/interview-img.png";
function InterviewSchedule({ interview_progress, datatext }) {
    const [activeTab, setActiveTab] = useState("schedule");
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


    const leasebtn = () => {
        navigate('/document-sign');
    }
    return (
        <div>
            {/* Tabs */}
            <div className="scheduling-tabs">
                <div className={`tab-item ${activeTab === "schedule" ? "active" : ""}`} onClick={() => setActiveTab("schedule")}>
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
                                    <Calendar />
                                </div>
                                {/* Slots */}
                                <div className="col-md-6 ps-md-2 mt-4 mt-md-0">
                                    <h6 className="slots-heading">
                                        AVAILABLE SLOTS FOR OCT 10
                                    </h6>
                                    <Timeslot />
                                    <button
                                        className="btn btn-gold mb-2"
                                        onClick={() => setActiveTab("confirm")}
                                    >
                                        Confirm Time Slot
                                    </button>
                                    <div className="divider-text">
                                        OR
                                    </div>
                                    <button type="button" className="btn btn-black" onClick={leasebtn}>
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
                                                Oct 14, 2024
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">
                                                Time
                                            </span>
                                            <span className="detail-value">
                                                02:00 PM
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">
                                                Room
                                            </span>
                                            <span className="detail-value">
                                                The Victorian Premier
                                            </span>
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-whatsapp mb-3" onClick={interview_progress}>
                                        <i className="bi bi-whatsapp me-2"></i>
                                        Interview with Najat
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-black"
                                        onClick={() => setActiveTab("schedule")}
                                    >
                                        Reschedule
                                    </button>
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