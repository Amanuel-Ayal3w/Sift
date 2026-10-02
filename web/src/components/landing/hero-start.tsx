"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroStart() {
  const router = useRouter();
  const [company, setCompany] = useState("");

  const start = (event: React.FormEvent) => {
    event.preventDefault();
    const name = company.trim();
    router.push(name ? `/signup?company=${encodeURIComponent(name)}` : "/signup");
  };

  return (
    <form
      onSubmit={start}
      className="mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center overflow-hidden rounded-lg border border-border bg-background/80 shadow-none backdrop-blur-sm">
        <Input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder="yourcompany"
          className="h-12 flex-1 rounded-none border-0 bg-transparent px-5 text-base shadow-none focus-visible:ring-0"
        />
        <span className="hidden shrink-0 pr-3 font-mono text-sm text-muted-foreground sm:inline">
          .sift.app
        </span>
      </div>
      <Button
        type="submit"
        size="lg"
        className="h-12 rounded-lg bg-foreground px-8 text-base font-semibold text-background hover:bg-foreground/90"
      >
        Get started for free!
      </Button>
    </form>
  );
}
