"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitDemoLead } from "@/lib/demo-lead";

export function ContactSection() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await submitDemoLead({
        fullName: `${firstName} ${lastName}`.trim(),
        email,
        companyName: company,
        message,
        source: "Contact form",
      });
      setStatus("sent");
      setFirstName("");
      setLastName("");
      setEmail("");
      setCompany("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send your message.");
    }
  };
  return (
    <section id="contact" className="bg-background py-20 dark:bg-transparent lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block border border-border bg-secondary px-3 py-1 font-mono text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Contact
          </span>
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Get in touch with Sift
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Questions about pricing, integrations, or enterprise plans? Our team
            responds within one business day.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <p className="text-lg text-muted-foreground">
              Whether you&apos;re evaluating Sift for a 5-person startup or a
              500-person sales org, we&apos;ll help you find the right setup.
            </p>

            <div>
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </h3>
              <p className="mt-2 text-foreground">hello@sift.app</p>
            </div>

            <div>
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Sales
              </h3>
              <p className="mt-2 text-foreground">sales@sift.app</p>
            </div>

            <div>
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Office
              </h3>
              <p className="mt-2 text-foreground">
                548 Market Street, Suite 35410
                <br />
                San Francisco, CA 94104
              </p>
            </div>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Jane"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Smith"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jane@company.com"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="company">Company name</Label>
              <Input
                id="company"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Acme Corp"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                required
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell us about your team..."
              />
            </div>
            {status === "sent" && (
              <p className="text-sm text-foreground">Sent. We&apos;ll follow up shortly.</p>
            )}
            {status === "error" && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={status === "sending"}
                className="rounded-lg bg-foreground px-8 font-semibold text-background hover:bg-foreground/90"
              >
                {status === "sending" ? "Sending…" : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="border-t border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
        <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
          Ready to get started?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join 120+ sales teams using Sift to qualify leads faster, route smarter,
          and close more deals — with AI-drafted replies on every inbound lead.
        </p>
        <Button
          size="lg"
          className="mt-8 h-12 rounded-lg bg-foreground px-10 text-base font-semibold text-background hover:bg-foreground/90"
          nativeButton={false}
          render={<Link href="/signup">Sign up now!</Link>}
        />
      </div>
    </section>
  );
}
