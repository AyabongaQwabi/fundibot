const stats = [
  { value: '50+', label: 'South African Institutions', description: 'Universities, UoTs, and TVET colleges' },
  { value: '1000+', label: 'Qualifications Mapped', description: 'Across all fields of study' },
  { value: '3', label: 'Powerful Free Tools', description: 'No account or email required' },
  { value: '100%', label: 'Free Forever', description: 'For every South African learner' },
];

export function StatsSection() {
  return (
    <section className='bg-white py-20 sm:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='mx-auto max-w-2xl text-center'>
          <span className='section-tag mb-5'>By the numbers</span>
          <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>
            Built Around Real Admission Requirements
          </h2>
        </div>

        <div className='mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => (
            <div key={stat.label} className='relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center shadow-card'>
              {/* Decorative accent */}
              <div className='absolute inset-x-0 top-0 h-1 bg-blue-gradient' />

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
