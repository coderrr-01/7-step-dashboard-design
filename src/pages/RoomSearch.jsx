import PageLayout from "../components/PageLayout";
import { IoLocationSharp } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSteps } from "../context/StepContext";

const WP_BASE = 'https://wordpress-1608288-6566160.cloudwaysapps.com/wp-json/jrny/v1';

export default function RoomSearch() {
   const navigate = useNavigate();
   const { completeStep } = useSteps();

   const [rooms, setRooms]               = useState([]);
   const [loading, setLoading]           = useState(true);
   const [roomAccomadtion, setroomAccomadtion] = useState(false);
   const [selected, setSelected]         = useState("Room type");
   const [locationPrefereance, setlocationPrefereance] = useState(false);
   const [selectlocation, setselectlocation] = useState("All Locations");

   const roomtypeAccomadtion = ["All Tiers", "Single Room", "Studio", "Executive Suites"];

   useEffect(() => {
      fetch(`${WP_BASE}/rooms`)
         .then(r => r.json())
         .then(data => {
            if (data.success) setRooms(data.rooms || []);
         })
         .catch(() => {})
         .finally(() => setLoading(false));
   }, []);

   const handleViewRoom = (room) => {
      completeStep(3);
      // Store selected room for ViewRoom page
      localStorage.setItem('jrny_selected_room', JSON.stringify(room));
      navigate('/view-room');
   };

   const roomType    = () => { setroomAccomadtion(!roomAccomadtion); setlocationPrefereance(false); };
   const locationType = () => { setlocationPrefereance(!locationPrefereance); setroomAccomadtion(false); };

   // Unique locations from rooms data
   const locations = ['All Locations', ...new Set(rooms.map(r => r.unit_number ? `Unit ${r.unit_number}` : r.name).filter(Boolean))];

   const filteredRooms = rooms.filter(r => {
      if (selectlocation !== 'All Locations' && `Unit ${r.unit_number}` !== selectlocation && r.name !== selectlocation) return false;
      return true;
   });

   return (
      <PageLayout page="RoomSearch">
         <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1 bg-field">
            <div className="container container-narrow">
               <section className="mb-4">
                  <div className="row">
                     <div className="col-lg-8">
                        <h1 className="display-4 serif-heading heading-hero mb-3 hero-title">Room Selection</h1>
                        <p className="mb-0 text-muted fs-5 heading-lead-wide">Our specialist committee is currently verifying your submitted documentation and identity credentials for the 2026 intake cycle.</p>
                     </div>
                  </div>
               </section>
               <section className="row mb-5 block-space-manage align-items-end g-4">
                  <div className="col-lg-3 col-md-4 position-relative">
                     <span className="filter-label">Location Preference </span>
                     <button className="filter-dropdown-toggle" onClick={locationType}>
                        {selectlocation}
                        <span className={`float-end ${locationPrefereance ? "active-arrow" : ""}`}><FaAngleDown /></span>
                     </button>
                     {locationPrefereance && (
                        <ul className="dropdown-mock-menu">
                           {locations.map((item) => (
                              <li key={item} className={selectlocation === item ? "active" : ""} onClick={() => { setselectlocation(item); setlocationPrefereance(false); }}>{item}</li>
                           ))}
                        </ul>
                     )}
                  </div>
                  <div className="col-lg-3 col-md-4 position-relative">
                     <span className="filter-label">Accommodation Tier</span>
                     <button className="filter-dropdown-toggle" onClick={roomType}>
                        {selected}
                        <span className={`float-end ${roomAccomadtion ? "active-arrow" : ""}`}><FaAngleDown /></span>
                     </button>
                     {roomAccomadtion && (
                        <ul className="dropdown-mock-menu">
                           {roomtypeAccomadtion.map((item) => (
                              <li key={item} className={selected === item ? "active" : ""} onClick={() => { setSelected(item); setroomAccomadtion(false); }}>{item}</li>
                           ))}
                        </ul>
                     )}
                  </div>
                  <div className="col-lg-6 col-md-4 text-md-end pb-1">
                     <span className="small text-muted fw-bold">Showing <span className="text-dark">{filteredRooms.length}</span> Exclusive Units</span>
                  </div>
               </section>

               {loading ? (
                  <div className="text-center py-5">
                     <div className="orbit-loader mb-3" style={{ width: 50, height: 50, margin: '0 auto' }}>
                        <div className="center-circle" style={{ width: 50, height: 50 }}></div>
                     </div>
                     <p style={{ color: 'var(--jrny-gold)', fontWeight: 600 }}>Loading available rooms...</p>
                  </div>
               ) : filteredRooms.length === 0 ? (
                  <div className="text-center py-5">
                     <p className="text-muted fs-5">No available rooms found at this time.</p>
                  </div>
               ) : (
                  <section className="row g-4">
                     {filteredRooms.map((room) => (
                        <div className="col-lg-3 col-md-6" key={room.id}>
                           <div className="property-card">
                              <div className="card-img-container">
                                 <div className="status-badge"><div className="status-dot"></div>{room.status}</div>
                                 <img alt={room.name} src={room.images[0] || 'https://picsum.photos/800/600?random=1'} />
                              </div>
                              <div className="card-body-custom">
                                 <div className="card-title-row">
                                    <h3 className="property-name serif">{room.name}</h3>
                                    <span className="room-number">{room.unit_number ? `Unit ${room.unit_number}` : `Floor ${room.floor}`}</span>
                                 </div>
                                 <span className="property-location"><span><IoLocationSharp /></span> {room.size_sq_ft ? `${room.size_sq_ft} sq.ft` : 'Details available'}</span>
                                 <p className="property-desc">{room.description ? room.description.substring(0, 100) + '...' : room.features}</p>
                              </div>
                              <div className="card-footer-custom">
                                 <div>
                                    <span className="rent-label">Monthly Rent</span>
                                    <span className="rent-amount">${Number(room.monthly_rent).toLocaleString()}</span> <span className="rent-period">/mo</span>
                                 </div>
                                 <button className="btn btn-gold" onClick={() => handleViewRoom(room)}>View Room</button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </section>
               )}
            </div>
         </main>
      </PageLayout>
   );
}
