"use client";

import { Typewriter } from "@/components/landing/typewriter";

const HEADLINE = "An AI agent that actually qualifies your leads";
const SUBHEAD =
  "Sift reasons over your criteria, enriches every inbound lead, and drafts a reply, so nothing hot sits in your inbox unread.";

export function HeroCopy() {
  return (
    <>
      <p className="mb-5 font-mono text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        00 / AI Lead Qualification
      </p>

      <h1 className="max-w-4xl min-h-[2.6em] text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        <Typewriter text={HEADLINE} speed={42} />
      </h1>

      <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
        {SUBHEAD}
      </p>
    </>
  );
}
