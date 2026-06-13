import { SubjectAdvisorClient } from './SubjectAdvisorClient';

export const metadata = {
  title: 'Subject Combination Advisor | Fundibot',
  description: 'Find out which careers and courses your Grade 10-11 subject combination unlocks.',
  alternates: { canonical: '/tools/subject-advisor' },
};

export default function SubjectAdvisorPage() {
  return (
    <div className='min-h-screen bg-slate-50 pt-20'>
      <SubjectAdvisorClient />
    </div>
  );
}
