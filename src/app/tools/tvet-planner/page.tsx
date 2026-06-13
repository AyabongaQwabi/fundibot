import { getToolsData } from '@/lib/tools/data';
import { TvetPlannerClient } from './TvetPlannerClient';

export const metadata = {
  title: 'TVET & NCV Pathway Planner | Fundibot',
  description: 'Understand the NCV and NATED pathways at South African TVET colleges.',
  alternates: { canonical: '/tools/tvet-planner' },
};

export default function TvetPlannerPage() {
  const { institutions, programmes } = getToolsData();
  return (
    <div className='min-h-screen bg-slate-50 pt-20'>
      <TvetPlannerClient institutions={institutions} programmes={programmes} />
    </div>
  );
}
