import { useState } from "react";
import {
  Header,
  GreetingSection,
  StatsCards,
  WeekNavigation,
  HabitsList,
  PerfectDayBanner,
  FloatingActionButton,
  AddHabitDialog,
  EditHabitDialog,
} from "./components";
import { useHabits, useWeekNavigation } from "./hooks";
import type { Habit } from "@/types/habit";

export default function HomePage() {
  const {
    habits,
    loading,
    error,
    stats,
    handleToggleCheck,
    handleCreateHabit,
    handleDeleteHabit,
    handleUpdateHabit,
  } = useHabits();
  const { selectedDate, setSelectedDate, navigateWeek } = useWeekNavigation();
  const [showActions, setShowActions] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleEdit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit) {
      setEditingHabit(habit);
      setShowEditDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header onAddHabit={() => setShowAddDialog(true)} />

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
          onAdd={() => setShowAddDialog(true)}
          onDelete={handleDeleteHabit}
          onEdit={handleEdit}
        />

        <PerfectDayBanner show={stats.percentage === 100 && stats.total > 0} />
      </main>

      <FloatingActionButton onClick={() => setShowAddDialog(true)} />

      <AddHabitDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleCreateHabit}
      />

      <EditHabitDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onEdit={handleUpdateHabit}
        habit={editingHabit}
      />
    </div>
  );
}
