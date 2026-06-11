import Link from 'next/link';

export default function HomePage() {
  return (
    <main className='min-h-screen bg-slate-50 text-slate-900'>
      <div className='mx-auto max-w-5xl px-4 py-16'>
        <h1 className='text-4xl font-semibold tracking-tight'>Fundibot</h1>
        <p className='mt-4 max-w-2xl text-lg text-slate-700'>
          Tools for Grade 12 learners: qualification checking, course matching, and career recommendations.
        </p>
        <div className='mt-10 grid gap-4 sm:grid-cols-3'>
          <Link className='rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-lg transition hover:bg-slate-800' href='/tools'>
            Open tools
          </Link>
          <a className='rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 shadow-sm transition hover:border-slate-300' href='#features'>
            Learn more
          </a>
        </div>
      </div>
    </main>
  );
}
