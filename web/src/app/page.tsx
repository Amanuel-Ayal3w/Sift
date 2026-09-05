import { DarkGradient } from "@/components/brand/dark-gradient";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ContactSection, CtaSection } from "@/components/landing/contact-cta";
import { FeatureCards } from "@/components/landing/feature-cards";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PlatformSection } from "@/components/landing/platform-section";
import { PricingSection } from "@/components/landing/pricing-section";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col dark:bg-surface-dark">
      <DarkGradient />
      <div className="relative z-10 flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1">
          <HeroSection />
          <FeatureCards />
          <PlatformSection />
          <HowItWorks />
          <PricingSection />
          <ContactSection />
          <CtaSection />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
