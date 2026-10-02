"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitDemoLead } from "@/lib/demo-lead";

export function DemoForm() {
  const [name, setName] = useState("");
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
        fullName: name,
        email,
        companyName: company,
        message,
        source: "Public demo",
      });
      setStatus("sent");
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not submit this lead.");
    }
  };

  return (
    <section id="demo" className="bg-background py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <span className="mb-4 inline-block border border-border bg-secondary px-3 py-1 font-mono text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Try it
          </span>
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Send a lead. Watch it get scored.
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Drop in a prospect the way your form would. Sift qualifies them
            against a live workspace and drafts a reply.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 border border-border p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-name">Name</Label>
            <Input
              id="demo-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Sarah Chen"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-email">Work email</Label>
            <Input
              id="demo-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="sarah@acme.io"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-company">Company</Label>
            <Input
              id="demo-company"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Acme Corp"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-message">Message</Label>
            <Textarea
              id="demo-message"
              required
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="We have a 150 person sales team and a $50k budget."
            />
          </div>
          {status === "sent" && (
            <p className="text-sm text-foreground">Sent. The lead is being scored now.</p>
          )}
          {status === "error" && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={status === "sending"}
              className="rounded-lg bg-foreground px-8 font-semibold text-background hover:bg-foreground/90"
            >
              {status === "sending" ? "Sending…" : "Score this lead"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
