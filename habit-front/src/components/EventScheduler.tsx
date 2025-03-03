// // // src/components/EventScheduler.tsx
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { format, addMonths, subMonths } from "date-fns";
// import Calendar from "./Calendar";

// const viewOptions = ["Month", "Week", "Day"];

// const EventScheduler: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [viewMode, setViewMode] = useState("Month");
//   const [showCalendarPicker, setShowCalendarPicker] = useState(false);
//   const [habits, setHabits] = useState<any[]>([]);

//   // Handlers
//   const goToToday = () => setSelectedDate(new Date());
//   const goToPrevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
//   const goToNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));
//   const toggleDatePicker = () => setShowCalendarPicker(!showCalendarPicker);


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
//         console.log('Habits data:', response.data);
//         setHabits(response.data);
//       } catch (error) {
//         console.error("Error fetching habits:", error);
//       }
//     };

//     fetchHabits();
//   }, []);

//   return (
//     <div className="w-full max-w-4xl mx-auto p-4">
//       {/* Calendar Header */}
//       <div className="flex justify-between items-center border-b pb-2">
//         {/* Left Controls */}
//         <div className="flex items-center gap-2">
//           <button onClick={goToToday} className="px-3 py-1 bg-blue-500 text-white rounded">Today</button>
//           <button onClick={goToPrevMonth} className="px-2">&lt;</button>
//           <button onClick={goToNextMonth} className="px-2">&gt;</button>
//           <span className="text-lg font-semibold">{format(selectedDate, "MMMM yyyy")}</span>
//         </div>

//         {/* Right Controls */}
//         <div className="flex items-center gap-4">
//           {/* View Selector */}
//           <select 
//             value={viewMode} 
//             onChange={(e) => setViewMode(e.target.value)} 
//             className="border p-1 rounded"
//           >
//             {viewOptions.map((option) => (
//               <option key={option} value={option}>{option}</option>
//             ))}
//           </select>

//           {/* Date Picker Trigger */}
//           <button onClick={toggleDatePicker} className="border px-3 py-1 rounded">
//             {format(selectedDate, "dd MMM yyyy")}
//           </button>
//         </div>
//       </div>

//       {/* Calendar (Opens when date picker is clicked) */}
//       {showCalendarPicker && (
//         <div className="absolute top-20 right-10 bg-white shadow-md p-3 border rounded">
//           <Calendar 
//             value={selectedDate} 
//             userId={localStorage.getItem("user_id") as string}
//             onChange={(date) => {
//               setSelectedDate(date);
//               setShowCalendarPicker(false);
//             }} 
//           />
//         </div>
//       )}

//       {/* Placeholder for Month/Week/Day views */}
//       <div className="mt-4 p-4 border rounded">
//         <h2 className="text-xl font-semibold">{viewMode} View</h2>
//         <p className="text-gray-500">blah blah blah calendar here</p>
//       </div>
//     </div>
//   );
// };

// export default EventScheduler;
// // ========================================================================

import { useState, useEffect } from "react";
import axios from "axios";
import { format, addMonths, subMonths } from "date-fns";
import Calendar from "./Calendar/Calendar";

const viewOptions = ["Month", "Week", "Day"];

const EventScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("Month");
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [habits, setHabits] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");

  // Handlers
  const goToToday = () => setSelectedDate(new Date());
  const goToPrevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
  const goToNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));
  const toggleDatePicker = () => setShowCalendarPicker(!showCalendarPicker);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const storedUsername = localStorage.getItem("username");

    if (!userId) {
      alert("Unauthorized access");
      window.location.href = "/";
      return;
    }

    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchHabits = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/habits?user_id=${userId}`);
        console.log('Habits data:', response.data);
        setHabits(response.data);
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };

    fetchHabits();
  }, []);

  // Helper function to get habit for a specific day
  const getHabitForDay = (date: Date) => {
    const day = format(date, "yyyy-MM-dd");
    const habit = habits.find((habit) => habit.created_at && habit.created_at.startsWith(day)); // Check if created_at is defined
    return habit ? habit.title : "";
  };
  

  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex gap-8">
      {/* Left Section: User Card and Date Picker */}
      <div className="w-1/3 flex flex-col gap-6">
        <div className="p-4 border rounded shadow-md">
          <h2 className="text-xl font-semibold">Hello, {username}</h2>
        </div>
        <div className="p-4 border rounded shadow-md">
          <h3 className="text-lg font-semibold">Select a Date</h3>
          <button onClick={toggleDatePicker} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Pick a Date
          </button>
          {showCalendarPicker && (
            <div className="mt-4">
              <Calendar 
                value={selectedDate} 
                user_id={Number(localStorage.getItem("user_id"))}
                onChange={(date) => {
                  setSelectedDate(date);
                  setShowCalendarPicker(false);
                }} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Monthly Calendar */}
      <div className="w-2/3 flex flex-col gap-6">
        {/* Calendar Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <div className="flex items-center gap-2">
            <button onClick={goToToday} className="px-3 py-1 bg-blue-500 text-white rounded">Today</button>
            <button onClick={goToPrevMonth} className="px-2">&lt;</button>
            <button onClick={goToNextMonth} className="px-2">&gt;</button>
            <span className="text-lg font-semibold">{format(selectedDate, "MMMM yyyy")}</span>
          </div>
          <div className="flex items-center gap-4">
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
        </div>

        {/* Full Month View Grid */}
        <div className="grid grid-cols-7 gap-2 mt-4">
          {Array.from({ length: 31 }, (_, index) => {
            const date = addMonths(selectedDate, 0);
            date.setDate(index + 1);
            const habit = getHabitForDay(date);
            return (
              <div key={index} className="p-2 border rounded">
                <div className="text-center">{format(date, "d")}</div>
                <div className="text-xs text-gray-500">{habit || "No habit"}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventScheduler;





// //====================================================================================
// import { useState } from "react";
// import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns";
// import Calendar from "./Calendar";
// // import { Select } from "@/components/ui/select";
// // import { Button } from "@/components/ui/button";
// // import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
// import { Button } from 'shadcn-ui';
// import { Select } from 'shadcn-ui';
// import { Popover } from 'shadcn-ui';


// const views = ["Month", "Week", "Day"];

// const EventScheduler = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [view, setView] = useState("Month");
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);

//   const goToToday = () => setCurrentDate(new Date());
//   const goToPrev = () => {
//     if (view === "Month") setCurrentDate(subMonths(currentDate, 1));
//     else if (view === "Week") setCurrentDate(subWeeks(currentDate, 1));
//     else setCurrentDate(subDays(currentDate, 1));
//   };
//   const goToNext = () => {
//     if (view === "Month") setCurrentDate(addMonths(currentDate, 1));
//     else if (view === "Week") setCurrentDate(addWeeks(currentDate, 1));
//     else setCurrentDate(addDays(currentDate, 1));
//   };

//   return (
//     <div className="p-4 flex flex-col gap-4">
//       {/* Header */}
//       <div className="flex justify-between items-center border-b pb-2">
//         <div className="flex gap-2">
//           <Button onClick={goToToday}>Today</Button>
//           <Button onClick={goToPrev}>{"<"}</Button>
//           <Button onClick={goToNext}>{">"}</Button>
//           <span className="text-xl font-bold">{format(currentDate, "MMMM yyyy")}</span>
//         </div>
//         <div className="flex gap-4 items-center">
//           <Select value={view} onChange={(e) => setView(e.target.value)}>
//             {views.map((v) => (
//               <option key={v} value={v}>{v}</option>
//             ))}
//           </Select>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
//                 {format(currentDate, "PPP")}
//               </Button>
//             </PopoverTrigger>
//             {isCalendarOpen && (
//               <PopoverContent>
//                 <Calendar value={currentDate} onChange={(date) => { setCurrentDate(date); setIsCalendarOpen(false); }} />
//               </PopoverContent>
//             )}
//           </Popover>
//         </div>
//       </div>

//       {/* Views */}
//       <div>
//         {view === "Month" && <Calendar value={currentDate} onChange={setCurrentDate} />}
//         {view === "Week" && <WeekView currentDate={currentDate} />}
//         {view === "Day" && <DayView currentDate={currentDate} />}
//       </div>
//     </div>
//   );
// };

// const WeekView = ({ currentDate }) => {
//   return <div className="p-4">Week View for {format(currentDate, "MMM dd, yyyy")}</div>;
// };

// const DayView = ({ currentDate }) => {
//   return <div className="p-4">Day View for {format(currentDate, "MMM dd, yyyy")}</div>;
// };

// export default EventScheduler;
