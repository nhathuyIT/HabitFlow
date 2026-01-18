import { Target, Flame, Award, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatsCardsProps {
  percentage: number;
  completed: number;
  total: number;
  streak: number;
}

export function StatsCards({
  percentage,
  completed,
  total,
  streak,
}: StatsCardsProps) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Target className="size-4 text-primary" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{percentage}%</div>
          <Progress value={percentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {completed} of {total} completed
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full" />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Flame className="size-4 text-orange-500" />
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{streak}</div>
          <p className="text-xs text-muted-foreground mt-2">days in a row</p>
          <div className="flex gap-0.5 mt-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`size-2 rounded-full ${i < streak % 7 ? "bg-orange-500" : "bg-muted"}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Award className="size-4 text-emerald-500" />
            Total Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground mt-2">active habits</p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="size-4 text-blue-500" />
            Best Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">9 AM</div>
          <p className="text-xs text-muted-foreground mt-2">
            most productive hour
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
