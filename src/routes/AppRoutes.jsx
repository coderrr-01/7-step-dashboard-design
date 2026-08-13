import { Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import DocumentSign from "../pages/DocumentSign";
import Interview from "../pages/Interview";
import PaymentScreen from "../pages/PaymentScreen";
import ResidenceAgreement from "../pages/ResidenceAgreement";
import Review from "../pages/Review";
import RoomSearch from "../pages/RoomSearch";
import SecureBooking from "../pages/SecureBooking";
import ViewRoom from "../pages/ViewRoom";
import Viewphoto from "../pages/Partial-element/Viewphoto";
import PageTransition from "../components/PageTransition";
import { isLoggedIn } from "../services/api";

function RequireAuth({ children }) {
  if (!isLoggedIn()) {
    const loginUrl = (window.jrnyData?.loginUrl) || 'https://wordpress-1608288-6566160.cloudwaysapps.com/login';
    window.parent.postMessage({ type: 'jrny_logout', loginUrl }, '*');
    window.location.replace(loginUrl);
    return null;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <PageTransition>
      <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/apply" element={<Navigate to="/" replace />} />
      <Route path="/document-sign" element={<RequireAuth><DocumentSign /></RequireAuth>} />
      <Route path="/interview" element={<RequireAuth><Interview /></RequireAuth>} />
      <Route path="/payment-screen" element={<RequireAuth><PaymentScreen /></RequireAuth>} />
      <Route path="/residence-agreement" element={<RequireAuth><ResidenceAgreement /></RequireAuth>} />
      <Route path="/review" element={<RequireAuth><Review /></RequireAuth>} />
      <Route path="/room-search" element={<RequireAuth><RoomSearch /></RequireAuth>} />
      <Route path="/secure-booking" element={<RequireAuth><SecureBooking /></RequireAuth>} />
      <Route path="/view-room" element={<RequireAuth><ViewRoom /></RequireAuth>} />
      <Route path="/Viewphoto" element={<RequireAuth><Viewphoto /></RequireAuth>} />
    </PageTransition>
  );
}
