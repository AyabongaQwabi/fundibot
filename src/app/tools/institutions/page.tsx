import { getToolsData } from '@/lib/tools/data';
import { InstitutionsBrowser } from './InstitutionsBrowser';

export const metadata = {
  title: 'All Institutions | Fundibot',
  description: 'Browse every university, university of technology and TVET college in South Africa.',
  alternates: { canonical: '/tools/institutions' },
};

export default function InstitutionsPage() {
  const { institutions } = getToolsData();
  return <InstitutionsBrowser institutions={institutions} />;
}
