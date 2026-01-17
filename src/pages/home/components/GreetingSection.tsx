import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getGreeting } from "../utils";
import { useAuth } from "@/context/AuthContext";

interface GreetingSectionProps {
  completed: number;
  total: number;
  streak: number;
}

export function GreetingSection({
  completed,
  total,
  streak,
}: GreetingSectionProps) {
  const greeting = getGreeting();
  const { user } = useAuth();

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {greeting.icon}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            {greeting.text}, {user ? capitalizeFirst(user.username) : "Guest"}!
          </h2>
          <p className="text-muted-foreground">
            {completed === total && total > 0
              ? "Amazing! You've completed all your habits! 🎉"
              : `You have ${total - completed} habits left for today`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="success" className="gap-1 py-1 px-3">
          <Flame className="size-3.5" />
          {streak} day streak
        </Badge>
      </div>
    </section>
  );
}
