// // src/components/EventScheduler.tsx
import { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import Calendar from "./Calendar";

const viewOptions = ["Month", "Week", "Day"];

const EventScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("Month");
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);

  // Handlers
  const goToToday = () => setSelectedDate(new Date());
  const goToPrevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
  const goToNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));
  const toggleDatePicker = () => setShowCalendarPicker(!showCalendarPicker);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center border-b pb-2">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          <button onClick={goToToday} className="px-3 py-1 bg-blue-500 text-white rounded">Today</button>
          <button onClick={goToPrevMonth} className="px-2">&lt;</button>
          <button onClick={goToNextMonth} className="px-2">&gt;</button>
          <span className="text-lg font-semibold">{format(selectedDate, "MMMM yyyy")}</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* View Selector */}
          <select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value)} 
            className="border p-1 rounded"
          >
            {viewOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          {/* Date Picker Trigger */}
          <button onClick={toggleDatePicker} className="border px-3 py-1 rounded">
            {format(selectedDate, "dd MMM yyyy")}
          </button>
        </div>
      </div>

      {/* Calendar (Opens when date picker is clicked) */}
      {showCalendarPicker && (
        <div className="absolute top-20 right-10 bg-white shadow-md p-3 border rounded">
          <Calendar 
            value={selectedDate} 
            onChange={(date) => {
              setSelectedDate(date);
              setShowCalendarPicker(false);
            }} 
          />
        </div>
      )}

      {/* Placeholder for Month/Week/Day views */}
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl font-semibold">{viewMode} View</h2>
        <p className="text-gray-500">blah blah blah calendar here</p>
      </div>
    </div>
  );
};

export default EventScheduler;



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
