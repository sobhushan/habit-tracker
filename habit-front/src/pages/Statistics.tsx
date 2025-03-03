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
import { format, addMonths, subMonths, subDays, addDays, startOfWeek, endOfWeek } from "date-fns";
import Calendar from "../components/Calendar/Calendar";
import Dashnav from "../components/Dashnav";
import Habitview from "../components/Habitview";
import AddHabitModal from "../components/AddModal";
import ViewHabitsOffcanvas from "../components/Offcanvas";
import { Toast, ToastContainer } from "react-bootstrap";
import Confetti from "react-confetti";

const Statistics = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("Month");
  const [showModal, setShowModal] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [, setSearchTerm] = useState("");
  const [confettiActive, setConfettiActive] = useState(false);

  // Function to trigger confetti
  const triggerConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 5000); // Stop after 3 seconds
  };

  const today = new Date();
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  const isPast = selectedDate < today;
  // const isFuture = selectedDate > today;

  // const [clickedPosition, setClickedPosition] = useState<{ top: number; left: number } | null>(null);
  //month viewer
  const handleDateClick = (event: React.MouseEvent<HTMLDivElement>, date: Date) => {
    if (!event.currentTarget) return; // Safety check
  
    setSelectedDate(date);
    setPopoverVisible(true);
  
    // Ensure event.currentTarget is treated as an HTML element
    // const target = event.currentTarget as HTMLElement;
    // const rect = target.getBoundingClientRect();
  
    // setClickedPosition({
    //   // top: rect.top + window.scrollY, // Account for scrolling
    //   // left: rect.left + window.scrollX,
    //   top: 10, // A small offset from the top
    //   left: window.innerWidth / 2, // Center it horizontally
    // });
  };

  //date picker
  const handleDateChange = (date: Date) => {
        console.log("Clicked date:", format(date, "yyyy-MM-dd"));
        setSelectedDate(date); 
      };
  

  return (
    <>
    {confettiActive && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <Dashnav setSearchTerm={setSearchTerm}/> 
      <div className="container-fluid"
      style={{
        backgroundImage: "url('/images/wood-texture.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        // border: "2px solid #8B4513",
        boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)"
      }}>
        <div className="row">
          {/* Left Panel */}
          <div className="col-md-4 mt-4">
            <div className="card p-3 text-center mb-4" style={{backgroundColor:"#2c1852"}}>
              <div className="card-body text-center">
                <img
                  src="/habit logo.png"
                  alt="User"
                  className="rounded-circle mx-auto d-block border-4 border-blue-400 shadow-md"
                  style={{ width: "150px", height: "150px" }}
                />
                <h5 className="mt-3 text-light">Hello, {localStorage.getItem("username")} 👋</h5>
                
                <div className="calendar-container position-relative mt-2">
                  <Calendar
                    value={selectedDate}
                    user_id={Number(localStorage.getItem("user_id"))}
                    onChange={handleDateChange}
                  />

                  {/* Custom Toast Notification */}
                  <ToastContainer
                    className="p-3"
                    style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1050 }} // Correct way to fix position
                  >
                    <Toast
                      show={popoverVisible && (isToday || isPast)}
                      onClose={() => setPopoverVisible(false)}
                      bg="warning"
                      delay={3000}
                      autohide
                      style={{
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        minWidth: "250px",
                        backgroundColor:"#fde231"
                      }}
                    >
                      <Toast.Header closeButton={false} className="d-flex justify-content-between">
                        <strong className="me-auto">{format(selectedDate, "dd MMM yyyy")}</strong>
                        <button className="btn-close" onClick={() => setPopoverVisible(false)}></button>
                      </Toast.Header>
                      <Toast.Body className="text-center">
                        {isToday && (
                          <button
                            className="btn btn-light btn-sm w-100 mb-2"
                            onClick={() => {
                              setShowModal(true);
                              setPopoverVisible(false);
                            }}
                          >
                            ➕ Add Habit
                          </button>
                        )}
                        <button
                          className="btn btn-light btn-sm w-100"
                          onClick={() => {
                            setShowOffcanvas(true);
                            setPopoverVisible(false);
                          }}
                        >
                          📋 View Habits
                        </button>
                      </Toast.Body>
                    </Toast>
                  </ToastContainer>
                </div>
              </div>
            </div>
          </div>
          {/* Right Panel */}
          <div className="col-md-8 mt-4">
            <div className="card p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                {/* <div className="d-flex gap-2">
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
                </div> */}
                <div className="d-flex gap-2">
                <button onClick={() => setSelectedDate(new Date())} className="btn btn-sm btn-primary">
                  Today
                </button>
                
                {viewMode === "Month" ? (
                  <>
                    <button onClick={() => setSelectedDate(subMonths(selectedDate, 1))} className="btn btn-sm btn-light">
                      &lt;
                    </button>
                    <button onClick={() => setSelectedDate(addMonths(selectedDate, 1))} className="btn btn-sm btn-light">
                      &gt;
                    </button>
                    <span className="text-xl font-bold cursor-pointer">{format(selectedDate, "MMMM yyyy")}</span>
                  </>
                ) : (
                  <>
                    <button onClick={() => setSelectedDate(subDays(selectedDate, 7))} className="btn btn-sm btn-light">
                      &lt;
                    </button>
                    <button onClick={() => setSelectedDate(addDays(selectedDate, 7))} className="btn btn-sm btn-light">
                      &gt;
                    </button>
                    <span className="text-xl font-bold cursor-pointer">
                      {format(startOfWeek(selectedDate), "MMM dd")} - {format(endOfWeek(selectedDate), "MMM dd")}
                    </span>
                  </>
                )}
              </div>

                <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="border p-1 rounded">
                  {["Month", "Week"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="card-body mb-5 flex flex-col items-center w-full">
                <Habitview
                  value={selectedDate}
                  onChange={handleDateClick}
                  user_id={Number(localStorage.getItem("user_id"))}
                  viewMode={viewMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal show={showModal} onClose={() => setShowModal(false)} />


      {/* View Habits Offcanvas */}
      <ViewHabitsOffcanvas show={showOffcanvas} onClose={() => setShowOffcanvas(false)} selectedDate={selectedDate} onHabitComplete={triggerConfetti}/>
    </>
  );
};

export default Statistics;

