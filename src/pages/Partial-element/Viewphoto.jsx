import React from 'react'
import PageLayout from "../../components/PageLayout";
const Viewphoto = () => {

  const categories = ['ALL SPACES', 'LIVING ROOMS', 'SLEEPING', 'AMENITIES'];
  return (
    <>      <PageLayout page="SecureBooking">
      <div className='container-fluid py-5 px-lg-5 flex-grow-1 scheduling-section bg-field'>
        <main className="container container-narrow">
          <div class="row align-items-end mb-5 gy-4">
            <div className="col-lg-7">
              <a href='view-room' className="text-decoration-none d-flex align-items-center gap-2 mb-3 text-muted-custom nav-link-custom">
                <span className="material-symbols-outlined fs-6">arrow_back</span>
                <span>BACK TO PROPERTY</span>
              </a>
              <h1 class="display-4 serif-heading heading-hero mb-3 hero-title">Available Residences</h1>
              <p className="text-muted-custom fs-5 mb-0">A complete visual journey through the heritage-inspired architecture and bespoke interiors of our most exclusive residence.</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-8">
              <div className=" animated-card ratio ratio-16x9 overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=800"
                  alt="Luxury Bath Detail"
                  className="img-fluid object-fit-cover hover-zoom"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="animated-card h-100 ratio ratio-4x5 overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=800"
                  alt="Luxury Bath Detail"
                  className="img-fluid object-fit-cover hover-zoom"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="animated-card ratio ratio-1x1 overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800"
                  alt="Gourmet Kitchen"
                  className="img-fluid object-fit-cover hover-zoom"
                />
              </div>
            </div>

            <div className="col-md-8">
              <div className="animated-card ratio ratio-21x9 overflow-hidden shadow-sm h-100">
                <img
                  src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200"
                  alt="Panoramic Terrace View"
                  className="img-fluid object-fit-cover hover-zoom"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="animated-card ratio ratio-4x3 overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200"
                  alt="Private Library"
                  className="img-fluid object-fit-cover hover-zoom"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="animated-card ratio ratio-4x3 overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800"
                  alt="Bespoke Wardrobe"
                  className="img-fluid object-fit-cover hover-zoom"
                />
              </div>
            </div>
          </div>
          <div className="text-center mt-5 pt-4">
            <button className="btn btn-outline-dark rounded-0 px-5 py-3 text-uppercase tracking-widest mb-3">
              Load 12 More Images ↓
            </button>
            <p className="text-muted small">DISPLAYING 6 OF 42 PHOTOGRAPHS</p>
          </div>
        </main>
      </div>

    </PageLayout>
    </>
  )
}

export default Viewphoto