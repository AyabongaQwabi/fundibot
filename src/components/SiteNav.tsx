'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Logo } from '@/components/Logo';

const navLinks = [
  { label: 'Tools', href: '/tools' },
  { label: 'Institutions', href: '/tools/institutions' },
  { label: 'Careers', href: '/tools/career-recommender' },
  { label: 'Stats', href: '/stats' },
  { label: 'Bursaries', href: '/tools/bursary-finder' },
];

export function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isHome
          ? 'border-b border-white/10 bg-brand-blue/90 backdrop-blur-xl'
          : 'border-b border-slate-100 bg-white/95 backdrop-blur-xl shadow-sm'
      }`}
    >
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6'>
        {/* Logo */}
        <Logo variant={isHome ? 'light' : 'dark'} iconSize={34} />

        {/* Desktop nav */}
        <nav className='hidden items-center gap-1 md:flex'>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isHome
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className='hidden items-center gap-3 md:flex'>
          <Link
            href='/tools/course-finder'
            className='inline-flex items-center gap-2 rounded-full bg-brand-gold px-5 py-2 text-sm font-extrabold text-navy-900 transition-all duration-200 hover:bg-brand-gold-light hover:shadow-glow-gold active:scale-95'
          >
            <Search className='h-4 w-4' />
            Launch Course Finder
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={`flex items-center justify-center rounded-lg p-2 transition md:hidden ${isHome ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label='Toggle menu'
        >
          {mobileOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`border-t px-4 py-4 md:hidden ${isHome ? 'border-white/10 bg-brand-blue' : 'border-slate-100 bg-white'}`}>
          <nav className='flex flex-col gap-1'>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isHome ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href='/tools/course-finder'
              onClick={() => setMobileOpen(false)}
              className='mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-center text-sm font-extrabold text-navy-900'
            >
              <Search className='h-4 w-4' />
              Launch Course Finder
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
