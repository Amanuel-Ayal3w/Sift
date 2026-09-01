import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const footerLinks = [
  { href: "/about", label: "About us" },
  { href: "#contact", label: "Contact us" },
  { href: "/terms", label: "Terms of service" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/support", label: "Sift support" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <Logo />
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col items-start justify-between gap-2 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            Multi-tenant agentic lead qualification.
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Sift
          </p>
        </div>
      </div>
    </footer>
  );
}
