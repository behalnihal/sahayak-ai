"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      className="px-2 cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-5 w-5 text-neutral-800 dark:hidden dark:text-neutral-200 inline" />
      <Moon className="hidden h-5 w-5 text-neutral-800 dark:block dark:text-neutral-200" />
    </button>
  );
}
