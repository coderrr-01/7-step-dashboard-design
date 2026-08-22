import { useEffect, useState } from "react";
import "../../assets/styles/slider-style.css"


function ResidenceSlider() {


    const images = [

        // "https://lh3.googleusercontent.com/aida-public/AB6AXuAyxb-niOqojyB9NLOCEf03t3XTgG4lYmI46J2ZrJxZgFgrJKNAOVpPP9UCVHlZR3fsDS4PUpumNrdG9E6mZiSzDa1ZSQqT_TqNzbgJc_pAczRGnSBJgq-lGHZA3sz16-L4SoefO_xyCkM_NYsjey-e_moju4s9uHEH3ltiA5efzSfBUAo39zdBglNI1OS9hID5xS3BW_E-Gt3Zhsz66VJEJxPe-d9d4d0unKjAOstgOvMyE0gJmNNMmJtVmUmMBU6UX03edP49RUg8",

        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLIVJXsIscLTS8nP6Dbmcv1vsoRkem09JkmvrDOgiZBWN63o7ikKL9Dqs&s=10"

    ];



    const [active, setActive] = useState(0);

    const [animate, setAnimate] = useState(true);



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


    }, []);





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