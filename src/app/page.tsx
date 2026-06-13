import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { ToolLauncherSection } from '@/components/home/ToolLauncherSection';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { WhyFundibot } from '@/components/home/WhyFundibot';
import { QualificationShowcase } from '@/components/home/QualificationShowcase';
import { InstitutionSection } from '@/components/home/InstitutionSection';
import { CareerSection } from '@/components/home/CareerSection';
import { StatsSection } from '@/components/home/StatsSection';
import { AIChatSection } from '@/components/home/AIChatSection';
import { FAQSection } from '@/components/home/FAQSection';
import { FinalCTA } from '@/components/home/FinalCTA';
import { SiteFooter } from '@/components/SiteFooter';
import { HomeJsonLd } from '@/components/home/HomeJsonLd';

export const metadata: Metadata = {
  title: 'Fundibot — College in Your Pocket | Free Course Finder for SA Matrics',
  description:
    'Free, no-login course and institution finder for every South African matriculant. Search 75+ universities, UoTs and TVET colleges, check your APS, find bursaries, and discover careers that fit your subjects.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <main>
      <HomeJsonLd />
      <HeroSection />
      <ToolLauncherSection />
      <ProductShowcase />
      <WhyFundibot />
      <QualificationShowcase />
      <InstitutionSection />
      <CareerSection />
      <StatsSection />
      <AIChatSection />
      <FAQSection />
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}
