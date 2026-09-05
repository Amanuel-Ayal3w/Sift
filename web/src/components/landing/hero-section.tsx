import Link from "next/link";
import { HeroIllustration } from "@/components/graphics/hero-illustration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 pt-16 pb-20 text-center lg:px-10 lg:pt-24 lg:pb-28">
        <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          An AI agent that actually qualifies your leads
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
          Sift reasons over your criteria, enriches every inbound lead, and
          drafts a reply, so nothing hot sits in your inbox unread.
        </p>

        {/* Store-style input combo */}
        <div className="mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center overflow-hidden rounded-full border border-border bg-card shadow-sm">
            <Input
              placeholder="yourcompany"
              className="h-12 flex-1 rounded-none border-0 bg-transparent px-5 text-base shadow-none focus-visible:ring-0"
            />
            <span className="hidden shrink-0 pr-2 text-sm text-muted-foreground sm:inline">
              .sift.app
            </span>
          </div>
          <Button
            size="lg"
            className="h-12 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90"
            nativeButton={false}
            render={<Link href="/signup">Get started for free!</Link>}
          />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Free 30 day trial · No credit card required
        </p>

        <div className="mt-16 w-full">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
