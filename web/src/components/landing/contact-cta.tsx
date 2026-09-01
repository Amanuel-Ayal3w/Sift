import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactSection() {
  return (
    <section id="contact" className="bg-background py-20 dark:bg-transparent lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Contact
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
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
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </h3>
              <p className="mt-2 text-foreground">hello@sift.app</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Sales
              </h3>
              <p className="mt-2 text-foreground">sales@sift.app</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Office
              </h3>
              <p className="mt-2 text-foreground">
                548 Market Street, Suite 35410
                <br />
                San Francisco, CA 94104
              </p>
            </div>
          </div>

          <form className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  placeholder="Jane"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
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
                placeholder="jane@company.com"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="company">Company name</Label>
              <Input
                id="company"
                placeholder="Acme Corp"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                rows={4}
                placeholder="Tell us about your team..."
                className="w-full resize-none rounded-xl border border-input bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Submit
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
    <section className="border-t border-border bg-background py-20 dark:border-white/10 dark:bg-transparent lg:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to get started?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join 120+ sales teams using Sift to qualify leads faster, route smarter,
          and close more deals — with AI-drafted replies on every inbound lead.
        </p>
        <Button
          size="lg"
          className="mt-8 h-12 rounded-full bg-primary px-10 text-base font-semibold text-primary-foreground hover:bg-primary/90"
          nativeButton={false}
          render={<Link href="/signup">Sign up now!</Link>}
        />
      </div>
    </section>
  );
}
