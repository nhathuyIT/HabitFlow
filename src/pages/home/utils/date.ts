// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// Get days of the week for the week view
export function getWeekDays(centerDate: Date): Date[] {
  const days: Date[] = [];
  const startOfWeek = new Date(centerDate);
  startOfWeek.setDate(centerDate.getDate() - centerDate.getDay());

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  return days;
}
