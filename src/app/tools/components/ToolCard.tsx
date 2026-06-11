import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ToolCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  requirement: string;
  href: string;
};

export function ToolCard({ icon: Icon, title, description, requirement, href }: ToolCardProps) {
  return (
    <div className='group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-slate-200'>
      <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-all duration-300 group-hover:bg-brand-blue group-hover:text-white'>
        <Icon className='h-5 w-5' aria-hidden='true' />
      </div>
      <h2 className='text-lg font-bold text-slate-900'>{title}</h2>
      <p className='mt-3 flex-1 text-sm leading-relaxed text-slate-500'>{description}</p>
      <p className='mt-4 text-xs text-slate-400'>
        <span className='font-semibold'>What you need:</span> {requirement}
      </p>
      <Link
        href={href}
        className='mt-6 inline-flex items-center justify-between rounded-full bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-blue hover:shadow-glow-blue'
      >
        Launch Tool
        <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5' />
      </Link>
    </div>
  );
}
