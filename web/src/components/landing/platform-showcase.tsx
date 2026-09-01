"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CardData = {
  label: string;
  subtitle: string;
  color: string;
  rotation: number;
  offsetX: number;
  offsetY: number;
  content: React.ReactNode;
};

export type LeadChannel = {
  id: string;
  label: string;
  description: string;
  cards: CardData[];
};

function ScoreBadge({ score, tier }: { score: number; tier: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-3xl font-bold text-black">{score}</span>
      <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-primary">
        {tier}
      </span>
    </div>
  );
}

function DraftReply({
  message,
  cta = "Send",
}: {
  message: string;
  cta?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-black/5 p-3">
        <p className="text-xs leading-relaxed text-black/70">{message}</p>
      </div>
      <div className="flex justify-end">
        <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-black">
          {cta}
        </span>
      </div>
    </div>
  );
}

function EnrichGrid({ fields }: { fields: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {fields.map(([k, v]) => (
        <div key={k} className="rounded-lg bg-black/5 p-2.5">
          <p className="text-[10px] text-black/40">{k}</p>
          <p className="text-xs font-medium text-black">{v}</p>
        </div>
      ))}
    </div>
  );
}

const cardLayout = {
  score: { color: "#baff39", rotation: -5, offsetX: 0, offsetY: 0 },
  enrich: { color: "#c8b8f0", rotation: 2, offsetX: 40, offsetY: 18 },
  draft: { color: "#ffffff", rotation: 7, offsetX: 80, offsetY: 36 },
} as const;

function makeCards(
  scoreSubtitle: string,
  score: React.ReactNode,
  enrichSubtitle: string,
  enrich: React.ReactNode,
  draftSubtitle: string,
  draft: React.ReactNode
): CardData[] {
  return [
    { label: "Score", subtitle: scoreSubtitle, ...cardLayout.score, content: score },
    { label: "Enrich", subtitle: enrichSubtitle, ...cardLayout.enrich, content: enrich },
    { label: "Draft", subtitle: draftSubtitle, ...cardLayout.draft, content: draft },
  ];
}

export const leadChannels: LeadChannel[] = [
  {
    id: "inbound-form",
    label: "Inbound Form",
    description:
      "Website form submissions are scored instantly against your ICP, enriched with company data and a reply drafted before your rep even sees it.",
    cards: makeCards(
      "Lead captured from your website form",
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-black/10" />
          <div>
            <p className="text-sm font-semibold text-black">Sarah Chen</p>
            <p className="text-xs text-black/50">sarah@acme.io</p>
          </div>
        </div>
        <div className="space-y-1.5 rounded-xl bg-black/5 p-3 text-xs text-black/70">
          <p>Role: VP Sales</p>
          <p>Budget: $50k+ · Team size: 25</p>
          <p>Message: "Looking for a lead qualification tool"</p>
        </div>
        <ScoreBadge score={88} tier="HOT" />
      </div>,
      "Company data pulled automatically",
      <div className="space-y-3">
        <p className="text-xs font-semibold text-black">Acme Corp</p>
        <EnrichGrid
          fields={[
            ["Industry", "FinTech"],
            ["Employees", "150"],
            ["Funding", "Series B, $22M"],
            ["Tech stack", "Salesforce, HubSpot"],
          ]}
        />
      </div>,
      "Personalized reply ready to send",
      <DraftReply message="Hi Sarah, thanks for filling out our form. With a 25 person sales team and your budget range, our Growth plan looks like the right fit. Want me to send over a tailored proposal?" />
    ),
  },
  {
    id: "webhook-lead",
    label: "Webhook Lead",
    description:
      "Leads from any CRM or tool hit your webhook, and Sift parses the payload, merges CRM context, and qualifies in real time.",
    cards: makeCards(
      "Raw payload received via webhook",
      <div className="space-y-3 font-mono">
        <p className="text-[10px] text-black/40">POST /webhook/leads</p>
        <div className="rounded-xl bg-black/5 p-3 text-[10px] leading-relaxed text-black/70">
          <span className="font-semibold text-black/90">"email"</span>: j.doe@northwind.com
          <br />
          <span className="font-semibold text-black/90">"source"</span>: hubspot
          <br />
          <span className="font-semibold text-black/90">"company"</span>: Northwind Traders
          <br />
          <span className="font-semibold text-black/90">"deal_stage"</span>: qualified
        </div>
        <ScoreBadge score={76} tier="WARM" />
      </div>,
      "CRM record merged with payload",
      <div className="space-y-3">
        <p className="text-xs font-semibold text-black">Merged from HubSpot CRM</p>
        <EnrichGrid
          fields={[
            ["Company", "Northwind Traders"],
            ["Deal stage", "Qualified"],
            ["Last touch", "3 days ago"],
            ["Owner", "Alex R."],
          ]}
        />
      </div>,
      "Follow up referencing CRM history",
      <DraftReply message="Hi James, I see Northwind came through your HubSpot integration. Your team is already in our qualified pipeline, so I've drafted a follow up based on your last conversation with Alex." />
    ),
  },
  {
    id: "chat-handoff",
    label: "Chat Handoff",
    description:
      "Live chat conversations are analyzed for intent and urgency, the visitor is identified, and a contextual reply is drafted on handoff.",
    cards: makeCards(
      "Chat transcript analyzed for intent",
      <div className="space-y-3">
        <div className="rounded-xl bg-black/5 p-3">
          <p className="text-xs text-black/70">
            "We need enterprise pricing for 200 seats. Can someone from sales call us this week?"
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Intent: Enterprise", "Urgency: High", "Seats: 200"].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-black/10 px-2.5 py-1 text-[10px] font-medium text-black"
            >
              {tag}
            </span>
          ))}
        </div>
        <ScoreBadge score={91} tier="HOT" />
      </div>,
      "Anonymous visitor identified",
      <div className="space-y-3">
        <p className="text-xs font-semibold text-black">Globex Inc identified</p>
        <EnrichGrid
          fields={[
            ["Company", "Globex Inc"],
            ["Pages viewed", "Pricing, API, SSO"],
            ["Sessions", "4 this week"],
            ["Location", "London, UK"],
          ]}
        />
      </div>,
      "Reply addressing their chat question",
      <DraftReply message="Hi there, thanks for chatting with us about enterprise pricing for 200 seats. I've put together a custom quote for Globex and can walk your team through SSO and API access on a call this week." />
    ),
  },
  {
    id: "demo-request",
    label: "Demo Request",
    description:
      "Demo bookings are flagged as high intent, and Sift builds a pre demo brief so your AE walks in prepared.",
    cards: makeCards(
      "Demo slot confirmed — high intent",
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-black">Demo booked</p>
          <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold text-primary">
            Tomorrow 2pm
          </span>
        </div>
        <div className="rounded-xl bg-black/5 p-3 text-xs text-black/70">
          <p>Marcus Webb · CTO</p>
          <p>Initech · 320 employees</p>
        </div>
        <ScoreBadge score={94} tier="HOT" />
      </div>,
      "Pre demo research brief generated",
      <div className="space-y-3">
        <p className="text-xs font-semibold text-black">AE prep brief</p>
        <EnrichGrid
          fields={[
            ["Company", "Initech"],
            ["Employees", "320"],
            ["Pain point", "Manual lead routing"],
            ["Current tool", "Spreadsheets"],
          ]}
        />
      </div>,
      "Demo confirmation with agenda",
      <DraftReply
        cta="Confirm demo"
        message="Hi Marcus, looking forward to your demo tomorrow at 2pm. I've prepared a walkthrough focused on lead routing for your 320 person team. Shall I include your RevOps lead on the invite?"
      />
    ),
  },
  {
    id: "pricing-inquiry",
    label: "Pricing Inquiry",
    description:
      "Pricing page visitors are matched to the right plan based on team size and lead volume, with ROI estimates included.",
    cards: makeCards(
      "Plan fit calculated from signals",
      <div className="space-y-4">
        <p className="text-sm font-semibold text-black">Recommended plan</p>
        <div className="flex gap-1.5">
          {["Starter", "Growth", "Enterprise"].map((plan, i) => (
            <div
              key={plan}
              className={cn(
                "flex-1 rounded-lg py-2 text-center text-[10px] font-medium",
                i === 1 ? "bg-black text-primary" : "bg-black/5 text-black/50"
              )}
            >
              {plan}
            </div>
          ))}
        </div>
        <p className="text-xs text-black/60">
          Based on 18 reps · ~2,400 leads/mo
        </p>
        <ScoreBadge score={82} tier="WARM" />
      </div>,
      "Usage and ROI projected",
      <div className="space-y-3">
        <p className="text-xs font-semibold text-black">Usage estimate</p>
        <EnrichGrid
          fields={[
            ["Leads/mo", "~2,400"],
            ["Team size", "18 reps"],
            ["Best fit", "Growth, $149/mo"],
            ["Est. ROI", "3.2x in year 1"],
          ]}
        />
      </div>,
      "Pricing reply with breakdown attached",
      <DraftReply message="Hi Priya, based on your ~2,400 monthly leads and 18 person team, Growth at $149/mo is the best fit. I've attached a breakdown showing projected time saved per rep. Happy to walk through it live." />
    ),
  },
  {
    id: "partner-referral",
    label: "Partner Referral",
    description:
      "Partner sourced leads are fast tracked, referral metadata, commission tier, and a warm welcome reply are handled automatically.",
    cards: makeCards(
      "Referral source identified and scored",
      <div className="space-y-4">
        <span className="inline-block rounded-lg bg-black/10 px-3 py-1.5 text-xs font-medium text-black">
          Referred by Globex Partners
        </span>
        <div className="rounded-xl bg-black/5 p-3 text-xs text-black/70">
          <p>Elena Voss · VP Operations</p>
          <p>Pinnacle SaaS · 80 employees</p>
        </div>
        <ScoreBadge score={86} tier="HOT" />
      </div>,
      "Partner tier and commission applied",
      <div className="space-y-3">
        <p className="text-xs font-semibold text-black">Partner context</p>
        <EnrichGrid
          fields={[
            ["Partner tier", "Gold"],
            ["Commission", "20%"],
            ["Referrals YTD", "12 this quarter"],
            ["Lead company", "Pinnacle SaaS"],
          ]}
        />
      </div>,
      "Warm welcome mentioning the partner",
      <DraftReply message="Hi Elena, Globex Partners recommended we connect. Welcome to Sift! As a Gold partner referral, you'll get priority onboarding and a dedicated success manager from day one." />
    ),
  },
  {
    id: "event-signup",
    label: "Event Signup",
    description:
      "Conference and webinar signups are enriched with LinkedIn and funding data, and follow ups are drafted while the event is still fresh.",
    cards: makeCards(
      "Event attendee profile scored",
      <div className="space-y-4">
        <p className="text-sm font-semibold text-black">SaaStr Annual 2026</p>
        <div className="flex flex-wrap gap-1.5">
          {["VP Sales", "Series B", "SaaS", "Lead scoring"].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-black/10 px-2.5 py-1 text-[10px] font-medium text-black"
            >
              {tag}
            </span>
          ))}
        </div>
        <ScoreBadge score={78} tier="WARM" />
      </div>,
      "Attendee enriched from public data",
      <div className="space-y-3">
        <p className="text-xs font-semibold text-black">David Kim, RelayHQ</p>
        <EnrichGrid
          fields={[
            ["Title", "VP Sales"],
            ["Company", "RelayHQ"],
            ["Funding", "$18M Series B"],
            ["Interest", "Lead scoring at scale"],
          ]}
        />
      </div>,
      "Post event follow up drafted",
      <DraftReply message="Hi David, great meeting you at SaaStr! You mentioned lead scoring was a priority for RelayHQ post Series B. I've put together a quick overview of how Sift handles qualification at your scale." />
    ),
  },
  {
    id: "trial-activation",
    label: "Trial Activation",
    description:
      "Trial users are monitored for adoption signals, and Sift nudges teams toward features they haven't tried before the trial ends.",
    cards: makeCards(
      "Trial engagement scored daily",
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-black">Trial Day 3</p>
          <span className="text-xs font-medium text-black/50">Brightwave</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-black/60">
            <span>Feature adoption</span>
            <span className="font-semibold text-black">72%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/10">
            <div className="h-full w-[72%] rounded-full bg-black" />
          </div>
        </div>
        <ScoreBadge score={71} tier="WARM" />
      </div>,
      "Usage patterns analyzed",
      <div className="space-y-3">
        <p className="text-xs font-semibold text-black">Trial usage</p>
        <EnrichGrid
          fields={[
            ["Leads scored", "47"],
            ["Drafts sent", "12"],
            ["Top feature", "Enrichment"],
            ["Unused", "Routing rules"],
          ]}
        />
      </div>,
      "Check in nudging unused features",
      <DraftReply
        cta="Send check in"
        message="Hi team, you're 72% through onboarding on day 3, with 47 leads already scored. Your team hasn't tried custom routing rules yet, want a 15 min walkthrough before your trial ends?"
      />
    ),
  },
];

function ProductCard({
  card,
  index,
  channelId,
}: {
  card: CardData;
  index: number;
  channelId: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 60 + index * 120);
    return () => clearTimeout(timer);
  }, [index, channelId]);

  return (
    <div
      className={cn(
        "absolute top-0 left-0 min-h-[300px] w-[260px] rounded-2xl p-5 shadow-2xl transition-all duration-700 ease-out sm:min-h-[340px] sm:w-[280px] lg:w-[300px]",
        visible
          ? "translate-x-[var(--card-x)] translate-y-[var(--card-y)] rotate-[var(--card-rotate)] scale-100 opacity-100"
          : "translate-x-[calc(var(--card-x)-24px)] translate-y-[calc(var(--card-y)+32px)] rotate-0 scale-[0.92] opacity-0"
      )}
      style={
        {
          "--card-x": `${card.offsetX}px`,
          "--card-y": `${card.offsetY}px`,
          "--card-rotate": `${card.rotation}deg`,
          backgroundColor: card.color,
          zIndex: index + 1,
        } as React.CSSProperties
      }
    >
      <div className="mb-4">
        <p className="text-base font-bold text-black">{card.label}</p>
        <p className="mt-0.5 text-[11px] text-black/50">{card.subtitle}</p>
      </div>
      <div
        className={cn(
          "transition-all duration-500 ease-out",
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        )}
        style={{ transitionDelay: visible ? `${index * 80 + 100}ms` : "0ms" }}
      >
        {card.content}
      </div>
    </div>
  );
}

export function PlatformShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const selectChannel = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % leadChannels.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeChannel = leadChannels[activeIndex];

  return (
    <div
      className="grid items-start gap-12 lg:grid-cols-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex flex-col gap-1">
        {leadChannels.map((channel, i) => (
          <button
            key={channel.id}
            type="button"
            onClick={() => selectChannel(i)}
            className={cn(
              "rounded-xl px-4 py-2 text-left transition-colors duration-200",
              i === activeIndex
                ? "bg-primary/15 text-foreground"
                : "text-muted-foreground hover:bg-[#f0f0ec] hover:text-foreground dark:hover:bg-white/[0.04]"
            )}
          >
            <span className="flex items-center justify-between">
              <span className="text-sm font-medium">{channel.label}</span>
              {i === activeIndex && (
                <span className="size-1.5 rounded-full bg-primary" />
              )}
            </span>
            {i === activeIndex && (
              <p className="mt-1.5 max-w-[36ch] text-xs leading-relaxed text-muted-foreground">
                {channel.description}
              </p>
            )}
          </button>
        ))}
      </div>

      <div className="relative flex min-h-[460px] w-full items-center justify-center sm:min-h-[520px] lg:min-h-[560px]">
        <div className="relative h-[440px] w-full max-w-[480px] sm:h-[500px]">
          {activeChannel.cards.map((card, i) => (
            <ProductCard
              key={`${activeChannel.id}-${card.label}`}
              card={card}
              index={i}
              channelId={activeChannel.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
