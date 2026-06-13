import { getToolsData } from '@/lib/tools/data';
import { GapYearClient } from './GapYearClient';

export const metadata = {
  title: 'Gap Year & Alternative Pathways | Fundibot',
  description: 'Discover TVET, bridging programmes, learnerships, and short courses if university admission was not achieved.',
};

export default function GapYearPage() {
  const { institutions, programmes } = getToolsData();
  return (
    <div className='min-h-screen bg-slate-50 pt-20'>
      <GapYearClient institutions={institutions} programmes={programmes} />
    </div>
  );
}
