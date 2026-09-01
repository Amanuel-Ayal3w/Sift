const steps = [
  {
    step: "01",
    title: "Lead comes in",
    description:
      "A prospect submits your form or hits your webhook. Sift receives it instantly via your org's unique endpoint and queues it for processing.",
    detail: "Supports forms, webhooks, chat handoffs, and CRM integrations.",
  },
  {
    step: "02",
    title: "Agent reasons",
    description:
      "The AI agent enriches company data from 20+ sources, then reasons over your custom qualification criteria, not a fixed rule set.",
    detail: "Transparent reasoning you can audit, not a black box score.",
  },
  {
    step: "03",
    title: "Scored & drafted",
    description:
      "You get a score, tier (HOT / WARM / COLD), the agent's full reasoning, and a personalized draft reply, routed to the right rep.",
    detail: "Average time from submission to qualified: under 30 seconds.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-20 dark:bg-transparent lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            How it works
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From raw lead to qualified opportunity in seconds
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            No manual research. No copy pasting into CRM. Sift handles
            enrichment, scoring, and reply drafting automatically.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="group rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg hover:shadow-primary/5 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                {s.step}
              </span>
              <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
              <p className="mt-3 text-xs font-medium text-primary/80">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
