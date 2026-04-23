"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors text-gray-600 dark:text-zinc-400"
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
};

export { ThemeSwitcher };
