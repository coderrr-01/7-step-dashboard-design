import { useEffect, useState } from "react";
import "../../assets/styles/slider-style.css"

const FALLBACK_IMAGES = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLIVJXsIscLTS8nP6Dbmcv1vsoRkem09JkmvrDOgiZBWN63o7ikKL9Dqs&s=10"
];

function ResidenceSlider({ images: propImages }) {


    const images = (Array.isArray(propImages) && propImages.length > 0)
        ? propImages
        : FALLBACK_IMAGES;



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