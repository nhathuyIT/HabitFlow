import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<
  React.ComponentProps<"button">,
  "onChange"
> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function Checkbox({
  className,
  checked = false,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "peer size-5 shrink-0 rounded-md border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-muted-foreground/40 hover:border-primary/60",
        className,
      )}
      {...props}
    >
      {checked && (
        <Check className="size-3.5 mx-auto text-current animate-in zoom-in-50 duration-200" />
      )}
    </button>
  );
}

export { Checkbox };
