import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const qualifications = [
  {
    name: 'Bachelor of Computer Science',
    apsRequired: 35,
    apsUser: 36,
    institutions: ['UCT', 'Stellenbosch', 'UP'],
    status: 'qualify' as const,
    field: 'Technology',
  },
  {
    name: 'Diploma in Information Technology',
    apsRequired: 28,
    apsUser: 36,
    institutions: ['CPUT', 'TUT', 'DUT'],
    status: 'qualify' as const,
    field: 'Technology',
  },
  {
    name: 'Bachelor of Accounting Sciences',
    apsRequired: 38,
    apsUser: 36,
    institutions: ['Wits', 'UNISA', 'UJ'],
    status: 'close' as const,
    field: 'Finance',
  },
  {
    name: 'BEng Electrical Engineering',
    apsRequired: 37,
    apsUser: 36,
    institutions: ['Wits', 'UP', 'Stellenbosch'],
    status: 'close' as const,
    field: 'Engineering',
  },
  {
    name: 'Bachelor of Medicine (MBChB)',
    apsRequired: 40,
    apsUser: 36,
    institutions: ['UCT', 'Wits', 'UP', 'UKZN'],
    status: 'reach' as const,
    field: 'Health',
  },
  {
    name: 'BCom Business Management',
    apsRequired: 30,
    apsUser: 36,
    institutions: ['NWU', 'UNISA', 'UWC'],
    status: 'qualify' as const,
    field: 'Business',
  },
];

const statusConfig = {
  qualify: {
    label: '✅ You Qualify',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bar: 'bg-emerald-500',
  },
  close: {
    label: '⚠ Close Match',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    bar: 'bg-amber-400',
  },
  reach: {
    label: '🎯 Reach Goal',
    badge: 'bg-slate-50 text-slate-600 border-slate-200',
    bar: 'bg-slate-400',
  },
};

export function QualificationShowcase() {
  return (
    <section className='bg-slate-50 py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='mx-auto max-w-2xl text-center'>
          <span className='section-tag mb-5'>Example Results</span>
          <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>
            This is what APS 36 gets you.
          </h2>
          <p className='mt-4 text-lg text-slate-500'>
            Enter your actual marks and you'll see your own list — not a hypothetical one.
          </p>
        </div>

        <div className='mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {qualifications.map((q) => {
            const config = statusConfig[q.status];
            const pct = Math.min(100, Math.round((q.apsUser / q.apsRequired) * 100));
            return (
              <div key={q.name} className='flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card'>
                <span className='mb-3 w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500'>
                  {q.field}
                </span>

                <h3 className='font-bold leading-snug text-slate-900'>{q.name}</h3>

                <div className='mt-3 flex items-center justify-between text-xs text-slate-500'>
                  <span>APS Required: <strong className='text-slate-900'>{q.apsRequired}</strong></span>
                  <span>Your APS: <strong className='text-brand-blue'>36</strong></span>
                </div>

                <div className='mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100'>
                  <div className={`h-full rounded-full ${config.bar}`} style={{ width: `${Math.min(100, pct)}%` }} />
                </div>

                <div className='mt-3 flex flex-wrap gap-1.5'>
                  {q.institutions.map((inst) => (
                    <span key={inst} className='rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-xs text-slate-600'>
                      {inst}
                    </span>
                  ))}
                </div>

                <div className='mt-auto pt-4'>
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${config.badge}`}>
                    {config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className='mt-12 text-center'>
          <Link href='/tools/course-finder' className='btn-primary'>
            Find My Course
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </section>
  );
}
