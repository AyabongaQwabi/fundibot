import { HeroSection } from '@/components/home/HeroSection';
import { ToolLauncherSection } from '@/components/home/ToolLauncherSection';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { WhyFundibot } from '@/components/home/WhyFundibot';
import { QualificationShowcase } from '@/components/home/QualificationShowcase';
import { InstitutionSection } from '@/components/home/InstitutionSection';
import { CareerSection } from '@/components/home/CareerSection';
import { StatsSection } from '@/components/home/StatsSection';
import { AIChatSection } from '@/components/home/AIChatSection';
import { FinalCTA } from '@/components/home/FinalCTA';
import { SiteFooter } from '@/components/SiteFooter';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ToolLauncherSection />
      <ProductShowcase />
      <WhyFundibot />
      <QualificationShowcase />
      <InstitutionSection />
      <CareerSection />
      <StatsSection />
      <AIChatSection />
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}
