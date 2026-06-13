import Link from 'next/link';
import {
  GraduationCap, Search, Sparkles, Building2, ArrowRight, Home,
  DollarSign, GitCompare, BookOpen, Calendar, Wrench, Map, BarChart2, TrendingUp, Clock,
} from 'lucide-react';
import { ToolCard } from './components/ToolCard';

const tools = [
  {
    icon: Search,
    title: 'Course & Institution Finder',
    description:
      'The big one. Type a course, pick a province — we show you every institution in SA that offers it, with APS requirements and links. Universities, UoTs, TVET colleges. All of them.',
    requirement: 'a course or career in mind.',
    href: '/tools/course-finder',
    featured: true,
  },
  {
    icon: Clock,
    title: 'Predict My Future',
    description:
      'Answer 7 quick questions. We build your personalised career timeline from today to your first big salary, your dream purchase, and your wedding day. Based on your actual subjects and marks.',
    requirement: 'your current grade and school subjects.',
    href: '/tools/future-timeline',
    featured: false,
  },
  {
    icon: TrendingUp,
    title: 'What Could You Earn?',
    description:
      'Enter your subjects and marks. We will show you exactly what careers match your strengths and what they actually pay in SA. Real salary data, not guesswork.',
    requirement: 'your Grade 12 subjects and marks.',
    href: '/tools/salary-predictor',
    featured: false,
  },
  {
    icon: Sparkles,
    title: 'Career & Course Recommender',
    description:
      'No idea what to study? Put in your subjects and marks. We\'ll suggest careers and courses that actually match your strengths. Beats staring at the ceiling for three months.',
    requirement: 'your Grade 12 subjects and marks.',
    href: '/tools/career-recommender',
  },
  {
    icon: BookOpen,
    title: 'Subject Combination Advisor',
    description:
      'Still in Grade 10 or 11? See which careers your current subjects unlock — and what happens if you drop or add one. Spoiler: dropping Maths closes a lot of doors.',
    requirement: 'your current school subjects.',
    href: '/tools/subject-advisor',
  },
  {
    icon: Wrench,
    title: 'TVET & NCV Pathway Planner',
    description:
      'The TVET route is seriously underrated. Understand the NCV Level 2–4 and NATED N1–N6 pathways, what each level unlocks, and which colleges offer your trade nearby.',
    requirement: 'nothing — just browse.',
    href: '/tools/tvet-planner',
  },
  {
    icon: Map,
    title: 'Gap Year & Alternative Pathways',
    description:
      'Didn\'t get the marks you wanted? There are more doors than you think. Find TVET programmes, bridging courses, learnerships, and short skills programmes you qualify for right now.',
    requirement: 'your NSC results.',
    href: '/tools/gap-year',
  },
  {
    icon: GitCompare,
    title: 'Institution Comparison',
    description:
      'Can\'t choose between UCT and Wits? Compare up to 4 institutions side by side — programmes, APS ranges, qualification types. May cause decisive moments.',
    requirement: 'at least 2 institutions in mind.',
    href: '/tools/institution-comparison',
  },
  {
    icon: Building2,
    title: 'Institution Profiles',
    description:
      'Deep-dive profiles for every university and college — faculties, campuses, programmes, contact details, and admission rules. All in one place.',
    requirement: 'nothing — just browse.',
    href: '/tools/institutions',
  },
  {
    icon: DollarSign,
    title: 'Bursary & Funding Matcher',
    description:
      'Find bursaries, NSFAS eligibility, and field-specific funding based on your course and household income. Because studying shouldn\'t only be for people with rich uncles.',
    requirement: 'your field of study and income bracket.',
    href: '/tools/bursary-finder',
  },
];

const wipTools = [
  {
    icon: GraduationCap,
    title: 'APS Qualification Checker',
    description:
      'Enter your subjects and marks and instantly see which programmes you qualify for. Like having an admissions officer in your pocket — except this one doesn\'t judge your maths mark.',
    requirement: 'your latest school report or predicted marks.',
    href: '/tools/qualification-checker',
    wip: true,
  },
  {
    icon: Calendar,
    title: 'Application Deadline Tracker',
    description:
      'See when applications open and close at every institution. Save the ones you care about. Stop finding out about deadlines after they\'ve passed.',
    requirement: 'nothing — just browse.',
    href: '/tools/deadline-tracker',
    wip: true,
  },
];

export default function ToolsHubPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Header */}
      <div className='bg-sky-700 pb-16 pt-28'>
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

          <p className='text-xs font-semibold uppercase tracking-widest text-brand-gold-light'>
            Free · No login · No stress
          </p>
          <h1 className='mt-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl'>
            10 free tools to sort out your future.
          </h1>
          <p className='mt-4 max-w-2xl text-lg text-white/60'>
            Find courses, check your APS, compare institutions, track deadlines, and discover what you can study — all without creating an account or asking your parents.
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

        {/* Coming Soon */}
        <div className='mt-14'>
          <div className='mb-6 flex items-center gap-4'>
            <div className='h-px flex-1 bg-slate-200' />
            <span className='inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700'>
              Coming Soon
            </span>
            <div className='h-px flex-1 bg-slate-200' />
          </div>
          <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {wipTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>

        {/* Stats link */}
        <div className='mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card'>
          <div className='bg-sky-gradient px-6 py-1' />
          <div className='flex flex-col items-center gap-4 px-6 py-8 text-center sm:flex-row sm:text-left'>
            <BarChart2 className='h-10 w-10 shrink-0 text-sky-500' />
            <div className='flex-1'>
              <p className='text-xl font-bold text-slate-900'>Explore the Dataset</p>
              <p className='mt-1 text-slate-500'>
                Curious how we built this? See charts and stats across 75+ scraped institutions.
              </p>
            </div>
            <Link
              href='/stats'
              className='inline-flex items-center gap-2 rounded-full bg-sky-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-sky-600'
            >
              View Stats
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        </div>

        {/* Tutoring CTA */}
        <div className='mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card'>
          <div className='bg-gold-gradient px-6 py-1' />
          <div className='px-6 py-8 text-center sm:py-10'>
            <p className='text-xl font-bold text-slate-900'>
              Maths and Science destroying your average?
            </p>
            <p className='mt-2 text-slate-500'>
              Small group tutoring — 3 learners max. Grades 6–12. Actual humans who explain things properly.
            </p>
            <Link
              href='/contact'
              className='mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gold px-8 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-brand-gold-light shadow-glow-gold'
            >
              Get help now
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
