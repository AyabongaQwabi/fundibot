'use client';

import Link from 'next/link';

export function ToolsBreadcrumb({ currentPage }: { currentPage?: string }) {
  return (
    <nav className='mb-6 text-sm text-slate-600' aria-label='Breadcrumb'>
      <ol className='flex items-center gap-2'>
        <li>
          <Link href='/' className='text-slate-600 hover:text-slate-900'>Home</Link>
        </li>
        <li aria-hidden='true'>/</li>
        {currentPage ? (
          <>
            <li>
              <Link href='/tools' className='text-slate-600 hover:text-slate-900'>Tools</Link>
            </li>
            <li aria-hidden='true'>/</li>
            <li className='font-semibold text-slate-900'>{currentPage}</li>
          </>
        ) : (
          <li className='font-semibold text-slate-900'>Tools</li>
        )}
      </ol>
    </nav>
  );
}
