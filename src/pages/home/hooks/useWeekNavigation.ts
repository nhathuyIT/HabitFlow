import { useState } from "react";

export function useWeekNavigation() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === "next" ? 7 : -7));
    setSelectedDate(newDate);
  };

  return {
    selectedDate,
    setSelectedDate,
    navigateWeek,
  };
}
