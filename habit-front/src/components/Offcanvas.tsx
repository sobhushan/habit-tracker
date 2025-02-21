// //src/components/Offcanvas.tsx
import axios from "axios";
import {useState, useEffect} from "react";
import { format, isAfter, subDays } from "date-fns";

interface Habit {
    habit_id: number;
    title: string;
    status: "Pending" | "Completed"; 
    date: string;
}

const ViewHabitsOffcanvas = ({ show, onClose, selectedDate }: { show: boolean; onClose: () => void; selectedDate: Date }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const userId = Number(localStorage.getItem("user_id"));
  
    useEffect(() => {
      if (show) {
        fetchHabits();
      }
    }, [show, selectedDate]);
  
    const fetchHabits = async () => {
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const response = await axios.get(`http://localhost:3000/api/statuslog?user_id=${userId}`);
        console.log("API Response: ", response.data);
        const data = response.data;
        if (data && data[formattedDate]) {
            setHabits(data[formattedDate].map((habit:Habit) => ({
                habit_id: habit.habit_id,
                title: habit.title,
                status: habit.status as "Pending" | "Completed",
              })));
          setHabits(data[formattedDate]); // Extract habits for the selected date
        } else {
          setHabits([]); // No habits found for the date
        }
        console.log("API Response ----: ", response.data);

      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };

    const handleToggle = async (habitId: number,habitDate: string ) => {
        console.log("habit_id:", habitId, "date:", habitDate);
        const confirmUpdate = window.confirm("Mark this habit as completed?");
        if (!confirmUpdate) return;
    
        try {
          const res = await axios.put("http://localhost:3000/api/newstat", {
            user_id: userId,
            habit_id: habitId,
            status: "Completed",
            date: habitDate,
          });
          console.log("new stat", res.data);
          fetchHabits(); // Reload data
        } catch (error) {
          console.error("Failed to update habit:", error);
        }
    };

    const isWithinOneWeek = isAfter(selectedDate, subDays(new Date(), 7));

    return (
    <div className={`offcanvas offcanvas-start ${show ? "show" : ""}`} style={{ width: "350px" , backgroundColor: "rgb(240, 255, 255)"}}>
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Habits on {format(selectedDate, "dd MMM yyyy")}</h5>
        <button className="btn-close" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body">
        <p>------------------------------------------------</p>
        {habits.length > 0 ? (
          habits.map((habit, index) => (
            <div
            key={habit?.habit_id || index}
              className={`card text-white mb-2`}
              style={{
                backgroundColor: habit.status === "Completed" ? "#28a745" : "#f73647", 
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between", 
                alignItems: "center",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <span>{habit.title}</span>
              {(habit.status as "Pending" | "Completed") === "Pending" && isWithinOneWeek && (
                <i
                className={`bi ${habit.status === "Completed" ? "bi-toggle-on" : "bi-toggle-off"}`}
                onClick={() => handleToggle(habit.habit_id,  habit.date)}
                style={{
                    fontSize: "1.5rem",
                    cursor: "pointer",
                }}
            ></i>
                // <input type="checkbox" onChange={() => handleToggle(habit.habit_id)} style={{ transform: "scale(1.2)" }} />
              )}
              {/* <div className="card-body p-2">
                <h6 className="mb-0">{habit.title}</h6>
              </div> */}
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No habits found for this date.</p>
        )}

      </div>
    </div>
  );
};

export default ViewHabitsOffcanvas;
