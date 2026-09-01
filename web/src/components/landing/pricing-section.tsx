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
    <section
      id="pricing"
      className="bg-[#0d0f0e] py-20 text-white lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            A small price for massive growth
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
            Start with a 30-day free trial. Scale as your pipeline grows.
          </p>
        </div>

        {/* Calculator card */}
        <div className="mx-auto mb-16 max-w-3xl rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10">
          <p className="text-sm font-medium opacity-80">
            Select your monthly leads
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {orderTiers.map((tier, i) => (
              <button
                key={tier.value}
                type="button"
                onClick={() => setSelectedTier(i)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  selectedTier === i
                    ? "bg-black text-white"
                    : "bg-black/10 hover:bg-black/20"
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
              <p className="text-4xl font-bold sm:text-5xl">
                ${currentPrice}
                <span className="text-lg font-medium opacity-60"> /mo</span>
              </p>
              <p className="mt-1 text-sm opacity-70">
                Unlock your revenue potential.
              </p>
            </div>
            <Button
              className="h-12 rounded-full bg-white px-8 font-semibold text-black hover:bg-white/90"
              nativeButton={false}
              render={
                <Link href="/signup">Start my 30 day free trial</Link>
              }
            />
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-primary/30 bg-white/5"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-white/50">{plan.description}</p>
              <p className="mt-6 text-4xl font-bold">
                ${plan.price}
                <span className="text-base font-medium text-white/50">
                  /mo
                </span>
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
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
