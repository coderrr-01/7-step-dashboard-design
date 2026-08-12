import PageLayout from "../components/PageLayout";
import ChatCard from "./Partial-element/Chatcard";
import { Link } from "react-router-dom";
import {
  FaFilePen,
  FaArrowRight,
  FaShieldHalved,
  FaCircleCheck,
  FaUserCheck,
} from "react-icons/fa6";
import "../assets/styles/home-style.css";

const overviewFields = [
  { label: "Full Name", value: "John Smith" },
  { label: "Email", value: "simonramsey@gmail.com" },
  { label: "Phone", value: "+1 (212) 555-0100" },
  { label: "Date of Birth", value: "12 Mar 1992" },
  { label: "Move-in Date", value: "01 Oct 2026" },
  { label: "Current Address", value: "123 Main St, New York, NY 10001" },
];

const sectionItems = [
  { name: "Personal Information", status: "ok", label: "Completed" },
  { name: "Contact Details", status: "ok", label: "Completed" },
  { name: "Employment & Income", status: "pending", label: "Pending" },
  { name: "Supporting Documents", status: "pending", label: "Pending" },
];

function OverviewPanel() {
  return (
    <aside className="home-overview">
      <div className="home-overview-head">
        <span className="home-overview-icon">
          <FaFilePen />
        </span>
        <div>
          <h2 className="home-overview-title">Application Overview</h2>
          <p className="home-overview-section">Personal Details</p>
        </div>
      </div>

      <div className="home-overview-note">
        <span className="home-overview-note-icon">
          <FaShieldHalved />
        </span>
        <p>
          You are completing the <strong>Personal Details</strong> section. Our
          systems will verify this information against your records.
        </p>
      </div>

      {/* <div className="home-overview-fields">
        {overviewFields.map((f) => (
          <div className="home-overview-field" key={f.label}>
            <span className="home-overview-label">{f.label}</span>
            <span className="home-overview-value">{f.value}</span>
          </div>
        ))}
      </div> */}

      {/* <ul className="home-overview-list">
        {sectionItems.map((item) => (
          <li
            key={item.name}
            className={`home-overview-item is-${item.status}`}
          >
            <span className="home-overview-item-icon">
              {item.status === "ok" ? <FaCircleCheck /> : <span className="home-overview-pending-dot"></span>}
            </span>
            <span className="home-overview-item-name">{item.name}</span>
            <span className="home-overview-item-label">{item.label}</span>
          </li>
        ))}
      </ul> */}

      <div className="home-overview-verified">
        <span className="home-overview-verified-dot"></span>
        <span className="home-overview-verified-label">Visa Status</span>
        <span className="home-overview-verified-value">Verified</span>
      </div>

      <Link to="/review" className="home-overview-cta">
        Continue Application
        <FaArrowRight />
      </Link>
    </aside>
  );
}

export default function Home() {
  return (
    <PageLayout page="Home">
      <main className="home-page-bg">
        <div className="home-ambient">
          <span className="home-blob home-blob-1"></span>
          <span className="home-blob home-blob-2"></span>
        </div>

        <div className="home-layout">
          <div className="home-chat-column">
            <ChatCard />
          </div>
          <div className="home-overview-column">
            <OverviewPanel />
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
