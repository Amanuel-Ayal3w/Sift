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
    <section id="how-it-works" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block border border-border bg-secondary px-3 py-1 font-mono text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            How it works
          </span>
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            From raw lead to qualified opportunity in seconds
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            No manual research. No copy pasting into CRM. Sift handles
            enrichment, scoring, and reply drafting automatically.
          </p>
        </div>

        <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-background p-8 transition-colors hover:bg-muted/40"
            >
              <span className="inline-flex font-mono text-sm font-medium text-foreground">
                {s.step}
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
              <p className="mt-3 text-xs font-medium text-muted-foreground">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
