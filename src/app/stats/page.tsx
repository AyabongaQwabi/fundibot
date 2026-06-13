import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, BarChart2 } from 'lucide-react';
import { getStatsData } from '@/lib/tools/stats';
import { StatsClient } from './StatsClient';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Data & Statistics — Inside the Fundibot Dataset',
  description:
    'Explore the open dataset behind Fundibot: charts and statistics across 75+ South African institutions, thousands of programmes, APS ranges and qualification types.',
  alternates: { canonical: '/stats' },
};

export default function StatsPage() {
  const stats = getStatsData();

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='bg-sky-700 pb-16 pt-28'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6'>
          <nav className='mb-6 flex items-center gap-2 text-sm text-white/50'>
            <Link href='/' className='flex items-center gap-1.5 transition-colors hover:text-white'>
              <Home className='h-3.5 w-3.5' />
              Home
            </Link>
            <span>/</span>
            <span className='text-white/80'>Data & Stats</span>
          </nav>
          <p className='text-xs font-semibold uppercase tracking-widest text-brand-blue-light'>
            Open dataset · Fundibot
          </p>
          <h1 className='mt-3 flex items-center gap-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl'>
            <BarChart2 className='h-9 w-9 text-brand-blue-light' />
            Data & Statistics
          </h1>
          <p className='mt-4 max-w-2xl text-lg text-white/60'>
            Explore the breadth of data behind Fundibot — scraped from institutions across South Africa.
          </p>
        </div>
      </div>

      <StatsClient stats={stats} />
    </div>
  );
}
