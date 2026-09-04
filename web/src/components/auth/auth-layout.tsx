import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthVisual } from "@/components/auth/auth-visual";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-[52%] overflow-hidden bg-surface-dark lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#baff39_0%,_transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#e8b44f_0%,_transparent_40%)] opacity-10" />

        <div className="relative flex flex-1 flex-col justify-between p-12 xl:p-16">
          <Logo className="text-white [&_span]:text-white" />

          <div className="max-w-md">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">
              AI lead qualification
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
              Qualify every lead before your rep picks up the phone.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/60">
              Sift enriches, scores, and drafts replies for every inbound
              channel — so your team closes deals, not sorts inboxes.
            </p>
          </div>

          <AuthVisual />

          <div className="flex items-center gap-6 text-sm text-white/40">
            <span>Trusted by 120+ sales teams</span>
            <span className="size-1 rounded-full bg-white/20" />
            <span>SOC 2 compliant</span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col bg-background">
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 sm:px-10">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
              <p className="mt-2 text-base text-muted-foreground">{subtitle}</p>
            </div>

            {children}

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {footer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
