import { useState } from "react";

function Timeslot({ selectedTime: externalTime, onSelectTime, bookedSlots = [] }) {

    const [internalTime, setInternalTime] = useState("10:30 AM");
    const selectedTime = externalTime !== undefined ? externalTime : internalTime;

    const handleSelect = (time) => {
        if (bookedSlots.includes(time)) return;
        setInternalTime(time);
        if (onSelectTime) onSelectTime(time);
    };

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
                                bookedSlots.includes(time)
                                    ? "slot-btn booked"
                                    : selectedTime === time
                                    ? "slot-btn selected"
                                    : "slot-btn"
                            }

                            onClick={() => handleSelect(time)}
                            style={{ cursor: bookedSlots.includes(time) ? 'not-allowed' : 'pointer', opacity: bookedSlots.includes(time) ? 0.45 : 1 }}
                            title={bookedSlots.includes(time) ? 'This slot is already booked' : ''}

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
