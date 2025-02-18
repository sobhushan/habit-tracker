// // import React, { useState } from "react";
// // import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay, addMonths, subMonths } from "date-fns";

// // const Rewards: React.FC = () => {
// //   const [currentDate, setCurrentDate] = useState(new Date());

// //   // Get the first and last day of the month
// //   const firstDay = startOfMonth(currentDate);
// //   const lastDay = endOfMonth(currentDate);

// //   // Generate days for the calendar
// //   const days = eachDayOfInterval({ start: firstDay, end: lastDay });

// //   return (
// //     <div style={{ textAlign: "center" }}>
// //       <h2>{format(currentDate, "MMMM yyyy")}</h2>
// //       <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>Prev</button>
// //       <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>Next</button>

// //       <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px", marginTop: "10px" }}>
// //         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
// //           <div key={day} style={{ fontWeight: "bold" }}>{day}</div>
// //         ))}

// //         {Array(getDay(firstDay)).fill(null).map((_, i) => <div key={`empty-${i}`} />)}

// //         {days.map((day) => (
// //           <div key={day.toString()} style={{ padding: "10px", border: "1px solid #ccc" }}>
// //             {format(day, "d")}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Rewards;
// import React, { useState } from "react";
// import { 
//   format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, isSameDay 
// } from "date-fns";

// interface Event {
//   id: number;
//   title: string;
//   date: Date;
// }

// const CalendarApp: React.FC = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [events, setEvents] = useState<Event[]>([]);
//   const [newEvent, setNewEvent] = useState({ title: "", date: new Date() });

//   // Generate days for the current month
//   const firstDay = startOfMonth(currentDate);
//   const lastDay = endOfMonth(currentDate);
//   const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });

//   // Add empty slots for proper grid alignment
//   const emptySlots = Array(getDay(firstDay)).fill(null);

//   // Handle new event submission
//   const handleAddEvent = () => {
//     if (newEvent.title) {
//       setEvents([...events, { id: events.length + 1, title: newEvent.title, date: newEvent.date }]);
//       setNewEvent({ title: "", date: new Date() });
//     }
//   };

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h2>{format(currentDate, "MMMM yyyy")}</h2>
      
//       {/* Month Navigation */}
//       <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>Prev</button>
//       <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>Next</button>

//       {/* Calendar Grid */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px", marginTop: "10px" }}>
//         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//           <div key={day} style={{ fontWeight: "bold" }}>{day}</div>
//         ))}
        
//         {/* Empty slots for alignment */}
//         {emptySlots.map((_, i) => <div key={`empty-${i}`} />)}

//         {/* Calendar Days */}
//         {daysInMonth.map((day) => (
//           <div key={day.toString()} style={{ padding: "10px", border: "1px solid #ccc", minHeight: "60px" }}>
//             <strong>{format(day, "d")}</strong>
//             {/* Show events for this day */}
//             {events.filter(event => isSameDay(event.date, day)).map(event => (
//               <div key={event.id} style={{ background: "#4caf50", color: "#fff", padding: "2px", marginTop: "5px", borderRadius: "3px" }}>
//                 {event.title}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>

//       {/* Event Form */}
//       <h3>Schedule Event</h3>
//       <input
//         type="text"
//         placeholder="Event Title"
//         value={newEvent.title}
//         onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
//       />
//       <input
//         type="date"
//         onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
//       />
//       <button onClick={handleAddEvent}>Add Event</button>
//     </div>
//   );
// };

// export default CalendarApp;
import { useState, useEffect } from "react";
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
 
import '@schedule-x/theme-default/dist/index.css'
 
function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0]
 
  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2023-12-16',
        end: '2023-12-16',
      },
    ],
    plugins: [eventsService]
  })
 
  useEffect(() => {
    // get all events
    eventsService.getAll()
  }, [])
 
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
 
export default CalendarApp;