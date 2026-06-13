import { getInstitutions } from '@/lib/tools/data';
import { DeadlineTrackerClient } from './DeadlineTrackerClient';

export const metadata = {
  title: 'Application Deadline Tracker | Fundibot',
  description: 'Browse application opening and closing dates for South African universities and colleges.',
  alternates: { canonical: '/tools/deadline-tracker' },
};

export default function DeadlineTrackerPage() {
  const institutions = getInstitutions();
  return (
    <div className='min-h-screen bg-slate-50 pt-20'>
      <DeadlineTrackerClient institutions={institutions} />
    </div>
  );
}
