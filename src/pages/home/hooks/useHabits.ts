/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useReducer, useMemo, useRef } from "react";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCheck,
  updateStreak,
} from "@/api/mockapi";
import { useAuth } from "@/context/AuthContext";
import type { Habit } from "@/types/habit";

interface HabitsState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
}

type HabitsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Habit[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "ADD_HABIT"; payload: Habit }
  | { type: "UPDATE_HABIT"; payload: Habit }
  | { type: "DELETE_HABIT"; payload: string }
  | { type: "TOGGLE_HABIT"; payload: { id: string; isCheck: boolean } };

const initialState: HabitsState = {
  habits: [],
  loading: true,
  error: null,
};

function habitsReducer(state: HabitsState, action: HabitsAction): HabitsState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { habits: action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_HABIT":
      return { ...state, habits: [...state.habits, action.payload] };
    case "UPDATE_HABIT":
      return {
        ...state,
        habits: state.habits.map((h) =>
          h.id === action.payload.id ? action.payload : h,
        ),
      };
    case "DELETE_HABIT":
      return {
        ...state,
        habits: state.habits.filter((h) => h.id !== action.payload),
      };
    case "TOGGLE_HABIT":
      return {
        ...state,
        habits: state.habits.map((h) =>
          h.id === action.payload.id
            ? { ...h, isCheck: action.payload.isCheck }
            : h,
        ),
      };
    default:
      return state;
  }
}

export function useHabits() {
  const { user, updateUserStreak } = useAuth();
  const [state, dispatch] = useReducer(habitsReducer, initialState);
  const hasIncrementedStreak = useRef(false);
  const userIdRef = useRef(user?.id);

  const stats = useMemo(() => {
    const completed = state.habits.filter((h) => h.isCheck).length;
    const total = state.habits.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const streak = user?.streak || 0;
    return { completed, total, percentage, streak };
  }, [state.habits, user]);

  useEffect(() => {
    if (!user) return;
    if (userIdRef.current === user.id && state.habits.length > 0) return;
    userIdRef.current = user.id;

    async function fetchHabits() {
      dispatch({ type: "FETCH_START" });
      hasIncrementedStreak.current = false;
      try {
        const data = await getHabits(user?.id ?? "");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err: any) {
        dispatch({
          type: "FETCH_ERROR",
          payload: err.message || "Failed to fetch habits",
        });
      }
    }
    fetchHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  //check streak
  useEffect(() => {
    async function checkAndUpdateStreak() {
      if (!user || state.habits.length === 0 || state.loading) return;

      const allCompleted = state.habits.every((h) => h.isCheck);
      if (!allCompleted) return;

      // Check if alr + today
      const today = new Date().toDateString();
      const lastStreakDate = localStorage.getItem(`streak_date_${user.id}`);
      if (lastStreakDate === today) return;

      // Update streak
      const newStreak = (user.streak || 0) + 1;
      try {
        await updateStreak(user.id, newStreak);
        updateUserStreak(newStreak);
        localStorage.setItem(`streak_date_${user.id}`, today);
      } catch (err) {
        console.error("Failed to update streak:", err);
      }
    }
    checkAndUpdateStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.habits, state.loading]);

  const handleCreateHabit = async (title: string, description: string) => {
    if (!user) return false;
    try {
      const newHabit = await createHabit({
        title,
        description,
        userId: user.id,
        isCheck: false,
      });
      dispatch({ type: "ADD_HABIT", payload: newHabit });
      return true;
    } catch (err) {
      console.error("Failed to create habit:", err);
      return false;
    }
  };

  const handleUpdateHabit = async (
    id: string,
    title: string,
    description: string,
  ) => {
    try {
      const updated = await updateHabit(id, { title, description });
      dispatch({ type: "UPDATE_HABIT", payload: updated });
      return true;
    } catch (err) {
      console.error("Failed to update habit:", err);
      return false;
    }
  };

  const handleDeleteHabit = async (id: string) => {
    const backup = state.habits.find((h) => h.id === id);
    dispatch({ type: "DELETE_HABIT", payload: id });
    try {
      await deleteHabit(id);
      return true;
    } catch (err) {
      console.error("Failed to delete habit:", err);
      if (backup) dispatch({ type: "ADD_HABIT", payload: backup });
      return false;
    }
  };

  const handleToggleCheck = async (id: string, currentCheck: boolean) => {
    dispatch({ type: "TOGGLE_HABIT", payload: { id, isCheck: !currentCheck } });
    try {
      await toggleHabitCheck(id, !currentCheck);
    } catch (err) {
      console.error("Failed to toggle habit:", err);
      dispatch({
        type: "TOGGLE_HABIT",
        payload: { id, isCheck: currentCheck },
      });
    }
  };

  return {
    habits: state.habits,
    loading: state.loading,
    error: state.error,
    stats,
    handleCreateHabit,
    handleUpdateHabit,
    handleDeleteHabit,
    handleToggleCheck,
  };
}
