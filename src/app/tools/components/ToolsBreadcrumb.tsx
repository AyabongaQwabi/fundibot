'use client';

import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

type Crumb = { label: string; href?: string };

export function ToolsBreadcrumb({
  currentPage,
  extraCrumbs,
  items,
  dark = false,
}: {
  currentPage?: string;
  extraCrumbs?: Crumb[];
  /** Alternative flat items API: [{label, href?}, ...] — last item without href is the current page */
  items?: Crumb[];
  dark?: boolean;
}) {
  const linkCls = dark
    ? 'text-white/50 transition-colors hover:text-white'
    : 'text-slate-400 transition-colors hover:text-slate-700';
  const chevronCls = dark ? 'h-3.5 w-3.5 text-white/30' : 'h-3.5 w-3.5 text-slate-300';
  const currentCls = dark ? 'font-semibold text-white/80' : 'font-semibold text-slate-700';

  // Flat items API
  if (items) {
    return (
      <nav className='mb-6 flex items-center gap-1.5 text-sm' aria-label='Breadcrumb'>
        <Link href='/' className={`flex items-center gap-1 ${linkCls}`}>
          <Home className='h-3.5 w-3.5' />
          Home
        </Link>
        {items.map((item, i) => (
          <span key={i} className='contents'>
            <ChevronRight className={chevronCls} />
            {item.href ? (
              <Link href={item.href} className={linkCls}>{item.label}</Link>
            ) : (
              <span className={currentCls}>{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    );
  }

  return (
    <nav className='mb-6 flex items-center gap-1.5 text-sm' aria-label='Breadcrumb'>
      <Link href='/' className={`flex items-center gap-1 ${linkCls}`}>
        <Home className='h-3.5 w-3.5' />
        Home
      </Link>
      <ChevronRight className={chevronCls} />
      <Link href='/tools' className={linkCls}>Tools</Link>
      {extraCrumbs?.map((c) => (
        <span key={c.href} className='contents'>
          <ChevronRight className={chevronCls} />
          {c.href ? (
            <Link href={c.href} className={linkCls}>{c.label}</Link>
          ) : (
            <span className={currentCls}>{c.label}</span>
          )}
        </span>
      ))}
      {currentPage && (
        <>
          <ChevronRight className={chevronCls} />
          <span className={currentCls}>{currentPage}</span>
        </>
      )}
    </nav>
  );
}
