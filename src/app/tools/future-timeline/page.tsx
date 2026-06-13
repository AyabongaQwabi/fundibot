import { FutureTimelineClient } from './FutureTimelineClient';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';

export const metadata = {
  title: 'Predict My Future | Fundibot',
  description:
    'See your personalised career timeline based on your grade, subjects, and marks. From Grade 8 to your first big salary — your story starts here.',
  alternates: { canonical: '/tools/future-timeline' },
};

export default function FutureTimelinePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-sky-700 pb-12 pt-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <ToolsBreadcrumb currentPage="Predict My Future" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-brand-gold-light">
            Career Timeline Generator
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
            Predict My Future
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/60">
            Answer a few questions. We build your personalised career story from today until you buy that thing you have always wanted.
          </p>
        </div>
      </div>
      <FutureTimelineClient />
    </div>
  );
}
