'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Search, GraduationCap, Sparkles } from 'lucide-react';

const provinces = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
];

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
    router.push(`/tools/course-finder${params}`);
  }

  return (
    <section className='relative min-h-screen overflow-hidden bg-hero-gradient pt-16'>
      {/* grid + glow accents */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]' />
      <div className='absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue-light/25 blur-3xl' />
      <div className='absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-brand-gold/15 blur-3xl' />
      <div className='absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl' />

      <div className='relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:pt-28'>
        <div className='grid items-center gap-12 lg:grid-cols-12'>
          {/* Left copy */}
          <div className='lg:col-span-7'>
            <div className='mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-gold-light'>
              <Sparkles className='h-3.5 w-3.5' />
              Free. No login. For every SA matriculant.
            </div>

            <h1 className='animate-fade-up font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl'>
              Find your course{' '}
              <span className='text-brand-gold-light'>before your parents choose for you.</span>
            </h1>

            <p className='animate-fade-up animate-delay-100 mt-6 max-w-xl text-lg leading-relaxed text-white/80'>
              Type what you want to study, pick your province, and see every university, UoT and TVET college in
              Mzansi that&apos;ll take you — in about 10 seconds. Sharp sharp.
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className='animate-fade-up animate-delay-200 mt-8 flex w-full max-w-xl flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-md sm:flex-row sm:items-center sm:rounded-full'
            >
              <div className='flex flex-1 items-center gap-3 px-4 py-2'>
                <Search className='h-5 w-5 shrink-0 text-white/60' />
                <input
                  type='text'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Nursing, Civil Engineering, Graphic Design…'
                  aria-label='What do you want to study?'
                  className='w-full bg-transparent text-sm font-medium text-white placeholder:text-white/50 focus:outline-none sm:text-base'
                />
              </div>
              <button
                type='submit'
                className='inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-extrabold text-navy-900 shadow-glow-gold transition-all duration-200 hover:bg-brand-gold-light active:scale-95'
              >
                Search
                <ArrowRight className='h-4 w-4' />
              </button>
            </form>

            {/* Province chips */}
            <div className='animate-fade-up animate-delay-300 mt-5 flex flex-wrap gap-2'>
              {provinces.map((p) => (
                <Link
                  key={p}
                  href={`/tools/course-finder?province=${encodeURIComponent(p)}`}
                  className='rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm transition-all duration-200 hover:border-brand-gold/50 hover:bg-brand-gold/15 hover:text-white'
                >
                  {p}
                </Link>
              ))}
            </div>

            {/* Trust bar */}
            <div className='animate-fade-up animate-delay-400 mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-bold text-white/90'>
              <span className='flex items-center gap-1.5'>
                <span className='h-2 w-2 rounded-full bg-brand-gold-light' /> 75+ Institutions
              </span>
              <span className='text-white/30'>•</span>
              <span className='flex items-center gap-1.5'>
                <span className='h-2 w-2 rounded-full bg-emerald-400' /> 3 000+ Courses
              </span>
              <span className='text-white/30'>•</span>
              <span className='flex items-center gap-1.5'>
                <span className='h-2 w-2 rounded-full bg-white' /> 100% Free
              </span>
            </div>
          </div>

          {/* Right: mascot + finder preview */}
          <div className='relative lg:col-span-5'>
            <div className='animate-fade-up animate-delay-200 relative mx-auto max-w-sm'>
              {/* Mascot */}
              <div className='animate-float relative z-10 mx-auto mb-[-1.5rem] w-36 sm:w-40'>
                <div className='absolute inset-0 -z-10 translate-y-6 rounded-full bg-white/20 blur-2xl' />
                <Image
                  src='/brand/bot-icon-white.png'
                  alt='Fundibot mascot'
                  width={220}
                  height={220}
                  priority
                  className='mx-auto drop-shadow-2xl'
                />
              </div>

              {/* Finder result card */}
              <div className='relative rounded-3xl border border-white/15 bg-white px-5 pb-5 pt-10 shadow-2xl'>
                <p className='mb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400'>
                  Civil Engineering · 24 matches
                </p>
                <div className='space-y-2.5'>
                  {[
                    { name: 'BEng Civil Engineering', inst: 'University of Pretoria', aps: 30 },
                    { name: 'NDip Civil Engineering', inst: 'Cape Peninsula UoT', aps: 22 },
                    { name: 'BEng Civil Engineering', inst: 'Stellenbosch University', aps: 34 },
                  ].map((item) => (
                    <div
                      key={item.inst}
                      className='flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5'
                    >
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-bold text-slate-900'>{item.name}</p>
                        <p className='mt-0.5 truncate text-xs text-slate-500'>{item.inst}</p>
                      </div>
                      <span className='ml-3 shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-700'>
                        APS {item.aps}
                      </span>
                    </div>
                  ))}
                </div>
                <div className='mt-4 flex flex-wrap gap-2'>
                  {['Gauteng', 'Degree', 'Under APS 30'].map((f) => (
                    <span
                      key={f}
                      className='rounded-full border border-brand-blue/20 bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue-dark'
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className='animate-float animate-delay-300 absolute -bottom-4 -left-3 flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100'>
                  <GraduationCap className='h-4 w-4 text-emerald-600' />
                </div>
                <div>
                  <p className='text-xs font-extrabold text-slate-900'>All 9 provinces</p>
                  <p className='text-xs text-slate-500'>covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
