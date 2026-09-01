import { PlatformShowcase } from "@/components/landing/platform-showcase";

export function PlatformSection() {
  return (
    <section className="bg-background py-20 dark:bg-[#0d0f0e] lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            One platform. All of your leads.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Every inbound channel, unified. Sift qualifies, enriches, and
            routes, so your team focuses on closing, not sorting.
          </p>
        </div>

        <PlatformShowcase />
      </div>
    </section>
  );
}
