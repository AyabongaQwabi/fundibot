import Link from 'next/link';
import { GraduationCap, Search, Sparkles } from 'lucide-react';
import { ToolCard } from './components/ToolCard';
import { ToolsBreadcrumb } from './components/ToolsBreadcrumb';

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
    <div className='font-sans'>
      <div className='bg-slate-100 py-12 md:py-16'>
        <div className='mx-auto max-w-5xl px-4'>
          <ToolsBreadcrumb />
          <p className='text-xs font-semibold uppercase tracking-widest text-slate-700'>
            Free tools · Fundibot
          </p>
          <h1 className='font-display mt-3 text-3xl text-slate-900 md:text-4xl lg:text-5xl'>
            Free tools for South African students
          </h1>
          <p className='mt-4 max-w-2xl text-lg text-slate-600'>
            Check university admission requirements, find courses by province, and discover career paths — no account or email required.
          </p>
        </div>
      </div>

      <div className='mx-auto max-w-5xl px-4 py-12 md:py-16'>
        <div className='grid gap-6 md:grid-cols-2'>
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>

        <div className='mt-12 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 text-center'>
          <p className='font-display text-xl text-slate-900'>
            Struggling with Maths or Science?
          </p>
          <p className='mt-2 text-slate-600'>
            Our tutors work in small groups of 3 — personalised support for Grades 6–12.
          </p>
          <Link
            href='/contact'
            className='mt-4 inline-flex rounded-full bg-slate-900 px-8 py-3 text-white hover:bg-slate-800'
          >
            Explore packages
          </Link>
        </div>
      </div>
    </div>
  );
}
