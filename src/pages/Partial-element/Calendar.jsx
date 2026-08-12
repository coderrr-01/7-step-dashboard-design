import { useState } from "react";
import "../../assets/styles/calendar-style.css"


function Calendar() {


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

          <span className="month-name">

            {months[month]}

          </span>

          <span className="month-year">

            {year}

          </span>

        </button>



        <div className="d-flex gap-2">


          <button

            className="calendar-nav-btn"

            onClick={() => {

              setCurrentDate(
                new Date(year, month - 1, )
              )

            }}

          >

            <i className="bi bi-chevron-left"></i>

          </button>





          <button

            className="calendar-nav-btn"

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

${date !== "" && (startDay + index) % 7 === 0 ? "weekend" : ""}

${date !== "" && (startDay + index) % 7 === 6 ? "weekend" : ""}

${selectedDate === date ? "active" : ""}

${date !== "" && date === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? "today" : ""}

`

              }


              onClick={() => date && setSelectedDate(date)}

            >


              {date}


              {date !== "" && <span className="date-marker"></span>}


            </div>


          ))


        }


      </div>



    </div>


  )

}


export default Calendar;