import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Calendar from "./Partial-element/Calendar";
import { IoArrowBack } from "react-icons/io5";
import { useState, useEffect } from "react";

export default function ViewRoom() {
   const navigate = useNavigate();
   const [room, setRoom] = useState(null);
   const [mainImg, setMainImg] = useState(0);

   useEffect(() => {
      const saved = localStorage.getItem('jrny_selected_room');
      if (saved) {
         try { setRoom(JSON.parse(saved)); }
         catch { navigate('/room-search'); }
      } else {
         navigate('/room-search');
      }
   }, []);

   if (!room) return null;

   // Support both the new catalogue shape and the old WP /rooms shape.
   // Images may be separated by commas, newlines, or both.
   const splitImages = (val) =>
      typeof val === 'string'
         ? val.split(/[,\n]/).map((u) => u.trim()).filter(Boolean)
         : [];
   const rawImages = Array.isArray(room.images)
      ? room.images.flatMap((img) => splitImages(img))
      : splitImages(room.images);
   const images = rawImages.length
      ? rawImages
      : [room.img || ''];
   const roomType = room.room_type || room.tier || '';
   const roomNumber = room.roomNumber || (room.unit_number ? `Unit ${room.unit_number}` : '');
   const roomName = room.name || '';
   const roomDesc = room.size_sq_ft
      ? `${room.size_sq_ft} sq. ft. living space`
      : (room.description || room.desc || '');
   const rentValue = Number(room.monthly_rent ?? room.price ?? 0);
   const monthlyRent = rentValue.toLocaleString('en-US', { minimumFractionDigits: 2 });
   const depositAmt = (room.security_deposit != null ? Number(room.security_deposit) : rentValue ).toLocaleString('en-US', { minimumFractionDigits: 2 });
   // const holdingDeposit = (room.security_deposit != null ? Number(room.security_deposit) * 0.5 : rentValue * 0.5).toLocaleString('en-US', { minimumFractionDigits: 2 });

   const agreementType = room.agreement_type || '';

    const aboutRoom = Array.isArray(room.about_your_room) ? room.about_your_room : [];
    const aboutApt = Array.isArray(room.about_apartment) ? room.about_apartment : [];
    const premiumAmenities = Array.isArray(room.premium_amenities) ? room.premium_amenities : [];

   return (
      <PageLayout page="ViewRoom">
         <main className="container-fluid py-5 px-lg-5 flex-grow-1 bg-field">
            <div className="container container-narrow">
               <div className=" flex-direction_change d-flex justify-content-between align-items-start mb-4">
                  <div data-purpose="page-intro">
                     <h1 className="display-4 serif-heading heading-hero mb-3 hero-title">Secure Your Residency</h1>
                  </div>
                  <Link to="/room-search"><button className="back-btn"><IoArrowBack /> BACK</button></Link>
               </div>
               <div className="row g-4">
                  <div className="col-xl-8">
                     <div className="row g-4">
                        <div className="col-12">
                           <div className="parchment-card p-4">
                              <div className="position-relative mb-4">
                                  <img alt="Main" className="w-100 gallery-main shadow-sm" src={images[mainImg]} />
                                   <Link to="/Viewphoto">
                                   {/* <button className="view-all-btn btn d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined fs-6">
<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5443 12.5443V9.66667H9.66667V12.5443H12.5443ZM8.21094 8.21094H14V14H8.21094V8.21094ZM12.5443 5.33333V2.45573H9.66667V5.33333H12.5443ZM8.21094 1H14V6.78906H8.21094V1ZM5.33333 12.5443V9.66667H2.45573V12.5443H5.33333ZM1 8.21094H6.78906V14H1V8.21094ZM5.33333 5.33333V2.45573H2.45573V5.33333H5.33333ZM1 1H6.78906V6.78906H1V1Z" fill="#B8924A"/>
</svg>
</span>
                                    VIEW ALL PHOTOS
                                 </button> */}
                                 </Link>
                              </div>
                              <div className="row g-3">
                                  <div className="col-lg-3 col-sm-6 col-6">
                                     <img alt="Thumb 1" className="w-100 gallery-thumb" src={images[0]} onClick={() => setMainImg(0)} style={{ cursor: 'pointer' }} />
                                  </div>
                                  <div className="col-lg-3 col-sm-6 col-6">
                                     <img alt="Thumb 2" className="w-100 gallery-thumb" src={images[1] || images[0]} onClick={() => setMainImg(1)} style={{ cursor: 'pointer' }} />
                                  </div>
                                  <div className="col-lg-3 col-sm-6 col-6">
                                     <img alt="Thumb 3" className="w-100 gallery-thumb" src={images[2] || images[0]} onClick={() => setMainImg(2)} style={{ cursor: 'pointer' }} />
                                  </div>
                                   <div className="col-lg-3 col-sm-6 col-6">
                                         <img alt="Thumb 4" className="w-100 gallery-thumb" src={images[3] || images[0]} onClick={() => setMainImg(3)} style={{ cursor: 'pointer' }} />
                                   </div>
                              </div>
                           </div>
                        </div>
                        {/* About Sections */}
                        <div className="col-md-6">
                           <div className="parchment-card">
                              <h3 className="h5 mb-4 border-bottom pb-2 text-primary">About Your Room</h3>
                               {aboutRoom.map((item, i) => (
                                    <div className={i < aboutRoom.length - 1 ? "d-flex mb-4" : "d-flex"} key={i}>
                                       {item.icon ? (
                                          <img src={item.icon} alt={item.heading || ''} width="30" height="30" className="me-3 align-self-start" style={{ objectFit: 'contain' }} />
                                       ) : (
                                          <span className="material-symbols-outlined text-primary me-3">
                                             <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M23.4131 12.1141V7.81879H16.3803V12.1141H23.4131ZM13.6197 12.1141V7.81879H6.58685V12.1141H13.6197ZM26.2394 12.1141C26.9844 12.1141 27.6307 12.4049 28.1784 12.9866C28.7261 13.5682 29 14.2394 29 15V22.1812H27.1596L26.2394 25H24.7934L23.8732 22.1812H6.12676L5.20657 25H3.76056L2.84038 22.1812H1V15C1 14.2394 1.27387 13.5682 1.8216 12.9866C2.36933 12.4049 3.01565 12.1141 3.76056 12.1141V7.81879C3.76056 7.05817 4.04538 6.39821 4.61502 5.83893C5.18466 5.27964 5.84194 5 6.58685 5H23.4131C24.1581 5 24.8153 5.27964 25.385 5.83893C25.9546 6.39821 26.2394 7.05817 26.2394 7.81879V12.1141Z" fill="#B8924A"/>
                                             </svg>
                                          </span>
                                       )}
                                       <div>
                                          <div className="fw-bold mb-1">{item.heading || ''}</div>
                                          <div className="small text-muted">{item.des || ''}</div>
                                       </div>
                                    </div>
                                 ))}
                           </div>
                        </div>
                        <div className="col-md-6">
                           <div className="parchment-card">
                              <h3 className="h5 mb-4 border-bottom pb-2 text-primary">About The Apartment</h3>
                               {aboutApt.map((item, i) => (
                                    <div className={i < aboutApt.length - 1 ? "d-flex mb-4" : "d-flex"} key={i}>
                                       {item.icon ? (
                                          <img src={item.icon} alt={item.heading || ''} width="30" height="30" className="me-3 align-self-start" style={{ objectFit: 'contain' }} />
                                       ) : (
                                          <span className="material-symbols-outlined text-primary me-3">
                                             <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22.3724 18.679V16.5556H20.2943V18.679H22.3724ZM22.3724 22.8765V20.8025H20.2943V22.8765H22.3724ZM16.0391 10.2346V8.16049H13.9609V10.2346H16.0391ZM16.0391 14.4815V12.358H13.9609V14.4815H16.0391ZM16.0391 18.679V16.5556H13.9609V18.679H16.0391ZM16.0391 22.8765V20.8025H13.9609V22.8765H16.0391ZM9.70573 14.4815V12.358H7.6276V14.4815H9.70573ZM9.70573 18.679V16.5556H7.6276V18.679H9.70573ZM9.70573 22.8765V20.8025H7.6276V22.8765H9.70573ZM18.1667 14.4815H24.5V25H5.5V10.2346H11.8333V8.16049L15 5L18.1667 8.16049V14.4815Z" fill="#B8924A"/>
                                             </svg>
                                          </span>
                                       )}
                                       <div>
                                          <div className="fw-bold mb-1">{item.heading || ''}</div>
                                          <div className="small text-muted">{item.des || ''}</div>
                                       </div>
                                    </div>
                                 ))}
                           </div>
                        </div>
                        <div className="col-12">
                           <div className="parchment-card">
                              <h3 className="h5 mb-4 text-primary">Premium Amenities</h3>
                              {premiumAmenities.length > 0 ? (
                                 <div className="row text-center">
                                    {premiumAmenities.map((item, i) => (
                                       <div className="col-6 col-md-3 mb-4" key={i}>
                                          <div className="amenity-icon">
                                             {item.icon ? (
                                                <img src={item.icon} alt={item.amenities || ''} width="30" height="30" style={{ objectFit: 'contain' }} />
                                             ) : (
                                                <span className="material-symbols-outlined">
                                                   <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M12 2l2.4 6.6H21l-5.4 4 2 6.6-5.6-4-5.6 4 2-6.6-5.4-4h6.6z" fill="#B8924A"/>
                                                   </svg>
                                                </span>
                                             )}
                                          </div>
                                          <span className="amenity-text">{item.amenities || ''}</span>
                                       </div>
                                    ))}
                                 </div>
                              ) : (
                                 <div className="text-muted">No amenities available.</div>
                              )}
                           </div>
                        </div>

                        {/* Calendar */}
                        {/* <div className="col-12">
                           <div className="parchment-card">
                              <div className="d-flex justify-content-between align-items-center mb-4">
                                 <h3 className="h5 mb-0 text-primary">Select Preferred Move-in Date</h3>
                              </div>
                              <Calendar />
                              <div className="info-box d-flex align-items-start gap-3">
                                 <span className="material-symbols-outlined text-primary fs-5">
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_120_220)">
<path d="M10 0C4.47301 0 0 4.4725 0 10C0 15.5269 4.4725 20 10 20C15.527 20 20 15.5275 20 10C20 4.47309 15.5275 0 10 0ZM11.0269 13.9696C11.0269 14.2855 10.5662 14.6014 10.0002 14.6014C9.40785 14.6014 8.98668 14.2855 8.98668 13.9696V8.95445C8.98668 8.5859 9.40789 8.33574 10.0002 8.33574C10.5662 8.33574 11.0269 8.5859 11.0269 8.95445V13.9696ZM10.0002 7.12484C9.39473 7.12484 8.9209 6.6773 8.9209 6.17707C8.9209 5.67687 9.39477 5.2425 10.0002 5.2425C10.5926 5.2425 11.0665 5.67687 11.0665 6.17707C11.0665 6.6773 10.5925 7.12484 10.0002 7.12484Z" fill="#B8924A"/>
</g>
<defs>
<clipPath id="clip0_120_220">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>

<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_120_220)">
<path d="M10 0C4.47301 0 0 4.4725 0 10C0 15.5269 4.4725 20 10 20C15.527 20 20 15.5275 20 10C20 4.47309 15.5275 0 10 0ZM11.0269 13.9696C11.0269 14.2855 10.5662 14.6014 10.0002 14.6014C9.40785 14.6014 8.98668 14.2855 8.98668 13.9696V8.95445C8.98668 8.5859 9.40789 8.33574 10.0002 8.33574C10.5662 8.33574 11.0269 8.5859 11.0269 8.95445V13.9696ZM10.0002 7.12484C9.39473 7.12484 8.9209 6.6773 8.9209 6.17707C8.9209 5.67687 9.39477 5.2425 10.0002 5.2425C10.5926 5.2425 11.0665 5.67687 11.0665 6.17707C11.0665 6.6773 10.5925 7.12484 10.0002 7.12484Z" fill="#B8924A"/>
</g>
<defs>
<clipPath id="clip0_120_220">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>
</span>
                                 <p className="mb-0">Standard institutional residency terms begin on the 1st or 15th of the month. Preferred move-in dates are subject to availability.</p>
                              </div>
                           </div>
                        </div> */}
                     </div>
                  </div>
                  {/* Right Column: Sidebar */}
                  <div className="col-xl-4 h-100">
                     <div className="parchment-card summary-card shadow-lg p-4">
                        <h2 className="h4 text-primary mb-4">Booking Summary</h2>
                        <div className="mb-4">
                           <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="small text-muted text-uppercase fw-bold summary-label">Unit Specification</span>
                              {/* <a className="small text-primary text-decoration-underline" href="#">Change</a> */}
                           </div>
                            <div className="h6 fw-bold mb-0">{roomName}, {roomNumber}</div>
                         </div>
                         <div className="mb-4">
                            <span className="small text-muted text-uppercase fw-bold d-block mb-1 summary-label">Agreement Type</span>
                               <div className="h6 mb-0">{agreementType}</div>
                         </div>
                         <hr className="my-4 opacity-10" />
                         <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
                            <span className="fw-bold">Monthly Residency Rate</span>
                            <span className="h5 mb-0 fw-bold text-primary">${monthlyRent}</span>
                         </div>
                         <div className="d-flex justify-content-between align-items-center mb-4">
                            <span className="fw-bold">Holding Deposit</span>
                            <span className="h5 mb-0 fw-bold text-muted">${depositAmt}</span>
                         </div>
                        <div className="d-grid gap-3 mb-4">
                           {/* <button className="btn btn-primary-elite">Lock In Residency</button> */}
                           <Link to="/interview"><button className="btn btn-outline-elite">Schedule Interview</button></Link>
                        </div>
                        <p className="text-center small text-muted text-uppercase mb-0 summary-disclaimer">
                           By clicking 'Lock In', you agree to the preliminary institutional residency terms and the immediate payment of the holding deposit.
                        </p>
                     </div>
                     {/* Trust Badge */}
                  </div>
               </div>
            </div>
         </main>
         {/* Footer */}
         {/* Bootstrap 5 Bundle JS */}

      </PageLayout>
   );
}

