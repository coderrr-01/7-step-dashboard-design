import { useEffect, useState } from "react";
import "../../assets/styles/slider-style.css"

const FALLBACK_IMAGES = [
    "https://www.thespruce.com/thmb/_xQMAqSNbX2bjnfXDKOdtaZRFaI=/2048x0/filters:no_upscale():max_bytes(150000):strip_icc()/put-together-a-perfect-guest-room-1976987-hero-223e3e8f697e4b13b62ad4fe898d492d.jpg"
];

function ResidenceSlider({ images: propImages, fallbackSrc }) {


    const images = (Array.isArray(propImages) && propImages.length > 0)
        ? propImages
        : (fallbackSrc ? [fallbackSrc] : FALLBACK_IMAGES);



    const [active, setActive] = useState(0);

    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        setActive(0);
    }, [images]);

    useEffect(() => {


        const timer = setInterval(() => {


            setAnimate(false);


            setTimeout(() => {


                setActive(prev =>
                    (prev + 1) % images.length
                );


                setAnimate(true);


            }, 100);


        }, 4000);



        return () => clearInterval(timer);


    }, [images.length]);





    const changeSlide = (index) => {


        setAnimate(false);


        setTimeout(() => {

            setActive(index);

            setAnimate(true);

        }, 100);


    }




    return (


        <div className="residence-carousel">


            <div

                className={`slider-image ${animate ? "show" : ""}`}

            >


                <img

                    src={images[active]}

                    alt="Residence"


                />


            </div>





            <div className="slider-dots">


                {
                    images.map((_, index) => (


                        <button

                            key={index}

                            className={
                                active === index ? "active-dot" : ""
                            }
                            onClick={() => changeSlide(index)}

                        >

                        </button>


                    ))

                }


            </div>





            <button

                className="slider-arrow left"

                onClick={() => changeSlide(
                    (active - 1 + images.length) % images.length
                )}

            >

                ‹

            </button>




            <button

                className="slider-arrow right"

                onClick={() => changeSlide(
                    (active + 1) % images.length
                )}

            >

                ›

            </button>



        </div>


    )

}

export default ResidenceSlider;