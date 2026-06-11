import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className='relative overflow-hidden bg-hero-gradient py-28 sm:py-36'>
      {/* Grid bg */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]' />
      {/* Glow */}
      <div className='absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/15 blur-3xl' />

      <div className='relative mx-auto max-w-3xl px-4 text-center sm:px-6'>
        <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-gold'>
          ✦ Start Today · It's Free
        </div>

        <h2 className='text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl'>
          Ready To Explore{' '}
          <span className='text-gradient-gold'>Your Future?</span>
        </h2>

        <p className='mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60'>
          Join thousands of South African learners who've already discovered their path. No account needed — just your marks.
        </p>

        <div className='mt-10 flex flex-wrap justify-center gap-4'>
          <Link
            href='/tools/qualification-checker'
            className='inline-flex items-center gap-2 rounded-full bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-glow-blue transition-all duration-200 hover:bg-brand-blue-dark hover:shadow-lg active:scale-95'
          >
            Check My Qualification
            <ArrowRight className='h-5 w-5' />
          </Link>
          <Link
            href='/tools/course-finder'
            className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15'
          >
            Explore Courses
          </Link>
        </div>

        <p className='mt-8 text-sm text-white/30'>
          Free forever · No signup · Works on any device
        </p>
      </div>
    </section>
  );
}
