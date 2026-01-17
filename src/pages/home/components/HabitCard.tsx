import { MoreHorizontal, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getCategoryStyle } from "../utils";
import type { Habit } from "@/types/habit";
import { useState } from "react";

interface HabitCardProps {
  habit: Habit;
  showActions: boolean;
  onToggleActions: () => void;
  onToggleCheck: () => void;
  onDelete: () => void;
}

export function HabitCard({
  habit,
  showActions,
  onToggleActions,
  onToggleCheck,
  onDelete,
}: HabitCardProps) {
  const category = getCategoryStyle(habit.title);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <Card
      className={`group transition-all duration-300 hover:shadow-md ${
        habit.isCheck ? "bg-muted/30 border-muted" : "hover:border-primary/30"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div
            className={`size-10 sm:size-12 rounded-xl flex items-center justify-center ${category.bg} ${category.color} transition-transform group-hover:scale-105`}
          >
            {category.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4
                className={`font-semibold truncate transition-all ${
                  habit.isCheck ? "line-through text-muted-foreground" : ""
                }`}
              >
                {habit.title}
              </h4>
              {habit.isCheck && (
                <Badge variant="success" className="text-[10px] py-0 h-5">
                  Done!
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {habit.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={onToggleActions}
              >
                <MoreHorizontal className="size-4" />
              </Button>
              {showActions && (
                <div className="absolute right-0 top-full mt-1 bg-popover border rounded-lg shadow-lg py-1 min-w-[120px] z-10">
                  <button className="w-full px-3 py-1.5 text-sm text-left hover:bg-muted flex items-center gap-2">
                    <Edit3 className="size-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                      onToggleActions();
                    }}
                    className="w-full px-3 py-1.5 text-sm text-left hover:bg-muted flex items-center gap-2 text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </div>
              )}
            </div>
            <Checkbox checked={habit.isCheck} onCheckedChange={onToggleCheck} />
          </div>
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{habit.title}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
