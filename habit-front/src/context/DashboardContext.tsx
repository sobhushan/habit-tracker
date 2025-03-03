// src/context/DashboardContext.tsx

import { createContext } from "react";

interface DashboardContextType {
  filteredHabits: any[];
  setFilteredHabits: (habits: any[]) => void;
}

export const DashboardContext = createContext<DashboardContextType>({
  filteredHabits: [],
  setFilteredHabits: () => {},
});
