import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, GraduationCap, ChevronRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className='relative min-h-screen overflow-hidden bg-hero-gradient pt-16'>
      {/* Background grid */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]' />

      {/* Glow orbs */}
      <div className='absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/20 blur-3xl' />
      <div className='absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl' />

      <div className='relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:pt-32'>
        <div className='grid items-center gap-16 lg:grid-cols-2'>
          {/* Left: Copy */}
          <div>
            <div className='mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-blue-light'>
              <Sparkles className='h-3.5 w-3.5' />
              Free for all South African learners
            </div>

            <h1 className='animate-fade-up text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl'>
              Discover What You{' '}
              <span className='text-gradient-blue'>Can Study</span>{' '}
              After Matric
            </h1>

            <p className='animate-fade-up animate-delay-100 mt-6 max-w-xl text-lg leading-relaxed text-white/70'>
              Calculate your APS, find universities, explore courses, and discover careers that match your Grade 12 results — in seconds.
            </p>

            <div className='animate-fade-up animate-delay-200 mt-10 flex flex-wrap gap-4'>
              <Link
                href='/tools/qualification-checker'
                className='inline-flex items-center gap-2 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white shadow-glow-blue transition-all duration-200 hover:bg-brand-blue-dark hover:shadow-lg active:scale-95'
              >
                Check My Qualification
                <ArrowRight className='h-4 w-4' />
              </Link>
              <Link
                href='/tools/course-finder'
                className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15'
              >
                Explore Courses
              </Link>
            </div>

            {/* Social proof */}
            <div className='animate-fade-up animate-delay-300 mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8'>
              <div className='text-center'>
                <p className='text-2xl font-bold text-white'>50+</p>
                <p className='mt-0.5 text-xs text-white/50'>Institutions</p>
              </div>
              <div className='h-8 w-px bg-white/10' />
              <div className='text-center'>
                <p className='text-2xl font-bold text-white'>1000+</p>
                <p className='mt-0.5 text-xs text-white/50'>Qualifications</p>
              </div>
              <div className='h-8 w-px bg-white/10' />
              <div className='text-center'>
                <p className='text-2xl font-bold text-white'>3</p>
                <p className='mt-0.5 text-xs text-white/50'>Free Tools</p>
              </div>
            </div>
          </div>

          {/* Right: Dashboard preview */}
          <div className='animate-fade-up animate-delay-300 relative hidden lg:block'>
            <div className='relative rounded-2xl border border-white/10 bg-navy-800/60 p-6 shadow-2xl backdrop-blur-sm'>
              {/* Dashboard header */}
              <div className='mb-6 flex items-center justify-between'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-widest text-white/40'>Your Results</p>
                  <p className='mt-1 text-xl font-bold text-white'>APS Score: 36</p>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue shadow-glow-blue'>
                  <TrendingUp className='h-5 w-5 text-white' />
                </div>
              </div>

              {/* APS Bar */}
              <div className='mb-6'>
                <div className='mb-2 flex justify-between text-xs text-white/50'>
                  <span>APS Score</span>
                  <span>36 / 42</span>
                </div>
                <div className='h-2.5 overflow-hidden rounded-full bg-white/10'>
                  <div className='h-full w-[86%] rounded-full bg-blue-gradient' />
                </div>
              </div>

              {/* Recommended cards */}
              <div className='space-y-3'>
                <p className='text-xs font-semibold uppercase tracking-wider text-white/40'>Top Matches</p>

                {[
                  { name: 'BSc Computer Science', institution: 'University of Cape Town', aps: 36, status: 'qualify' },
                  { name: 'BCom Accounting', institution: 'Stellenbosch University', aps: 34, status: 'qualify' },
                  { name: 'BEng Electrical Engineering', institution: 'University of Pretoria', aps: 38, status: 'close' },
                ].map((item) => (
                  <div key={item.name} className='flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-4 py-3'>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-semibold text-white'>{item.name}</p>
                      <p className='mt-0.5 truncate text-xs text-white/50'>{item.institution}</p>
                    </div>
                    <div className='ml-3 flex items-center gap-2'>
                      <span className='text-xs text-white/40'>APS {item.aps}</span>
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${item.status === 'qualify' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand-gold/20 text-brand-gold'}`}>
                        {item.status === 'qualify' ? '✓' : '~'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Career pill */}
              <div className='mt-5 flex flex-wrap gap-2'>
                <p className='w-full text-xs font-semibold uppercase tracking-wider text-white/40'>Career Paths</p>
                {['Software Developer', 'Data Scientist', 'Systems Analyst'].map((c) => (
                  <span key={c} className='rounded-full border border-brand-blue/30 bg-brand-blue/15 px-3 py-1 text-xs font-medium text-brand-blue-light'>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className='animate-float absolute -right-4 -top-4 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-navy-900 px-4 py-2.5 shadow-xl'>
              <span className='flex h-2 w-2 rounded-full bg-emerald-400' />
              <span className='text-xs font-semibold text-emerald-400'>3 qualifications found</span>
            </div>

            {/* Floating APS badge */}
            <div className='animate-float animate-delay-300 absolute -bottom-4 -left-4 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-navy-900 px-4 py-3 shadow-xl'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold/20'>
                <GraduationCap className='h-4 w-4 text-brand-gold' />
              </div>
              <div>
                <p className='text-xs font-bold text-white'>APS 36</p>
                <p className='text-xs text-white/50'>Above average</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className='absolute bottom-8 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center gap-1.5'>
          <ChevronRight className='h-4 w-4 rotate-90 text-white/30' />
        </div>
      </div>
    </section>
  );
}
