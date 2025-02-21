// //src/pages/Statistics.tsx
// import { useState} from "react";
// // import axios from "axios";
// import { format, addMonths, subMonths,  } from "date-fns";
// import Calendar from "../components/Calendar/Calendar";
// import Dashnav from "../components/Dashnav";
// import Habitview from "../components/Habitview";

// const viewOptions = ["Month", "Week", "Day"];

// const Statistics = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [viewMode, setViewMode] = useState("Month");
//   // const [habits, setHabits] = useState<any[]>([]);

//   // Handlers
//   const goToToday = () => setSelectedDate(new Date());
//   const goToPrevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
//   const goToNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));

//   const handleDateChange = (date: Date) => {
//     console.log("Clicked date:", format(date, "yyyy-MM-dd"));
//     // setSelectedDate(date); // Update selected date if needed
//   };

//   return (
//     <>
//       <Dashnav />
//       <div className="container-fluid mt-4">
//         <div className="row">
//         {/* Left Panel: User Greeting & Date Picker */}
//         <div className="col-md-4">
//           <div className="card p-3 text-center mb-4">
//             <div className="card-body text-center">
//               <h4 className="card-title">Hello, {localStorage.getItem("username")}!</h4>
//               <img
//                 src="/habit logo.png"
//                 alt="User"
//                 className="rounded-circle mx-auto d-block"
//                 style={{ width: "200px", height: "200px" }}
//               />
//               <div className="calendar-container" >
//                 <Calendar value={selectedDate} user_id={Number(localStorage.getItem("user_id"))} onChange={(date) => setSelectedDate(date)} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Panel: Monthly Calendar Grid */}
//         <div className="col-md-8">
//           <div className="card p-3">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div className="d-flex gap-2">
//                   <button onClick={goToToday} className="btn btn-sm btn-primary">Today</button>
//                   <button onClick={goToPrevMonth} className="btn btn-sm btn-light">&lt;</button>
//                   <button onClick={goToNextMonth} className="btn btn-sm btn-light">&gt;</button>
//                   <span className="text-xl font-bold cursor-pointer">{format(selectedDate, "MMMM yyyy")}</span>
//                 </div>
//                 <span>
//                   <div className="d-flex items-center gap-4">
//                     <select 
//                       value={viewMode} 
//                       onChange={(e) => setViewMode(e.target.value)} 
//                       className="border p-1 rounded"
//                     >
//                       {viewOptions.map((option) => (
//                         <option key={option} value={option}>{option}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </span>
//             </div>
//             <div className="card-body">
//             <Habitview 
//               value={selectedDate} 
//               onChange={handleDateChange} 
//               user_id={Number(localStorage.getItem("user_id"))} 
//             />
//             </div>  


//           </div>
//         </div>


//         </div>
//       </div>
//     </>
//   )
// }

// export default Statistics;

//=================================================================================
import { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import Calendar from "../components/Calendar/Calendar";
import Dashnav from "../components/Dashnav";
import Habitview from "../components/Habitview";
import AddHabitModal from "../components/AddModal";
import ViewHabitsOffcanvas from "../components/Offcanvas";

const Statistics = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("Month");
  const [showModal, setShowModal] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const today = new Date();
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  const isPast = selectedDate < today;
  // const isFuture = selectedDate > today;

  const [clickedPosition, setClickedPosition] = useState<{ top: number; left: number } | null>(null);
  //month viewer
  const handleDateClick = (event: React.MouseEvent<HTMLDivElement>, date: Date) => {
    if (!event.currentTarget) return; // Safety check
  
    setSelectedDate(date);
    setPopoverVisible(true);
  
    // Ensure event.currentTarget is treated as an HTML element
    // const target = event.currentTarget as HTMLElement;
    // const rect = target.getBoundingClientRect();
  
    setClickedPosition({
      // top: rect.top + window.scrollY, // Account for scrolling
      // left: rect.left + window.scrollX,
      top: 10, // A small offset from the top
      left: window.innerWidth / 2, // Center it horizontally
    });
  };

  //date picker
  const handleDateChange = (date: Date) => {
        console.log("Clicked date:", format(date, "yyyy-MM-dd"));
        setSelectedDate(date); 
      };
  

  return (
    <>
      <Dashnav /> 
      <div className="container-fluid bg-blue-200">
        <div className="row">
          {/* Left Panel */}
          <div className="col-md-4 mt-4">
            <div className="card p-3 text-center mb-4">
              <div className="card-body text-center">
                <h4 className="card-title">Hello, {localStorage.getItem("username")}!</h4>
                <img
                  src="/habit logo.png"
                  alt="User"
                  className="rounded-circle mx-auto d-block"
                  style={{ width: "200px", height: "200px" }}
                />
                <div className="calendar-container position-relative">
                  <Calendar
                    value={selectedDate}
                    user_id={Number(localStorage.getItem("user_id"))}
                    onChange={handleDateChange}
                  />

                  {/* Custom Popover */}
                  {/* {popoverVisible && (isToday || isPast) && (
                    <div className="position-absolute bg-white shadow p-3 rounded" style={{ top: "50px", left: "50%" }}>
                      <h6>{format(selectedDate, "dd MMM yyyy")}</h6>
                      {isToday && (
                        <button className="btn btn-primary btn-sm w-100 mb-2" onClick={() => setShowModal(true)}>
                          Add Habit
                        </button>
                      )}
                      <button className="btn btn-success btn-sm w-100" onClick={() => setShowOffcanvas(true)}>
                        View Habits
                      </button>
                      <button className="btn btn-danger btn-sm w-100 mt-2" onClick={() => setPopoverVisible(false)}>
                        Close
                      </button>
                    </div>
                  )} */}

                  {/* Custom Popover */}
                  {/* Custom Popover */}
                  {popoverVisible && (isToday || isPast) && clickedPosition && (
                    <div
                      className="position-absolute bg-blue-100 shadow p-3 rounded"
                      style={{
                        top: `${clickedPosition.top - 20}px`, // Positions popover **above** the clicked date
                        left: `${clickedPosition.left}px`, // Aligns with the clicked date
                        transform: "translateX(-50%)", // Centers the popover
                        zIndex: 1050, // Ensures it appears on top
                      }}
                    >
                      {/* Popover Header */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">{format(selectedDate, "dd MMM yyyy")}</h6>
                        <button
                          className="btn btn-sm border-0"
                          onClick={() => setPopoverVisible(false)}
                          style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                        >
                          &times; {/* X Button */}
                        </button>
                      </div>

                      {/* Add Habit Button (Only for Today) */}
                      {isToday && (
                        <button
                          className="btn btn-primary btn-sm w-100 mb-2"
                          onClick={() => {
                            setShowModal(true);
                            setPopoverVisible(false); // Close popover
                          }}
                        >
                          Add Habit
                        </button>
                      )}

                      {/* View Habits Button */}
                      <button
                        className="btn btn-success btn-sm w-40"
                        onClick={() => {
                          setShowOffcanvas(true);
                          setPopoverVisible(false); // Close popover
                        }}
                      >
                        View Habits
                      </button>
                    </div>
                  )}


                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-md-8 mt-4">
            <div className="card p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2">
                  <button onClick={() => setSelectedDate(new Date())} className="btn btn-sm btn-primary">
                    Today
                  </button>
                  <button onClick={() => setSelectedDate(subMonths(selectedDate, 1))} className="btn btn-sm btn-light">
                    &lt;
                  </button>
                  <button onClick={() => setSelectedDate(addMonths(selectedDate, 1))} className="btn btn-sm btn-light">
                    &gt;
                  </button>
                  <span className="text-xl font-bold cursor-pointer">{format(selectedDate, "MMMM yyyy")}</span>
                </div>
                <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="border p-1 rounded">
                  {["Month", "Week", "Day"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="card-body">
                <Habitview
                  value={selectedDate}
                  onChange={handleDateClick}
                  user_id={Number(localStorage.getItem("user_id"))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal show={showModal} onClose={() => setShowModal(false)} />


      {/* View Habits Offcanvas */}
      <ViewHabitsOffcanvas show={showOffcanvas} onClose={() => setShowOffcanvas(false)} selectedDate={selectedDate} />
    </>
  );
};

export default Statistics;

