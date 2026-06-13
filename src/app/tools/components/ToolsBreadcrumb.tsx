'use client';

import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

type Crumb = { label: string; href: string };

export function ToolsBreadcrumb({
  currentPage,
  extraCrumbs,
}: {
  currentPage?: string;
  extraCrumbs?: Crumb[];
}) {
  return (
    <nav className='mb-6 flex items-center gap-1.5 text-sm' aria-label='Breadcrumb'>
      <Link href='/' className='flex items-center gap-1 text-white/50 transition-colors hover:text-white'>
        <Home className='h-3.5 w-3.5' />
        Home
      </Link>
      <ChevronRight className='h-3.5 w-3.5 text-white/30' />
      <Link href='/tools' className='text-white/50 transition-colors hover:text-white'>Tools</Link>
      {extraCrumbs?.map((c) => (
        <span key={c.href} className='contents'>
          <ChevronRight className='h-3.5 w-3.5 text-white/30' />
          <Link href={c.href} className='text-white/50 transition-colors hover:text-white'>{c.label}</Link>
        </span>
      ))}
      {currentPage && (
        <>
          <ChevronRight className='h-3.5 w-3.5 text-white/30' />
          <span className='font-semibold text-white/80'>{currentPage}</span>
        </>
      )}
    </nav>
  );
}
