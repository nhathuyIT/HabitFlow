import axios from "axios";
import type { Habit } from "@/types/habit";
import type { User } from "@/types/user";

const MOCKAPI_BASE_URL =
  import.meta.env.VITE_MOCKAPI_URL ||
  "https://696b3b9f624d7ddccaa091ec.mockapi.io";

const api = axios.create({
  baseURL: MOCKAPI_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function login(
  username: string,
  password: string,
): Promise<User | null> {
  const { data: users } = await api.get<User[]>("/user", {
    params: { username },
  });
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  return user || null;
}

export async function getHabits(userId: string): Promise<Habit[]> {
  const { data } = await api.get<Habit[]>("/habit", {
    params: { userId },
  });
  return data;
}

export async function createHabit(habit: {
  title: string;
  description: string;
  userId: string;
  isCheck: boolean;
}): Promise<Habit> {
  const { data } = await api.post<Habit>("/habit", habit);
  return data;
}

export async function updateHabit(
  id: string,
  habit: {
    title?: string;
    description?: string;
    isCheck?: boolean;
  },
): Promise<Habit> {
  const { data } = await api.put<Habit>(`/habit/${id}`, habit);
  return data;
}

export async function deleteHabit(id: string): Promise<void> {
  await api.delete(`/habit/${id}`);
}

export async function toggleHabitCheck(
  id: string,
  isCheck: boolean,
): Promise<Habit> {
  return updateHabit(id, { isCheck });
}

export async function updateStreak(id: string, streak: number): Promise<User> {
  const { data } = await api.put<User>(`/user/${id}`, { streak });
  return data;
}
