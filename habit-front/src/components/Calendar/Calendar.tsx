// // // src/components/Calendar.tsx
// import { 
//   format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, isSameDay 
// } from "date-fns";
// import Cell from "./Cell";

// const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// interface Props{
//   value?:Date;
//   onChange:(value:Date) => void;
// }

// const Calendar: React.FC<Props> = ({value = new Date(), onChange}) => {
//   console.log(value);
  
//   // Generate days for the current month
//   const firstDay = startOfMonth(value);
//   const lastDay = endOfMonth(value);
//   const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });

//   // Add empty slots for proper grid alignment at start
//   const emptySlotsStart = Array(getDay(firstDay)).fill(null);

//   // Calculate empty slots at the end of the last row
//   const totalCells = emptySlotsStart.length + daysInMonth.length; // Total cells used
//   const emptySlotsEnd = Array(totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)).fill(null);

//   const prevMonth = () => onChange(subMonths(value, 1));
//   const nextMonth = () => onChange(addMonths(value, 1)); 
//   const prevYear = () => onChange(subMonths(value, 12)); 
//   const nextYear = () => onChange(addMonths(value, 12));


//   return (
//     <div className="w-[400px] border">
//         <div className="grid grid-cols-7 items-center justify-center text-center">
//         <Cell onClick={prevYear}>{"<<"}</Cell>
//         <Cell onClick={prevMonth}>{"<"}</Cell>
//         <Cell className="col-span-3">{format(value, "MMMM yyyy")}</Cell>
//         <Cell onClick={nextMonth}>{">"}</Cell>
//         <Cell onClick={nextYear}>{">>"}</Cell>

//             {weeks.map((week) => (
//               <Cell key={week} className="text-xs font-bold uppercase">{week}</Cell>
//             ))}

//             {emptySlotsStart.map((_, i) => (
//              <Cell key={`empty-start-${i}`} />
//             ))}

//             {daysInMonth.map((day) => (
//               <Cell  key={day.toString()} 
//               isActive={isSameDay(day, value)} 
//               onClick={() => onChange(day)}>
//                 {format(day, "d")}</Cell>
//             ))}

//             {emptySlotsEnd.map((_, i) => (
//               <Cell key={`empty-end-${i}`} />
//             ))}

//         </div>
//     </div>
//   )
// }

// export default Calendar;

//======================================================
// import { useState } from "react";
// import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, addDays } from "date-fns";
// import Cell from "./Cell";

// const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// interface Props {
//   value?: Date;
//   onChange: (value: Date) => void;
//   view: "month" | "week" | "day";
// }

// const Calendar: React.FC<Props> = ({ value = new Date(), onChange, view }) => {
//   const [selectedDate, setSelectedDate] = useState(value);
  
//   // Week View Logic
//   const startWeek = startOfWeek(selectedDate);
//   const endWeek = endOfWeek(selectedDate);
//   const daysInWeek = eachDayOfInterval({ start: startWeek, end: endWeek });

//   // Navigation Functions
//   const prev = () => {
//     if (view === "month") onChange(subWeeks(value, 4));
//     else if (view === "week") onChange(subWeeks(value, 1));
//     else onChange(subWeeks(value, 1));
//   };
  
//   const next = () => {
//     if (view === "month") onChange(addWeeks(value, 4));
//     else if (view === "week") onChange(addWeeks(value, 1));
//     else onChange(addDays(value, 1));
//   };

//   return (
//     <div className="w-full border-t border-l">
//       <div className="flex justify-between p-4">
//         <button onClick={prev}>&lt;</button>
//         <span>{format(value, "MMMM yyyy")}</span>
//         <button onClick={next}>&gt;</button>
//       </div>
      
//       {view === "week" && (
//         <div className="grid grid-cols-7">
//           {weeks.map((week) => (
//             <Cell key={week} className="text-xs font-bold uppercase">{week}</Cell>
//           ))}
//           {daysInWeek.map((day) => (
//             <Cell key={day.toString()} onClick={() => onChange(day)}>
//               {format(day, "d")}
//             </Cell>
//           ))}
//         </div>
//       )}

//       {view === "day" && (
//         <div className="grid grid-cols-1 border">
//           {[...Array(24).keys()].map((hour) => (
//             <Cell key={hour} className="h-16">
//               {format(new Date(0, 0, 0, hour), "h a")}
//             </Cell>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Calendar;

//========================================================================================
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, isSameDay 
} from "date-fns";
import { useEffect, useState } from "react";
import axios from "axios";
import Cell from "./calCell";

const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  value?: Date;
  onChange: (value: Date) => void;
  user_id: number; // User ID for fetching habits
}

const Calendar: React.FC<Props> = ({ value = new Date(), onChange, user_id }) => {
  const [habitStatus, setHabitStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/habits?user_id=${user_id}`);
        const habits = response.data;
        const statusMap: Record<string, string> = {};

        habits.forEach((habit: { created_at: string; status: string }) => {
          const dateKey = format(new Date(habit.created_at), "yyyy-MM-dd");
          if (!statusMap[dateKey]) {
            statusMap[dateKey] = habit.status;
          } else if (statusMap[dateKey] === "Completed" && habit.status === "Pending") {
            statusMap[dateKey] = "Pending";
          }
        });

        setHabitStatus(statusMap);
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };

    fetchHabits();
  }, [value, user_id]);

  const firstDay = startOfMonth(value);
  const lastDay = endOfMonth(value);
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
  const emptySlotsStart = Array(getDay(firstDay)).fill(null);
  const totalCells = emptySlotsStart.length + daysInMonth.length;
  const emptySlotsEnd = Array(totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)).fill(null);

  const prevMonth = () => onChange(subMonths(value, 1));
  const nextMonth = () => onChange(addMonths(value, 1));
  const prevYear = () => onChange(subMonths(value, 12));
  const nextYear = () => onChange(addMonths(value, 12));

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-5xl border p-4 bg-blue-200">
        <div className="grid grid-cols-7 items-center text-center bg-blue-50">
          <Cell onClick={prevYear}>{"<<"}</Cell>
          <Cell onClick={prevMonth}>{"<"}</Cell>
          <Cell className="col-span-3 text-xl font-bold">{format(value, "MMMM yyyy")}</Cell>
          <Cell onClick={nextMonth}>{">"}</Cell>
          <Cell onClick={nextYear}>{">>"}</Cell>
          {weeks.map((week) => (
            <Cell key={week} className="text-xs font-bold uppercase">{week}</Cell>
          ))}
          {emptySlotsStart.map((_, i) => (
            <Cell key={`empty-start-${i}`} />
          ))}
          {/* {daysInMonth.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const bgColor = habitStatus[dateKey] === "Completed" ? "bg-green-500 text-white" :
                            habitStatus[dateKey] === "Pending" ? "bg-red-500 text-white" : "";
            return (
              <Cell key={day.toString()} isActive={isSameDay(day, value)}
                onClick={() => onChange(day)} className={bgColor}>
                {format(day, "d")}
              </Cell>
            );
          })} */}

          {daysInMonth.map((day) => (
              <Cell  key={day.toString()} 
              isActive={isSameDay(day, value)} 
              onClick={() => onChange(day)}>
                {format(day, "d")}</Cell>
          ))}

          {emptySlotsEnd.map((_, i) => (
            <Cell key={`empty-end-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
