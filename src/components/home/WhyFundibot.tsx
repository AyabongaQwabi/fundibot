import { BookOpen, Map, Compass } from 'lucide-react';

const challenges = [
  {
    icon: BookOpen,
    title: '"What do I even qualify for?"',
    description: 'Most learners finish matric without knowing their APS score — or which programmes will actually accept them. By the time they figure it out, the application deadline is waving goodbye.',
  },
  {
    icon: Map,
    title: '"Which institution do I choose?"',
    description: 'South Africa has 75+ institutions. Finding the one that offers your course, in your province, at an APS you actually have, is not something Google handles well. We do.',
  },
  {
    icon: Compass,
    title: '"What career should I even pick?"',
    description: 'Choosing what to do with the next 40 years of your life at age 17 is a lot. No pressure though. (There\'s a lot of pressure.) We help you figure it out faster.',
  },
];

export function WhyFundibot() {
  return (
    <section className='bg-slate-50 py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='grid items-center gap-16 lg:grid-cols-2'>
          {/* Left */}
          <div>
            <span className='section-tag mb-5'>Why we exist</span>
            <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
              The info exists.{' '}
              <span className='text-gradient-blue'>It's just a nightmare to find.</span>
            </h2>
            <p className='mt-6 text-lg leading-relaxed text-slate-600'>
              Every year, thousands of South African learners finish matric and then spend weeks — sometimes months — trying to figure out where they can study and what they qualify for.
            </p>
            <p className='mt-4 text-lg leading-relaxed text-slate-600'>
              We scraped 75+ institutions, processed hundreds of PDFs, and built the tools so you don't have to do any of that. You're welcome.
            </p>
            <div className='mt-8 flex items-center gap-3'>
              <div className='h-1 w-12 rounded-full bg-sky-500' />
              <p className='text-sm font-semibold text-slate-500'>Built for SA learners, by South Africans</p>
            </div>
          </div>

          {/* Right: challenge cards */}
          <div className='space-y-4'>
            {challenges.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className='flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
                  <div className='flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50 shadow-sm'>
                    <Icon className='h-5 w-5 text-sky-500' />
                  </div>
                  <div>
                    <h3 className='font-bold text-slate-900'>{item.title}</h3>
                    <p className='mt-1.5 text-sm leading-relaxed text-slate-500'>{item.description}</p>
                  </div>
                </div>
              );
            })}

            {/* Resolution */}
            <div className='flex gap-5 rounded-2xl border border-sky-200 bg-sky-50 p-6'>
              <div className='flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-sky-500 shadow-glow-sky'>
                <span className='text-lg text-white'>✦</span>
              </div>
              <div>
                <h3 className='font-bold text-slate-900'>Fundibot handles all three</h3>
                <p className='mt-1.5 text-sm leading-relaxed text-slate-600'>
                  In under two minutes, you can find every institution offering your course, check your APS, and discover careers that match your strengths. Beats Googling for three hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
