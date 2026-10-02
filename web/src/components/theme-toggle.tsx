"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return showLabel ? <div className="h-9" /> : <div className="size-8" />;
  }

  const isDark = resolvedTheme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");

  if (showLabel) {
    return (
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          className
        )}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        {isDark ? "Light mode" : "Dark mode"}
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("rounded-full", className)}
      aria-label="Toggle theme"
      onClick={toggle}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
