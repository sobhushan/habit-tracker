//src/pages/Statistics.tsx
import { useState} from "react";
// import axios from "axios";
import { format, addMonths, subMonths,  } from "date-fns";
import Calendar from "../components/Calendar/Calendar";
import Dashnav from "../components/Dashnav";
import Habitview from "../components/Habitview";

const viewOptions = ["Month", "Week", "Day"];

const Statistics = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("Month");
  // const [habits, setHabits] = useState<any[]>([]);

  // Handlers
  const goToToday = () => setSelectedDate(new Date());
  const goToPrevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
  const goToNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));

  const handleDateChange = (date: Date) => {
    console.log("Clicked date:", format(date, "yyyy-MM-dd"));
    // setSelectedDate(date); // Update selected date if needed
  };

  return (
    <>
      <Dashnav />
      <div className="container-fluid mt-4">
        <div className="row">
        {/* Left Panel: User Greeting & Date Picker */}
        <div className="col-md-4">
          <div className="card p-3 text-center mb-4">
            <div className="card-body text-center">
              <h4 className="card-title">Hello, {localStorage.getItem("username")}!</h4>
              <img
                src="/habit logo.png"
                alt="User"
                className="rounded-circle mx-auto d-block"
                style={{ width: "200px", height: "200px" }}
              />
              <div className="calendar-container" >
                <Calendar value={selectedDate} user_id={Number(localStorage.getItem("user_id"))} onChange={(date) => setSelectedDate(date)} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Monthly Calendar Grid */}
        <div className="col-md-8">
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2">
                  <button onClick={goToToday} className="btn btn-sm btn-primary">Today</button>
                  <button onClick={goToPrevMonth} className="btn btn-sm btn-light">&lt;</button>
                  <button onClick={goToNextMonth} className="btn btn-sm btn-light">&gt;</button>
                  <span className="text-xl font-bold cursor-pointer">{format(selectedDate, "MMMM yyyy")}</span>
                </div>
                <span>
                  <div className="d-flex items-center gap-4">
                    <select 
                      value={viewMode} 
                      onChange={(e) => setViewMode(e.target.value)} 
                      className="border p-1 rounded"
                    >
                      {viewOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </span>
            </div>
            <div className="card-body">
            <Habitview 
              value={selectedDate} 
              onChange={handleDateChange} 
              user_id={Number(localStorage.getItem("user_id"))} 
            />
            </div>  


          </div>
        </div>


        </div>
      </div>
    </>
  )
}

export default Statistics;