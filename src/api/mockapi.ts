// Type Definitions
export interface Habit {
  id: string
  title: string
  description: string
  completed_at: number | null
  created_at: number
  updated_at: number
  isCheck: boolean
}

export type HabitInput = Omit<Habit, 'id' | 'created_at' | 'updated_at'>

// API Configuration
const MOCKAPI_BASE_URL = import.meta.env.VITE_MOCKAPI_URL || 'https://696b3b9f624d7ddccaa091ec.mockapi.io'
export const HABITS_ENDPOINT = `${MOCKAPI_BASE_URL}`

// API Functions
export async function getHabits(): Promise<Habit[]> {
  const response = await fetch(HABITS_ENDPOINT)
  if (!response.ok) {
    throw new Error(`Failed to fetch habits: ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  return data
}

export async function updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
  const response = await fetch(`${HABITS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })
  if (!response.ok) {
    throw new Error(`Failed to update habit: ${response.status} ${response.statusText}`)
  }
  return await response.json()
}

export async function toggleHabitCheck(id: string, isCheck: boolean): Promise<Habit> {
  return updateHabit(id, { isCheck })
}
