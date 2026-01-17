import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getHabits, toggleHabitCheck, type Habit } from '@/api/mockapi'

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    async function fetchHabits() {
      try {
        setLoading(true)
        setError(null)
        const data = await getHabits()
        setHabits(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load habits'
        console.error('Failed to load habits:', err)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchHabits()
  }, [])

  const handleToggleCheck = async (id: string, currentCheck: boolean) => {
    try {
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === id ? { ...habit, isCheck: !currentCheck } : habit
        )
      )

      await toggleHabitCheck(id, !currentCheck)
    } catch (err) {
      console.error('Failed to toggle habit check:', err)
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === id ? { ...habit, isCheck: currentCheck } : habit
        )
      )
    }
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Habit Flow</h1>
            <Button>
              <Plus className="size-4" />
              Add Habit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Table */}
        <div className="rounded-md border overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="w-12 px-4 py-3 text-center font-medium text-muted-foreground">
                  <input type="checkbox" className="size-4 mx-auto" />
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  Title
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  Completed At
                </th>
                <th className="w-32 px-4 py-3 text-center font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-destructive">
                    Error: {error}
                  </td>
                </tr>
              ) : habits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No habits found. Add your first habit!
                  </td>
                </tr>
              ) : (
                habits.map((habit) => (
                  <tr key={habit.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        className="size-4 mx-auto cursor-pointer"
                        checked={habit.isCheck}
                        onChange={() => handleToggleCheck(habit.id, habit.isCheck)}
                      />
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{habit.title}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      {habit.description}
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      {habit.completed_at
                        ? new Date(habit.completed_at * 1000).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
