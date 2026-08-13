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

   // Support both the new catalogue shape and the old WP /rooms shape
   const rawImages = Array.isArray(room.images)
      ? room.images
      : typeof room.images === 'string'
         ? room.images.split(',').map((u) => u.trim()).filter(Boolean)
         : [];
   const images = rawImages.length
      ? rawImages
      : [room.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVfkL8eMoD4BRwoPZpU7RgLDUjbRLK3wH-XAdz6WV0kl6Du2f9yQcpOr7eTdjNWMDhmvQdihD1BrYLZgDmUp9Merj2fIgvWSZUw-NdZ1sgTwt2VceIiSimt_tDdNm1rYmGz2h9qJ9tbVt9bPdhcHml9lpYH4CDHeaEbDuKUxGcOpdkL-_Ln2Ic_GlPSiFdKp3y1dZcnAE25vyKoB_qYXoxj61V68bMgd6i5d4CcYyruqknzYFDsyh5Qg'];
   const roomType = room.room_type || room.tier || 'King Studio Suite';
   const roomNumber = room.roomNumber || (room.unit_number ? `Unit ${room.unit_number}` : 'Suite 402');
   const roomName = room.name || 'Victorian Premier';
   const roomDesc = room.size_sq_ft
      ? `${room.size_sq_ft} sq. ft. living space`
      : (room.description || room.desc || 'Bespoke 750 sq. ft. living space with high ceilings and crown molding.');
   const rentValue = Number(room.monthly_rent ?? room.price ?? 3450);
   const monthlyRent = rentValue.toLocaleString('en-US', { minimumFractionDigits: 2 });
   const depositAmt = (room.security_deposit != null ? Number(room.security_deposit) : rentValue ).toLocaleString('en-US', { minimumFractionDigits: 2 });
   // const holdingDeposit = (room.security_deposit != null ? Number(room.security_deposit) * 0.5 : rentValue * 0.5).toLocaleString('en-US', { minimumFractionDigits: 2 });

   const bathroomInfo = room.bathroom_info || 'Carrara marble vanity with heated flooring and rainfall shower.';
   const workstationInfo = room.workstation_info || 'Built-in mahogany desk with high-speed fiber optic connectivity.';
   const buildingName = room.building_name || roomName;
   const buildingFloor = room.floor ? `Floor ${room.floor} with panoramic northern views of the park.` : 'Located on the 12th floor with panoramic northern views of the park.';
   const commonAreas = room.common_areas || 'Access to the private library, gourmet kitchen, and grand salon.';
   const buildingHeritage = room.building_heritage || 'A 1920s landmark meticulously restored for modern institutional living.';
   const agreementType = room.agreement_type || 'Annual Lease [Fixed Term]';

   const defaultAmenities = ['Climate Control', 'Giga-Fiber Wifi', 'Daily Housekeeping', '24/7 Concierge'];
   const rawAmenities = Array.isArray(room.amenities)
      ? room.amenities
      : typeof room.amenities === 'string'
         ? room.amenities.split(',').map((a) => a.trim()).filter(Boolean)
         : [];
   const amenityList = rawAmenities.length
      ? rawAmenities.concat(defaultAmenities).slice(0, Math.max(rawAmenities.length, defaultAmenities.length))
      : defaultAmenities;

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
                                   <Link to="/Viewphoto"><button className="view-all-btn btn d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined fs-6">
<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5443 12.5443V9.66667H9.66667V12.5443H12.5443ZM8.21094 8.21094H14V14H8.21094V8.21094ZM12.5443 5.33333V2.45573H9.66667V5.33333H12.5443ZM8.21094 1H14V6.78906H8.21094V1ZM5.33333 12.5443V9.66667H2.45573V12.5443H5.33333ZM1 8.21094H6.78906V14H1V8.21094ZM5.33333 5.33333V2.45573H2.45573V5.33333H5.33333ZM1 1H6.78906V6.78906H1V1Z" fill="#B8924A"/>
</svg>
</span>
                                    VIEW ALL PHOTOS
                                 </button>
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
                                     <div className="position-relative h-100">
                                        <img alt="Thumb 4" className="w-100 gallery-thumb opacity-50" src={images[3] || images[0]} />
                                        {images.length > 3 && (
                                           <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                                              <span className="fw-bold text-dark more-photos-label">+{images.length - 3} More</span>
                                           </div>
                                        )}
                                     </div>
                                  </div>
                              </div>
                           </div>
                        </div>
                        {/* About Sections */}
                        <div className="col-md-6">
                           <div className="parchment-card">
                              <h3 className="h5 mb-4 border-bottom pb-2 text-primary">About Your Room</h3>
                              <div className="d-flex mb-4">
                                 <span className="material-symbols-outlined text-primary me-3">
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.4131 12.1141V7.81879H16.3803V12.1141H23.4131ZM13.6197 12.1141V7.81879H6.58685V12.1141H13.6197ZM26.2394 12.1141C26.9844 12.1141 27.6307 12.4049 28.1784 12.9866C28.7261 13.5682 29 14.2394 29 15V22.1812H27.1596L26.2394 25H24.7934L23.8732 22.1812H6.12676L5.20657 25H3.76056L2.84038 22.1812H1V15C1 14.2394 1.27387 13.5682 1.8216 12.9866C2.36933 12.4049 3.01565 12.1141 3.76056 12.1141V7.81879C3.76056 7.05817 4.04538 6.39821 4.61502 5.83893C5.18466 5.27964 5.84194 5 6.58685 5H23.4131C24.1581 5 24.8153 5.27964 25.385 5.83893C25.9546 6.39821 26.2394 7.05817 26.2394 7.81879V12.1141Z" fill="#B8924A"/>
</svg>
</span>
                                  <div>
                                     <div className="fw-bold mb-1">{roomType}</div>
                                     <div className="small text-muted">{roomDesc}</div>
                                  </div>
                              </div>
                              <div className="d-flex mb-4">
                                 <span className="material-symbols-outlined text-primary me-3">

<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.5838 14.9553H4.50558C3.67549 14.9553 3 15.6308 3 16.4609C3 17.291 3.67549 17.9665 4.50558 17.9665H25.5838C26.4138 17.9665 27.0893 17.291 27.0893 16.4609C27.0893 15.6308 26.4138 14.9553 25.5838 14.9553Z" fill="#B8924A"/>
<path d="M25.722 16.9818C25.45 16.9055 25.1769 17.06 25.1017 17.327L25.0625 17.4646H5.02719L4.98706 17.327C4.91178 17.06 4.63678 16.9075 4.36676 16.9818C4.09975 17.058 3.94619 17.3361 4.0225 17.6021L5.40561 22.444C5.83419 23.9446 7.22337 24.9924 8.78315 24.9924H21.3046C22.8653 24.9924 24.2535 23.9446 24.6821 22.444L26.0652 17.6021C26.1425 17.336 25.9879 17.058 25.722 16.9818ZM8.78414 22.985C8.11566 22.985 7.51945 22.5363 7.33676 21.8929L6.68536 19.6105C6.60909 19.3434 6.76365 19.0664 7.02962 18.9902C7.2986 18.9139 7.57464 19.0694 7.64992 19.3354L8.30132 21.6179C8.36357 21.8317 8.56127 21.9823 8.7841 21.9823C9.06112 21.9823 9.28597 22.2071 9.28597 22.4841C9.28602 22.7612 9.06117 22.985 8.78414 22.985Z" fill="#B8924A"/>
<path d="M9.7476 24.041C9.49969 23.9195 9.19956 24.0169 9.07408 24.2658L8.07038 26.2733C7.94692 26.5212 8.04728 26.8223 8.29523 26.9468C8.36848 26.9829 8.4448 27 8.52008 27C8.70376 27 8.88043 26.8986 8.96874 26.722L9.97245 24.7145C10.0959 24.4665 9.9955 24.1654 9.7476 24.041Z" fill="#B8924A"/>
<path d="M22.0183 26.2743L21.0146 24.2668C20.8902 24.0179 20.5891 23.9185 20.3411 24.042C20.0932 24.1664 19.9928 24.4676 20.1163 24.7155L21.12 26.723C21.2083 26.8986 21.385 27 21.5686 27C21.6439 27 21.7202 26.9829 21.7935 26.9478C22.0414 26.8233 22.1418 26.5222 22.0183 26.2743Z" fill="#B8924A"/>
<path d="M23.1602 3C22.6483 3 22.1665 3.19973 21.8042 3.5621L20.2112 5.15501C20.0155 5.35073 20.0155 5.66893 20.2112 5.86465C20.407 6.06038 20.7252 6.06038 20.9209 5.86465L22.5138 4.27274C22.6854 4.10011 22.9152 4.00474 23.1652 4.00474C23.669 4.00474 24.0785 4.41426 24.0785 4.91811V15.4572C24.0785 15.7342 24.3034 15.9591 24.5804 15.9591C24.8574 15.9591 25.0823 15.7342 25.0833 15.4562V4.91713C25.0833 3.86021 24.2241 3 23.1602 3Z" fill="#B8924A"/>
<path d="M21.4225 5.65693L20.4188 4.65323C20.3044 4.5388 20.1448 4.48559 19.9822 4.51269L17.4729 4.92423C17.2882 4.95434 17.1366 5.08481 17.0774 5.26148C17.0182 5.43815 17.0633 5.63487 17.1939 5.76835L20.205 8.86985C20.3004 8.96922 20.4319 9.02243 20.5643 9.02243C20.6115 9.02243 20.6597 9.01542 20.7069 9.00135C20.8855 8.94917 21.021 8.80163 21.0571 8.61893L21.559 6.10964C21.5921 5.94601 21.5409 5.77635 21.4225 5.65693Z" fill="#B8924A"/>
<path d="M14.8973 9.08051C14.7015 8.88478 14.3833 8.88478 14.1876 9.08051L13.1839 10.0842C12.9882 10.2799 12.9882 10.5981 13.1839 10.7939C13.2823 10.8912 13.4107 10.9404 13.5392 10.9404C13.6677 10.9404 13.7962 10.8913 13.8936 10.7939L14.8973 9.79016C15.093 9.59439 15.093 9.27624 14.8973 9.08051Z" fill="#B8924A"/>
<path d="M16.9051 11.088C16.7093 10.8922 16.3911 10.8922 16.1954 11.088L15.1917 12.0917C14.996 12.2874 14.996 12.6056 15.1917 12.8013C15.2901 12.8987 15.4185 12.9479 15.547 12.9479C15.6755 12.9479 15.804 12.8987 15.9014 12.8013L16.9051 11.7976C17.1008 11.6019 17.1008 11.2837 16.9051 11.088Z" fill="#B8924A"/>
<path d="M17.909 8.07685C17.7133 7.88112 17.3951 7.88112 17.1993 8.07685L16.1956 9.08056C15.9999 9.27628 15.9999 9.59448 16.1956 9.7902C16.294 9.88755 16.4224 9.93676 16.5509 9.93676C16.6794 9.93676 16.8079 9.88759 16.9053 9.7902L17.909 8.7865C18.1047 8.59077 18.1047 8.27257 17.909 8.07685Z" fill="#B8924A"/>
</svg>

</span>
                                 <div>
                                     <div className="fw-bold mb-1">En-suite Bathroom</div>
                                     <div className="small text-muted">{bathroomInfo}</div>
                                 </div>
                              </div>
                              <div className="d-flex">
                                 <span className="material-symbols-outlined text-primary me-3">
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.25 7.4875C1.25 4.75312 3.47187 2.53125 6.20625 2.53125C8.9375 2.53125 11.1625 4.75312 11.1625 7.4875V7.64375H9.90625C9.89062 8.08437 9.79375 8.50625 9.63437 8.89375H11.7875C12.1312 8.89375 12.4125 8.61562 12.4125 8.26875V7.4875C12.4125 4.06562 9.62812 1.28125 6.20625 1.28125C2.78437 1.28125 0 4.06562 0 7.4875C0 7.83125 0.28125 8.1125 0.625 8.1125C0.96875 8.1125 1.25 7.83125 1.25 7.4875Z" fill="#B8924A"/>
<path d="M6.61562 8.26875C6.61562 7.925 6.89687 7.64375 7.24062 7.64375H9.90625C9.9125 7.59062 9.9125 7.54062 9.9125 7.4875C9.9125 5.44375 8.25 3.78125 6.20625 3.78125C4.1625 3.78125 2.5 5.44375 2.5 7.4875C2.5 9.53125 4.1625 11.1937 6.20625 11.1937C7.75312 11.1937 9.08125 10.2437 9.63437 8.89375H7.24062C6.89687 8.89375 6.61562 8.61562 6.61562 8.26875Z" fill="#B8924A"/>
<path d="M6.78145 17.5156L6.79707 17.4688L7.98457 13.8063L8.37207 12.6094C7.6627 12.3188 6.89707 12.1656 6.10957 12.1656C4.5252 12.1656 3.0377 12.7844 1.92207 13.9031C0.800195 15.0219 0.18457 16.5094 0.18457 18.0938C0.18457 18.4406 0.46582 18.7188 0.80957 18.7188H6.8002C6.6627 18.3344 6.65332 17.9125 6.78145 17.5156ZM5.23145 16.6469H4.0252C3.67832 16.6469 3.4002 16.3688 3.4002 16.0219C3.4002 15.6781 3.67832 15.3969 4.0252 15.3969H5.23145C5.5752 15.3969 5.85645 15.6781 5.85645 16.0219C5.85645 16.3688 5.5752 16.6469 5.23145 16.6469Z" fill="#B8924A"/>
<path d="M19.8817 11.5156C19.7629 11.3531 19.5754 11.2562 19.3754 11.2562H10.5817C10.3098 11.2562 10.0692 11.4312 9.9879 11.6906L7.96915 17.9C7.90665 18.0906 7.94103 18.3 8.05978 18.4625C8.1754 18.6219 8.3629 18.7187 8.5629 18.7187H17.3598C17.6285 18.7187 17.8692 18.5437 17.9535 18.2875L19.9692 12.075C20.0317 11.8844 19.9973 11.675 19.8817 11.5156ZM13.9692 16.7719C12.9879 16.7719 12.1879 15.9719 12.1879 14.9875C12.1879 14.0062 12.9879 13.2031 13.9692 13.2031C14.9535 13.2031 15.7535 14.0062 15.7535 14.9875C15.7535 15.9719 14.9535 16.7719 13.9692 16.7719Z" fill="#B8924A"/>
</svg>
</span>
                                 <div>
                                     <div className="fw-bold mb-1">Integrated Workstation</div>
                                     <div className="small text-muted">{workstationInfo}</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="col-md-6">
                           <div className="parchment-card">
                              <h3 className="h5 mb-4 border-bottom pb-2 text-primary">About The Apartment</h3>
                              <div className="d-flex mb-4">
                                 <span className="material-symbols-outlined text-primary me-3">

<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.3724 18.679V16.5556H20.2943V18.679H22.3724ZM22.3724 22.8765V20.8025H20.2943V22.8765H22.3724ZM16.0391 10.2346V8.16049H13.9609V10.2346H16.0391ZM16.0391 14.4815V12.358H13.9609V14.4815H16.0391ZM16.0391 18.679V16.5556H13.9609V18.679H16.0391ZM16.0391 22.8765V20.8025H13.9609V22.8765H16.0391ZM9.70573 14.4815V12.358H7.6276V14.4815H9.70573ZM9.70573 18.679V16.5556H7.6276V18.679H9.70573ZM9.70573 22.8765V20.8025H7.6276V22.8765H9.70573ZM18.1667 14.4815H24.5V25H5.5V10.2346H11.8333V8.16049L15 5L18.1667 8.16049V14.4815Z" fill="#B8924A"/>
</svg>

</span>
                                  <div>
                                     <div className="fw-bold mb-1">{buildingName}</div>
                                     <div className="small text-muted">{buildingFloor}</div>
                                  </div>
                              </div>
                              <div className="d-flex mb-4">
                                 <span className="material-symbols-outlined text-primary me-3">
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.5 5V11.6667C8.5 12.7778 8.73698 13.7934 9.21094 14.7135C9.6849 15.6337 10.3281 16.4062 11.1406 17.0312C11.9531 17.6562 12.8841 18.0556 13.9336 18.2292V22.7604H10.6836V25H19.3164V22.7604H16.0664V18.2292C17.1159 18.0556 18.0469 17.6562 18.8594 17.0312C19.6719 16.4062 20.3151 15.6337 20.7891 14.7135C21.263 13.7934 21.5 12.7778 21.5 11.6667V5H8.5ZM19.3164 10.5729H10.6836V7.23958H19.3164C19.3164 7.23958 19.3164 7.40451 19.3164 7.73438C19.3164 8.06424 19.3164 8.44618 19.3164 8.88021C19.3164 9.31424 19.3164 9.70486 19.3164 10.0521C19.3164 10.3993 19.3164 10.5729 19.3164 10.5729Z" fill="#B8924A"/>
</svg>
</span>
                                 <div>
                                     <div className="fw-bold mb-1">Shared Common Areas</div>
                                     <div className="small text-muted">{commonAreas}</div>
                                 </div>
                              </div>
                              <div className="d-flex">
                                 <span className="material-symbols-outlined text-primary me-3">
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.3404 12.2766L22.4894 9.76596L25 8.65957L22.4894 7.51064L21.3404 5L20.234 7.51064L17.7234 8.65957L20.234 9.76596L21.3404 12.2766ZM14.5319 12.7447L12.2766 7.7234L10.0213 12.7447L5 15L10.0213 17.2553L12.2766 22.2766L14.5319 17.2553L19.5532 15L14.5319 12.7447ZM21.3404 17.7234L20.234 20.234L17.7234 21.3404L20.234 22.4894L21.3404 25L22.4894 22.4894L25 21.3404L22.4894 20.234L21.3404 17.7234Z" fill="#B8924A"/>
</svg>
</span>
                                 <div>
                                     <div className="fw-bold mb-1">Building A Heritage</div>
                                     <div className="small text-muted">{buildingHeritage}</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        {/* Amenities */}
                        <div className="col-12">
                           <div className="parchment-card">
                              <h3 className="h5 mb-4 text-primary">Premium Amenities</h3>
                              <div className="row text-center">
                                 <div className="col-6 col-md-3">
                                    <div className="amenity-icon"><span className="material-symbols-outlined">
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.486 16.4789V4.50704C19.486 3.66197 19.2874 2.89906 18.8902 2.21831C18.493 1.53756 17.9556 0.997653 17.278 0.598592C16.6005 0.199531 15.8411 0 15 0C14.1589 0 13.3995 0.199531 12.722 0.598592C12.0444 0.997653 11.507 1.53756 11.1098 2.21831C10.7126 2.89906 10.514 3.66197 10.514 4.50704V16.4789C9.62617 17.1831 8.90187 18.0634 8.34112 19.1197C7.78037 20.1761 7.5 21.3146 7.5 22.5352C7.5 23.8967 7.83879 25.1526 8.51636 26.3028C9.19393 27.4531 10.1051 28.3568 11.25 29.0141C12.3949 29.6714 13.6449 30 15 30C16.3551 30 17.6051 29.6714 18.75 29.0141C19.8949 28.3568 20.8061 27.4531 21.4836 26.3028C22.1612 25.1526 22.5 23.8967 22.5 22.5352C22.5 21.3146 22.2196 20.1761 21.6589 19.1197C21.0981 18.0634 20.3738 17.1831 19.486 16.4789ZM13.528 13.5211V4.50704C13.528 4.08451 13.6682 3.72066 13.9486 3.41549C14.229 3.11033 14.5794 2.95775 15 2.95775C15.4206 2.95775 15.771 3.11033 16.0514 3.41549C16.3318 3.72066 16.472 4.08451 16.472 4.50704V5.98592H15V7.46479H16.472V9.01408V10.493H15V11.9718H16.472V13.5211H13.528Z" fill="#B8924A"/>
</svg>
</span></div>
                                     <span className="amenity-text">{amenityList[0]}</span>
                                 </div>
                                 <div className="col-6 col-md-3">
                                    <div className="amenity-icon"><span className="material-symbols-outlined">
<svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.69484 4.67337C7.82473 1.55779 11.5931 0 16 0C20.4069 0 24.1753 1.55779 27.3052 4.67337C30.4351 7.78894 32 11.5829 32 16.0553C32 18.9698 31.2864 21.6709 29.8592 24.1583C28.4319 26.6457 26.4914 28.593 24.0376 30L22.385 27.2111C24.338 26.0553 25.903 24.4849 27.0798 22.5C28.2567 20.5151 28.8451 18.3668 28.8451 16.0553C28.8451 12.5377 27.5931 9.52261 25.0892 7.01005C22.5853 4.49749 19.5556 3.24121 16 3.24121C12.4444 3.24121 9.41471 4.49749 6.9108 7.01005C4.40689 9.52261 3.15493 12.5377 3.15493 16.0553C3.15493 18.4171 3.73083 20.5779 4.88263 22.5377C6.03443 24.4975 7.58685 26.0553 9.53991 27.2111L7.96244 30C5.50861 28.593 3.56808 26.6457 2.14085 24.1583C0.713615 21.6709 0 18.9698 0 16.0553C0 11.5829 1.56495 7.78894 4.69484 4.67337ZM25.615 16.0553C25.615 17.8141 25.1768 19.4347 24.3005 20.9171C23.4241 22.3995 22.2598 23.5678 20.8075 24.4221L19.23 21.6332C21.3333 20.3769 22.385 18.5176 22.385 16.0553C22.385 14.2965 21.759 12.7889 20.507 11.5327C19.2551 10.2764 17.7527 9.64824 16 9.64824C14.2473 9.64824 12.7449 10.2764 11.493 11.5327C10.241 12.7889 9.61502 14.2965 9.61502 16.0553C9.61502 18.5176 10.6667 20.3769 12.77 21.6332L11.1925 24.4221C9.74022 23.5678 8.5759 22.3995 7.69953 20.9171C6.82316 19.4347 6.38498 17.8141 6.38498 16.0553C6.38498 13.392 7.32394 11.1181 9.20188 9.23367C11.0798 7.34925 13.3459 6.40704 16 6.40704C18.6541 6.40704 20.9202 7.34925 22.7981 9.23367C24.6761 11.1181 25.615 13.392 25.615 16.0553ZM13.7465 13.8317C14.3975 13.2035 15.1487 12.8894 16 12.8894C16.8513 12.8894 17.6025 13.2035 18.2535 13.8317C18.9045 14.4598 19.23 15.201 19.23 16.0553C19.23 16.9095 18.9045 17.6633 18.2535 18.3166C17.6025 18.9698 16.8513 19.2965 16 19.2965C15.1487 19.2965 14.3975 18.9698 13.7465 18.3166C13.0955 17.6633 12.77 16.9095 12.77 16.0553C12.77 15.201 13.0955 14.4598 13.7465 13.8317Z" fill="#B8924A"/>
</svg>
</span></div>
                                     <span className="amenity-text">{amenityList[1]}</span>
                                 </div>
                                 <div className="col-6 col-md-3">
                                    <div className="amenity-icon"><span className="material-symbols-outlined">
<svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.2988 39.3744H27.927C27.927 39.3744 27.9278 36.1689 27.927 35.4744H26.4336C26.4336 35.4744 25.5163 38.6095 25.2988 39.3744Z" fill="#B8924A"/>
<path d="M30.6459 35.4744H29.2306C29.2303 36.1676 29.2306 39.3744 29.2306 39.3744H31.7806C31.5928 38.7231 30.6949 35.6441 30.6459 35.4744Z" fill="#B8924A"/>
<path d="M36.7892 37.9331L35.4588 35.4353C34.5972 35.5241 32.8968 35.4531 32.0088 35.4745C32.3493 36.6514 32.7938 38.1953 33.137 39.3744H35.9218C36.0903 39.3724 36.2555 39.3273 36.4017 39.2434C36.5478 39.1596 36.6702 39.0398 36.7571 38.8954C36.844 38.7511 36.8925 38.5869 36.8981 38.4185C36.9038 38.25 36.8663 38.083 36.7892 37.9331Z" fill="#B8924A"/>
<path d="M21.6987 35.4353L20.3683 37.9331C20.2908 38.0829 20.2529 38.2501 20.2583 38.4186C20.2637 38.5872 20.3122 38.7516 20.3992 38.8961C20.4862 39.0406 20.6087 39.1605 20.7551 39.2442C20.9016 39.3279 21.067 39.3727 21.2356 39.3744H23.9421C24.165 38.6093 25.0769 35.4744 25.0769 35.4744C24.597 35.4742 21.922 35.485 21.6987 35.4353Z" fill="#B8924A"/>
<path d="M19.8519 33.2115C19.6567 30.5325 21.3552 29.2934 23.8955 29.5334L25.6041 22.2943C28.5823 15.8441 4.17709 16.3417 6.14992 21.6354C6.33421 22.3432 6.64296 23.7525 6.81516 24.4594C4.49646 27.6067 3.87783 33.6328 9.09133 34.131L9.61945 36.3811C9.72554 36.8318 9.93603 37.2514 10.2339 37.606C10.5319 37.9605 10.9089 38.2402 11.3346 38.4223C13.7644 39.46 16.4725 39.6506 19.0237 38.9636C18.8979 38.5039 18.9277 38.0155 19.1085 37.5745C19.1272 37.4862 20.4625 34.9757 20.5433 34.8355C20.3242 34.6256 20.1501 34.3734 20.0312 34.0943C19.9124 33.8152 19.8514 33.5149 19.8519 33.2115ZM15.952 18.8899C21.3585 18.8899 24.3845 20.2269 24.5736 20.9703C24.4394 22.075 20.9525 23.1519 15.952 23.1878C10.9581 23.1524 7.47264 22.0747 7.3368 20.9704C7.52601 20.2269 10.552 18.8899 15.952 18.8899ZM8.53033 32.7093C5.66021 31.9887 6.15695 28.4041 7.24564 26.2986L8.43902 31.3724C11.527 31.822 14.0664 30.3854 16.6694 28.3856C16.736 28.332 16.8125 28.2921 16.8946 28.2683C16.9767 28.2445 17.0628 28.2372 17.1477 28.2469C17.2326 28.2566 17.3148 28.2831 17.3894 28.3248C17.4641 28.3665 17.5297 28.4226 17.5824 28.4898C17.9533 28.9554 17.5363 29.4351 17.1258 29.6768C16.0105 30.5413 14.8006 31.2764 13.5194 31.868C12.5772 32.342 9.97339 33.0298 8.53033 32.7093ZM19.1085 30.5833C19.0193 30.7259 18.8797 30.8297 18.7175 30.8741C18.5552 30.9186 18.3822 30.9004 18.2328 30.8232C18.0833 30.746 17.9684 30.6154 17.9107 30.4574C17.8531 30.2994 17.8569 30.1255 17.9215 29.9702C18.2057 29.5674 18.5721 29.3542 18.5476 28.7703C18.5457 28.5233 18.4713 28.2823 18.3336 28.0773C18.1959 27.8723 18.001 27.7122 17.7731 27.617C17.5452 27.5219 17.2944 27.4957 17.0518 27.5419C16.8092 27.5881 16.5855 27.7046 16.4085 27.8769C16.2858 27.9958 16.1212 28.0619 15.9503 28.0609C15.7793 28.0598 15.6156 27.9918 15.4943 27.8713C15.373 27.7509 15.3038 27.5876 15.3016 27.4167C15.2994 27.2458 15.3644 27.0808 15.4825 26.9572C15.7189 26.7188 16.0004 26.5298 16.3105 26.401C16.6206 26.2723 16.9532 26.2064 17.2889 26.2073C17.793 26.2137 18.2841 26.3677 18.7016 26.6502C19.1192 26.9326 19.4448 27.3312 19.6384 27.7967C19.8319 28.2621 19.8849 28.7741 19.7907 29.2693C19.6965 29.7645 19.4594 30.2213 19.1085 30.5833Z" fill="#B8924A"/>
<path d="M34.768 34.1701C34.9136 34.2028 35.0647 34.2029 35.2104 34.1703C35.356 34.1377 35.4927 34.0733 35.6105 33.9816C35.7283 33.89 35.8244 33.7734 35.8918 33.6402C35.9593 33.507 35.9964 33.3606 36.0006 33.2114V32.5005C36.0007 32.2821 35.9579 32.0658 35.8743 31.8639C35.7908 31.6621 35.6683 31.4787 35.5139 31.3242C35.3594 31.1697 35.176 31.0472 34.9742 30.9637C34.7723 30.8802 34.556 30.8373 34.3375 30.8375H30.2485V4.27477C30.2432 3.83542 30.065 3.41584 29.7525 3.10701C29.4399 2.79818 29.0183 2.62499 28.5789 2.625C28.1395 2.62501 27.7178 2.79821 27.4053 3.10705C27.0928 3.4159 26.9146 3.83548 26.9094 4.27483V30.8375H23.5899C23.1325 30.7979 22.6718 30.8354 22.2268 30.9484C21.9117 31.0675 21.6405 31.2799 21.4494 31.5572C21.2582 31.8346 21.1563 32.1637 21.1572 32.5005V33.2114C21.1573 33.4645 21.2574 33.7074 21.4358 33.8869C21.6142 34.0665 21.8563 34.1683 22.1094 34.1701C25.1651 34.1688 34.768 34.1701 34.768 34.1701Z" fill="#B8924A"/>
</svg>
</span></div>
                                     <span className="amenity-text">{amenityList[2]}</span>
                                 </div>
                                 <div className="col-6 col-md-3">
                                    <div className="amenity-icon"><span className="material-symbols-outlined">
<svg width="33" height="30" viewBox="0 0 33 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M31.3732 15.3906C31.3732 13.099 30.973 11.0156 30.1725 9.14062C29.3721 7.26562 28.2746 5.63802 26.8803 4.25781C25.4859 2.8776 23.8979 1.82292 22.1162 1.09375C20.3345 0.364583 18.4624 0 16.5 0C14.5376 0 12.6784 0.364583 10.9225 1.09375C9.16667 1.82292 7.57864 2.86458 6.15845 4.21875C4.73826 5.57292 3.62793 7.20052 2.82746 9.10156C2.027 11.0026 1.62676 13.125 1.62676 15.4688C1.11033 15.7292 0.710094 16.1198 0.426056 16.6406C0.142019 17.1615 0 17.7344 0 18.3594V21.6406C0 22.5781 0.32277 23.3724 0.96831 24.0234C1.61385 24.6745 2.37559 25 3.25352 25H4.95775V14.8438C4.95775 13.2292 5.25469 11.7188 5.84859 10.3125C6.44249 8.90625 7.26878 7.66927 8.32747 6.60156C9.38615 5.53385 10.6127 4.70052 12.007 4.10156C13.4014 3.5026 14.8991 3.20312 16.5 3.20312C18.1009 3.20312 19.5986 3.5026 20.993 4.10156C22.3873 4.70052 23.6138 5.53385 24.6725 6.60156C25.7312 7.66927 26.5575 8.90625 27.1514 10.3125C27.7453 11.7188 28.0423 13.2292 28.0423 14.8438V26.6406H14.8732V30H28.0423C28.9718 30 29.7594 29.6745 30.4049 29.0234C31.0505 28.3724 31.3732 27.5781 31.3732 26.6406V24.6094C31.838 24.349 32.2254 23.9844 32.5352 23.5156C32.8451 23.0469 33 22.5 33 21.875V18.0469C33 17.474 32.8451 16.9531 32.5352 16.4844C32.2254 16.0156 31.838 15.651 31.3732 15.3906ZM9.91549 16.6406C9.91549 16.1719 10.0704 15.7812 10.3803 15.4688C10.6901 15.1562 11.0775 15 11.5423 15C12.007 15 12.3944 15.1562 12.7042 15.4688C13.0141 15.7812 13.169 16.1719 13.169 16.6406C13.169 17.1094 13.0141 17.513 12.7042 17.8516C12.3944 18.1901 12.007 18.3594 11.5423 18.3594C11.0775 18.3594 10.6901 18.1901 10.3803 17.8516C10.0704 17.513 9.91549 17.1094 9.91549 16.6406ZM19.831 16.6406C19.831 16.1719 19.9859 15.7812 20.2958 15.4688C20.6056 15.1562 20.993 15 21.4577 15C21.9225 15 22.3099 15.1562 22.6197 15.4688C22.9296 15.7812 23.0845 16.1719 23.0845 16.6406C23.0845 17.1094 22.9296 17.513 22.6197 17.8516C22.3099 18.1901 21.9225 18.3594 21.4577 18.3594C20.993 18.3594 20.6056 18.1901 20.2958 17.8516C19.9859 17.513 19.831 17.1094 19.831 16.6406ZM26.4155 13.3594C26.1573 11.7969 25.5634 10.3776 24.6338 9.10156C23.7042 7.82552 22.5423 6.82292 21.1479 6.09375C19.7535 5.36458 18.23 5 16.5775 5C15.338 5 14.0986 5.2474 12.8592 5.74219C11.6197 6.23698 10.5094 6.95312 9.52817 7.89062C8.54695 8.82812 7.78521 9.96094 7.24296 11.2891C6.7007 12.6172 6.48122 14.1146 6.58451 15.7812C8.65024 14.8958 10.4061 13.5938 11.8521 11.875C13.2981 10.1562 14.2277 8.17708 14.6408 5.9375C15.3638 7.39583 16.3192 8.6849 17.507 9.80469C18.6948 10.9245 20.0505 11.7969 21.5739 12.4219C23.0974 13.0469 24.7113 13.3594 26.4155 13.3594Z" fill="#B8924A"/>
</svg>
</span></div>
                                     <span className="amenity-text">{amenityList[3]}</span>
                                  </div>
                                  {amenityList.slice(4).map((amenity, i) => (
                                     <div className="col-6 col-md-3" key={i}>
                                        <div className="amenity-icon"><span className="material-symbols-outlined">
<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2l2.4 6.6H21l-5.4 4 2 6.6-5.6-4-5.6 4 2-6.6-5.4-4h6.6z" fill="#B8924A"/>
</svg>
                                        </span></div>
                                        <span className="amenity-text">{amenity}</span>
                                     </div>
                                  ))}
                               </div>
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
                  <div className="col-xl-4">
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
                         <div className="d-flex justify-content-between align-items-center mb-3">
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

