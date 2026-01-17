import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HabitCard } from "./HabitCard";
import type { Habit } from "@/types/habit";

interface HabitsListProps {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  showActions: string | null;
  onToggleActions: (id: string | null) => void;
  onToggleCheck: (id: string, currentCheck: boolean) => void;
}

export function HabitsList({
  habits,
  loading,
  error,
  showActions,
  onToggleActions,
  onToggleCheck,
}: HabitsListProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Today's Habits</h3>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View All
        </Button>
      </div>

      {loading ? (
        <HabitsListSkeleton />
      ) : error ? (
        <HabitsListError error={error} />
      ) : habits.length === 0 ? (
        <HabitsListEmpty />
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              showActions={showActions === habit.id}
              onToggleActions={() =>
                onToggleActions(showActions === habit.id ? null : habit.id)
              }
              onToggleCheck={() => onToggleCheck(habit.id, habit.isCheck)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function HabitsListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
              <div className="size-6 rounded-md bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function HabitsListError({ error }: { error: string }) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="p-6 text-center">
        <p className="text-destructive font-medium">Error: {error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}

function HabitsListEmpty() {
  return (
    <Card className="border-dashed">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="size-8 text-primary" />
          </div>
        </div>
        <h4 className="font-semibold text-lg mb-2">No habits yet</h4>
        <p className="text-muted-foreground mb-4">
          Start building better habits today. Add your first habit to get
          started!
        </p>
        <Button>
          <Plus className="size-4" />
          Add Your First Habit
        </Button>
      </CardContent>
    </Card>
  );
}
