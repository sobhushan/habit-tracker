// src/components/Heatmap.tsx

import { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import axios from "axios";
import { subDays } from "date-fns";

const Heatmap = () => {
  const today = new Date();
  const startDate = subDays(today, 180); // Last 90 days
  const [habitData, setHabitData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");

    axios.get(`http://localhost:3000/api/charts/heatmap?user_id=${user_id}`)
    .then((response) => {
        console.log("Heatmap Data from API:", response.data); // Log API response
        setHabitData(response.data);
      })
      .catch((error) => console.error("Error fetching heatmap data:", error));
  }, []);

  return (
    <div className="text-center" style={{ width: "90%", maxWidth: "600px", margin: "auto" }}>
      <h5 className="mb-3">Last 6 months Habit Completion</h5>
      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={habitData}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-empty";
          if (value.count === 1) return "color-scale-1";
          if (value.count === 2) return "color-scale-2";
          if (value.count === 3) return "color-scale-3";
          return "color-scale-4";
        }}
        showWeekdayLabels={true}
        gutterSize={2} // Reduce spacing between boxes
      />
      <style>
        {`
          .color-empty { fill: #ebedf0; }
          .color-scale-1 { fill: #c6e48b; }
          .color-scale-2 { fill: #7bc96f; }
          .color-scale-3 { fill: #239a3b; }
          .color-scale-4 { fill: #196127; }
          svg { transform: scale(0.8); } /* Decreased size */
        `}
      </style>
    </div>
  );
};

export default Heatmap;



