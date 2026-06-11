import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const careers = [
  {
    emoji: '💻',
    title: 'Software Developer',
    salary: 'R25k – R80k/mo',
    subjects: ['Mathematics', 'Physical Sciences'],
    pathway: 'BSc Computer Science / Diploma IT',
    demand: 'Very High',
  },
  {
    emoji: '⚕️',
    title: 'Medical Doctor',
    salary: 'R60k – R200k/mo',
    subjects: ['Life Sciences', 'Physical Sciences', 'Mathematics'],
    pathway: 'MBChB (6 years)',
    demand: 'High',
  },
  {
    emoji: '⚖️',
    title: 'Attorney / Lawyer',
    salary: 'R30k – R120k/mo',
    subjects: ['English', 'History', 'Life Sciences'],
    pathway: 'LLB (4 years)',
    demand: 'High',
  },
  {
    emoji: '🔧',
    title: 'Civil Engineer',
    salary: 'R35k – R90k/mo',
    subjects: ['Mathematics', 'Physical Sciences'],
    pathway: 'BEng Civil Engineering (4 years)',
    demand: 'High',
  },
  {
    emoji: '📊',
    title: 'Chartered Accountant',
    salary: 'R45k – R130k/mo',
    subjects: ['Mathematics', 'Accounting'],
    pathway: 'BCom Accounting → SAICA',
    demand: 'Very High',
  },
  {
    emoji: '🎓',
    title: 'Teacher / Educator',
    salary: 'R18k – R45k/mo',
    subjects: ['Any subjects', 'Communication'],
    pathway: 'B.Ed (4 years)',
    demand: 'Very High',
  },
];

const demandColor: Record<string, string> = {
  'Very High': 'bg-emerald-50 text-emerald-700',
  'High': 'bg-blue-50 text-blue-700',
  'Medium': 'bg-slate-100 text-slate-600',
};

export function CareerSection() {
  return (
    <section className='bg-navy-900 py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <span className='mb-5 inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-blue-light'>
              Careers
            </span>
            <h2 className='text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
              Discover Careers That{' '}
              <span className='text-gradient-gold'>Match Your Strengths</span>
            </h2>
            <p className='mt-3 text-lg text-white/60'>
              Explore career paths based on your subject strengths and academic performance.
            </p>
          </div>
          <Link
            href='/tools/career-recommender'
            className='flex-shrink-0 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15'
          >
            Find My Career <ArrowRight className='ml-2 inline h-4 w-4' />
          </Link>
        </div>

        <div className='mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {careers.map((career) => (
            <div
              key={career.title}
              className='group rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:bg-white/8 hover:border-white/20'
            >
              <div className='flex items-start justify-between'>
                <span className='text-2xl'>{career.emoji}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${demandColor[career.demand] ?? 'bg-slate-100 text-slate-600'}`}>
                  {career.demand} demand
                </span>
              </div>

              <h3 className='mt-3 text-base font-bold text-white'>{career.title}</h3>
              <p className='mt-1 text-sm font-semibold text-brand-gold'>{career.salary}</p>

              <div className='mt-3 space-y-1.5'>
                <p className='text-xs font-semibold uppercase tracking-wider text-white/30'>Subjects</p>
                <div className='flex flex-wrap gap-1.5'>
                  {career.subjects.map((s) => (
                    <span key={s} className='rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/60'>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className='mt-3 rounded-lg border border-white/8 bg-white/5 px-3 py-2'>
                <p className='text-xs text-white/40'>Study path</p>
                <p className='mt-0.5 text-xs font-semibold text-white/80'>{career.pathway}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
