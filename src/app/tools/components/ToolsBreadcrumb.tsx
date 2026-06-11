'use client';

import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export function ToolsBreadcrumb({ currentPage }: { currentPage?: string }) {
  return (
    <nav className='mb-6 flex items-center gap-1.5 text-sm' aria-label='Breadcrumb'>
      <Link href='/' className='flex items-center gap-1 text-white/50 transition-colors hover:text-white'>
        <Home className='h-3.5 w-3.5' />
        Home
      </Link>
      <ChevronRight className='h-3.5 w-3.5 text-white/30' />
      {currentPage ? (
        <>
          <Link href='/tools' className='text-white/50 transition-colors hover:text-white'>Tools</Link>
          <ChevronRight className='h-3.5 w-3.5 text-white/30' />
          <span className='font-semibold text-white/80'>{currentPage}</span>
        </>
      ) : (
        <span className='font-semibold text-white/80'>Tools</span>
      )}
    </nav>
  );
}
