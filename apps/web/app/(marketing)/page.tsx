import { MarketingNavbar } from "@/components/landing/MarketingNavbar";
import { Hero } from "@/components/landing/Hero";
import { StatsGrid } from "@/components/landing/StatsGrid";
import { PillarGrid } from "@/components/landing/PillarGrid";
import { AwardsPreview } from "@/components/landing/AwardsPreview";
import { SponsorsStrip } from "@/components/landing/SponsorsStrip";
import { CTAFinal } from "@/components/landing/CTAFinal";
import { MarketingFooter } from "@/components/landing/MarketingFooter";

export default function MarketingHomePage() {
  return (
    <>
      <MarketingNavbar />
      <main>
        <Hero />
        <StatsGrid />
        <PillarGrid />
        <AwardsPreview />
        <SponsorsStrip />
        <CTAFinal />
      </main>
      <MarketingFooter />
    </>
  );
}
