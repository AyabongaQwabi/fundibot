import Link from 'next/link';
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
    <div className='flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm'>
      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-900'>
        <Icon className='h-6 w-6' aria-hidden='true' />
      </div>
      <h2 className='text-xl font-semibold text-slate-900'>{title}</h2>
      <p className='mt-3 text-sm text-slate-600'>{description}</p>
      <p className='mt-4 text-xs italic text-slate-500'>What you need: {requirement}</p>
      <Link
        href={href}
        className='mt-6 inline-flex items-center justify-between rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'
      >
        Use this tool
        <span aria-hidden='true'>→</span>
      </Link>
    </div>
  );
}
