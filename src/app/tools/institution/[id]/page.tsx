import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getInstitutionProfile, getAllInstitutionIds } from '@/lib/tools/data';
import { JsonLd, breadcrumbList, BASE_URL } from '@/components/seo/JsonLd';
import { InstitutionProfileClient } from './InstitutionProfileClient';

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return getAllInstitutionIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const profile = getInstitutionProfile(id);
  if (!profile) return {};
  const where = [profile.city, profile.province].filter(Boolean).join(', ');
  return {
    title: `${profile.name} — Programmes, Faculties & Admissions`,
    description: `Explore ${profile.name}${where ? ` in ${where}` : ''}: faculties, campuses, programmes, APS requirements and contact details. Free profile on Fundibot.`,
    alternates: { canonical: `/tools/institution/${id}` },
    openGraph: {
      title: `${profile.name} | Fundibot`,
      description: `Faculties, campuses, programmes and admission details for ${profile.name}.`,
      url: `${BASE_URL}/tools/institution/${id}`,
      type: 'website',
    },
  };
}

function institutionTypeToSchema(type: string | null): string {
  if (!type) return 'EducationalOrganization';
  const t = type.toLowerCase();
  if (t.includes('university')) return 'CollegeOrUniversity';
  if (t.includes('tvet') || t.includes('college')) return 'CollegeOrUniversity';
  return 'EducationalOrganization';
}

export default async function InstitutionPage({ params }: Props) {
  const { id } = await params;
  const profile = getInstitutionProfile(id);
  if (!profile) notFound();

  const collegeSchema = {
    '@context': 'https://schema.org',
    '@type': institutionTypeToSchema(profile.institution_type),
    name: profile.name,
    alternateName: profile.short_name ?? undefined,
    url: `${BASE_URL}/tools/institution/${id}`,
    sameAs: profile.official_website ?? undefined,
    logo: profile.logo ? `${BASE_URL}${profile.logo}` : undefined,
    slogan: profile.motto ?? undefined,
    address: (profile.city || profile.province)
      ? {
          '@type': 'PostalAddress',
          addressLocality: profile.city ?? undefined,
          addressRegion: profile.province ?? undefined,
          addressCountry: 'ZA',
        }
      : undefined,
  };

  const breadcrumbs = breadcrumbList([
    { name: 'Home', path: '/' },
    { name: 'Institutions', path: '/tools/institutions' },
    { name: profile.name, path: `/tools/institution/${id}` },
  ]);

  return (
    <>
      <JsonLd data={[collegeSchema, breadcrumbs]} />
      <InstitutionProfileClient profile={profile} />
    </>
  );
}
