//src/pages/CalendarGrid.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "../Calendar/Calendar"

const CalendarGrid = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState<any[]>([]);

  useEffect(() => {
    const userId = Number(localStorage.getItem("user_id"));

    if (!userId) {
      alert("Unauthorized access");
      window.location.href = "/";
      return;
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

  return (
    <div className="mt-16 flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <Calendar value={currentDate} onChange={setCurrentDate} user_id={Number(localStorage.getItem("user_id"))} />
      </div>
    </div>
  ) 
}

export default CalendarGrid;