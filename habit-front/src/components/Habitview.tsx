// //src/components/Habitview.tsx
// import { useState, useEffect } from "react";
// import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isValid  } from "date-fns";
// import axios from "axios";

// const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// interface Habit {
//   habit_id: number;
//   user_id: number;
//   title: string;
//   description: string;
//   frequency: string;
//   time_req: string;
//   status: string;
//   created_at: string | Date | null; 
// }

// interface Props {
//   value?: Date;
//   onChange: (value: Date) => void;
//   user_id: number;
// }

// const Habitview: React.FC<Props> = ({ value = new Date(), onChange, user_id }) => {
//   const [habitStatus, setHabitStatus] = useState<Record<string, string>>({});

//   useEffect(() => {
//     const fetchHabits = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/habits?user_id=${user_id}`);
//         const habits = response.data;
//         console.log("Get se data:",habits);
//         const statusMap: Record<string, string> = {};

//         habits.forEach((habit: Habit) => {
//           if (!habit.created_at) {
//               console.warn("Skipping habit with missing date:", habit);
//               return;
//           }
      
//           const date = new Date(habit.created_at);
//           if (!isValid(date)) {
//               console.error("Invalid date format for habit:", habit);
//               return;
//           }
      
//           const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");
//           console.log("Formatted Date:", formattedDate);
//         });
      

//         setHabitStatus(statusMap);
//       } catch (error) {
//         console.error("Error fetching habits:", error);
//       }
//     };

//     fetchHabits();
//   }, [value, user_id]);

//   const firstDay = startOfMonth(value);
//   const lastDay = endOfMonth(value);
//   const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
//   const emptySlotsStart = Array(getDay(firstDay)).fill(null);
//   const totalCells = emptySlotsStart.length + daysInMonth.length;
//   const emptySlotsEnd = Array(totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)).fill(null);

//   return (
//     <div className="w-full h-screen flex flex-col items-center">
//       <div className="w-full max-w-5xl border p-4">

//         {/* Week Days */}
//         <div className="grid grid-cols-7 text-center text-xs font-bold uppercase mb-4">
//           {weeks.map((week) => (
//             <div key={week} className="py-2">{week}</div>
//           ))}
//         </div>

//         {/* Calendar Grid */}
//         <div className="grid grid-cols-7 gap-2">
//           {emptySlotsStart.map((_, i) => (
//             <div key={`empty-start-${i}`} />
//           ))}

//           {daysInMonth.map((day) => {
//             const dateKey = format(day, "yyyy-MM-dd");
//             const habit = habitStatus[dateKey];
//             const isActive = isSameDay(day, value);

//             return (
//               <div
//                 key={day.toString()}
//                 className={`p-4 border rounded cursor-pointer ${isActive ? 'bg-blue-500 text-white' : 'bg-white'}`}
//                 onClick={() => onChange(day)}
//               >
//                 <div className="text-center text-lg">{format(day, "d")}</div>
//                 <div className="text-xs text-gray-500">{habit || "No Habit"}</div>
//               </div>
//             );
//           })}

//           {emptySlotsEnd.map((_, i) => (
//             <div key={`empty-end-${i}`} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Habitview;
//===============================================================

// import { useState, useEffect } from "react";
// import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isValid, isAfter } from "date-fns";
// import axios from "axios";

// const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// interface Habit {
//   habit_id: number;
//   user_id: number;
//   title: string;
//   description: string;
//   frequency: string;
//   time_req: string;
//   status: string; // "Completed" or "Pending"
//   created_at: string | Date | null;  // Handles different formats
// }

// interface Props {
//   value?: Date;
//   onChange: (value: Date) => void;
//   user_id: number;
// }

// const Habitview: React.FC<Props> = ({ value = new Date(), onChange, user_id }) => {
//   const [habitStatus, setHabitStatus] = useState<Record<string, Habit[]>>({});  // Store full habit data per date

//   useEffect(() => {
//     // const fetchHabits = async () => {
//     //   try {
//     //     const response = await axios.get(`http://localhost:3000/api/statuslog?user_id=${user_id}`);
//     //     const habits = response.data;
//     //     console.log("Get se data:", habits);
//     //     const statusMap: Record<string, Habit[]> = {};

//     //     habits.forEach((habit: Habit) => {
//     //       if (!habit.created_at || !habit.status) {
//     //         console.warn("Skipping habit with missing data:", habit);
//     //         return;
//     //       }

//     //       const createdDate = new Date(habit.created_at);
//     //       if (!isValid(createdDate)) {
//     //         console.error("Invalid date format for habit:", habit);
//     //         return;
//     //       }

//     //       const formattedDate = format(createdDate, "yyyy-MM-dd");
//     //       const endOfMonthDate = endOfMonth(createdDate);

//     //       // Check if the habit's creation date is within the current month
//     //       eachDayOfInterval({ start: createdDate, end: endOfMonthDate }).forEach(day => {
//     //         const dateKey = format(day, "yyyy-MM-dd");
//     //         if (!statusMap[dateKey]) {
//     //           statusMap[dateKey] = [];
//     //         }
//     //         statusMap[dateKey].push(habit);
//     //       });
//     //     });

//     //     setHabitStatus(statusMap);
//     //   } catch (error) {
//     //     console.error("Error fetching habits:", error);
//     //   }
//     // };

//     const fetchHabits = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/statuslog?user_id=${user_id}`);
//         const habits = response.data;
//         console.log("Get se data:", habits);
//         const statusMap: Record<string, Habit[]> = {};

//         // Iterate over the keys (dates) and the associated habit data
//         Object.keys(habits).forEach((dateKey) => {
//           const habitsForDate = habits[dateKey]; // This is an array of habit objects for a particular date

//           // Ensure habitsForDate is an array before proceeding
//           if (Array.isArray(habitsForDate)) {
//             habitsForDate.forEach((habit: Habit) => {
//               // Format the habit data and store it
//               if (!statusMap[dateKey]) {
//                 statusMap[dateKey] = [];
//               }
//               statusMap[dateKey].push(habit);
//             });
//           }
//         });

//         setHabitStatus(statusMap);
//       } catch (error) {
//         console.error("Error fetching habits:", error);
//       }
//     };

//     fetchHabits();
//   }, [value, user_id]);

//   const firstDay = startOfMonth(value);
//   const lastDay = endOfMonth(value);
//   const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
//   const emptySlotsStart = Array(getDay(firstDay)).fill(null);
//   const totalCells = emptySlotsStart.length + daysInMonth.length;
//   const emptySlotsEnd = Array(totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)).fill(null);

//   return (
//     <div className="w-full h-screen flex flex-col items-center">
//       <div className="w-full max-w-5xl border p-4">

//         {/* Week Days */}
//         <div className="grid grid-cols-7 text-center text-xs font-bold uppercase mb-4">
//           {weeks.map((week) => (
//             <div key={week} className="py-2">{week}</div>
//           ))}
//         </div>

//         {/* Calendar Grid */}
//         <div className="grid grid-cols-7 gap-2">
//           {emptySlotsStart.map((_, i) => (
//             <div key={`empty-start-${i}`} />
//           ))}

//           {daysInMonth.map((day) => {
//             const dateKey = format(day, "yyyy-MM-dd");
//             const habits = habitStatus[dateKey] || [];
//             const isActive = isSameDay(day, value);
//             const isPast = isAfter(day, new Date()); // Check if the date is in the future

//             return (
//               <div
//                 key={day.toString()}
//                 className={`p-4 border rounded cursor-pointer ${isActive ? 'bg-blue-500 text-white' : 'bg-white'}`}
//                 onClick={() => onChange(day)}
//               >
//                 <div className="text-center text-lg">{format(day, "d")}</div>
//                 <div className="text-xs text-gray-500">
//                   {habits.map((habit, index) => {
//                     const habitStatusColor = isPast
//                       ? 'bg-gray-300' // For future dates
//                       : habit.status === 'Completed'
//                         ? 'bg-green-500'
//                         : habit.status === 'Pending'
//                           ? 'bg-red-500'
//                           : 'bg-gray-500';

//                     return (
//                       <div key={index} className={`p-2 rounded text-white mb-1 ${habitStatusColor}`}>
//                         {habit.title}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}

//           {emptySlotsEnd.map((_, i) => (
//             <div key={`empty-end-${i}`} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Habitview;

//============================================================
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isAfter } from "date-fns";
import axios from "axios";

const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Habit {
  habit_id: number;
  user_id: number;
  title: string;
  description: string;
  frequency: string;
  time_req: string;
  status: string; // "Completed" or "Pending"
  created_at: string | Date | null;  // Handles different formats
}

interface Props {
  value?: Date;
  onChange: (value: Date) => void;
  user_id: number;
}

const Habitview: React.FC<Props> = ({ value = new Date(), onChange, user_id }) => {
  const [habitStatus, setHabitStatus] = useState<Record<string, Habit[]>>({});  // Store full habit data per date

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/statuslog?user_id=${user_id}`);
        const habits = response.data;
        console.log("Fetched habits data:", habits);
        const statusMap: Record<string, Habit[]> = {};

        // Iterate over the keys (dates) and the associated habit data
        Object.keys(habits).forEach((dateKey) => {
          const habitsForDate = habits[dateKey]; // This is an array of habit objects for a particular date

          // Ensure habitsForDate is an array before proceeding
          if (Array.isArray(habitsForDate)) {
            habitsForDate.forEach((habit: Habit) => {
              // Format the habit data and store it
              if (!statusMap[dateKey]) {
                statusMap[dateKey] = [];
              }
              statusMap[dateKey].push(habit);
            });
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

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="w-full max-w-5xl border p-4">

        {/* Week Days */}
        <div className="grid grid-cols-7 text-center text-xs font-bold uppercase mb-4">
          {weeks.map((week) => (
            <div key={week} className="py-2">{week}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {emptySlotsStart.map((_, i) => (
            <div key={`empty-start-${i}`} />
          ))}

          {daysInMonth.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const habits = habitStatus[dateKey] || []; // Get habits for the current day
            const isActive = isSameDay(day, value);
            const isPast = isAfter(day, new Date()); // Check if the date is in the future

            return (
              <div
                key={day.toString()}
                className={`p-4 border rounded cursor-pointer ${isActive ? 'bg-blue-500 text-white' : 'bg-white'}`}
                onClick={() => onChange(day)}
              >
                <div className="text-center text-lg">{format(day, "d")}</div>
                <div className="text-xs text-gray-500">
                  {habits.length > 0 ? (
                    habits.map((habit, index) => {
                      const habitStatusColor = isPast
                        ? 'bg-gray-300' // For future dates
                        : habit.status === 'Completed'
                          ? 'bg-green-500'
                          : habit.status === 'Pending'
                            ? 'bg-red-500'
                            : 'bg-gray-500';

                      return (
                        <div key={index} className={`p-2 rounded text-white mb-1 ${habitStatusColor}`}>
                          {habit.title} {/* Render habit title here */}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-400">No habits for today</div>
                  )}
                </div>
              </div>
            );
          })}

          {emptySlotsEnd.map((_, i) => (
            <div key={`empty-end-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Habitview;




