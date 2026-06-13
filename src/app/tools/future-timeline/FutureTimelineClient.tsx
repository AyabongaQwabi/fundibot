'use client';

import { useState, useEffect, useRef } from 'react';
import {
  GraduationCap, Briefcase, Home, Car, Star, Zap, Heart, ChevronRight,
  ChevronLeft, Loader2, RefreshCw, Share2, TrendingUp, BookOpen,
  MapPin, Award, Users, Globe, Coffee, Trophy,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Occupation = {
  title: string;
  sector: string;
  salary_min: number;
  salary_max: number;
  salary_mid: number;
  subjects_required: string[];
  career_fields: string[];
  qualification: string;
};

type Company = {
  name: string;
  sector: string;
  career_fields: string[];
  hq: string;
  provinces_operating: string[];
  offers_internship: boolean;
};

type SubjectEntry = { subject: string; mark: number | '' };

type Vibe = 'money' | 'difference' | 'adventure' | 'creative';

type TimelineCard = {
  year: number;
  icon: string;
  headline: string;
  body: string;
  category: 'school' | 'tertiary' | 'career' | 'personal' | 'positive' | 'challenge' | 'wildcard';
};

// ─── Constants ────────────────────────────────────────────────────────────────

const NSC_SUBJECTS = [
  'Mathematics',
  'Mathematical Literacy',
  'Physical Sciences',
  'Life Sciences',
  'Accounting',
  'Economics',
  'Business Studies',
  'Information Technology',
  'Computer Applications Technology',
  'History',
  'Geography',
  'English Home Language',
  'English First Additional Language',
  'Afrikaans Home Language',
  'isiZulu',
  'isiXhosa',
  'Sesotho',
  'Arts and Culture',
  'Dramatic Arts',
  'Music',
  'Consumer Studies',
  'Agricultural Sciences',
  'Tourism',
  'Visual Arts',
  'Technical Mathematics',
  'Technical Sciences',
  'Hospitality Studies',
];

const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

const PROVINCE_CITIES: Record<string, string[]> = {
  'Eastern Cape': ['Port Elizabeth', 'East London', 'Makhanda'],
  'Free State': ['Bloemfontein', 'Welkom', 'Bethlehem'],
  'Gauteng': ['Johannesburg', 'Pretoria', 'Sandton', 'Midrand'],
  'KwaZulu-Natal': ['Durban', 'Pietermaritzburg', 'Richards Bay'],
  'Limpopo': ['Polokwane', 'Tzaneen', 'Louis Trichardt'],
  'Mpumalanga': ['Mbombela', 'Witbank', 'Secunda'],
  'Northern Cape': ['Kimberley', 'Upington', 'De Aar'],
  'North West': ['Rustenburg', 'Mahikeng', 'Potchefstroom'],
  'Western Cape': ['Cape Town', 'Stellenbosch', 'George'],
};

const SUBJECT_TO_CAREER: Record<string, string[]> = {
  'Mathematics': ['Engineering', 'IT', 'Finance', 'Science', 'Medicine'],
  'Mathematical Literacy': ['Commerce', 'Hospitality', 'Administration'],
  'Physical Sciences': ['Engineering', 'Science', 'Medicine'],
  'Life Sciences': ['Medicine', 'Science', 'Agriculture'],
  'Accounting': ['Finance', 'Commerce'],
  'Business Studies': ['Commerce', 'Management'],
  'Information Technology': ['IT'],
  'Computer Applications Technology': ['IT'],
  'Economics': ['Finance', 'Commerce'],
  'History': ['Law', 'Education', 'Government'],
  'Geography': ['Engineering', 'Science', 'Environmental'],
  'English Home Language': ['Law', 'Media', 'Education'],
  'English First Additional Language': ['Law', 'Media', 'Education'],
  'Arts and Culture': ['Arts', 'Media', 'Design'],
  'Dramatic Arts': ['Arts', 'Media'],
  'Music': ['Arts', 'Media'],
  'Agricultural Sciences': ['Agriculture', 'Science'],
  'Consumer Studies': ['Hospitality', 'Design'],
  'Tourism': ['Hospitality', 'Tourism'],
  'Visual Arts': ['Arts', 'Design'],
  'Technical Mathematics': ['Engineering', 'Finance'],
  'Technical Sciences': ['Engineering', 'Science'],
  'Hospitality Studies': ['Hospitality', 'Tourism'],
  'Afrikaans Home Language': ['Law', 'Media', 'Education'],
  'isiZulu': ['Education', 'Media'],
  'isiXhosa': ['Education', 'Media'],
  'Sesotho': ['Education', 'Media'],
};

const VIBE_BOOSTS: Record<Vibe, string[]> = {
  money: ['Finance', 'IT', 'Law', 'Management'],
  difference: ['Medicine', 'Education', 'Science', 'Government'],
  adventure: ['Tourism', 'Environmental', 'Agriculture', 'Engineering'],
  creative: ['Arts', 'Design', 'Media', 'Architecture'],
};

const VIBE_LABELS: Record<Vibe, { emoji: string; title: string; desc: string; color: string }> = {
  money: { emoji: '💰', title: 'Money and success', desc: 'You want the bag. Big house, nice car, and a table at the restaurant.', color: '#ffd800' },
  difference: { emoji: '🌍', title: 'Making a difference', desc: 'You want to leave things better than you found them. Purpose over pay.', color: '#10b981' },
  adventure: { emoji: '✈️', title: 'Adventure and travel', desc: 'You want a career that takes you places — literally. Passport full of stamps.', color: '#0ea5e9' },
  creative: { emoji: '🎨', title: 'Creative and expressive', desc: 'You want to build things, make things, design things. Art is work.', color: '#a855f7' },
};

const UNIVERSITIES_HIGH = [
  'UCT', 'Wits', 'University of Pretoria', 'Stellenbosch University',
  'UKZN', 'UWC', 'Rhodes University', 'University of Fort Hare',
  'University of Limpopo', 'NWU', 'WSU', 'UNIZULU', 'UFS',
];
const UNIVERSITIES_MID = [
  'DUT (Durban University of Technology)', 'CPUT (Cape Peninsula University of Technology)',
  'TUT (Tshwane University of Technology)', 'VUT (Vaal University of Technology)',
  'MUT (Mangosuthu University of Technology)', 'CUT (Central University of Technology)',
  'Walter Sisulu University',
];
const LOADING_MESSAGES = [
  'Consulting the ancestors...',
  'Checking your horoscope...',
  'Running the numbers...',
  'Your future is loading...',
];

const CARD_COLORS: Record<TimelineCard['category'], { bg: string; accent: string; border: string; text: string }> = {
  school:    { bg: '#eff6ff', accent: '#3b82f6', border: '#bfdbfe', text: '#1e40af' },
  tertiary:  { bg: '#faf5ff', accent: '#a855f7', border: '#e9d5ff', text: '#7e22ce' },
  career:    { bg: '#ecfdf5', accent: '#10b981', border: '#a7f3d0', text: '#065f46' },
  personal:  { bg: '#fffbeb', accent: '#F59E0B', border: '#fde68a', text: '#92400e' },
  positive:  { bg: '#f0f9ff', accent: '#0ea5e9', border: '#bae6fd', text: '#0c4a6e' },
  challenge: { bg: '#fff7ed', accent: '#f97316', border: '#fed7aa', text: '#9a3412' },
  wildcard:  { bg: '#fdf4ff', accent: '#ec4899', border: '#f5d0fe', text: '#86198f' },
};

const ICON_MAP: Record<string, typeof Star> = {
  graduation: GraduationCap,
  briefcase: Briefcase,
  home: Home,
  car: Car,
  star: Star,
  zap: Zap,
  heart: Heart,
  trending: TrendingUp,
  book: BookOpen,
  map: MapPin,
  award: Award,
  users: Users,
  globe: Globe,
  coffee: Coffee,
  trophy: Trophy,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtR(n: number) {
  return `R${Math.round(n).toLocaleString('en-ZA')}`;
}

function pickRandom<T>(arr: T[], seed: number = 0): T {
  return arr[(Math.abs(seed * 1973 + 7919) % arr.length)];
}

function pickRandomMultiple<T>(arr: T[], count: number, seed: number = 0): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.abs((seed * i * 1973 + 7919) % (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function weightedAvg(subjects: SubjectEntry[]): number {
  const valid = subjects.filter((s) => s.subject && typeof s.mark === 'number' && (s.mark as number) > 0);
  if (!valid.length) return 0;
  return valid.reduce((sum, s) => sum + (s.mark as number), 0) / valid.length;
}

function qualDuration(qual: string): number {
  if (qual.includes('Medicine') || qual.includes('LLB') || qual.includes('Engineering')) return 5;
  if (qual.includes('Degree') || qual === 'Degree') return 4;
  if (qual.includes('Diploma')) return 3;
  return 2;
}

function qualLabel(qual: string, occupation: Occupation): string {
  if (qual.includes('Degree') || qual === 'Degree') {
    if (occupation.career_fields.includes('Engineering')) return 'BEng degree';
    if (occupation.career_fields.includes('Medicine')) return 'MBChB degree';
    if (occupation.career_fields.includes('Law')) return 'LLB degree';
    if (occupation.career_fields.includes('IT')) return 'BSc (Computer Science) degree';
    return `Bachelor\'s degree`;
  }
  if (qual.includes('Diploma')) return 'National Diploma';
  return 'Certificate';
}

// ─── Timeline generation ──────────────────────────────────────────────────────

function generateTimeline(params: {
  grade: number;
  year: number;
  age: number;
  province: string;
  vibe: Vibe;
  subjects: SubjectEntry[];
  dreamItem: string;
  occupation: Occupation;
  company: Company;
  seed: number;
}): TimelineCard[] {
  const { grade, year, province, vibe, subjects, dreamItem, occupation, company, seed } = params;
  const city = pickRandom(PROVINCE_CITIES[province] ?? ['your city'], seed);
  const avg = weightedAvg(subjects);
  const yearsToMatric = 12 - grade;
  const matricYear = year + yearsToMatric;
  const qual = occupation.qualification;
  const duration = qualDuration(qual);
  const tertStart = matricYear + 1;
  const tertEnd = tertStart + duration;
  const cards: TimelineCard[] = [];
  const usedYears = new Set<number>();

  function addCard(card: TimelineCard) {
    while (usedYears.has(card.year)) card.year++;
    usedYears.add(card.year);
    cards.push(card);
  }

  const weakest = subjects
    .filter((s) => s.subject && typeof s.mark === 'number' && (s.mark as number) >= 40)
    .sort((a, b) => (a.mark as number) - (b.mark as number))[0];

  const studyTips: Record<string, string> = {
    'Mathematics': 'Focus on past papers every week — consistency is everything with Maths.',
    'Physical Sciences': 'Break formulas into small bits and test yourself every Friday.',
    'Life Sciences': 'Draw the diagrams. Your brain remembers pictures better than text.',
    'Accounting': 'Never skip the reconciliation step. Most marks are lost there.',
    'History': 'Learn the "so what" of every event, not just the dates.',
    'Geography': 'Connect theory to real news headlines every week.',
    'English Home Language': 'Read one page of anything every night. Your vocabulary will surprise you.',
  };
  const defaultTip = `Work on ${weakest?.subject ?? 'your toughest subject'} — it is where the biggest gains are hiding.`;
  const studyTip = weakest ? (studyTips[weakest.subject] ?? defaultTip) : defaultTip;

  // 1. Current year card
  addCard({
    year,
    icon: 'book',
    headline: `Grade ${grade} in ${province}`,
    body: `You are in Grade ${grade}, studying hard in ${province}. ${studyTip}`,
    category: 'school',
  });

  // 2. School years up to matric
  for (let g = grade + 1; g <= 11; g++) {
    const y = year + (g - grade);
    addCard({
      year: y,
      icon: 'book',
      headline: `Grade ${g} complete`,
      body: `Another year done. You are getting closer. Keep those marks where they are and the doors stay open.`,
      category: 'school',
    });
  }

  // 3. Matric year
  const bestSubject = subjects
    .filter((s) => s.subject && typeof s.mark === 'number')
    .sort((a, b) => (b.mark as number) - (a.mark as number))[0];
  addCard({
    year: matricYear,
    icon: 'graduation',
    headline: 'Matric exams. This is it.',
    body: `You write your final Matric exams. ${bestSubject?.subject ?? 'Your strongest subject'} is where you shine brightest — it opens the big doors.`,
    category: 'school',
  });

  // Institution name
  let institution: string;
  if (avg >= 70) {
    institution = pickRandom(UNIVERSITIES_HIGH, seed + 3);
  } else if (avg >= 50) {
    institution = pickRandom(UNIVERSITIES_MID, seed + 4);
  } else {
    institution = 'a bridging programme (smart move — one extra year, better foundation)';
  }
  const institutionCity = company.hq.split(',')[1]?.trim() ?? city;

  // 4. Start tertiary
  addCard({
    year: tertStart,
    icon: 'award',
    headline: `${institution}. You made it.`,
    body: `You are officially a ${qualLabel(qual, occupation)} student in ${occupation.career_fields[0] ?? 'your field'}. ${institutionCity} is your new home. Sharp sharp!`,
    category: 'tertiary',
  });

  // 5. Mid-degree part-time job
  const midYear = Math.floor((tertStart + tertEnd) / 2);
  const partTimeSalary = Math.round(occupation.salary_min / 3);
  addCard({
    year: midYear,
    icon: 'coffee',
    headline: 'Halfway through. Side income unlocked.',
    body: `You land a part-time gig as a junior ${occupation.title.toLowerCase()} earning ${fmtR(partTimeSalary)}/month. Textbooks: covered. Stress: still very present.`,
    category: 'tertiary',
  });

  // 6. Graduation
  addCard({
    year: tertEnd,
    icon: 'trophy',
    headline: `You graduate. Uyimpumelelo!`,
    body: `You hold a ${qualLabel(qual, occupation)} in ${occupation.career_fields[0] ?? 'your field'}. Congratulations. The journey from Grade ${grade} to this moment took everything you had.`,
    category: 'career',
  });

  // 7. First job
  const internYear = tertEnd + 1;
  addCard({
    year: internYear,
    icon: 'briefcase',
    headline: `First job. ${company.name} calls.`,
    body: `You start as a ${occupation.title} at ${company.name} in ${company.hq}. Earning ${fmtR(occupation.salary_min)}/month. First day nerves — completely normal.`,
    category: 'career',
  });

  // 8. 2 years into career
  const earlyCareerYear = internYear + 2;
  const earlyCareerSalary = Math.round(occupation.salary_mid * 0.7);
  addCard({
    year: earlyCareerYear,
    icon: 'trending',
    headline: 'Promotion. Salary jumps.',
    body: `Two years in and your manager notices. You get promoted. ${fmtR(earlyCareerSalary)}/month hits your account. You move into your own place in ${city}. December braai: on you.`,
    category: 'career',
  });

  // 9. Dream item
  const dreamYear = earlyCareerYear + Math.floor(2 + (seed % 3));
  const dreamYearsSaving = dreamYear - internYear;
  addCard({
    year: dreamYear,
    icon: 'star',
    headline: `You buy ${dreamItem}.`,
    body: `${dreamYearsSaving} years of saving, smart choices, and saying no to impulse buys. Today, you say yes. Worth every single cent.`,
    category: 'personal',
  });

  // 10. Senior role
  const seniorYear = internYear + 5;
  addCard({
    year: seniorYear,
    icon: 'briefcase',
    headline: `Senior ${occupation.title}. Respect.`,
    body: `Earning ${fmtR(occupation.salary_mid)}/month. Your colleagues call you by your last name. You know things now that you could not even Google five years ago.`,
    category: 'career',
  });

  // 11. Marriage
  const marriageYear = tertEnd + Math.floor(6 + (seed % 3));
  addCard({
    year: marriageYear,
    icon: 'heart',
    headline: 'You get married. Life is good.',
    body: `The lobola negotiations go smoothly. The venue is perfect. The speech: short and hilarious. You made it, in every sense of the word.`,
    category: 'personal',
  });

  // ─ Random events ─
  const positiveEvents: Array<{ headline: string; body: string; icon: string; category: TimelineCard['category'] }> = [
    {
      headline: 'Bursary. Stress reduced.',
      body: `You win a bursary worth ${fmtR(Math.round(occupation.salary_min * 1.5))}. That is ${Math.ceil(occupation.salary_min * 1.5 / 4000)} months of rent, sorted.`,
      icon: 'award', category: 'positive',
    },
    {
      headline: 'Published. Your name in print.',
      body: `A professor recommends you for a research project. It gets published in a journal. You screenshot it and send it to the family WhatsApp group.`,
      icon: 'star', category: 'positive',
    },
    {
      headline: 'Business partner found.',
      body: `You make a friend at varsity who shares your vision exactly. A decade later, you run something together. It starts as a late-night conversation over Indomie.`,
      icon: 'users', category: 'positive',
    },
    {
      headline: 'First passport stamp.',
      body: `A work conference takes you overseas for the first time. You take a photo of your passport stamp and stare at it for five minutes on the flight home.`,
      icon: 'globe', category: 'positive',
    },
    {
      headline: 'Local newspaper feature.',
      body: `A journalist writes about young professionals doing big things. Your name is in the headline. Your aunts share it in every WhatsApp group they are in.`,
      icon: 'star', category: 'positive',
    },
    {
      headline: 'Mentor changes everything.',
      body: `Someone senior sees potential in you and opens their network. One introduction leads to an opportunity you could not have found on LinkedIn.`,
      icon: 'users', category: 'positive',
    },
    {
      headline: 'Side hustle: extra income.',
      body: `You freelance on weekends. This month you make ${fmtR(occupation.salary_min * 0.4)} extra on top of your salary. Not bad for four Saturdays' work.`,
      icon: 'trending', category: 'positive',
    },
    {
      headline: 'Headhunted. You negotiate.',
      body: `A bigger company reaches out. You play it cool, negotiate hard, and land a ${fmtR(Math.round(occupation.salary_min * 0.15))} raise before you even pack your desk.`,
      icon: 'briefcase', category: 'positive',
    },
  ];

  const challengeEvents: Array<{ headline: string; body: string; icon: string; category: TimelineCard['category'] }> = [
    {
      headline: 'June almost breaks you.',
      body: `First year is harder than expected. You almost quit in June. You push through. Years later, this is the story you tell at every dinner party.`,
      icon: 'zap', category: 'challenge',
    },
    {
      headline: 'Failed module. Then: distinction.',
      body: `You fail one module. You redo it. You pass with distinction the second time. Failure was just the warm-up.`,
      icon: 'book', category: 'challenge',
    },
    {
      headline: 'Tough boss. Better you.',
      body: `Your first boss is difficult in ways you did not prepare for. You learn more from them than anyone else. You never manage people the way they managed you.`,
      icon: 'briefcase', category: 'challenge',
    },
    {
      headline: 'Load shedding kills your laptop.',
      body: `You submit your assignment late because Eskom had other plans. Your lecturer gives you a pass. You buy a UPS the next day.`,
      icon: 'zap', category: 'challenge',
    },
  ];

  const wildcardEvents: Array<{ headline: string; body: string; icon: string; category: TimelineCard['category'] }> = [
    {
      headline: 'You go viral.',
      body: `A post about your work in ${occupation.career_fields[0] ?? 'your field'} blows up online. You gain thousands of followers overnight. The comments are mostly nice.`,
      icon: 'star', category: 'wildcard',
    },
    {
      headline: 'You speak at your old school.',
      body: `You go back to your Grade 10 classroom and talk to the current Grade 10s. One of them looks exactly like you did: terrified and curious at the same time.`,
      icon: 'users', category: 'wildcard',
    },
    {
      headline: 'Government scholarship. Abroad.',
      body: `You are selected for a government scholarship to study abroad for one year. You pack light, land heavy. A changed person comes home.`,
      icon: 'globe', category: 'wildcard',
    },
    {
      headline: 'Startup equity offer.',
      body: `A startup offers you shares instead of just salary. You think about it for a week. You take it. It either pays off big or makes a great story.`,
      icon: 'trending', category: 'wildcard',
    },
  ];

  // Pick events based on average
  const isHighAchiever = avg >= 65;
  const positiveCount = isHighAchiever ? 3 : 2;
  const challengeCount = isHighAchiever ? 1 : 2;

  const chosenPositive = pickRandomMultiple(positiveEvents, positiveCount, seed + 10);
  const chosenChallenge = pickRandomMultiple(challengeEvents, challengeCount, seed + 20);
  const chosenWild = pickRandom(wildcardEvents, seed + 30);

  // Distribute random events across the timeline
  const allRandom = [...chosenPositive, ...chosenChallenge, chosenWild];
  const span = marriageYear - year;
  allRandom.forEach((evt, i) => {
    const offsetYear = year + Math.round((span * (i + 1)) / (allRandom.length + 1));
    addCard({ year: offsetYear, ...evt });
  });

  return cards.sort((a, b) => a.year - b.year);
}

// ─── Occupation picker ────────────────────────────────────────────────────────

function pickOccupation(subjects: SubjectEntry[], vibe: Vibe, occupations: Occupation[], seed: number): Occupation {
  const fieldWeights: Record<string, number> = {};
  for (const { subject, mark } of subjects) {
    if (!subject || typeof mark !== 'number') continue;
    const fields = SUBJECT_TO_CAREER[subject] ?? [];
    const w = mark >= 80 ? 3 : mark >= 60 ? 2 : mark >= 50 ? 1 : 0;
    for (const f of fields) fieldWeights[f] = (fieldWeights[f] ?? 0) + w;
  }

  // Apply vibe boost
  for (const f of VIBE_BOOSTS[vibe]) {
    fieldWeights[f] = (fieldWeights[f] ?? 0) + 2;
  }

  const topFields = Object.entries(fieldWeights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([f]) => f);

  const matched = occupations.filter((o) =>
    o.career_fields.some((f) => topFields.includes(f)),
  );

  if (!matched.length) return occupations[seed % occupations.length];

  // Shuffle among top matches
  const shuffled = pickRandomMultiple(matched, Math.min(matched.length, 6), seed);
  return shuffled[0];
}

function pickCompany(occupation: Occupation, province: string, companies: Company[], seed: number): Company {
  const matches = companies.filter(
    (c) =>
      c.career_fields.some((f) => occupation.career_fields.includes(f)) &&
      (c.provinces_operating.includes(province) || c.provinces_operating.length === 0),
  );
  if (!matches.length) return companies[seed % companies.length];
  const shuffled = pickRandomMultiple(matches, Math.min(matches.length, 5), seed);
  return shuffled[0];
}

// ─── Step components ──────────────────────────────────────────────────────────

function QuestionShell({ step, total, children, onBack }: {
  step: number; total: number; children: React.ReactNode; onBack?: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-slate-400 hover:text-slate-700">
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-sky-600">
              Question {step} of {total}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-gold transition-all duration-500"
              style={{ width: `${(step / total) * 100}%` }}
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function OptionButton({ label, selected, onClick, children }: {
  label?: string; selected?: boolean; onClick: () => void; children?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border px-5 py-3.5 text-left text-sm font-semibold transition-all hover:shadow-card ${
        selected
          ? 'border-brand-gold bg-amber-50 text-brand-gold-dark'
          : 'border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50'
      }`}
    >
      {children ?? label}
    </button>
  );
}

// ─── Subject input row ────────────────────────────────────────────────────────

function SubjectRow({ entry, index, onChange, onRemove }: {
  entry: SubjectEntry;
  index: number;
  onChange: (i: number, field: keyof SubjectEntry, value: string | number) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="flex gap-2">
      <select
        value={entry.subject}
        onChange={(e) => onChange(index, 'subject', e.target.value)}
        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none"
      >
        <option value="">Select subject</option>
        {NSC_SUBJECTS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <input
        type="number"
        min={0}
        max={100}
        placeholder="%"
        value={entry.mark === '' ? '' : entry.mark}
        onChange={(e) => {
          const v = e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value)));
          onChange(index, 'mark', v as number | '');
        }}
        className="w-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-sm font-bold text-slate-900 focus:border-sky-400 focus:outline-none"
      />
      <button
        onClick={() => onRemove(index)}
        className="rounded-lg px-2 py-2 text-slate-300 transition hover:text-red-500"
      >
        ×
      </button>
    </div>
  );
}

// ─── Timeline card ────────────────────────────────────────────────────────────

function TimelineCardComp({ card, index, isLeft }: { card: TimelineCard; index: number; isLeft: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const colors = CARD_COLORS[card.category];
  const Icon = ICON_MAP[card.icon] ?? Star;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative flex w-full gap-4 transition-all duration-700 md:w-[46%] ${
        isLeft ? 'md:self-start' : 'md:self-end'
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transitionDelay: `${Math.min(index * 60, 300)}ms`,
      }}
    >
      <div
        className="relative flex-1 overflow-hidden rounded-2xl border p-5 shadow-card"
        style={{ background: colors.bg, borderColor: colors.border }}
      >
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: `${colors.accent}20` }}>
            <Icon className="h-4 w-4" style={{ color: colors.accent }} />
          </div>
          <span className="text-2xl font-black tracking-tight" style={{ color: colors.accent }}>{card.year}</span>
        </div>
        <p className="mb-1.5 text-sm font-bold leading-tight" style={{ color: colors.text }}>{card.headline}</p>
        <p className="text-xs leading-relaxed text-slate-500">{card.body}</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Step = 'grade' | 'year' | 'age' | 'province' | 'vibe' | 'subjects' | 'dream' | 'loading' | 'result';

export function FutureTimelineClient() {
  const [step, setStep] = useState<Step>('grade');
  const [grade, setGrade] = useState<number | null>(null);
  const [year, setYear] = useState<number>(2025);
  const [age, setAge] = useState<number | ''>('');
  const [province, setProvince] = useState('');
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [subjects, setSubjects] = useState<SubjectEntry[]>([
    { subject: '', mark: '' },
    { subject: '', mark: '' },
    { subject: '', mark: '' },
    { subject: '', mark: '' },
  ]);
  const [dreamItem, setDreamItem] = useState('');
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [timeline, setTimeline] = useState<TimelineCard[] | null>(null);
  const [occupation, setOccupation] = useState<Occupation | null>(null);
  const [seed, setSeed] = useState(1);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Load JSON data client-side once
  useEffect(() => {
    Promise.all([
      fetch('/sa_occupations_salaries.json').then((r) => r.json()),
      fetch('/sa_companies_employers.json').then((r) => r.json()),
    ]).then(([occData, compData]) => {
      setOccupations(occData.occupations ?? []);
      setCompanies(compData.companies ?? []);
    });
  }, []);

  const validSubjects = subjects.filter((s) => s.subject && typeof s.mark === 'number' && (s.mark as number) > 0);

  // Snapshot of inputs captured when loading begins — stable refs, no dependency churn
  const snapshotRef = useRef<{
    grade: number; year: number; age: number; province: string; vibe: Vibe;
    subjects: SubjectEntry[]; dreamItem: string;
  } | null>(null);

  function runGenerationFromSnapshot(newSeed: number, snap: typeof snapshotRef.current) {
    if (!snap || !occupations.length || !companies.length) return;
    const occ = pickOccupation(snap.subjects, snap.vibe, occupations, newSeed);
    const comp = pickCompany(occ, snap.province, companies, newSeed);
    setOccupation(occ);
    const tl = generateTimeline({
      grade: snap.grade, year: snap.year, age: snap.age,
      province: snap.province, vibe: snap.vibe, subjects: snap.subjects,
      dreamItem: snap.dreamItem, occupation: occ, company: comp, seed: newSeed,
    });
    setTimeline(tl);
  }

  // Loading animation — runs once when step becomes 'loading', stable deps via ref
  const loadingStarted = useRef(false);
  useEffect(() => {
    if (step !== 'loading') { loadingStarted.current = false; return; }
    if (loadingStarted.current) return;
    loadingStarted.current = true;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i < LOADING_MESSAGES.length) {
        setLoadingMsg(i);
      } else {
        clearInterval(iv);
        const newSeed = Math.floor(Math.random() * 10000);
        setSeed(newSeed);
        runGenerationFromSnapshot(newSeed, snapshotRef.current);
        setStep('result');
      }
    }, 900);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function updateSubject(i: number, field: keyof SubjectEntry, value: string | number | '') {
    setSubjects((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  function addSubject() {
    setSubjects((prev) => [...prev, { subject: '', mark: '' }]);
  }

  function removeSubject(i: number) {
    setSubjects((prev) => prev.filter((_, idx) => idx !== i));
  }

  function regenerate() {
    const newSeed = Math.floor(Math.random() * 10000);
    setSeed(newSeed);
    runGenerationFromSnapshot(newSeed, snapshotRef.current);
  }

  function whatIfHarder() {
    const snap = snapshotRef.current;
    if (!snap) return;
    const boosted = snap.subjects.map((s) => ({
      ...s,
      mark: Math.min(100, (s.mark as number) + 15),
    }));
    const newSeed = seed + 99;
    runGenerationFromSnapshot(newSeed, { ...snap, subjects: boosted });
  }

  function goBack() {
    const steps: Step[] = ['grade', 'year', 'age', 'province', 'vibe', 'subjects', 'dream'];
    const idx = steps.indexOf(step as Step);
    if (idx > 0) setStep(steps[idx - 1]);
  }

  // ─ Render steps ─

  if (step === 'grade') {
    return (
      <QuestionShell step={1} total={7}>
        <h2 className="mb-2 text-2xl font-black text-slate-900">What grade are you currently in?</h2>
        <p className="mb-8 text-sm text-slate-500">We will use this to build your timeline from today.</p>
        <div className="flex flex-col gap-3">
          {[8, 9, 10, 11, 12].map((g) => (
            <OptionButton key={g} selected={grade === g} onClick={() => { setGrade(g); setTimeout(() => setStep('year'), 200); }}>
              Grade {g}
            </OptionButton>
          ))}
        </div>
      </QuestionShell>
    );
  }

  if (step === 'year') {
    return (
      <QuestionShell step={2} total={7} onBack={goBack}>
        <h2 className="mb-2 text-2xl font-black text-slate-900">What year is it right now?</h2>
        <p className="mb-8 text-sm text-slate-500">Pre-filled with the current year. Edit if needed.</p>
        <input
          type="number"
          value={year}
          min={2020}
          max={2035}
          onChange={(e) => setYear(Number(e.target.value))}
          className="mb-6 w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-2xl font-black text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
        <button
          onClick={() => setStep('age')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold py-4 text-sm font-bold text-slate-900 transition hover:bg-brand-gold-light"
        >
          Continue <ChevronRight className="h-4 w-4" />
        </button>
      </QuestionShell>
    );
  }

  if (step === 'age') {
    return (
      <QuestionShell step={3} total={7} onBack={goBack}>
        <h2 className="mb-2 text-2xl font-black text-slate-900">How old are you?</h2>
        <p className="mb-8 text-sm text-slate-500">Just your age. No data stored, no account needed.</p>
        <input
          type="number"
          min={13}
          max={20}
          value={age}
          placeholder="e.g. 16"
          onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
          className="mb-6 w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-2xl font-black text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
        <button
          disabled={age === '' || (age as number) < 13 || (age as number) > 20}
          onClick={() => setStep('province')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold py-4 text-sm font-bold text-slate-900 transition hover:bg-brand-gold-light disabled:opacity-40"
        >
          Continue <ChevronRight className="h-4 w-4" />
        </button>
      </QuestionShell>
    );
  }

  if (step === 'province') {
    return (
      <QuestionShell step={4} total={7} onBack={goBack}>
        <h2 className="mb-2 text-2xl font-black text-slate-900">What province are you in?</h2>
        <p className="mb-8 text-sm text-slate-500">We will mention real cities in your timeline.</p>
        <div className="flex flex-col gap-3">
          {SA_PROVINCES.map((p) => (
            <OptionButton key={p} selected={province === p} onClick={() => { setProvince(p); setTimeout(() => setStep('vibe'), 200); }}>
              {p}
            </OptionButton>
          ))}
        </div>
      </QuestionShell>
    );
  }

  if (step === 'vibe') {
    return (
      <QuestionShell step={5} total={7} onBack={goBack}>
        <h2 className="mb-2 text-2xl font-black text-slate-900">Pick a vibe for your future.</h2>
        <p className="mb-8 text-sm text-slate-500">This shapes which career direction we lean into.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(Object.keys(VIBE_LABELS) as Vibe[]).map((v) => {
            const info = VIBE_LABELS[v];
            const selected = vibe === v;
            return (
              <button
                key={v}
                onClick={() => { setVibe(v); setTimeout(() => setStep('subjects'), 200); }}
                className={`rounded-2xl border-2 p-5 text-left transition-all hover:shadow-card ${
                  selected ? 'shadow-card' : 'border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50'
                }`}
                style={selected ? { borderColor: info.color, background: `${info.color}12` } : {}}
              >
                <div className="mb-2 text-3xl">{info.emoji}</div>
                <p className="mb-1 text-sm font-bold text-slate-900">{info.title}</p>
                <p className="text-xs leading-relaxed text-slate-500">{info.desc}</p>
              </button>
            );
          })}
        </div>
      </QuestionShell>
    );
  }

  if (step === 'subjects') {
    return (
      <QuestionShell step={6} total={7} onBack={goBack}>
        <h2 className="mb-2 text-2xl font-black text-slate-900">Enter your subjects and marks.</h2>
        <p className="mb-6 text-sm text-slate-500">
          Add at least 4 subjects. Use your latest school report or predicted marks.
        </p>
        <div className="mb-4 flex flex-col gap-2">
          {subjects.map((s, i) => (
            <SubjectRow key={i} entry={s} index={i} onChange={updateSubject} onRemove={removeSubject} />
          ))}
        </div>
        <button
          onClick={addSubject}
          className="mb-6 text-sm font-semibold text-sky-600 transition hover:text-sky-800"
        >
          + Add another subject
        </button>
        <button
          disabled={validSubjects.length < 4}
          onClick={() => setStep('dream')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold py-4 text-sm font-bold text-slate-900 transition hover:bg-brand-gold-light disabled:opacity-40"
        >
          {validSubjects.length < 4 ? `${validSubjects.length}/4 subjects entered` : 'Continue'} <ChevronRight className="h-4 w-4" />
        </button>
      </QuestionShell>
    );
  }

  if (step === 'dream') {
    return (
      <QuestionShell step={7} total={7} onBack={goBack}>
        <h2 className="mb-2 text-2xl font-black text-slate-900">What is one thing you dream of owning one day?</h2>
        <p className="mb-8 text-sm text-slate-500">
          A BMW. Your own house. A farm. A horse. Anything. We will put it in your timeline.
        </p>
        <input
          type="text"
          maxLength={60}
          placeholder="e.g. a BMW M3, my own house, a farm..."
          value={dreamItem}
          onChange={(e) => setDreamItem(e.target.value)}
          className="mb-6 w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-slate-900 placeholder-slate-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
        <button
          disabled={!dreamItem.trim() || !grade || !province || !vibe}
          onClick={() => {
            snapshotRef.current = {
              grade: grade!, year, age: typeof age === 'number' ? age : 17,
              province, vibe: vibe!, subjects: validSubjects, dreamItem: dreamItem.trim(),
            };
            setStep('loading');
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold py-4 text-sm font-bold text-slate-900 transition hover:bg-brand-gold-light disabled:opacity-40"
        >
          Build my future <ChevronRight className="h-4 w-4" />
        </button>
      </QuestionShell>
    );
  }

  if (step === 'loading') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Loader2 className="mb-6 h-10 w-10 animate-spin text-sky-500" />
        <p className="text-xl font-black text-slate-900" key={loadingMsg}>
          {LOADING_MESSAGES[loadingMsg]}
        </p>
        <p className="mt-3 text-sm text-slate-400">
          Building your personalised timeline...
        </p>
      </div>
    );
  }

  if (step === 'result' && timeline && occupation) {
    const avg = weightedAvg(validSubjects);

    return (
      <div className="pb-20">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          {/* Hero summary card */}
          <div className="mb-10 overflow-hidden rounded-3xl border-2 border-brand-gold bg-sky-700 p-8 text-center shadow-glow-sky">
            <div className="h-1 w-16 mx-auto mb-4 rounded-full bg-brand-gold" />
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-light">
              {province} Edition
            </p>
            <h2 className="mb-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Your Future
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/60">
              Based on your subjects and marks, here is one version of your story. The rest is up to you.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-full bg-white/10 px-4 py-2 text-xs text-white/70">
                Career: <span className="font-bold text-white">{occupation.title}</span>
              </div>
              <div className="rounded-full bg-white/10 px-4 py-2 text-xs text-white/70">
                Senior salary: <span className="font-bold text-brand-gold">{fmtR(occupation.salary_mid)}/mo</span>
              </div>
              <div className="rounded-full bg-white/10 px-4 py-2 text-xs text-white/70">
                Avg mark: <span className="font-bold text-white">{Math.round(avg)}%</span>
              </div>
            </div>
          </div>

          {/* Timeline — desktop alternating, mobile single column */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-200" />
              <div className="flex flex-col gap-6">
                {timeline.map((card, i) => (
                  <div key={i} className={`flex gap-6 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <TimelineCardComp card={card} index={i} isLeft={i % 2 === 0} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 md:hidden">
            {timeline.map((card, i) => (
              <TimelineCardComp key={i} card={card} index={i} isLeft={true} />
            ))}
          </div>

          {/* End card */}
          <div className="mt-12 rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <p className="text-lg font-black text-emerald-800">This is just one path.</p>
            <p className="mt-2 text-sm leading-relaxed text-emerald-700/70">
              Every choice you make rewrites this timeline. Keep going.
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={regenerate}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-card transition hover:border-slate-300 hover:shadow-card-hover"
            >
              <RefreshCw className="h-4 w-4" /> Generate a new timeline
            </button>
            <button
              onClick={whatIfHarder}
              className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-6 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
            >
              <TrendingUp className="h-4 w-4" /> What if I studied harder?
            </button>
            <button
              onClick={() => {
                setTimeline(null);
                setOccupation(null);
                setStep('grade');
                setGrade(null);
                setVibe(null);
                setProvince('');
                setDreamItem('');
                setSubjects([
                  { subject: '', mark: '' }, { subject: '', mark: '' },
                  { subject: '', mark: '' }, { subject: '', mark: '' },
                ]);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-400 transition hover:text-slate-700"
            >
              Start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
