import { useState } from "react";

function Timeslot() {

    const [selectedTime, setSelectedTime] = useState("10:30 AM");


    const timeSlots = [
        "09:00 AM",
        "10:30 AM",
        "01:00 PM",
        "02:30 PM",
        "04:00 PM",
        "05:30 PM"
    ];



    return (

        <div className="row g-2 mb-3">

            {
                timeSlots.map((time) => (

                    <div className="col-4" key={time}>


                        <div

                            className={
                                selectedTime === time
                                    ?
                                    "slot-btn selected"
                                    :
                                    "slot-btn"
                            }


                            onClick={() => {

                                console.log("clicked", time);

                                setSelectedTime(time);

                            }}


                        >

                            {time}

                        </div>


                    </div>


                ))

            }


        </div>

    )

}
export default Timeslot