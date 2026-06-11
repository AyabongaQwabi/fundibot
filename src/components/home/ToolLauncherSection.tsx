import Link from 'next/link';
import { GraduationCap, Search, Sparkles, ArrowRight } from 'lucide-react';

const tools = [
  {
    icon: GraduationCap,
    emoji: '🎯',
    label: 'Most Popular',
    title: 'Qualification Checker',
    description:
      'Enter your subjects and marks and instantly see which qualifications and institutions you qualify for. Get your APS score in seconds.',
    href: '/tools/qualification-checker',
    accent: 'blue',
  },
  {
    icon: Search,
    emoji: '🏫',
    label: 'Course Discovery',
    title: 'Course & Institution Finder',
    description:
      'Find universities and colleges offering the course you want in your chosen province. Search across every South African institution.',
    href: '/tools/course-finder',
    accent: 'purple',
  },
  {
    icon: Sparkles,
    emoji: '🚀',
    label: 'Career Guidance',
    title: 'Career Recommendation Tool',
    description:
      'Discover careers and study paths that match your strengths and academic performance. Unlock your potential.',
    href: '/tools/career-recommender',
    accent: 'gold',
  },
];

const accentStyles: Record<string, { border: string; bg: string; badge: string; icon: string; cta: string }> = {
  blue: {
    border: 'hover:border-brand-blue/40',
    bg: 'group-hover:bg-brand-blue/5',
    badge: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
    icon: 'bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white',
    cta: 'text-brand-blue group-hover:text-brand-blue-dark',
  },
  purple: {
    border: 'hover:border-purple-400/40',
    bg: 'group-hover:bg-purple-500/5',
    badge: 'bg-purple-500/10 text-purple-600 border-purple-300/30',
    icon: 'bg-purple-500/10 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
    cta: 'text-purple-600 group-hover:text-purple-700',
  },
  gold: {
    border: 'hover:border-brand-gold/40',
    bg: 'group-hover:bg-brand-gold/5',
    badge: 'bg-brand-gold/10 text-amber-600 border-brand-gold/20',
    icon: 'bg-brand-gold/10 text-amber-600 group-hover:bg-brand-gold group-hover:text-white',
    cta: 'text-amber-600 group-hover:text-amber-700',
  },
};

export function ToolLauncherSection() {
  return (
    <section className='bg-white py-24 sm:py-32' id='tools'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        {/* Header */}
        <div className='mx-auto max-w-2xl text-center'>
          <span className='section-tag mb-5'>Platform</span>
          <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
            What Would You Like{' '}
            <span className='text-gradient-blue'>To Do Today?</span>
          </h2>
          <p className='mt-4 text-lg text-slate-500'>
            Three powerful free tools built specifically for South African Grade 12 learners.
          </p>
        </div>

        {/* Tool cards */}
        <div className='mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {tools.map((tool) => {
            const Icon = tool.icon;
            const styles = accentStyles[tool.accent];
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group relative flex flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-card transition-all duration-300 hover:shadow-card-hover ${styles.border}`}
              >
                {/* Hover bg tint */}
                <div className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${styles.bg}`} />

                <div className='relative'>
                  {/* Badge */}
                  <span className={`mb-5 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles.badge}`}>
                    {tool.emoji} {tool.label}
                  </span>

                  {/* Icon */}
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${styles.icon}`}>
                    <Icon className='h-5 w-5' aria-hidden='true' />
                  </div>

                  <h3 className='text-xl font-bold text-slate-900'>{tool.title}</h3>
                  <p className='mt-3 text-sm leading-relaxed text-slate-500'>{tool.description}</p>

                  {/* CTA */}
                  <div className={`mt-6 flex items-center gap-2 text-sm font-semibold transition-colors duration-200 ${styles.cta}`}>
                    Launch Tool
                    <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom note */}
        <p className='mt-10 text-center text-sm text-slate-400'>
          All tools are completely free. No account or email required.
        </p>
      </div>
    </section>
  );
}
