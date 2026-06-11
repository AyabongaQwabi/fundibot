const steps = [
  {
    step: '01',
    title: 'Enter Your Subjects',
    description: 'Select your Grade 12 subjects from the full NSC curriculum and enter your percentage marks.',
    preview: (
      <div className='space-y-2'>
        {[
          { subject: 'Mathematics', mark: '78%', aps: 6 },
          { subject: 'English Home Language', mark: '72%', aps: 6 },
          { subject: 'Physical Sciences', mark: '65%', aps: 5 },
          { subject: 'Life Sciences', mark: '81%', aps: 7 },
        ].map((row) => (
          <div key={row.subject} className='flex items-center justify-between rounded-lg border border-slate-100 bg-white px-4 py-2.5 shadow-sm'>
            <span className='text-sm font-medium text-slate-700'>{row.subject}</span>
            <div className='flex items-center gap-3'>
              <span className='rounded-md bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600'>{row.mark}</span>
              <span className='flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue/10 text-xs font-bold text-brand-blue'>{row.aps}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: '02',
    title: 'Calculate APS Score',
    description: 'Your APS score is automatically calculated using the official South African point system.',
    preview: (
      <div className='text-center'>
        <div className='mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-gradient shadow-glow-blue'>
          <div>
            <p className='text-3xl font-black text-white'>36</p>
            <p className='text-xs font-semibold text-white/70'>APS Score</p>
          </div>
        </div>
        <p className='mt-5 text-sm font-medium text-slate-600'>Based on your best 6 subjects</p>
        <div className='mt-4 grid grid-cols-3 gap-3'>
          {[
            { label: 'Percentile', value: 'Top 15%' },
            { label: 'Rating', value: 'Above Avg' },
            { label: 'Eligible', value: '12 courses' },
          ].map((stat) => (
            <div key={stat.label} className='rounded-xl border border-slate-100 bg-slate-50 py-3'>
              <p className='text-sm font-bold text-slate-900'>{stat.value}</p>
              <p className='mt-0.5 text-xs text-slate-500'>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    step: '03',
    title: 'View Opportunities',
    description: 'See every university and qualification you qualify for, instantly matched to your results.',
    preview: (
      <div className='space-y-2.5'>
        {[
          { name: 'BSc Computer Science', inst: 'UCT', aps: 36, match: true },
          { name: 'BCom Accounting', inst: 'Stellenbosch', aps: 34, match: true },
          { name: 'BEng Mechanical', inst: 'Wits', aps: 35, match: true },
        ].map((item) => (
          <div key={item.name} className='flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm'>
            <span className='flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm text-emerald-500'>✓</span>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-semibold text-slate-900'>{item.name}</p>
              <p className='text-xs text-slate-500'>{item.inst} · APS {item.aps} required</p>
            </div>
            <span className='flex-shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600'>Qualify</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: '04',
    title: 'Explore Careers',
    description: 'Discover which careers align with your subject strengths and what to study to get there.',
    preview: (
      <div className='space-y-3'>
        <div className='flex flex-wrap gap-2'>
          {['Software Developer', 'Data Analyst', 'Systems Engineer', 'AI Researcher', 'Product Manager'].map((c) => (
            <span key={c} className='rounded-full border border-brand-blue/20 bg-brand-blue/8 px-3 py-1.5 text-xs font-semibold text-brand-blue'>
              {c}
            </span>
          ))}
        </div>
        <div className='rounded-xl border border-slate-100 bg-slate-50 p-4'>
          <p className='text-xs font-semibold uppercase tracking-widest text-slate-400'>Recommended path</p>
          <p className='mt-2 text-sm font-bold text-slate-900'>BSc Computer Science → Software Development</p>
          <p className='mt-1 text-xs text-slate-500'>4 years · Universities nationwide · High demand field</p>
        </div>
      </div>
    ),
  },
];

export function ProductShowcase() {
  return (
    <section className='bg-slate-50 py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='mx-auto max-w-2xl text-center'>
          <span className='section-tag mb-5'>How It Works</span>
          <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>
            From Marks to Opportunities in Minutes
          </h2>
          <p className='mt-4 text-lg text-slate-500'>
            A simple four-step journey that puts your future within reach.
          </p>
        </div>

        <div className='mt-20 grid gap-8 lg:grid-cols-2'>
          {steps.map((step, i) => (
            <div key={step.step} className='rounded-2xl border border-slate-200 bg-white p-7 shadow-card'>
              <div className='mb-5 flex items-center gap-4'>
                <span className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-blue text-sm font-black text-white'>
                  {step.step}
                </span>
                <div>
                  <h3 className='text-lg font-bold text-slate-900'>{step.title}</h3>
                  <p className='mt-0.5 text-sm text-slate-500'>{step.description}</p>
                </div>
              </div>
              <div className='rounded-xl border border-slate-100 bg-slate-50 p-4'>
                {step.preview}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
