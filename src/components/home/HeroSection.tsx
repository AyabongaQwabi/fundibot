import Link from 'next/link';
import { ArrowRight, Search, GraduationCap, ChevronRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className='relative min-h-screen overflow-hidden bg-hero-gradient pt-16'>
      <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]' />
      <div className='absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/20 blur-3xl' />
      <div className='absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl' />

      <div className='relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:pt-32'>
        <div className='grid items-center gap-16 lg:grid-cols-2'>
          <div>
            <div className='mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-gold-light'>
              ✦ Free for every South African learner
            </div>

            <h1 className='animate-fade-up text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl'>
              Find the course you want{' '}
              <span className='text-gradient-blue'>before your parents pick one for you.</span>
            </h1>

            <p className='animate-fade-up animate-delay-100 mt-6 max-w-xl text-lg leading-relaxed text-white/70'>
              Search every university, UoT, and TVET college in South Africa. Type what you want to study, pick your province, and see who accepts you — in about 10 seconds.
            </p>

            <div className='animate-fade-up animate-delay-200 mt-10 flex flex-wrap gap-4'>
              <Link
                href='/tools/course-finder'
                className='inline-flex items-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-bold text-slate-900 shadow-glow-gold transition-all duration-200 hover:bg-brand-gold-light hover:shadow-lg active:scale-95'
              >
                <Search className='h-4 w-4' />
                Find My Course
                <ArrowRight className='h-4 w-4' />
              </Link>
              <Link
                href='/tools/institutions'
                className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15'
              >
                Browse Institutions
              </Link>
            </div>

            <div className='animate-fade-up animate-delay-300 mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8'>
              <div className='text-center'>
                <p className='text-2xl font-bold text-white'>75+</p>
                <p className='mt-0.5 text-xs text-white/50'>Institutions</p>
              </div>
              <div className='h-8 w-px bg-white/10' />
              <div className='text-center'>
                <p className='text-2xl font-bold text-white'>3 000+</p>
                <p className='mt-0.5 text-xs text-white/50'>Courses</p>
              </div>
              <div className='h-8 w-px bg-white/10' />
              <div className='text-center'>
                <p className='text-2xl font-bold text-white'>100%</p>
                <p className='mt-0.5 text-xs text-white/50'>Free, always</p>
              </div>
            </div>
          </div>

          {/* Right: Course Finder preview */}
          <div className='animate-fade-up animate-delay-300 relative hidden lg:block'>
            <div className='relative rounded-2xl border border-white/10 bg-sky-700/60 p-6 shadow-2xl backdrop-blur-sm'>
              <div className='mb-5'>
                <p className='mb-2 text-xs font-semibold uppercase tracking-widest text-white/40'>What do you want to study?</p>
                <div className='flex items-center gap-3 rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-3'>
                  <Search className='h-4 w-4 text-sky-400' />
                  <span className='text-sm text-white/60'>Civil Engineering…</span>
                  <span className='ml-auto h-4 w-0.5 animate-pulse bg-sky-400' />
                </div>
              </div>

              <p className='mb-3 text-xs font-semibold uppercase tracking-wider text-white/40'>Offered across 9 provinces</p>
              <div className='space-y-3'>
                {[
                  { name: 'BEng Civil Engineering', institution: 'University of Pretoria', province: 'Gauteng', aps: 30 },
                  { name: 'NDip Civil Engineering', institution: 'Cape Peninsula UoT', province: 'Western Cape', aps: 22 },
                  { name: 'BEng Civil Engineering', institution: 'Stellenbosch University', province: 'Western Cape', aps: 34 },
                ].map((item) => (
                  <div key={item.institution} className='flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-4 py-3'>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-semibold text-white'>{item.name}</p>
                      <p className='mt-0.5 truncate text-xs text-white/50'>{item.institution} · {item.province}</p>
                    </div>
                    <span className='ml-3 shrink-0 rounded-full bg-sky-500/20 px-2.5 py-1 text-xs font-bold text-sky-300'>
                      APS {item.aps}
                    </span>
                  </div>
                ))}
              </div>

              <div className='mt-5 flex flex-wrap gap-2'>
                <p className='w-full text-xs font-semibold uppercase tracking-wider text-white/40'>Active filters</p>
                {['Gauteng', 'Degree', 'Under APS 30'].map((f) => (
                  <span key={f} className='rounded-full border border-brand-gold/30 bg-brand-gold/15 px-3 py-1 text-xs font-medium text-brand-gold-light'>
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className='animate-float absolute -right-4 -top-4 flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-700 px-4 py-2.5 shadow-xl'>
              <span className='flex h-2 w-2 rounded-full bg-sky-400' />
              <span className='text-xs font-semibold text-sky-300'>24 results found</span>
            </div>

            <div className='animate-float animate-delay-300 absolute -bottom-4 -left-4 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-sky-700 px-4 py-3 shadow-xl'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold/20'>
                <GraduationCap className='h-4 w-4 text-brand-gold' />
              </div>
              <div>
                <p className='text-xs font-bold text-white'>All 9 provinces</p>
                <p className='text-xs text-white/50'>covered</p>
              </div>
            </div>
          </div>
        </div>

        <div className='absolute bottom-8 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center gap-1.5'>
          <ChevronRight className='h-4 w-4 rotate-90 text-white/30' />
        </div>
      </div>
    </section>
  );
}
