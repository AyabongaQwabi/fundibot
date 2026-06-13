import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ToolCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  requirement: string;
  href: string;
  wip?: boolean;
  featured?: boolean;
};

export function ToolCard({ icon: Icon, title, description, requirement, href, wip, featured }: ToolCardProps) {
  if (featured) {
    return (
      <div className='group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-brand-gold/60 p-6 shadow-[0_0_0_4px_rgba(245,158,11,0.1)] transition-all duration-300 hover:shadow-[0_0_0_6px_rgba(245,158,11,0.18)]'
        style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #f0fdf4 100%)' }}
      >
        <span className='pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-brand-gold/25 animate-pulse' />
        <div className='mb-5 flex items-start justify-between gap-2'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold text-white shadow-glow-gold transition-transform duration-300 group-hover:scale-110'>
            <Icon className='h-5 w-5' aria-hidden='true' />
          </div>
          <span className='inline-flex items-center rounded-full border border-brand-gold/40 bg-brand-gold/20 px-2.5 py-1 text-xs font-bold text-amber-700'>
            ★ Featured
          </span>
        </div>
        <h2 className='text-lg font-extrabold text-slate-900'>{title}</h2>
        <p className='mt-3 flex-1 text-sm leading-relaxed text-slate-600'>{description}</p>
        <p className='mt-4 text-xs text-slate-400'>
          <span className='font-semibold'>What you need:</span> {requirement}
        </p>
        <Link
          href={href}
          className='mt-6 inline-flex items-center justify-between rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-900 shadow-glow-gold transition-all duration-200 hover:bg-brand-gold-light'
        >
          Find My Course
          <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5' />
        </Link>
      </div>
    );
  }

  return (
    <div className={`group flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card transition-all duration-300 ${wip ? 'border-slate-100 opacity-70' : 'border-slate-100 hover:shadow-card-hover hover:border-slate-200'}`}>
      <div className='mb-5 flex items-start justify-between gap-2'>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-all duration-300 ${wip ? '' : 'group-hover:bg-brand-blue group-hover:text-white'}`}>
          <Icon className='h-5 w-5' aria-hidden='true' />
        </div>
        {wip && (
          <span className='inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700'>
            Work in progress
          </span>
        )}
      </div>
      <h2 className='text-lg font-bold text-slate-900'>{title}</h2>
      <p className='mt-3 flex-1 text-sm leading-relaxed text-slate-500'>{description}</p>
      <p className='mt-4 text-xs text-slate-400'>
        <span className='font-semibold'>What you need:</span> {requirement}
      </p>
      {wip ? (
        <div className='mt-6 inline-flex cursor-not-allowed items-center justify-between rounded-full bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-400'>
          Coming soon
          <ArrowRight className='h-4 w-4' />
        </div>
      ) : (
        <Link
          href={href}
          className='mt-6 inline-flex items-center justify-between rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-blue hover:shadow-glow-blue'
        >
          Launch Tool
          <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5' />
        </Link>
      )}
    </div>
  );
}
