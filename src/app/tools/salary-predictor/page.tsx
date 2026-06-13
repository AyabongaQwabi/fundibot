import { SalaryPredictorClient } from './SalaryPredictorClient';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';

export const metadata = {
  title: 'What Could You Earn? | Fundibot',
  description:
    'Enter your Grade 12 subjects and marks to discover which careers match your strengths and what you could earn in South Africa.',
};

export default function SalaryPredictorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-sky-700 pb-12 pt-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <ToolsBreadcrumb currentPage="What Could You Earn?" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-brand-gold-light">
            Career Salary Predictor
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
            What Could You Earn?
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/60">
            Enter your subjects and marks. We will show you real careers that match your strengths and what they pay in SA.
          </p>
        </div>
      </div>
      <SalaryPredictorClient />
    </div>
  );
}
