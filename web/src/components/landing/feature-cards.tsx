import { DashboardMockup, WorkflowMockup } from "@/components/graphics/mockups";

const features = [
  {
    title: "Qualify leads with AI reasoning & dynamic scoring",
    bullets: [
      "Score every inbound lead against your custom criteria, including company size, budget signals, and intent, with transparent reasoning, not black box rules.",
      "Supercharge your pipeline with automated enrichment and tier assignment (HOT / WARM / COLD) designed to surface the leads that matter most.",
    ],
    graphic: <DashboardMockup />,
  },
  {
    title: "Build meaningful relationships & drive faster follow ups",
    bullets: [
      "Go from raw form submissions to qualified opportunities by enriching company data and drafting personalized replies in seconds.",
      "Deliver fully branded, context aware responses throughout the lead journey, from first touch to handoff.",
    ],
    graphic: <WorkflowMockup />,
  },
];

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed text-white/80 sm:text-base">
      <span className="mt-1 shrink-0 text-primary" aria-hidden>
        *
      </span>
      <span>{children}</span>
    </li>
  );
}

export function FeatureCards() {
  return (
    <section id="features" className="bg-primary py-6 sm:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-10">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="grid items-center gap-8 rounded-3xl bg-surface-dark p-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-10 lg:p-16"
          >
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              {feature.title}
            </h2>

            <div className="flex justify-center px-4">{feature.graphic}</div>

            <ul className="flex flex-col gap-5">
              {feature.bullets.map((bullet) => (
                <BulletItem key={bullet}>{bullet}</BulletItem>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
