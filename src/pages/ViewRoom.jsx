import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Calendar from "./Partial-element/Calendar";
import { IoArrowBack } from "react-icons/io5";
export default function ViewRoom() {
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
                                 <img alt="Main" className="w-100 gallery-main shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVfkL8eMoD4BRwoPZpU7RgLDUjbRLK3wH-XAdz6WV0kl6Du2f9yQcpOr7eTdjNWMDhmvQdihD1BrYLZgDmUp9Merj2fIgvWSZUw-NdZ1sgTwt2VceIiSimt_tDdNm1rYmGz2h9qJ9tbVt9bPdhcHml9lpYH4CDHeaEbDuKUxGcOpdkL-_Ln2Ic_GlPSiFdKp3y1dZcnAE25vyKoB_qYXoxj61V68bMgd6i5d4CcYyruqknzYFDsyh5Qg" />
                                   <Link to="/Viewphoto"><button className="view-all-btn btn d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined fs-6">grid_view</span>
                                    VIEW ALL PHOTOS
                                 </button>
                                 </Link>
                              </div>
                              <div className="row g-3">
                                 <div className="col-lg-3 col-sm-6 col-6">
                                    <img alt="Thumb 1" className="w-100 gallery-thumb" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7Q3CdiGRwdBG8HWtZvXCVWXWmRHZBOstII4Jgo6FQvGT0Ql5JemmGTgTl2GsWkOANqLnbpaXhlQNTWdnk7ArfQPW6wGvRvRFHMXl0H4H2cCG0IJ9tjtHNyyd-FUG2p-BgLf8Al43mnF10pkE8EIav0ilF1I2a-aH8Cwybs1cZZfqI8rTktq2N5ShXrhKlnkaUjAd2OpHmgrmwtqksWo2OvjMbbuA9GfylXXMMRLPh58RRy0r0MvKCMw" />
                                 </div>
                                 <div className="col-lg-3 col-sm-6 col-6">
                                    <img alt="Thumb 2" className="w-100 gallery-thumb" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD3YjfCUyQf6xWAULB9ipz3qNLYBUccUZvhYJZWJZoQGTxlCMqgC9dcqOcXYnwrNNI_BU4CnWcrUzn2LmpNC6h-hGQqCOkgZ0LrRHojwWeEIbYR4PipDc13iFmMOoZQyI5bP-2XW-Tvt_6cYAQqX28n4HeI6aKTSx_4-nOj742wr0sMzoRsn0WbQwYNgJpWNXC28iTdj1Zjx_J--6wt-TUoDGeqIkZt1Oxf4zTh-1Z6MoCujUfvzbj7g" />
                                 </div>
                                 <div className="col-lg-3 col-sm-6 col-6">
                                    <img alt="Thumb 3" className="w-100 gallery-thumb" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAAnKKJlX04DibLty1NMMB7p05jEv-Qua_IiNDn-12KOze1BasommYL2kVqMmz1NfQA-gezn9ZYL3s_wVKjOjpoGs1q-SjwilRa58ngt9VvdUCOV1mY-R4q6ajQ0djQp34YvHFsJvZsFApF-niY6EbpQg8Dl1u7zXrQmJ5k9vl_7N6W6V2h33WPLvOZUGvkfNEzElefoyG9vbx1m2iIXH0ZV-5kCSy4ZLBrcKbpJNn3o4hCTGqfcE7Tg" />
                                 </div>
                                 <div className="col-lg-3 col-sm-6 col-6">
                                    <div className="position-relative h-100">
                                       <img alt="Thumb 4" className="w-100 gallery-thumb opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpgJuSmi_ip3SDUMTI2h9ppRyXcPsRqNVRdFXRgtcwD6zKXqJ5Oxz5Ao5WW6ZFwUY9P7dDZEK0LO0VvQimgZcBSutnm0whTNCsZfPGstPTJzFKvy-UpMH49C0HGL6WdRPwVXDLuaQGVPQs2bLbGHdymvQteOFrp51gbrsredui_Gq4H6uzTDaLnWYPzrtG4gdDYi3Wva_3vqqGv8UMgKWrQhpJ1tHhW3huY_2tLnLYWXlSOEUVa9NCjQ" />
                                       <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                                          <span className="fw-bold text-dark more-photos-label">+12 More</span>
                                       </div>
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
                                 <span className="material-symbols-outlined text-primary me-3">king_bed</span>
                                 <div>
                                    <div className="fw-bold mb-1">King Studio Suite</div>
                                    <div className="small text-muted">Bespoke 750 sq. ft. living space with high ceilings and crown molding.</div>
                                 </div>
                              </div>
                              <div className="d-flex mb-4">
                                 <span className="material-symbols-outlined text-primary me-3">bathtub</span>
                                 <div>
                                    <div className="fw-bold mb-1">En-suite Bathroom</div>
                                    <div className="small text-muted">Carrara marble vanity with heated flooring and rainfall shower.</div>
                                 </div>
                              </div>
                              <div className="d-flex">
                                 <span className="material-symbols-outlined text-primary me-3">work</span>
                                 <div>
                                    <div className="fw-bold mb-1">Integrated Workstation</div>
                                    <div className="small text-muted">Built-in mahogany desk with high-speed fiber optic connectivity.</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="col-md-6">
                           <div className="parchment-card">
                              <h3 className="h5 mb-4 border-bottom pb-2 text-primary">About The Apartment</h3>
                              <div className="d-flex mb-4">
                                 <span className="material-symbols-outlined text-primary me-3">apartment</span>
                                 <div>
                                    <div className="fw-bold mb-1">Victorian Premier Wing</div>
                                    <div className="small text-muted">Located on the 12th floor with panoramic northern views of the park.</div>
                                 </div>
                              </div>
                              <div className="d-flex mb-4">
                                 <span className="material-symbols-outlined text-primary me-3">groups</span>
                                 <div>
                                    <div className="fw-bold mb-1">Shared Common Areas</div>
                                    <div className="small text-muted">Access to the private library, gourmet kitchen, and grand salon.</div>
                                 </div>
                              </div>
                              <div className="d-flex">
                                 <span className="material-symbols-outlined text-primary me-3">history</span>
                                 <div>
                                    <div className="fw-bold mb-1">Building A Heritage</div>
                                    <div className="small text-muted">A 1920s landmark meticulously restored for modern institutional living.</div>
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
                                    <div className="amenity-icon"><span className="material-symbols-outlined">ac_unit</span></div>
                                    <span className="amenity-text">Climate Control</span>
                                 </div>
                                 <div className="col-6 col-md-3">
                                    <div className="amenity-icon"><span className="material-symbols-outlined">wifi</span></div>
                                    <span className="amenity-text">Giga-Fiber Wifi</span>
                                 </div>
                                 <div className="col-6 col-md-3">
                                    <div className="amenity-icon"><span className="material-symbols-outlined">cleaning_services</span></div>
                                    <span className="amenity-text">Daily Housekeeping</span>
                                 </div>
                                 <div className="col-6 col-md-3">
                                    <div className="amenity-icon"><span className="material-symbols-outlined">concierge</span></div>
                                    <span className="amenity-text">24/7 Concierge</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                        {/* Calendar */}
                        <div className="col-12">
                           <div className="parchment-card">
                              <div className="d-flex justify-content-between align-items-center mb-4">
                                 <h3 className="h5 mb-0 text-primary">Select Preferred Move-in Date</h3>
                              </div>
                              <Calendar />
                              <div className="info-box d-flex align-items-start gap-3">
                                 <span className="material-symbols-outlined text-primary fs-5">info</span>
                                 <p className="mb-0">Standard institutional residency terms begin on the 1st or 15th of the month. Preferred move-in dates are subject to availability.</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  {/* Right Column: Sidebar */}
                  <div className="col-xl-4">
                     <div className="parchment-card summary-card shadow-lg p-4">
                        <h2 className="h4 text-primary mb-4">Booking Summary</h2>
                        <div className="mb-4">
                           <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="small text-muted text-uppercase fw-bold summary-label">Unit Specification</span>
                              <a className="small text-primary text-decoration-underline" href="#">Change</a>
                           </div>
                           <div className="h6 fw-bold mb-0">Victorian Premier, Suite 402</div>
                        </div>
                        <div className="mb-4">
                           <span className="small text-muted text-uppercase fw-bold d-block mb-1 summary-label">Agreement Type</span>
                           <div className="h6 mb-0">Annual Lease [Fixed Term]</div>
                        </div>
                        <hr className="my-4 opacity-10" />
                        <div className="d-flex justify-content-between align-items-center mb-3">
                           <span className="fw-bold">Monthly Residency Rate</span>
                           <span className="h5 mb-0 fw-bold text-primary">$3,450.00</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                           <span className="fw-bold">Holding Deposit (50%)</span>
                           <span className="h5 mb-0 fw-bold text-muted">$1,725.00</span>
                        </div>
                        <div className="d-grid gap-3 mb-4">
                           <button className="btn btn-primary-elite">Lock In Residency</button>
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

