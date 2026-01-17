import { useState, type FormEvent } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, description: string) => Promise<boolean>;
}

export function AddHabitDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddHabitDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    if (title.trim().length > 50) {
      setError("Title must not exceed 50 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await onSubmit(title.trim(), description.trim());
      if (result) {
        // Show success feedback briefly
        setSuccess(true);
        
        // Reset form and close dialog after short delay
        setTimeout(() => {
          setTitle("");
          setDescription("");
          setError("");
          setSuccess(false);
          onOpenChange(false);
        }, 500);
      } else {
        setError("Failed to create habit. Please check your connection and try again.");
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = error?.response?.data?.message || error?.message || "An unexpected error occurred";
      setError(`Error: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      setTitle("");
      setDescription("");
      setError("");
      setSuccess(false);
      onOpenChange(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !loading) {
      setTitle("");
      setDescription("");
      setError("");
      setSuccess(false);
      onOpenChange(false);
    } else if (open) {
      onOpenChange(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
              <Plus className="size-4" />
            </div>
            Add New Habit
          </DialogTitle>
          <DialogDescription>
            Create a new habit to track daily. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Morning Exercise"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                autoFocus
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/50 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., 30 minutes of cardio or strength training"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                maxLength={200}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/200 characters
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 animate-in fade-in-0 slide-in-from-top-1">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-500/10 border border-green-500/20 p-3 animate-in fade-in-0 slide-in-from-top-1">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  ✓ Habit created successfully!
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || success}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : success ? (
                <>
                  ✓ Created!
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Create Habit
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}