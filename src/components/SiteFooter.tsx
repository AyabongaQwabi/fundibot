import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className='border-t border-slate-100 bg-white py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
          {/* Logo */}
          <div className='flex items-center gap-2.5'>
            <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-brand-blue'>
              <span className='text-xs font-bold text-white'>F</span>
            </div>
            <span className='text-sm font-bold text-slate-900'>Fundibot</span>
          </div>

          {/* Links */}
          <nav className='flex flex-wrap justify-center gap-6 text-sm text-slate-500'>
            <Link href='/tools/qualification-checker' className='transition-colors hover:text-slate-900'>Qualification Checker</Link>
            <Link href='/tools/course-finder' className='transition-colors hover:text-slate-900'>Course Finder</Link>
            <Link href='/tools/career-recommender' className='transition-colors hover:text-slate-900'>Career Recommender</Link>
          </nav>

          <p className='text-xs text-slate-400'>
            © {new Date().getFullYear()} Fundibot · Free for all South African learners
          </p>
        </div>
      </div>
    </footer>
  );
}
