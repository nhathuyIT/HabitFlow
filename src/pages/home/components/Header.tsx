import { Flame, Plus, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "../utils";
import { ModeToggle } from "../../../provider/ModeToggle";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const today = new Date();
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/25">
              <Flame className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">HabitFlow</h1>
              <p className="text-xs text-muted-foreground">
                Build better habits
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Calendar className="size-4" />
              <span>{formatDate(today)}</span>
            </Button>
            <Button className="shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-shadow">
              <Plus className="size-4" />
              <span className="hidden sm:inline">New Habit</span>
            </Button>
            <ModeToggle />
            <div className="flex items-center gap-2">
              <Avatar className="size-9 border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-semibold">
                  {user ? getInitials(user.username) : "??"}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Logout"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
