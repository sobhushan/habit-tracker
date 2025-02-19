// import { useState, useEffect } from "react";
// import axios from "axios";
// import { format, addMonths, subMonths } from "date-fns";
// import Calendar from "./Calendar";
// import "./event.css";

// const viewOptions = ["Month", "Week", "Day"];

// const EventScheduler: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [viewMode, setViewMode] = useState("Month");
//   const [habits, setHabits] = useState<any[]>([]);

//   // Handlers
//   const goToToday = () => setSelectedDate(new Date());
//   const goToPrevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
//   const goToNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));

//   useEffect(() => {
//     const userId = localStorage.getItem("user_id");
//     if (!userId) {
//       alert("Unauthorized access");
//       window.location.href = "/";
//       return;
//     }

//     const fetchHabits = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/habits?user_id=${userId}`);
//         console.log('Habits data for cal:', response.data);
//         setHabits(response.data);
//       } catch (error) {
//         console.error("Error fetching habits:", error);
//       }
//     };

//     fetchHabits();
//   }, []);

//   const getHabitForDay = (date: Date) => {
//     const day = format(date, "yyyy-MM-dd");
//     const habit = habits.find((habit) => habit.created_at && habit.created_at.startsWith(day)); // Check if created_at is defined
//     return habit ? habit.title : "";
//   };

//   // Function to generate the days for the month view
//   const generateCalendarGrid = () => {
//     const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
//     const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

//     // Adjust start date to be Sunday (or previous Saturday if the 1st of the month is not Sunday)
//     const startDate = new Date(startOfMonth);
//     startDate.setDate(startOfMonth.getDate() - startOfMonth.getDay()); // Set to previous Sunday

//     const endDate = new Date(endOfMonth);
//     endDate.setDate(endOfMonth.getDate() + (6 - endOfMonth.getDay())); // Set to next Saturday

//     // Calculate number of rows required to display the whole month
//     const totalDays = Math.ceil((endDate.getDate() - startDate.getDate()) / 7) + 1;
//     let weeks = [];

//     // Generate each week
//     for (let weekIndex = 0; weekIndex < totalDays; weekIndex++) {
//       const week = [];
//       for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
//         const currentDate = new Date(startDate);
//         currentDate.setDate(startDate.getDate() + (weekIndex * 7) + dayIndex);
//         if (currentDate.getMonth() === selectedDate.getMonth()) {
//           week.push(currentDate);
//         } else {
//           week.push(null); // For days outside the current month
//         }
//       }
//       weeks.push(week);
//     }


//     return weeks;
//   };

//   return (
//     <div className="container-fluid mt-4">
//       <div className="row">
//         {/* Left Panel: User Greeting & Date Picker */}
//         <div className="col-md-3">
//           <div className="card p-3 text-center mb-4">
//             <div className="card-body text-center">
//               <h4 className="card-title">Hello, {localStorage.getItem("username")}!</h4>
//               <img
//                 src="/habit logo.png"
//                 alt="User"
//                 className="rounded-circle mx-auto d-block"
//                 style={{ width: "200px", height: "200px" }}
//               />
//               <p>Choose a date below:</p>
//               <div className="calendar-container">
//                 <Calendar value={selectedDate} userId={localStorage.getItem("user_id") as string} onChange={(date) => setSelectedDate(date)} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Panel: Monthly Calendar Grid */}
//         <div className="col-md-9">
//           {/* Calendar Header */}
//           <div className="card p-3">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <div className="d-flex gap-2">
//               <button onClick={goToToday} className="btn btn-sm btn-primary">Today</button>
//               <button onClick={goToPrevMonth} className="btn btn-sm btn-light">&lt;</button>
//               <button onClick={goToNextMonth} className="btn btn-sm btn-light">&gt;</button>
//             </div>
//             <span className="font-weight-bold">{format(selectedDate, "MMMM yyyy")}</span>
//           </div>

//           {/* Calendar Grid */}
//           <div className="calendar-grid">
//             {/* Weekdays */}
//             <div className="row text-center">
//               {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//                 <div className="col-1" key={day}>
//                   <strong>{day}</strong>
//                 </div>
//               ))}
//             </div>

//             {/* Generate days of the current month */}
//             {generateCalendarGrid().map((week, rowIndex) => (
//               <div className="row" key={rowIndex}>
//                 {week.map((currentDate, colIndex) => {
//                   if (currentDate === null) return <div className="col-1" key={colIndex}></div>; // Empty space for out-of-month days
//                   const habit = getHabitForDay(currentDate);
//                   return (
//                     <div className="col-1" key={colIndex}>
//                       <div className="calendar-day">
//                         <div>{currentDate.getDate()}</div>
//                         {habit && <div className="habit-text">{habit.title}</div>}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventScheduler;

//============================================

import { useState, useEffect } from "react";
import axios from "axios";
import { format, addMonths, subMonths } from "date-fns";
import Calendar from "./Calendar/Calendar";

const EventScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("Month");
  const [habits, setHabits] = useState<any[]>([]);

  // Handlers
  const goToToday = () => setSelectedDate(new Date());
  const goToPrevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
  const goToNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Unauthorized access");
      window.location.href = "/";
      return;
    }

    const fetchHabits = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/habits?user_id=${userId}`);
        console.log('Habits data for calendar:', response.data);
        setHabits(response.data);
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };

    fetchHabits();
  }, []);

  const getHabitForDay = (date: Date) => {
    const day = format(date, "yyyy-MM-dd");
    const habit = habits.find((habit) => habit.created_at && habit.created_at.startsWith(day));
    return habit ? habit.title : "";
  };

  // Function to generate the days for the month view
  const generateCalendarGrid = () => {
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  
    // Adjust start date to be Sunday (or previous Saturday if the 1st of the month is not Sunday)
    const startDate = new Date(startOfMonth);
    startDate.setDate(startOfMonth.getDate() - startOfMonth.getDay()); // Set to previous Sunday
  
    const endDate = new Date(endOfMonth);
    endDate.setDate(endOfMonth.getDate() + (6 - endOfMonth.getDay())); // Set to next Saturday
  
    // Log the start and end dates to debug
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
  
    // Calculate the total number of days between start and end
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    console.log("Total Days:", totalDays); // Log the total number of days
  
    // Calculate the number of weeks (7 days per week)
    const totalWeeks = Math.ceil(totalDays / 7);
    console.log("Total Weeks:", totalWeeks); // Log the total number of weeks
  
    let weeks = [];
  
    // Generate each week
    for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
      const week = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (weekIndex * 7) + dayIndex);
        
        if (currentDate.getMonth() === selectedDate.getMonth()) {
          week.push(currentDate);
        } else {
          week.push(null); // For days outside the current month
        }
      }
      weeks.push(week);
    }
  
    // Log the weeks to check if the grid is being generated correctly
    console.log("Generated Calendar Grid:", weeks);
    return weeks;
  };
  
  

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Left Panel: User Greeting & Date Picker */}
        <div className="col-md-3">
          <div className="card p-3 text-center mb-4">
            <div className="card-body text-center">
              <h4 className="card-title">Hello, {localStorage.getItem("username")}!</h4>
              <img
                src="/habit logo.png"
                alt="User"
                className="rounded-circle mx-auto d-block"
                style={{ width: "200px", height: "200px" }}
              />
              <p>Choose a date below:</p>
              <div className="calendar-container">
                <Calendar value={selectedDate} userId={localStorage.getItem("user_id") as string} onChange={(date) => setSelectedDate(date)} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Monthly Calendar Grid */}
        <div className="col-md-9">
          {/* Calendar Header */}
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex gap-2">
                <button onClick={goToToday} className="btn btn-sm btn-primary">Today</button>
                <button onClick={goToPrevMonth} className="btn btn-sm btn-light">&lt;</button>
                <button onClick={goToNextMonth} className="btn btn-sm btn-light">&gt;</button>
              </div>
              <span className="font-weight-bold">{format(selectedDate, "MMMM yyyy")}</span>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
              {/* Weekdays */}
              <div className="row text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div className="col-1" key={day}>
                    <strong>{day}</strong>
                  </div>
                ))}
              </div>

              {/* Generate days of the current month */}
              {generateCalendarGrid().map((week, rowIndex) => (
                <div className="row" key={rowIndex}>
                  {week.map((currentDate, colIndex) => {
                    if (currentDate === null) return <div className="col-1" key={colIndex}></div>; // Empty space for out-of-month days
                    const habit = getHabitForDay(currentDate);
                    return (
                      <div className="col-1" key={colIndex}>
                        <div className="calendar-day">
                          <div>{currentDate.getDate()}</div>
                          {habit && <div className="habit-text">{habit}</div>} {/* Display habit title */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventScheduler;

//================================================

