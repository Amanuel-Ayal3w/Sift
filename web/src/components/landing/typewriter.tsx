"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Typewriter({
  text,
  className,
  speed = 28,
  startDelay = 80,
  showCursor = true,
  onDone,
}: {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  showCursor?: boolean;
  onDone?: () => void;
}) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setShown("");
    setDone(false);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setShown(text);
      setDone(true);
      onDoneRef.current?.();
      return;
    }

    let i = 0;
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          window.clearInterval(interval);
          setDone(true);
          onDoneRef.current?.();
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeout);
      if (interval) window.clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      {shown}
      {showCursor && !done && (
        <span
          className="caret ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.1em] bg-primary align-baseline"
          aria-hidden
        />
      )}
    </span>
  );
}
