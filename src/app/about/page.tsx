import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search, MapPin, Sparkles, Target, ShieldAlert } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd, breadcrumbList, BASE_URL } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'About Fundibot — Built for Every South African Learner',
  description:
    'Fundibot was born out of frustration. Learn why Ayabonga Qwabi of Qwabi Engineering built a free, no-login platform that brings South African courses, institutions, bursaries and careers into one place.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Fundibot',
    description:
      'Why we built a free platform to make South African higher education information accessible to every learner.',
    url: `${BASE_URL}/about`,
    type: 'website',
  },
};

const sources = [
  'University & college prospectuses',
  'Official institution websites',
  'Claude AI',
  'zabursaries.co.za',
  'Wikimedia',
  'nationalgovernment.co.za',
];

export default function AboutPage() {
  const breadcrumbs = breadcrumbList([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);

  return (
    <main className='bg-white'>
      <JsonLd data={[breadcrumbs]} />

      {/* Hero */}
      <section className='relative overflow-hidden bg-hero-gradient pb-20 pt-32 sm:pb-28 sm:pt-40'>
        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]' />
        <div className='absolute right-1/4 top-10 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl' />

        <div className='relative mx-auto max-w-4xl px-4 text-center sm:px-6'>
          <Image
            src='/brand/bot-icon-white.png'
            alt='Fundibot mascot'
            width={120}
            height={120}
            priority
            className='animate-float mx-auto mb-6 w-24 drop-shadow-2xl sm:w-28'
          />
          <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm'>
            <Sparkles className='h-3.5 w-3.5 text-brand-gold-light' />
            Our Story
          </div>
          <h1 className='text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl'>
            About Fundibot
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70'>
            College in your pocket — free, simple, and built for every learner in South Africa,
            no matter where you come from.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className='mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24'>
        <div className='space-y-6 text-lg leading-relaxed text-slate-600'>
          <p className='text-2xl font-extrabold text-slate-900'>Fundibot was born out of frustration.</p>
          <p>
            Every year, thousands of matriculants across South Africa finish school full of
            potential but completely lost. Prospectuses are scattered in PDFs, university websites
            are confusing, APS requirements feel like a secret code, and there&apos;s no single
            place where a learner from a township or rural area can easily search{' '}
            <span className='font-semibold text-brand-blue'>
              &ldquo;What can I study with my marks?&rdquo;
            </span>
          </p>
          <p className='text-xl font-bold text-slate-900'>So I built Fundibot.</p>
          <p>
            Fundibot is a completely free platform that brings together courses, admission
            requirements, institutions, fees, bursaries, and career paths from across South Africa
            — all in one simple, mobile-friendly place.{' '}
            <span className='font-semibold text-slate-900'>No login. No fees. No stress.</span>
          </p>
          <p>
            The project started with one province (Eastern Cape) and is growing fast as we continue
            scraping and structuring prospectuses and official documents from universities,
            universities of technology, and TVET colleges nationwide.
          </p>
        </div>

        {/* Growing badge */}
        <div className='mt-10 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700'>
          <MapPin className='h-4 w-4' />
          Started in the Eastern Cape · Growing nationwide
        </div>
      </section>

      {/* Creator */}
      <section className='border-y border-slate-100 bg-slate-50 py-20 sm:py-24'>
        <div className='mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[280px_1fr]'>
          <div className='mx-auto w-full max-w-[280px]'>
            <div className='overflow-hidden rounded-3xl border-4 border-white shadow-card-hover'>
              <Image
                src='/brand/ayabonga-qwabi.jpg'
                alt='Ayabonga Qwabi, founder of Fundibot'
                width={560}
                height={720}
                className='h-full w-full object-cover'
              />
            </div>
          </div>
          <div>
            <p className='text-xs font-bold uppercase tracking-widest text-brand-blue'>The Creator</p>
            <h2 className='mt-2 text-3xl font-extrabold tracking-tight text-slate-900'>
              Ayabonga Qwabi
            </h2>
            <p className='mt-1 text-base font-semibold text-brand-gold-dark'>Qwabi Engineering</p>
            <p className='mt-5 text-lg leading-relaxed text-slate-600'>
              Fundibot was created by <span className='font-semibold text-slate-900'>Ayabonga Qwabi</span> of{' '}
              <span className='font-semibold text-slate-900'>Qwabi Engineering</span> — a young South
              African developer passionate about using technology to solve real problems in
              education.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className='mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24'>
        <div className='mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-gradient shadow-glow-blue'>
          <Target className='h-7 w-7 text-white' />
        </div>
        <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>Our Mission</h2>
        <p className='mx-auto mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-slate-600'>
          To make South African higher education information accessible to every learner, regardless
          of where they come from or what school they attended.{' '}
          <span className='font-bold text-slate-900'>
            Your future shouldn&apos;t be this hard to figure out.
          </span>
        </p>

        <div className='mt-10 flex flex-wrap justify-center gap-4'>
          <Link
            href='/tools/course-finder'
            className='inline-flex items-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-base font-extrabold text-navy-900 transition-all duration-200 hover:bg-brand-gold-light hover:shadow-glow-gold active:scale-95'
          >
            <Search className='h-5 w-5' />
            Find My Course
            <ArrowRight className='h-5 w-5' />
          </Link>
          <Link
            href='/tools'
            className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-base font-bold text-slate-700 transition-all duration-200 hover:border-brand-blue hover:text-brand-blue'
          >
            Explore All Tools
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className='mx-auto max-w-3xl px-4 pb-20 sm:px-6 sm:pb-24'>
        <div className='rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8'>
          <div className='mb-3 flex items-center gap-2'>
            <ShieldAlert className='h-5 w-5 text-brand-gold-dark' />
            <h3 className='text-lg font-extrabold text-slate-900'>Disclaimer</h3>
          </div>
          <p className='text-sm leading-relaxed text-slate-600'>
            The information on Fundibot is compiled from publicly available sources including
            university and college prospectuses, official institution websites, Claude AI,
            zabursaries.co.za, Wikimedia, and nationalgovernment.co.za. We work hard to keep the data
            accurate and up to date, but we strongly recommend that you always verify the latest
            details directly with the institution before making any decisions. We are not affiliated
            with any university or government department.
          </p>
          <div className='mt-5 flex flex-wrap gap-2'>
            {sources.map((s) => (
              <span
                key={s}
                className='rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500'
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
