// src/context/DashboardProvider.tsx

import { useState } from "react";
import { DashboardContext } from "./DashboardContext";

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [filteredHabits, setFilteredHabits] = useState<any[]>([]);

  return (
    <DashboardContext.Provider value={{ filteredHabits, setFilteredHabits }}>
      {children}
    </DashboardContext.Provider>
  );
};
