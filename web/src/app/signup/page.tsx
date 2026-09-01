import Link from "next/link";
import { Check } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";

const perks = [
  "30 day free trial, no credit card",
  "Unlimited lead scoring",
  "AI drafted replies on every lead",
];

export default function SignupPage() {
  return (
    <AuthLayout
      title="Start qualifying leads"
      subtitle="Create your workspace and connect your first inbound channel in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <ul className="mb-8 flex flex-col gap-2.5">
        {perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
              <Check className="size-3 text-primary" strokeWidth={3} />
            </span>
            {perk}
          </li>
        ))}
      </ul>

      <form className="flex flex-col gap-5">
        <AuthField
          id="company"
          label="Company name"
          placeholder="Acme Corp"
          autoComplete="organization"
          required
        />

        <AuthField
          id="email"
          label="Work email"
          type="email"
          placeholder="jane@company.com"
          autoComplete="email"
          required
        />

        <AuthField
          id="password"
          label="Password"
          type="password"
          placeholder="Create a password"
          hint="At least 8 characters"
          autoComplete="new-password"
          required
        />

        <Button
          type="submit"
          className="mt-1 h-12 rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90"
        >
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline-offset-2 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthLayout>
  );
}
