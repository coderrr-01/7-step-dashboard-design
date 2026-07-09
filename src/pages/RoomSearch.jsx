import PageLayout from "../components/PageLayout";
import { IoLocationSharp } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function RoomSearch() {
   const [roomAccomadtion, setroomAccomadtion] = useState(false);
   const [selected, setSelected] = useState("Room type");
   const [locationPrefereance, setlocationPrefereance] = useState(false);

   const [selectlocation, setselectlocation] = useState(
      "Central London Residences"
   );

   const roomtypeAccomadtion = [
      "All Tiers",
      "Single Room",
      "Studio",
      "Executive Suites"
   ];
   const roomType = () => {
      setroomAccomadtion(!roomAccomadtion);
      setlocationPrefereance(false)
   };

   const locationwise = [
      "New York",
      "Los Angeles",
      "Chicago",
      "San Francisco"
   ];

   const locationType = () => {
      setlocationPrefereance(!locationPrefereance);
      setroomAccomadtion(false)
   };
   return (
      <PageLayout page="RoomSearch">
         <main className="container-fluid pb-lg-5 px-lg-5 flex-grow-1 bg-field">
            <div className="container container-narrow">
               <section className="mb-4 ">
                  <div class="row">
                     <div class="col-lg-8">
                        <h1 class="display-4 serif-heading heading-hero mb-3 hero-title">Room Selection</h1>
                        <p class="mb-0 text-muted fs-5 heading-lead-wide">Our specialist committee is currently verifying your submitted documentation and identity credentials for the 2026 intake cycle.</p>
                     </div>
                  </div>
               </section>
               <section className="row mb-5 block-space-manage align-items-end g-4">
                  <div className="col-lg-3 col-md-4 position-relative">
                     <span className="filter-label">Location Preference </span>
                     <button className="filter-dropdown-toggle" onClick={locationType}>
                        {selectlocation}
                        <span className={`float-end ${locationPrefereance ? "active-arrow" : ""}`}>
                           <FaAngleDown />
                        </span>
                     </button>
                     {locationPrefereance && (
                        <ul className="dropdown-mock-menu" >
                           {locationwise.map((item) => (
                              <li
                                 key={item}
                                 className={selectlocation === item ? "active" : ""}
                                 onClick={() => {
                                    setselectlocation(item);
                                    setlocationPrefereance(false);
                                 }}
                              >
                                 {item}
                              </li>
                           ))}
                        </ul>
                     )}
                  </div>
                  <div className="col-lg-3 col-md-4 position-relative">
                     <span className="filter-label">Accommodation Tier</span>
                     <button
                        className="filter-dropdown-toggle"
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
                  <div className="col-lg-6 col-md-4 text-md-end pb-1">
                     <span className="small text-muted fw-bold">Showing <span className="text-dark">12</span> Exclusive Units</span>
                  </div>
               </section>
               {/* Property Grid */}
               <section className="row g-4">
                  {/* Card 1 */}
                  <div className="col-lg-3 col-md-6">
                     <div className="property-card">
                        <div className="card-img-container">
                           <div className="status-badge">
                              <div className="status-dot"></div>
                              Available
                           </div>
                           <img alt="Windsor Court Interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFyO66RgErN232FeilZH2elxl6dUKQzQCwz7kMPI25_B_zqHFPxheAh0NU2zRQgEl2agv64IuP7e9GFU7EbewFG0nviJ3nvhBS3cRTGChnfyts4qrq10rk-4YCLcWY1ZhG2Wxi4qMLov3ndhcbNDE0J2voRmmlNw44nP--b7ZQyPIobJZ6wjKWuIMepszpR3IESV4umSDhlJxKAvK1kdMfxiIJdp13gF-cRzpQb_TVAByVp7xbHqQ7XBKPY184WURbvHgIlM1FyCe3" />
                        </div>
                        <div className="card-body-custom">
                           <div className="card-title-row">
                              <h3 className="property-name serif">Windsor Court</h3>
                              <span className="room-number">Room 118-402</span>
                           </div>
                           <span className="property-location"><span><IoLocationSharp /></span> Belgravia Square, London</span>
                           <p className="property-desc">Ground-floor access to private gardens with floor-to-ceiling windows and bespoke oak...</p>
                        </div>
                        <div className="card-footer-custom">
                           <div>
                              <span className="rent-label">Monthly Rent</span>
                              <span className="rent-amount">$1,850</span> <span className="rent-period">/mo</span>
                           </div>
                           <a href="/view-room"> <button className="btn btn-gold">View Room</button></a>
                        </div>
                     </div>
                  </div>
                  {/* Card 2 */}
                  <div className="col-lg-3 col-md-6">
                     <div className="property-card">
                        <div className="card-img-container">
                           <div className="status-badge">
                              <div className="status-dot"></div>
                              Available
                           </div>
                           <img alt="Windsor Court Interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrHShwe7JVjLeFPePS011vva-4WwSUaYWV5ygzLfmFJ-1QIasieno8IAhojs7NeP_FhbFkKCLF5Qdih6wzSSKwIyHVP2vMQ92itA-HFrvHmFw48TbJnqv1QTlujyn3-c119QsHgqixYjks_nFLOOdQauE34fCTN_D_Sx_9xi-qiqEeguHCqByNmZmPTAbAoXRyd7t6tXXuDYMF6Fr2nWOK6xECzYjuYrRLlBzisOkT_H6uGxFiwK7nHXaKLMO0FGH1ngEScf6Ljj72" />
                        </div>
                        <div className="card-body-custom">
                           <div className="card-title-row">
                              <h3 className="property-name serif">Windsor Court</h3>
                              <span className="room-number">Room 110</span>
                           </div>
                           <span className="property-location"><span><IoLocationSharp /></span>Belgravia Square, London</span>
                           <p className="property-desc">Ground-floor access to private gardens with floor-to-ceiling windows and bespoke oak...</p>
                        </div>
                        <div className="card-footer-custom">
                           <div>
                              <span className="rent-label">Monthly Rent</span>
                              <span className="rent-amount">$2,100</span> <span className="rent-period">/mo</span>
                           </div>
                           <Link to="/view-room"> <button className="btn btn-gold">View Room</button></Link>
                        </div>
                     </div>
                  </div>
                  {/* Card 3 */}
                  <div className="col-lg-3 col-md-6">
                     <div className="property-card">
                        <div className="card-img-container">
                           <div className="status-badge">
                              <div className="status-dot"></div>
                              Available
                           </div>
                           <img alt="Regent's Archive Interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBZ6r6OMG9CmjAiC4QQPhrq5BXWuX2JGRfrVJ_-ixygu7jH4pFpbUVuDxnrKztf5cAibEJdDjiaXV1BjXt_tXkmXY6VqQySo8h6O6yiUOb6phnTr5eeVo-hhvt33-e-DxvB3DL4dFk2x93Gak6W1wwLJVjQMGIxEPgmK-yrSqJwSPB4OxDYyjgxm7AuJelwOaQHw9zyz4ib0ZiUyG_LhKJDmXjk70RwDKjfJ8-3tjPdo_bYsW1bj7PHVFnwqopCtHTz8Jt0DCqLtJS" />
                        </div>
                        <div className="card-body-custom">
                           <div className="card-title-row">
                              <h3 className="property-name serif">Regent's Archive</h3>
                              <span className="room-number">Room 305</span>
                           </div>
                           <span className="property-location"><span><IoLocationSharp /></span> Marylebone Row, London</span>
                           <p className="property-desc">Spacious studio with an integrated archive wall and museum-grade climate control for persona...</p>
                        </div>
                        <div className="card-footer-custom">
                           <div>
                              <span className="rent-label">Monthly Rent</span>
                              <span className="rent-amount">$1,975</span> <span className="rent-period">/mo</span>
                           </div>
                          <Link to="/view-room"> <button className="btn btn-gold">View Room</button></Link>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                     <div className="property-card">
                        <div className="card-img-container">
                           <div className="status-badge">
                              <div className="status-dot"></div>
                              Available
                           </div>
                           <img alt="Regent's Archive Interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBZ6r6OMG9CmjAiC4QQPhrq5BXWuX2JGRfrVJ_-ixygu7jH4pFpbUVuDxnrKztf5cAibEJdDjiaXV1BjXt_tXkmXY6VqQySo8h6O6yiUOb6phnTr5eeVo-hhvt33-e-DxvB3DL4dFk2x93Gak6W1wwLJVjQMGIxEPgmK-yrSqJwSPB4OxDYyjgxm7AuJelwOaQHw9zyz4ib0ZiUyG_LhKJDmXjk70RwDKjfJ8-3tjPdo_bYsW1bj7PHVFnwqopCtHTz8Jt0DCqLtJS" />
                        </div>
                        <div className="card-body-custom">
                           <div className="card-title-row">
                              <h3 className="property-name serif">Regent's Archive</h3>
                              <span className="room-number">Room 305</span>
                           </div>
                           <span className="property-location"><span><IoLocationSharp /></span> Marylebone Row, London</span>
                           <p className="property-desc">Spacious studio with an integrated archive wall and museum-grade climate control for persona...</p>
                        </div>
                        <div className="card-footer-custom">
                           <div>
                              <span className="rent-label">Monthly Rent</span>
                              <span className="rent-amount">$1,975</span> <span className="rent-period">/mo</span>
                           </div>
                           <Link to="/view-room"> <button className="btn btn-gold">View Room</button></Link>
                        </div>
                     </div>
                  </div>
               </section>
            </div>

         </main>
         {/* END: MainContent */}
         {/* BEGIN: MainFooter */}
         {/* END: MainFooter */}

      </PageLayout>
   );
}

