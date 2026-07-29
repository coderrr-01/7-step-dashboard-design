import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
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

   const images   = room.images?.length ? room.images : ['https://picsum.photos/800/600?random=1'];
   const amenities = room.amenities
      ? room.amenities.split(',').map(a => a.trim()).filter(Boolean)
      : [];

   const holdingDeposit = room.security_deposit
      ? (Number(room.security_deposit) * 0.5).toLocaleString('en-US', { minimumFractionDigits: 2 })
      : null;

   return (
      <PageLayout page="ViewRoom">
         <main className="container-fluid py-5 px-lg-5 flex-grow-1 bg-field">
            <div className="container container-narrow">
               <div className="flex-direction_change d-flex justify-content-between align-items-start mb-4">
                  <div data-purpose="page-intro">
                     <h1 className="display-4 serif-heading heading-hero mb-3 hero-title">Secure Your Residency</h1>
                  </div>
                  <Link to="/room-search"><button className="back-btn"><IoArrowBack /> BACK</button></Link>
               </div>
               <div className="row g-4">
                  <div className="col-xl-8">
                     <div className="row g-4">
                        {/* Gallery */}
                        <div className="col-12">
                           <div className="parchment-card p-4">
                              <div className="position-relative mb-4">
                                 <img alt="Main" className="w-100 gallery-main shadow-sm" src={images[mainImg]} />
                                 <Link to="/Viewphoto">
                                    <button className="view-all-btn btn d-flex align-items-center gap-2">
                                       <span className="material-symbols-outlined fs-6">grid_view</span>
                                       VIEW ALL PHOTOS
                                    </button>
                                 </Link>
                              </div>
                              {images.length > 1 && (
                                 <div className="row g-3">
                                    {images.slice(0, 3).map((img, i) => (
                                       <div className="col-lg-3 col-sm-6 col-6" key={i}>
                                          <img
                                             alt={`Thumb ${i + 1}`}
                                             className={`w-100 gallery-thumb${mainImg === i ? ' opacity-100' : ''}`}
                                             src={img}
                                             onClick={() => setMainImg(i)}
                                             style={{ cursor: 'pointer' }}
                                          />
                                       </div>
                                    ))}
                                    {images.length > 3 && (
                                       <div className="col-lg-3 col-sm-6 col-6">
                                          <div className="position-relative h-100">
                                             <img alt="More" className="w-100 gallery-thumb opacity-50" src={images[3]} />
                                             <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                                                <span className="fw-bold text-dark more-photos-label">+{images.length - 3} More</span>
                                             </div>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* About Room & Apartment */}
                        <div className="col-md-6">
                           <div className="parchment-card">
                              <h3 className="h5 mb-4 border-bottom pb-2 text-primary">About Your Room</h3>
                              {room.room_type && (
                                 <div className="d-flex mb-4">
                                    <span className="material-symbols-outlined text-primary me-3">king_bed</span>
                                    <div>
                                       <div className="fw-bold mb-1">{room.room_type}</div>
                                       {room.size_sq_ft && <div className="small text-muted">{room.size_sq_ft} sq. ft. living space</div>}
                                    </div>
                                 </div>
                              )}
                              {room.bathroom_info && (
                                 <div className="d-flex mb-4">
                                    <span className="material-symbols-outlined text-primary me-3">bathtub</span>
                                    <div>
                                       <div className="fw-bold mb-1">En-suite Bathroom</div>
                                       <div className="small text-muted">{room.bathroom_info}</div>
                                    </div>
                                 </div>
                              )}
                              {room.workstation_info && (
                                 <div className="d-flex">
                                    <span className="material-symbols-outlined text-primary me-3">work</span>
                                    <div>
                                       <div className="fw-bold mb-1">Integrated Workstation</div>
                                       <div className="small text-muted">{room.workstation_info}</div>
                                    </div>
                                 </div>
                              )}
                              {!room.room_type && !room.bathroom_info && !room.workstation_info && room.description && (
                                 <p className="small text-muted">{room.description}</p>
                              )}
                           </div>
                        </div>

                        <div className="col-md-6">
                           <div className="parchment-card">
                              <h3 className="h5 mb-4 border-bottom pb-2 text-primary">About The Apartment</h3>
                              {room.building_name && (
                                 <div className="d-flex mb-4">
                                    <span className="material-symbols-outlined text-primary me-3">apartment</span>
                                    <div>
                                       <div className="fw-bold mb-1">{room.building_name}</div>
                                       {room.floor && <div className="small text-muted">Floor {room.floor}</div>}
                                    </div>
                                 </div>
                              )}
                              {room.common_areas && (
                                 <div className="d-flex mb-4">
                                    <span className="material-symbols-outlined text-primary me-3">groups</span>
                                    <div>
                                       <div className="fw-bold mb-1">Shared Common Areas</div>
                                       <div className="small text-muted">{room.common_areas}</div>
                                    </div>
                                 </div>
                              )}
                              {room.building_heritage && (
                                 <div className="d-flex">
                                    <span className="material-symbols-outlined text-primary me-3">history</span>
                                    <div>
                                       <div className="fw-bold mb-1">Building Heritage</div>
                                       <div className="small text-muted">{room.building_heritage}</div>
                                    </div>
                                 </div>
                              )}
                              {!room.building_name && !room.common_areas && !room.building_heritage && room.features && (
                                 <p className="small text-muted">{room.features}</p>
                              )}
                           </div>
                        </div>

                        {/* Amenities */}
                        {amenities.length > 0 && (
                           <div className="col-12">
                              <div className="parchment-card">
                                 <h3 className="h5 mb-4 text-primary">Premium Amenities</h3>
                                 <div className="row text-center">
                                    {amenities.map((amenity, i) => (
                                       <div className="col-6 col-md-3" key={i}>
                                          <div className="amenity-icon"><span className="material-symbols-outlined">star</span></div>
                                          <span className="amenity-text">{amenity}</span>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Booking Summary Sidebar */}
                  <div className="col-xl-4">
                     <div className="parchment-card summary-card shadow-lg p-4">
                        <h2 className="h4 text-primary mb-4">Booking Summary</h2>
                        <div className="mb-4">
                           <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="small text-muted text-uppercase fw-bold summary-label">Unit Specification</span>
                           </div>
                           <div className="h6 fw-bold mb-0">
                              {room.name}{room.unit_number ? `, Unit ${room.unit_number}` : ''}
                           </div>
                        </div>
                        {room.agreement_type && (
                           <div className="mb-4">
                              <span className="small text-muted text-uppercase fw-bold d-block mb-1 summary-label">Agreement Type</span>
                              <div className="h6 mb-0">{room.agreement_type}</div>
                           </div>
                        )}
                        <hr className="my-4 opacity-10" />
                        <div className="d-flex justify-content-between align-items-center mb-3">
                           <span className="fw-bold">Monthly Residency Rate</span>
                           <span className="h5 mb-0 fw-bold text-primary">
                              ${Number(room.monthly_rent).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                           </span>
                        </div>
                        {holdingDeposit && (
                           <div className="d-flex justify-content-between align-items-center mb-4">
                              <span className="fw-bold">Holding Deposit (50%)</span>
                              <span className="h5 mb-0 fw-bold text-muted">${holdingDeposit}</span>
                           </div>
                        )}
                        <div className="d-grid gap-3 mb-4">
                           <button className="btn btn-primary-elite">Lock In Residency</button>
                           <Link to="/interview"><button className="btn btn-outline-elite">Schedule Interview</button></Link>
                        </div>
                        <p className="text-center small text-muted text-uppercase mb-0 summary-disclaimer">
                           By clicking 'Lock In', you agree to the preliminary institutional residency terms and the immediate payment of the holding deposit.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </PageLayout>
   );
}
