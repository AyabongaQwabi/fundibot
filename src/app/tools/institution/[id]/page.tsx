import { notFound } from 'next/navigation';
import { getInstitutionProfile, getAllInstitutionIds } from '@/lib/tools/data';
import { InstitutionProfileClient } from './InstitutionProfileClient';

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return getAllInstitutionIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const profile = getInstitutionProfile(id);
  if (!profile) return {};
  return {
    title: `${profile.name} | Fundibot`,
    description: `Explore faculties, campuses, programmes and contact details for ${profile.name}.`,
  };
}

export default async function InstitutionPage({ params }: Props) {
  const { id } = await params;
  const profile = getInstitutionProfile(id);
  if (!profile) notFound();
  return <InstitutionProfileClient profile={profile} />;
}
