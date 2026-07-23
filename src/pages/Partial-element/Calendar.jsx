import { useState } from "react";
import "../../assets/styles/calendar-style.css"


function Calendar({ onSelectDate }) {


  const [currentDate, setCurrentDate] = useState(
    new Date()
  );
const today = new Date();

  const [selectedDate, setSelectedDate] = useState(
     today.getDate()
  );

  const [showPicker, setShowPicker] = useState(false);



  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];


  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();



  const days = [
    "S", "M", "T", "W", "T", "F", "S"
  ];



  const totalDays = new Date(
    year,
    month + 1,
    0
  ).getDate();



  const startDay = new Date(
    year,
    month,
    1
  ).getDay();



  const dates = [];



  for (let i = 0; i < startDay; i++) {

    dates.push("");

  }


  for (let i = 1; i <= totalDays; i++) {

    dates.push(i);

  }





  const changeMonth = (index) => {


    setCurrentDate(

      new Date(
        year,
        index,
        1
      )

    );


    setShowPicker(false);


  }



  const changeYear = (e) => {


    setCurrentDate(

      new Date(
        Number(e.target.value),
        month,
        1
      )

    );
    


  }






  return (


    <div className="calendar-widget">



      <div className="calendar-header">



        <button

          className="month-title"

          onClick={() => setShowPicker(!showPicker)}

        >

          {
            months[month]
          } {year}


        </button>




        <div className="d-flex gap-2">


          <button

            className="border rounded p-1 bg-white"

            onClick={() => {

              setCurrentDate(
                new Date(year, month - 1, )
              )

            }}

          >

            <i className="bi bi-chevron-left"></i>

          </button>




          <button

            className="border rounded p-1 bg-white"

            onClick={() => {

              setCurrentDate(
                new Date(year, month + 1, 1)
              )

            }}

          >

            <i className="bi bi-chevron-right"></i>

          </button>



        </div>


      </div>






      {
        showPicker &&

        <div className="month-picker">


          <select

            value={year}

            onChange={changeYear}

          >

            {

              Array.from(
                { length: 20 },
                (_, i) => 2020 + i
              )

                .map((yr) => (


                  <option

                    key={yr}

                    value={yr}

                  >

                    {yr}

                  </option>


                ))


            }

          </select>



          <div className="months-list">


            {

              months.map((m, index) => (


                <button

                  key={m}

                  className={
                    index === month ? "active-month" : ""
                  }


                  onClick={() => changeMonth(index)}

                >

                  {m}


                </button>


              ))


            }



          </div>



        </div>


      }







      <div className="calendar-grid">


        {
          days.map((day) => (

            <div className="calendar-day-label">

              {day}

            </div>

          ))

        }



        {

          dates.map((date, index) => (


            <div

              key={index}

              className={

                `calendar-date

${date === "" ? "muted" : ""}

${selectedDate === date ? "active" : ""}

`

              }


              onClick={() => {
                if (!date) return;
                setSelectedDate(date);
                if (onSelectDate) {
                  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  const yr = currentDate.getFullYear();
                  const mo = currentDate.getMonth();
                  const label = `${months[mo]} ${date}, ${yr}`;
                  // Format for WP plugin: dd/mm/yyyy
                  const padded = String(date).padStart(2,'0');
                  const moPadded = String(mo + 1).padStart(2,'0');
                  onSelectDate({ label, value: `${padded}/${moPadded}/${yr}` });
                }
              }}

            >


              {date}


            </div>


          ))


        }


      </div>



    </div>


  )

}


export default Calendar;