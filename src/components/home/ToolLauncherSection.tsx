'use client';

import Link from 'next/link';
import { Search, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function ToolLauncherSection() {
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = shimmerRef.current;
    if (!el) return;
    let frame: number;
    let start: number | null = null;
    const duration = 2200;

    function animate(ts: number) {
      if (!start) start = ts;
      const progress = ((ts - start) % duration) / duration;
      el!.style.transform = `translateX(${-100 + progress * 250}%)`;
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className='bg-white py-24 sm:py-32' id='tools'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='mx-auto max-w-2xl text-center'>
          <span className='section-tag mb-5'>The tools</span>
          <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
            Start here.{' '}
            <span className='text-gradient-blue'>Figure the rest out later.</span>
          </h2>
          <p className='mt-4 text-lg text-slate-500'>
            Course Finder first. The others slot in once you know what you're after.
          </p>
        </div>

        <div className='mt-16 grid gap-6 lg:grid-cols-3'>
          {/* Featured: Course Finder */}
          <Link
            href='/tools/course-finder'
            className='group relative flex flex-col overflow-hidden rounded-2xl border-2 border-brand-gold/60 p-7 shadow-[0_0_0_4px_rgba(245,158,11,0.12)] transition-all duration-300 hover:shadow-[0_0_0_6px_rgba(245,158,11,0.2)] hover:border-brand-gold'
            style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #ecfdf5 100%)' }}
          >
            <div className='pointer-events-none absolute inset-0 overflow-hidden rounded-2xl'>
              <div
                ref={shimmerRef}
                className='absolute inset-y-0 w-24 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/50 to-transparent'
                style={{ transform: 'translateX(-100%)' }}
              />
            </div>
            <span className='pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-brand-gold/30 animate-pulse' />

            <div className='relative'>
              <div className='mb-5 flex items-center gap-2'>
                <span className='inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-brand-gold/20 px-3 py-1 text-xs font-bold text-amber-700'>
                  🔍 Start here
                </span>
                <span className='inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700'>
                  ★ Featured tool
                </span>
              </div>

              <div className='mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gold text-white shadow-glow-gold transition-transform duration-300 group-hover:scale-110'>
                <Search className='h-6 w-6' />
              </div>

              <h3 className='text-xl font-extrabold text-slate-900'>Course & Institution Finder</h3>
              <p className='mt-3 text-sm leading-relaxed text-slate-600'>
                Type a course. Pick a province. Every institution in SA that offers it pops up — universities, UoTs, TVET colleges — with APS requirements and contact links. Done in seconds.
              </p>

              <div className='mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-bold text-slate-900 shadow-glow-gold transition-all duration-200 group-hover:bg-brand-gold-light'>
                Find My Course
                <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
              </div>
            </div>
          </Link>

          {/* Career Recommender */}
          <Link
            href='/tools/career-recommender'
            className='group relative flex flex-col rounded-2xl border border-sky-200/60 bg-sky-500/5 p-7 shadow-card transition-all duration-300 hover:bg-sky-500/10 hover:border-sky-400/50 hover:shadow-card-hover'
          >
            <div className='relative'>
              <span className='mb-5 inline-flex items-center gap-1.5 rounded-full border border-sky-300/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-700'>
                🚀 Not sure yet?
              </span>

              <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 transition-all duration-300 group-hover:bg-sky-500 group-hover:text-white'>
                <Sparkles className='h-5 w-5' />
              </div>

              <h3 className='text-xl font-bold text-slate-900'>Career Recommender</h3>
              <p className='mt-3 text-sm leading-relaxed text-slate-500'>
                No idea what to study? Enter your subjects and marks. We'll match careers and courses to what you're actually good at. Better than asking your uncle.
              </p>

              <div className='mt-6 inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 group-hover:bg-sky-500'>
                Launch Tool
                <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
              </div>
            </div>
          </Link>

          {/* Subject Advisor */}
          <Link
            href='/tools/subject-advisor'
            className='group relative flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-7 shadow-card transition-all duration-300 hover:bg-slate-100 hover:border-slate-300 hover:shadow-card-hover'
          >
            <div className='relative'>
              <span className='mb-5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600'>
                📚 Still in school?
              </span>

              <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all duration-300 group-hover:bg-slate-600 group-hover:text-white'>
                <BookOpen className='h-5 w-5' />
              </div>

              <h3 className='text-xl font-bold text-slate-900'>Subject Combination Advisor</h3>
              <p className='mt-3 text-sm leading-relaxed text-slate-500'>
                Still in Grade 10 or 11? See which careers your current subjects unlock — and what happens if you drop or add one. Spoiler: dropping Maths closes a lot of doors.
              </p>

              <div className='mt-6 inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 group-hover:bg-slate-700'>
                Launch Tool
                <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
              </div>
            </div>
          </Link>
        </div>

        <p className='mt-10 text-center text-sm text-slate-400'>
          All tools are free. No account, no email, no funny business.{' '}
          <Link href='/tools' className='text-sky-600 underline underline-offset-2 hover:text-sky-500'>
            See all 7 tools →
          </Link>
        </p>
      </div>
    </section>
  );
}
