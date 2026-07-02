import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import DocumentSign from "../pages/DocumentSign";
import Interview from "../pages/Interview";
import PaymentScreen from "../pages/PaymentScreen";
import ResidenceAgreement from "../pages/ResidenceAgreement";
import Review from "../pages/Review";
import RoomSearch from "../pages/RoomSearch";
import SecureBooking from "../pages/SecureBooking";
import ViewRoom from "../pages/ViewRoom";
import { ToastContainer } from "react-toastify";
import Viewphoto from "../pages/Partial-element/Viewphoto";

export default function AppRoutes() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/document-sign" element={<DocumentSign />} />
    <Route path="/interview" element={<Interview />} />
    <Route path="/payment-screen" element={<PaymentScreen />} />
    <Route path="/residence-agreement" element={<ResidenceAgreement />} />
    <Route path="/review" element={<Review />} />
    <Route path="/room-search" element={<RoomSearch />} />
    <Route path="/secure-booking" element={<SecureBooking />} />
    <Route path="/view-room" element={<ViewRoom />} />
    <Route path="/Viewphoto" element={<Viewphoto />} />

  </Routes> ;
   
}

