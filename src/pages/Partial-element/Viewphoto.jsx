import React from 'react'
import PageLayout from "../../components/PageLayout";
import { Link } from 'react-router-dom';
const Viewphoto = () => {

  const categories = ['ALL SPACES', 'LIVING ROOMS', 'SLEEPING', 'AMENITIES'];
  return (
    <>      <PageLayout page="SecureBooking">
      <div className='container-fluid py-5 px-lg-5 flex-grow-1 scheduling-section bg-field'>
        <main className="container container-narrow">
          <div className="row align-items-end mb-5 gy-4">
            <div className="col-lg-7">
              <Link to='/view-room' className="text-decoration-none d-flex align-items-center gap-2 mb-3 text-muted-custom nav-link-custom">
                <span className="material-symbols-outlined fs-6">
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.75 23.75C18.5855 23.751 18.4224 23.7195 18.2701 23.6572C18.1178 23.595 17.9793 23.5034 17.8625 23.3875L10.3625 15.8875C10.1297 15.6533 9.99902 15.3365 9.99902 15.0063C9.99902 14.6761 10.1297 14.3592 10.3625 14.125L17.8625 6.62503C18.1016 6.42025 18.4092 6.31324 18.7238 6.3254C19.0384 6.33755 19.3368 6.46796 19.5595 6.69058C19.7821 6.9132 19.9125 7.21162 19.9247 7.52622C19.9368 7.84081 19.8298 8.14841 19.625 8.38753L13.0125 15L19.625 21.6125C19.8005 21.7866 19.9205 22.0089 19.9697 22.2511C20.019 22.4934 19.9953 22.7448 19.9016 22.9736C19.8079 23.2024 19.6485 23.3983 19.4436 23.5365C19.2386 23.6747 18.9972 23.749 18.75 23.75Z" fill="black"/>
</svg>
</span>
                <span>BACK TO PROPERTY</span>
              </Link>
              <h1 className="display-4 serif-heading heading-hero mb-3 hero-title">Available Residences</h1>
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