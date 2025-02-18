//src/pages/Statistics.tsx
import { useState } from "react";
import Calendar from "../components/Calendar";

const Statistics = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="mt-16 flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <Calendar value={currentDate} onChange={setCurrentDate} />
      </div>
    </div>
  ) 
}

export default Statistics;

