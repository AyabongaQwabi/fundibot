import Link from 'next/link';
import { Logo } from '@/components/Logo';

const footerLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Tools', href: '/tools' },
  { label: 'Institutions', href: '/tools/institutions' },
  { label: 'Careers', href: '/tools/career-recommender' },
  { label: 'Stats', href: '/stats' },
];

export function SiteFooter() {
  return (
    <footer className='border-t border-slate-100 bg-white py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
          {/* Logo */}
          <Logo variant='dark' withTagline iconSize={32} />

          {/* Links */}
          <nav className='flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-slate-500'>
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='transition-colors hover:text-brand-blue'
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className='text-xs text-slate-400'>
            © 2026 Qwabi Engineering. All Rights Reserved.
          </p>
        </div>

        {/* Disclaimer */}
        <div className='mt-8 border-t border-slate-100 pt-6'>
          <p className='mx-auto max-w-4xl text-center text-[11px] leading-relaxed text-slate-400'>
            Information on Fundibot is compiled from publicly available sources including university
            and college prospectuses, official institution websites, Claude AI, zabursaries.co.za,
            Wikimedia, and nationalgovernment.co.za. Always verify the latest details directly with
            the institution before making any decisions. Fundibot is not affiliated with any
            university or government department.
          </p>
        </div>
      </div>
    </footer>
  );
}
