import PageLayout from "../components/PageLayout";
import { FaAngleDown, FaCompass } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PropertyMap from "../components/roomSearch/PropertyMap";
import { roomsData } from "../components/roomSearch/roomsData";
import { searchLocations } from "../components/roomSearch/geocode";
import "../components/roomSearch/roomSearch.css";

const locationwise = [
   "London",
   "Manchester",
   "Birmingham",
   "Australia",
   "New York",
   "Los Angeles",
];

export default function RoomSearch() {
   const [roomAccomadtion, setroomAccomadtion] = useState(false);
   const [selected, setSelected] = useState("All Tiers");
   const [locationPrefereance, setlocationPrefereance] = useState(false);
   const [location, setLocation] = useState(null);
   const [locSearching, setLocSearching] = useState(false);
   const [locError, setLocError] = useState("");

   const roomtypeAccomadtion = [
      "All Tiers",
      "Single Room",
      "Studio",
      "Executive Suites"
   ];

   const roomType = () => {
      setroomAccomadtion(!roomAccomadtion);
      setlocationPrefereance(false);
   };

   const filteredRooms = useMemo(() => {
      return roomsData.filter((room) => {
         const tierOk = selected === "All Tiers" || room.tier === selected;
         const locOk =
            !location ||
            String(location.name)
               .toLowerCase()
               .includes(room.city.toLowerCase());
         return tierOk && locOk;
      });
   }, [location, selected]);

   const locationType = () => {
      setlocationPrefereance(!locationPrefereance);
      setroomAccomadtion(false);
      setLocError("");
   };

   const handleLocationSelect = async (name) => {
      setlocationPrefereance(false);
      setroomAccomadtion(false);
      setLocSearching(true);
      setLocError("");
      try {
         const matches = await searchLocations(name);
         if (matches.length === 0) {
            setLocError("Location not found. Please try another location.");
            return;
         }
         const first = matches[0];
         setLocation({
            name,
            displayName: first.displayName || name,
            lat: first.lat,
            lon: first.lon,
            bounds: first.boundingBox
               ? [
                    [parseFloat(first.boundingBox[0]), parseFloat(first.boundingBox[2])],
                    [parseFloat(first.boundingBox[1]), parseFloat(first.boundingBox[3])],
                 ]
               : null,
         });
      } catch (e) {
         setLocError("Unable to load location. Please try again.");
      } finally {
         setLocSearching(false);
      }
   };

   const handleReset = () => {
      setLocation(null);
      setSelected("All Tiers");
      setLocError("");
   };

   return (
      <PageLayout page="RoomSearch">
         <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1 bg-field py-5 px-lg-5">
            <div className="container container-narrow">
               <section className="mb-4 ">
                  <div class="row">
                     <div class="col-lg-12">
                        <h1 class="display-4 serif-heading heading-hero mb-3 hero-title">Room Selection</h1>
                        <p class="mb-0 text-muted fs-5 heading-lead-wide">Search by location on the map below and explore exclusive rooms available near your preferred area.</p>
                     </div>
                  </div>
               </section>

               {/* Filters */}
               <section className="row mb-4 block-space-manage align-items-end  set-location-data g-4">
                  <div className="col-lg-5 col-md-7 position-relative">
                     <span className="filter-label">Preferred Location </span>
                     <button
                        className="filter-dropdown-toggle w-100 text-start px-3 py-2"
                        onClick={locationType}
                        disabled={locSearching}
                     >
                        {locSearching ? (
                           <span className="rs-dd-loading">
                              <span className="spin">⏳</span> Searching location…
                           </span>
                        ) : (
                           <>
                              {location ? location.name : "Select Location"}
                              <span className={`float-end ${locationPrefereance ? "active-arrow" : ""}`}>
                                 <FaAngleDown />
                              </span>
                           </>
                        )}
                     </button>
                     {locationPrefereance && !locSearching && (
                        <ul className="dropdown-mock-menu">
                           {locationwise.map((item) => (
                              <li
                                 key={item}
                                 className={location?.name === item ? "active" : ""}
                                 onClick={() => handleLocationSelect(item)}
                              >
                                 <IoLocationSharp /> {item}
                              </li>
                           ))}
                        </ul>
                     )}
                     {locError && (
                        <span className="rs-loc-error">{locError}</span>
                     )}
                  </div>
                  <div className="col-lg-3 col-md-5 position-relative">
                     <span className="filter-label">Accommodation Tier</span>
                     <button
                        className="filter-dropdown-toggle w-100 text-start px-3 py-2"
                        onClick={roomType}
                     >
                        {selected}
                        <span className={`float-end ${roomAccomadtion ? "active-arrow" : ""}`}>
                           <FaAngleDown />
                        </span>
                     </button>
                     {roomAccomadtion && (
                        <ul className="dropdown-mock-menu">
                           {roomtypeAccomadtion.map((item) => (
                              <li
                                 key={item}
                                 className={selected === item ? "active" : ""}
                                 onClick={() => {
                                    setSelected(item);
                                    setroomAccomadtion(false);
                                 }}
                              >
                                 {item}
                              </li>
                           ))}
                        </ul>
                     )}
                  </div>
                  <div className="col-lg-4 col-md-12 text-lg-end pb-1">
                     <span className="small text-muted fw-bold">
                        Showing{" "}
                        <span className="text-dark">{filteredRooms.length}</span>{" "}
                        Exclusive Units
                     </span>
                  </div>
               </section>

               {/* Interactive Map */}
               <section className="mb-5">
                  <PropertyMap
                     location={location}
                     rooms={filteredRooms}
                     onReset={handleReset}
                  />
               </section>

               {/* Results header */}
               <div className="rs-results-head mb-4">
                  <h2 className="rs-results-title mb-0">
                     {location ? (
                        <>
                           Available Rooms in <span className="rs-loc-tag">📍 {location.name}</span>
                        </>
                     ) : (
                        <>Available Rooms</>
                     )}
                  </h2>
                  <span className="rs-results-count">
                     {filteredRooms.length} room{filteredRooms.length === 1 ? "" : "s"}
                  </span>
               </div>

               {/* Property Grid */}
               {filteredRooms.length === 0 ? (
                  <section className="rs-empty-state mb-4">
                     <div className="rs-empty-state-icon"><FaCompass /></div>
                     <h4>No rooms found in this area yet</h4>
                     <p>Try another location or change the accommodation tier, or hit Reset Map to see all rooms.</p>
                  </section>
               ) : (
                  <section className="row g-4">
                     {filteredRooms.map((room) => (
                        <div className="col-lg-3 col-md-6" key={room.id}>
                           <div className="property-card">
                              <div className="card-img-container">
                                 <div className="status-badge">
                                    <div className="status-dot"></div>
                                    {room.status}
                                 </div>
                                 <img alt={`${room.name} Interior`} src={room.img} />
                              </div>
                              <div className="card-body-custom">
                                 <div className="card-title-row">
                                    <h3 className="property-name serif">{room.name}</h3>
                                    <span className="room-number">{room.roomNumber}</span>
                                 </div>
                                 <span className="property-location"><span><IoLocationSharp /></span>{room.location}</span>
                                 <p className="property-desc">{room.desc}</p>
                              </div>
                              <div className="card-footer-custom">
                                 <div>
                                    <span className="rent-label">Monthly Rent</span>
                                    <span className="rent-amount">${room.price.toLocaleString()}</span> <span className="rent-period">/mo</span>
                                 </div>
                                 <Link to="/view-room"> <button className="btn btn-gold">View Room</button></Link>
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
