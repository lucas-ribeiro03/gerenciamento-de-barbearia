/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import { Hours } from "../types/Hours";

interface DateContextData {
  date: Hours | null;
  setDate: React.Dispatch<React.SetStateAction<Hours | null>>;
}

export const DateContext = createContext({} as DateContextData);

interface DateProviderProps {
  children: React.ReactNode;
}

export const DateProvider: React.FC<DateProviderProps> = ({ children }) => {
  const [date, setDate] = useState<Hours | null>(null);

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
};
