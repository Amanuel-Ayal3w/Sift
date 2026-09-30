"use client";

import { useState } from "react";
import { Typewriter } from "@/components/landing/typewriter";

const HEADLINE = "An AI agent that actually qualifies your leads";
const SUBHEAD =
  "Sift reasons over your criteria, enriches every inbound lead, and drafts a reply, so nothing hot sits in your inbox unread.";

export function HeroCopy() {
  const [showSubhead, setShowSubhead] = useState(false);

  return (
    <>
      <h1 className="max-w-4xl min-h-[2.6em] text-balance text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
        <Typewriter
          text={HEADLINE}
          speed={60}
          onDone={() => setShowSubhead(true)}
        />
      </h1>

      <p className="mt-6 min-h-[4.5rem] max-w-2xl text-balance text-lg text-muted-foreground sm:min-h-[3.5rem] sm:text-xl">
        {showSubhead && (
          <Typewriter text={SUBHEAD} speed={40} startDelay={120} />
        )}
      </p>
    </>
  );
}
