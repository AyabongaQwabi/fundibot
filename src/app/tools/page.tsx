import Link from 'next/link';
import { GraduationCap, Search, Sparkles, ArrowRight, Home } from 'lucide-react';
import { ToolCard } from './components/ToolCard';

const tools = [
  {
    icon: GraduationCap,
    title: 'University Qualification Checker',
    description:
      'See which universities and colleges accept your marks. Enter your Grade 12 subjects and percentage marks — the tool calculates your APS score and matches you to programmes where you qualify.',
    requirement: 'your latest school report or predicted marks.',
    href: '/tools/qualification-checker',
  },
  {
    icon: Search,
    title: 'Course & Institution Finder',
    description:
      'Search by course name and filter by province. Find every university, TVET college, and university of technology in South Africa that offers the qualification you want.',
    requirement: 'a course or career in mind.',
    href: '/tools/course-finder',
  },
  {
    icon: Sparkles,
    title: 'Career & Course Recommender',
    description:
      'Not sure what to study? Enter your subjects and marks and get personalised career paths and matching courses based on your strengths.',
    requirement: 'your Grade 12 subjects and marks.',
    href: '/tools/career-recommender',
  },
];

export default function ToolsHubPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Header */}
      <div className='bg-navy-900 pb-16 pt-28'>
        <div className='mx-auto max-w-5xl px-4 sm:px-6'>
          {/* Breadcrumb */}
          <nav className='mb-6 flex items-center gap-2 text-sm text-white/50'>
            <Link href='/' className='flex items-center gap-1.5 transition-colors hover:text-white'>
              <Home className='h-3.5 w-3.5' />
              Home
            </Link>
            <span>/</span>
            <span className='text-white/80'>Tools</span>
          </nav>

          <p className='text-xs font-semibold uppercase tracking-widest text-brand-blue-light'>
            Free tools · Fundibot
          </p>
          <h1 className='mt-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl'>
            Free Tools for South African Students
          </h1>
          <p className='mt-4 max-w-2xl text-lg text-white/60'>
            Check university admission requirements, find courses by province, and discover career paths — no account or email required.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className='mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16'>
        <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>

        {/* Tutoring CTA */}
        <div className='mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card'>
          <div className='bg-blue-gradient px-6 py-1' />
          <div className='px-6 py-8 text-center sm:py-10'>
            <p className='text-xl font-bold text-slate-900'>
              Struggling with Maths or Science?
            </p>
            <p className='mt-2 text-slate-500'>
              Our tutors work in small groups of 3 — personalised support for Grades 6–12.
            </p>
            <Link
              href='/contact'
              className='mt-6 inline-flex items-center gap-2 rounded-full bg-navy-900 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-navy-800'
            >
              Explore packages
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
