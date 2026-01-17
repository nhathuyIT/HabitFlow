import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 sm:hidden">
      <Button
        size="lg"
        className="size-14 rounded-full shadow-2xl shadow-primary/40"
        onClick={onClick}
      >
        <Plus className="size-6" />
      </Button>
    </div>
  );
}
