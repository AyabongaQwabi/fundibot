import Link from 'next/link';
import { Logo } from '@/components/Logo';

export function SiteFooter() {
  return (
    <footer className='border-t border-slate-100 bg-white py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
          {/* Logo */}
          <Logo variant='dark' withTagline iconSize={32} />

          {/* Links */}
          <nav className='flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-500'>
            <Link href='/tools/qualification-checker' className='transition-colors hover:text-brand-blue'>Qualification Checker</Link>
            <Link href='/tools/course-finder' className='transition-colors hover:text-brand-blue'>Course Finder</Link>
            <Link href='/tools/career-recommender' className='transition-colors hover:text-brand-blue'>Career Recommender</Link>
            <Link href='/tools/bursary-finder' className='transition-colors hover:text-brand-blue'>Bursaries</Link>
          </nav>

          <p className='text-xs text-slate-400'>
            © {new Date().getFullYear()} Fundibot · Built with{' '}
            <span className='text-brand-gold-dark'>♥</span> for SA learners
          </p>
        </div>
      </div>
    </footer>
  );
}
