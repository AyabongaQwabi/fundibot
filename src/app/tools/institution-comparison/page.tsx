import { getToolsData } from '@/lib/tools/data';
import { InstitutionComparisonClient } from './InstitutionComparisonClient';

export const metadata = {
  title: 'Institution Comparison Tool | Fundibot',
  description: 'Compare South African universities and colleges side by side on programmes, fees, admission, and more.',
  alternates: { canonical: '/tools/institution-comparison' },
};

export default function InstitutionComparisonPage() {
  const { institutions, programmes } = getToolsData();
  return (
    <div className='min-h-screen bg-slate-50 pt-20'>
      <InstitutionComparisonClient institutions={institutions} programmes={programmes} />
    </div>
  );
}
