const stats = [
  { value: '75+', label: 'SA Institutions', description: 'Universities, UoTs, and TVET colleges', accent: 'sky' },
  { value: '3 000+', label: 'Courses Mapped', description: 'Across every field you can think of', accent: 'gold' },
  { value: '10', label: 'Free Tools', description: 'No login. No ads. No catch.', accent: 'sky' },
  { value: '100%', label: 'Free Forever', description: 'For every South African learner', accent: 'gold' },
];

const accentBar: Record<string, string> = {
  sky: 'bg-sky-gradient',
  gold: 'bg-gold-gradient',
};

export function StatsSection() {
  return (
    <section className='bg-white py-20 sm:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='mx-auto max-w-2xl text-center'>
          <span className='section-tag mb-5'>The numbers</span>
          <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>
            Real data. Real institutions. Really free.
          </h2>
          <p className='mt-3 text-slate-500'>We scraped hundreds of PDFs so you don't have to. You're welcome.</p>
        </div>

        <div className='mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => (
            <div key={stat.label} className='relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center shadow-card'>
              <div className={`absolute inset-x-0 top-0 h-1 ${accentBar[stat.accent]}`} />
              <p className='mt-2 text-4xl font-black tracking-tight text-slate-900'>{stat.value}</p>
              <p className='mt-2 text-sm font-bold text-slate-700'>{stat.label}</p>
              <p className='mt-1 text-xs text-slate-400'>{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
