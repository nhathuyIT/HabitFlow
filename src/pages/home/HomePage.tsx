import { useState } from "react";
import {
  Header,
  GreetingSection,
  StatsCards,
  WeekNavigation,
  HabitsList,
  PerfectDayBanner,
  FloatingActionButton,
} from "./components";
import { useHabits, useWeekNavigation } from "./hooks";

export default function HomePage() {
  const { habits, loading, error, stats, handleToggleCheck } = useHabits();
  const { selectedDate, setSelectedDate, navigateWeek } = useWeekNavigation();
  const [showActions, setShowActions] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <GreetingSection
          completed={stats.completed}
          total={stats.total}
          streak={stats.streak}
        />

        <StatsCards
          percentage={stats.percentage}
          completed={stats.completed}
          total={stats.total}
          streak={stats.streak}
        />

        <WeekNavigation
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onNavigateWeek={navigateWeek}
        />

        <HabitsList
          habits={habits}
          loading={loading}
          error={error}
          showActions={showActions}
          onToggleActions={setShowActions}
          onToggleCheck={handleToggleCheck}
        />

        <PerfectDayBanner show={stats.percentage === 100 && stats.total > 0} />
      </main>

      <FloatingActionButton />
    </div>
  );
}
