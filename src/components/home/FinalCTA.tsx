import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className='relative overflow-hidden bg-hero-gradient py-28 sm:py-36'>
      {/* Grid bg */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]' />
      {/* Glow */}
      <div className='absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/15 blur-3xl' />
      <div className='absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl' />

      <div className='relative mx-auto max-w-3xl px-4 text-center sm:px-6'>
        <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-gold-light'>
          ✦ Free · No signup · Works on any device
        </div>

        <h2 className='text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl'>
          Your future is out there.{' '}
          <span className='text-gradient-gold'>Go find it.</span>
        </h2>

        <p className='mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60'>
          Thousands of courses. 75+ institutions. Zero excuses. Start with the Course Finder and see what's waiting for you.
        </p>

        <div className='mt-10 flex flex-wrap justify-center gap-4'>
          <Link
            href='/tools/course-finder'
            className='inline-flex items-center gap-2 rounded-full bg-brand-gold px-8 py-4 text-base font-bold text-slate-900 shadow-glow-gold transition-all duration-200 hover:bg-brand-gold-light hover:shadow-lg active:scale-95'
          >
            <Search className='h-5 w-5' />
            Find My Course
            <ArrowRight className='h-5 w-5' />
          </Link>
          <Link
            href='/tools/course-finder'
            className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15'
          >
            Check My APS Score
          </Link>
        </div>

        <p className='mt-8 text-sm text-white/30'>
          No account needed · No credit card · Just your marks
        </p>
      </div>
    </section>
  );
}
