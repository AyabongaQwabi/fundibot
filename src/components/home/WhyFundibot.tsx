import { BookOpen, Map, Compass } from 'lucide-react';

const challenges = [
  {
    icon: BookOpen,
    title: 'What do I qualify for?',
    description: 'Most learners don\'t know their APS score or which programmes they\'re eligible for until it\'s too late to apply.',
  },
  {
    icon: Map,
    title: 'Which institution is right for me?',
    description: 'South Africa has 50+ institutions. Navigating which ones offer your programme in your province is overwhelming.',
  },
  {
    icon: Compass,
    title: 'What career should I pursue?',
    description: 'Choosing a career path is one of the biggest decisions a young person makes — often without enough information.',
  },
];

export function WhyFundibot() {
  return (
    <section className='bg-white py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='grid items-center gap-16 lg:grid-cols-2'>
          {/* Left */}
          <div>
            <span className='section-tag mb-5'>Our Mission</span>
            <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
              Every Learner{' '}
              <span className='text-gradient-blue'>Deserves Direction</span>
            </h2>
            <p className='mt-6 text-lg leading-relaxed text-slate-500'>
              Thousands of South African learners finish matric every year unsure of what comes next. The information exists — but it's scattered, complex, and hard to navigate.
            </p>
            <p className='mt-4 text-lg leading-relaxed text-slate-500'>
              Fundibot brings everything together in one place, making the path from Grade 12 to higher education clear, simple, and empowering.
            </p>
            <div className='mt-8 flex items-center gap-3'>
              <div className='h-1 w-12 rounded-full bg-brand-blue' />
              <p className='text-sm font-semibold text-slate-500'>Built for South African learners, by South Africans</p>
            </div>
          </div>

          {/* Right: challenge cards */}
          <div className='space-y-4'>
            {challenges.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className='flex gap-5 rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm'>
                  <div className='flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm'>
                    <Icon className='h-5 w-5 text-brand-blue' />
                  </div>
                  <div>
                    <h3 className='font-bold text-slate-900'>{item.title}</h3>
                    <p className='mt-1.5 text-sm leading-relaxed text-slate-500'>{item.description}</p>
                  </div>
                </div>
              );
            })}

            {/* Resolution */}
            <div className='flex gap-5 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-6'>
              <div className='flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-blue shadow-glow-blue'>
                <span className='text-lg'>✦</span>
              </div>
              <div>
                <h3 className='font-bold text-slate-900'>Fundibot solves all three</h3>
                <p className='mt-1.5 text-sm leading-relaxed text-slate-500'>
                  In under two minutes, any learner can get their APS score, see their qualifying programmes, and discover careers that match their strengths.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
