import { useState, useRef } from "react";
import { Timer, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { HabitTimer, type TimerControls } from "./HabitTimer.tsx";
import type { Habit } from "@/types/habit";

interface HabitTimerDialogProps {
  habit: Habit;
  onTimerComplete?: () => void;
}

export function HabitTimerDialog({
  habit,
  onTimerComplete,
}: HabitTimerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isInFocusMode, setIsInFocusMode] = useState(false);
  const timerRef = useRef<TimerControls>(null);

  const handleTimerComplete = () => {
    onTimerComplete?.();
    // Exit focus mode when timer completes
    setIsInFocusMode(false);

    // Show completion notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Habit Timer Complete!", {
        body: `Great job completing your "${habit.title}" session!`,
        icon: "/favicon.ico",
      });
    }
  };

  const enterFocusMode = () => {
    setIsInFocusMode(true);
    // Request notification permission if not already granted
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const exitFocusMode = () => {
    setIsInFocusMode(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Exit focus mode when dialog closes
      setIsInFocusMode(false);
    }
  };

  if (isInFocusMode) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="fixed inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10">
          <div className="container mx-auto px-4 h-full flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Target className="size-6 text-blue-500" />
                  <h1 className="text-2xl font-bold">Focus Mode</h1>
                </div>
                <p className="text-muted-foreground">
                  Stay focused on your habit:{" "}
                  <span className="font-medium">{habit.title}</span>
                </p>
              </div>

              <HabitTimer
                ref={timerRef}
                habitId={habit.id}
                habitTitle={habit.title}
                onComplete={handleTimerComplete}
                className="border-2 border-primary/20 shadow-2xl"
              />

              <div className="text-center mt-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Minimize distractions and focus on your task
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={exitFocusMode} size="sm">
                    Exit Focus Mode
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-blue-600 hover:text-blue-700"
        >
          <Timer className="size-4" />
          Timer
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Timer className="size-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Habit Focus Timer</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Set a timer to stay focused while working on your habit
            </p>
            <Badge variant="outline" className="text-xs">
              {habit.title}
            </Badge>
          </div>

          <HabitTimer
            ref={timerRef}
            habitId={habit.id}
            habitTitle={habit.title}
            onComplete={handleTimerComplete}
          />

          <div className="flex flex-col gap-2">
            <Button
              onClick={enterFocusMode}
              className="w-full gap-2"
              variant="default"
            >
              <Target className="size-4" />
              Enter Focus Mode
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Focus mode provides a distraction-free environment
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
