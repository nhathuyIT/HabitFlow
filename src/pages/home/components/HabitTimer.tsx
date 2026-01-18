import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { Play, Pause, Square, Timer, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export interface TimerControls {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setDuration: (minutes: number) => void;
}

interface HabitTimerProps {
  habitId: string;
  habitTitle: string;
  defaultDuration?: number; // minutes
  onComplete?: () => void;
  onTimeUpdate?: (timeLeft: number, totalTime: number) => void;
  className?: string;
}

export const HabitTimer = forwardRef<TimerControls, HabitTimerProps>(
  (
    {
      habitId,
      habitTitle,
      defaultDuration = 25, // Default Pomodoro time
      onComplete,
      onTimeUpdate,
      className = "",
    },
    ref,
  ) => {
    const [duration, setDuration] = useState(defaultDuration * 60); // in seconds
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [customMinutes, setCustomMinutes] = useState(defaultDuration);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressCircleRef = useRef<SVGCircleElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Audio notification when timer completes
    useEffect(() => {
      if (audioEnabled) {
        audioRef.current = new Audio(
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dy",
        );
        audioRef.current.volume = 0.3;
      }
      return () => {
        if (audioRef.current) {
          audioRef.current = null;
        }
      };
    }, [audioEnabled]);

    // useLayoutEffect để đồng bộ DOM measurements cho smooth animations
    useLayoutEffect(() => {
      if (!progressCircleRef.current) return;

      const circle = progressCircleRef.current;
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;

      // Set up circle properties ngay lập tức để tránh flicker
      circle.style.strokeDasharray = `${circumference}`;
      circle.style.strokeDashoffset = `${circumference}`;
      circle.style.transition = "stroke-dashoffset 0.5s ease-in-out";

      // Calculate progress
      const progress = timeLeft / duration;
      const offset = circumference - progress * circumference;

      // Force layout recalculation để animation mượt
      circle.getBoundingClientRect();
      circle.style.strokeDashoffset = `${offset}`;
    }, [timeLeft, duration]);

    // Timer logic
    useEffect(() => {
      if (isRunning && timeLeft > 0) {
        intervalRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            const newTime = prev - 1;
            onTimeUpdate?.(newTime, duration);

            if (newTime <= 0) {
              setIsRunning(false);
              setIsCompleted(true);
              onComplete?.();
              // Play completion sound
              if (audioRef.current && audioEnabled) {
                audioRef.current.play().catch(() => {});
              }
            }

            return newTime;
          });
        }, 1000);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [isRunning, timeLeft, duration, onComplete, onTimeUpdate, audioEnabled]);

    // Persist timer state to localStorage
    useEffect(() => {
      const saveState = () => {
        const state = {
          timeLeft,
          duration,
          isRunning,
          isCompleted,
          timestamp: Date.now(),
        };
        localStorage.setItem(`habit-timer-${habitId}`, JSON.stringify(state));
      };

      if (isRunning || timeLeft !== duration) {
        saveState();
      }
    }, [timeLeft, duration, isRunning, isCompleted, habitId]);

    // Load timer state from localStorage
    useEffect(() => {
      const savedState = localStorage.getItem(`habit-timer-${habitId}`);
      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          const timePassed = Math.floor((Date.now() - state.timestamp) / 1000);

          if (state.isRunning && timePassed < state.timeLeft) {
            const newTimeLeft = Math.max(0, state.timeLeft - timePassed);
            setTimeLeft(newTimeLeft);
            setDuration(state.duration);
            setIsRunning(newTimeLeft > 0);
            setIsCompleted(newTimeLeft <= 0);
          } else if (!state.isRunning) {
            setTimeLeft(state.timeLeft);
            setDuration(state.duration);
            setIsCompleted(state.isCompleted);
          }
        } catch (error) {
          console.error("Failed to load timer state:", error);
        }
      }
    }, [habitId]);

    // Expose controls via useImperativeHandle
    useImperativeHandle(
      ref,
      () => ({
        start: () => {
          if (timeLeft > 0) {
            setIsRunning(true);
            setIsCompleted(false);
          }
        },
        pause: () => {
          setIsRunning(false);
        },
        reset: () => {
          setIsRunning(false);
          setTimeLeft(duration);
          setIsCompleted(false);
          localStorage.removeItem(`habit-timer-${habitId}`);
        },
        setDuration: (minutes: number) => {
          const newDuration = minutes * 60;
          setDuration(newDuration);
          if (!isRunning) {
            setTimeLeft(newDuration);
            setIsCompleted(false);
          }
        },
      }),
      [timeLeft, duration, isRunning, habitId],
    );

    const handleStart = () => {
      if (timeLeft <= 0) {
        setTimeLeft(duration);
        setIsCompleted(false);
      }
      setIsRunning(true);
    };

    const handlePause = () => {
      setIsRunning(false);
    };

    const handleReset = () => {
      setIsRunning(false);
      setTimeLeft(duration);
      setIsCompleted(false);
      localStorage.removeItem(`habit-timer-${habitId}`);
    };

    const handleDurationChange = useCallback(
      (minutes: number) => {
        const newDuration = minutes * 60;
        setDuration(newDuration);
        setCustomMinutes(minutes);
        if (!isRunning) {
          setTimeLeft(newDuration);
          setIsCompleted(false);
        }
      },
      [isRunning],
    );

    const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const progress =
      duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;

    return (
      <Card
        className={`relative overflow-hidden ${className}`}
        ref={containerRef}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Timer className="size-5 text-blue-500" />
            Focus Timer
            {isCompleted && (
              <Badge variant="default" className="bg-green-500">
                Completed!
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground truncate">{habitTitle}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Circular Progress */}
          <div className="flex justify-center">
            <div className="relative">
              <svg width="120" height="120" className="transform -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-muted-foreground/20"
                />
                <circle
                  ref={progressCircleRef}
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className={`${
                    isCompleted
                      ? "text-green-500"
                      : isRunning
                        ? "text-blue-500"
                        : "text-primary"
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Duration Settings */}
          <div className="space-y-2">
            <Label htmlFor={`duration-${habitId}`}>Duration (minutes)</Label>
            <div className="flex gap-2">
              <Input
                id={`duration-${habitId}`}
                type="number"
                min="1"
                max="180"
                value={customMinutes}
                onChange={(e) => {
                  const minutes = parseInt(e.target.value) || 1;
                  handleDurationChange(minutes);
                }}
                disabled={isRunning}
                className="w-20"
              />
              <div className="flex gap-1">
                {[15, 25, 45, 60].map((min) => (
                  <Button
                    key={min}
                    variant={customMinutes === min ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDurationChange(min)}
                    disabled={isRunning}
                    className="text-xs"
                  >
                    {min}m
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {!isRunning ? (
                <Button onClick={handleStart} className="gap-2">
                  <Play className="size-4" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  variant="outline"
                  className="gap-2"
                >
                  <Pause className="size-4" />
                  Pause
                </Button>
              )}
              <Button onClick={handleReset} variant="outline" size="icon">
                <Square className="size-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? (
                <Volume2 className="size-4" />
              ) : (
                <VolumeX className="size-4" />
              )}
            </Button>
          </div>

          {/* Status Message */}
          {isCompleted && (
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-700 dark:text-green-300 font-medium">
                Great job! You complete your focus session.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
);

HabitTimer.displayName = "HabitTimer";
