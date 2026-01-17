import {
  Zap,
  Flame,
  Target,
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export const habitCategories: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  health: {
    icon: <Zap className="size-4" />,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  fitness: {
    icon: <Flame className="size-4" />,
    color: "text-orange-600",
    bg: "bg-orange-500/10",
  },
  learning: {
    icon: <Target className="size-4" />,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  mindfulness: {
    icon: <Sparkles className="size-4" />,
    color: "text-purple-600",
    bg: "bg-purple-500/10",
  },
  productivity: {
    icon: <TrendingUp className="size-4" />,
    color: "text-cyan-600",
    bg: "bg-cyan-500/10",
  },
  default: {
    icon: <CheckCircle2 className="size-4" />,
    color: "text-gray-600",
    bg: "bg-gray-500/10",
  },
};

export function getCategoryStyle(title: string) {
  const lowercaseTitle = title.toLowerCase();
  if (
    lowercaseTitle.includes("exercise") ||
    lowercaseTitle.includes("workout") ||
    lowercaseTitle.includes("gym")
  )
    return habitCategories.fitness;
  if (
    lowercaseTitle.includes("read") ||
    lowercaseTitle.includes("learn") ||
    lowercaseTitle.includes("study")
  )
    return habitCategories.learning;
  if (
    lowercaseTitle.includes("meditat") ||
    lowercaseTitle.includes("journal") ||
    lowercaseTitle.includes("mindful")
  )
    return habitCategories.mindfulness;
  if (
    lowercaseTitle.includes("water") ||
    lowercaseTitle.includes("sleep") ||
    lowercaseTitle.includes("health")
  )
    return habitCategories.health;
  if (
    lowercaseTitle.includes("work") ||
    lowercaseTitle.includes("task") ||
    lowercaseTitle.includes("productive")
  )
    return habitCategories.productivity;
  return habitCategories.default;
}
