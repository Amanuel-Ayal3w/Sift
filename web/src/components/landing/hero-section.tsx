import { HeroIllustration } from "@/components/graphics/hero-illustration";
import { HeroCopy } from "@/components/landing/hero-copy";
import { HeroStart } from "@/components/landing/hero-start";

export function HeroSection() {
  return (
    <section className="bg-transparent py-20 lg:py-28">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-10">
        <HeroCopy />
        <HeroStart />

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
