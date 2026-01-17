import { Sun, Moon } from "lucide-react";
import React from "react";

export function getGreeting(): { text: string; icon: React.ReactNode } {
  const hour = new Date().getHours();
  if (hour < 12)
    return {
      text: "Good Morning",
      icon: React.createElement(Sun, { className: "size-6 text-amber-500" }),
    };
  if (hour < 18)
    return {
      text: "Good Afternoon",
      icon: React.createElement(Sun, { className: "size-6 text-orange-500" }),
    };
  return {
    text: "Good Evening",
    icon: React.createElement(Moon, { className: "size-6 text-indigo-500" }),
  };
}
