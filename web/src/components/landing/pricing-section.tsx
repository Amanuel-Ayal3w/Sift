"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: 49,
    description: "For small teams getting started",
    features: [
      "Up to 500 leads/mo",
      "AI scoring & enrichment",
      "Draft reply generation",
      "Webhook integration",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: 149,
    description: "For growing sales teams",
    features: [
      "Up to 5,000 leads/mo",
      "Custom qualification criteria",
      "Multi tenant org support",
      "CRM integrations",
      "Priority support",
      "Analytics dashboard",
    ],
    highlighted: true,
  },
];

const orderTiers = [
  { label: "500", value: 500, price: 49 },
  { label: "2,000", value: 2000, price: 99 },
  { label: "5,000", value: 5000, price: 149 },
  { label: "15,000", value: 15000, price: 195 },
];

export function PricingSection() {
  const [selectedTier, setSelectedTier] = useState(2);
  const currentPrice = orderTiers[selectedTier].price;

  return (
    <section id="pricing" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
            A small price for massive growth
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Start with a 30-day free trial. Scale as your pipeline grows.
          </p>
        </div>

        <div className="mx-auto mb-16 max-w-3xl border border-foreground bg-foreground p-8 text-background sm:p-10">
          <p className="text-sm font-medium opacity-80">
            Select your monthly leads
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {orderTiers.map((tier, i) => (
              <button
                key={tier.value}
                type="button"
                onClick={() => setSelectedTier(i)}
                className={`px-5 py-2 text-sm font-semibold transition-all ${
                  selectedTier === i
                    ? "bg-background text-foreground"
                    : "border border-background/25 bg-transparent hover:bg-background/10"
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium opacity-80">
                Total monthly price
              </p>
              <p className="text-4xl font-semibold tracking-tight sm:text-5xl">
                ${currentPrice}
                <span className="text-lg font-medium opacity-60"> /mo</span>
              </p>
              <p className="mt-1 text-sm opacity-70">
                Unlock your revenue potential.
              </p>
            </div>
            <Button
              className="h-12 rounded-lg bg-background px-8 font-semibold text-foreground hover:bg-background/90"
              nativeButton={false}
              render={
                <Link href="/signup">Start my 30 day free trial</Link>
              }
            />
          </div>
        </div>

        <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-background p-8 ${
                plan.highlighted ? "ring-1 ring-inset ring-foreground/30" : ""
              }`}
            >
              <h3 className="text-xl font-semibold tracking-tight">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <p className="mt-6 text-4xl font-semibold tracking-tight">
                ${plan.price}
                <span className="text-base font-medium text-muted-foreground">
                  /mo
                </span>
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="size-4 shrink-0 text-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full rounded-lg bg-foreground font-semibold text-background hover:bg-foreground/90"
                nativeButton={false}
                render={<Link href="/signup">Get started</Link>}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
