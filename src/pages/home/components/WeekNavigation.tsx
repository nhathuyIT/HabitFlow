import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getWeekDays } from "../utils";

interface WeekNavigationProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onNavigateWeek: (direction: "prev" | "next") => void;
}

export function WeekNavigation({
  selectedDate,
  onDateSelect,
  onNavigateWeek,
}: WeekNavigationProps) {
  const weekDays = getWeekDays(selectedDate);
  const today = new Date();

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <section>
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigateWeek("prev")}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="font-medium">
              {weekDays[0].toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              -{" "}
              {weekDays[6].toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigateWeek("next")}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <button
                key={index}
                onClick={() => onDateSelect(day)}
                className={`flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all ${
                  isSelected(day)
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : isToday(day)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                }`}
              >
                <span className="text-[10px] sm:text-xs font-medium opacity-80">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span
                  className={`text-lg sm:text-xl font-bold mt-0.5 ${isToday(day) && !isSelected(day) ? "text-primary" : ""}`}
                >
                  {day.getDate()}
                </span>
                {isToday(day) && (
                  <div
                    className={`size-1.5 rounded-full mt-1 ${isSelected(day) ? "bg-primary-foreground" : "bg-primary"}`}
                  />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
