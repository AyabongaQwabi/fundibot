'use client';

import { useState, useMemo, useCallback } from 'react';
import { ExternalLink, Info, ChevronDown, Search, X } from 'lucide-react';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';
import type { BursaryCategory } from './page';

const NAVY = '#091930';
const AMBER = '#ffd800';

const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape',
];

const STUDY_LEVELS = [
  { value: 'matric', label: 'Matric (Grade 12)' },
  { value: 'first_year', label: 'First Year' },
  { value: 'second_year', label: 'Second Year' },
  { value: 'third_year', label: 'Third Year' },
  { value: 'postgraduate', label: 'Postgraduate' },
];

const NSFAS_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unsure', label: 'Not sure' },
];

const PAGE_SIZE = 20;

/** "AUDITING BURSARIES FOR 2026" → "Auditing" */
function cleanSubcategoryName(raw: string): string {
  return raw
    .replace(/\s+BURSARIES?\s+FOR\s+\d{4}/i, '')
    .replace(/\s+SCHOLARSHIP[S]?\s+FOR\s+\d{4}/i, '')
    .trim()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

type FlatBursary = {
  name: string;
  url: string;
  category: string;
  subcategory: string;
  rawSubcategory: string;
};

function flattenCategories(categories: BursaryCategory[]): FlatBursary[] {
  const out: FlatBursary[] = [];
  for (const cat of categories) {
    for (const sub of cat.subcategories) {
      for (const b of sub.bursaries) {
        out.push({
          name: b.name,
          url: b.url,
          category: cat.category,
          subcategory: cleanSubcategoryName(sub.name),
          rawSubcategory: sub.name,
        });
      }
    }
  }
  return out;
}

const PROVINCE_KEYS: Record<string, string[]> = {
  'Eastern Cape': ['eastern cape'],
  'Free State': ['free state'],
  Gauteng: ['gauteng'],
  'KwaZulu-Natal': ['kwazulu-natal', 'kwazulu natal', 'kzn'],
  Limpopo: ['limpopo'],
  Mpumalanga: ['mpumalanga'],
  'North West': ['north west'],
  'Northern Cape': ['northern cape'],
  'Western Cape': ['western cape'],
};

export function BursaryFinderClient({ categories }: { categories: BursaryCategory[] }) {
  const allBursaries = useMemo(() => flattenCategories(categories), [categories]);
  const categoryNames = useMemo(() => categories.map((c) => c.category), [categories]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [studyLevel, setStudyLevel] = useState('');
  const [province, setProvince] = useState('');
  const [nsfas, setNsfas] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('');
  const [page, setPage] = useState(1);

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }, []);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    setActiveCategoryFilter('');
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setSelectedCategories([]);
    setStudyLevel('');
    setProvince('');
    setNsfas('');
    setActiveCategoryFilter('');
    setPage(1);
  }, []);

  const showNsfasNotice = nsfas === 'yes' || nsfas === 'unsure';
  const isFormValid = selectedCategories.length > 0 && studyLevel && nsfas;

  const matchedBursaries = useMemo(() => {
    if (!submitted) return [];

    let cats = selectedCategories.length > 0 ? selectedCategories : categoryNames;

    // Surface MBA & Postgraduate first for postgrad students
    if (studyLevel === 'postgraduate' && !cats.includes('MBA & Postgraduate')) {
      cats = ['MBA & Postgraduate', ...cats];
    } else if (studyLevel === 'postgraduate') {
      cats = ['MBA & Postgraduate', ...cats.filter((c) => c !== 'MBA & Postgraduate')];
    }

    const results: FlatBursary[] = [];

    for (const catName of cats) {
      const catBursaries = allBursaries.filter((b) => b.category === catName);

      if (catName === 'Government' && province) {
        const keys = PROVINCE_KEYS[province] ?? [];
        const matched = catBursaries.filter((b) =>
          keys.some((k) => b.rawSubcategory.toLowerCase().includes(k)),
        );
        const rest = catBursaries.filter(
          (b) => !keys.some((k) => b.rawSubcategory.toLowerCase().includes(k)),
        );
        results.push(...matched, ...rest);
      } else {
        results.push(...catBursaries);
      }
    }

    // Deduplicate
    const seen = new Set<string>();
    return results.filter((b) => {
      const key = b.url;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [submitted, selectedCategories, categoryNames, studyLevel, province, allBursaries]);

  const presentCategories = useMemo(
    () => [...new Set(matchedBursaries.map((b) => b.category))],
    [matchedBursaries],
  );

  const filteredBursaries = useMemo(
    () =>
      activeCategoryFilter
        ? matchedBursaries.filter((b) => b.category === activeCategoryFilter)
        : matchedBursaries,
    [matchedBursaries, activeCategoryFilter],
  );

  const visibleBursaries = filteredBursaries.slice(0, page * PAGE_SIZE);
  const hasMore = visibleBursaries.length < filteredBursaries.length;

  return (
    <div className='mx-auto max-w-5xl px-4 py-10 sm:px-6'>
      <ToolsBreadcrumb
        items={[{ label: 'Tools', href: '/tools' }, { label: 'Bursary & Funding Matcher' }]}
      />

      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-extrabold md:text-4xl' style={{ color: NAVY }}>
          Bursary &amp; Funding Matcher
        </h1>
        <p className='mt-2 text-base text-slate-500'>
          Answer four questions and we&apos;ll match you from{' '}
          <strong className='text-slate-700'>{allBursaries.length}</strong> South African bursaries.
        </p>
      </div>

      {/* ── STEP 1: FORM ── */}
      <div
        className='mb-8 rounded-2xl p-6 shadow-sm'
        style={{ background: '#fff', border: `1.5px solid #e2e8f0` }}
      >
        <h2 className='mb-5 text-base font-bold' style={{ color: NAVY }}>
          Step 1 — Tell us about yourself
        </h2>

        {/* Multi-select field chips */}
        <fieldset className='mb-5'>
          <legend className='mb-2 text-sm font-semibold text-slate-700'>
            Field of study{' '}
            <span className='font-normal text-slate-400'>(select all that apply)</span>
          </legend>
          <div className='flex flex-wrap gap-2'>
            {categoryNames.map((cat) => {
              const active = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type='button'
                  onClick={() => toggleCategory(cat)}
                  aria-pressed={active}
                  className='rounded-full border px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2'
                  style={
                    active
                      ? { background: NAVY, color: '#fff', borderColor: NAVY }
                      : { background: '#fff', color: '#334155', borderColor: '#cbd5e1' }
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className='grid gap-4 sm:grid-cols-3'>
          {/* Study level */}
          <div>
            <label
              htmlFor='study-level'
              className='mb-1.5 block text-sm font-semibold text-slate-700'
            >
              Current level of study
            </label>
            <div className='relative'>
              <select
                id='study-level'
                value={studyLevel}
                onChange={(e) => setStudyLevel(e.target.value)}
                className='w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400'
              >
                <option value=''>Select level…</option>
                {STUDY_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
              <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            </div>
          </div>

          {/* Province */}
          <div>
            <label
              htmlFor='province'
              className='mb-1.5 block text-sm font-semibold text-slate-700'
            >
              Province
            </label>
            <div className='relative'>
              <select
                id='province'
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className='w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400'
              >
                <option value=''>Select province…</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            </div>
          </div>

          {/* NSFAS */}
          <div>
            <label
              htmlFor='nsfas'
              className='mb-1.5 block text-sm font-semibold text-slate-700'
            >
              Household income under R350k/year?
            </label>
            <div className='relative'>
              <select
                id='nsfas'
                value={nsfas}
                onChange={(e) => setNsfas(e.target.value)}
                className='w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400'
              >
                <option value=''>Select…</option>
                {NSFAS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            </div>
          </div>
        </div>

        <div className='mt-6 flex items-center gap-3'>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className='inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40'
            style={{ background: NAVY, color: '#fff' }}
          >
            <Search className='h-4 w-4' />
            Find Bursaries
          </button>
          {submitted && (
            <button
              onClick={handleReset}
              className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-500 transition-all hover:border-slate-300 hover:text-slate-700'
            >
              <X className='h-3.5 w-3.5' />
              Start over
            </button>
          )}
        </div>
      </div>

      {/* ── STEP 2+: RESULTS ── */}
      {submitted && (
        <div className='space-y-6'>

          {/* NSFAS notice */}
          {showNsfasNotice && (
            <div
              className='flex gap-3 rounded-2xl p-5'
              style={{ background: `${AMBER}28`, border: `1.5px solid ${AMBER}` }}
            >
              <Info className='mt-0.5 h-5 w-5 shrink-0' style={{ color: NAVY }} />
              <div>
                <p className='text-sm font-bold' style={{ color: NAVY }}>
                  You may qualify for NSFAS funding
                </p>
                <p className='mt-1 text-sm text-slate-700'>
                  NSFAS covers tuition, accommodation, and a living allowance for eligible
                  students at public universities and TVET colleges.{' '}
                  <a
                    href='https://www.nsfas.org.za'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold underline decoration-1 underline-offset-2'
                    style={{ color: NAVY }}
                  >
                    Apply at nsfas.org.za
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Results count */}
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='flex items-baseline gap-2'>
              <span className='text-2xl font-extrabold' style={{ color: NAVY }}>
                {filteredBursaries.length}
              </span>
              <span className='text-sm text-slate-500'>
                {filteredBursaries.length === 1 ? 'bursary' : 'bursaries'} found
                {activeCategoryFilter ? ` in ${activeCategoryFilter}` : ''}
              </span>
            </div>
          </div>

          {/* Category filter chips */}
          {presentCategories.length > 1 && (
            <div className='flex flex-wrap gap-2'>
              <button
                onClick={() => {
                  setActiveCategoryFilter('');
                  setPage(1);
                }}
                className='rounded-full border px-3 py-1 text-xs font-semibold transition-all'
                style={
                  !activeCategoryFilter
                    ? { background: NAVY, color: '#fff', borderColor: NAVY }
                    : { background: '#fff', color: '#334155', borderColor: '#cbd5e1' }
                }
              >
                All
              </button>
              {presentCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategoryFilter(cat);
                    setPage(1);
                  }}
                  className='rounded-full border px-3 py-1 text-xs font-semibold transition-all'
                  style={
                    activeCategoryFilter === cat
                      ? { background: NAVY, color: '#fff', borderColor: NAVY }
                      : { background: '#fff', color: '#334155', borderColor: '#cbd5e1' }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Cards grid */}
          {visibleBursaries.length > 0 ? (
            <>
              <div className='grid gap-4 sm:grid-cols-2'>
                {visibleBursaries.map((b, i) => (
                  <BursaryCard key={`${b.url}-${i}`} bursary={b} />
                ))}
              </div>

              {hasMore && (
                <div className='pt-2 text-center'>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className='inline-flex items-center gap-2 rounded-full border px-8 py-3 text-sm font-semibold transition-all hover:shadow-sm'
                    style={{ borderColor: NAVY, color: NAVY, background: '#fff' }}
                  >
                    Load more
                    <span
                      className='rounded-full px-2 py-0.5 text-xs font-bold'
                      style={{ background: AMBER, color: NAVY }}
                    >
                      +{Math.min(PAGE_SIZE, filteredBursaries.length - visibleBursaries.length)}
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className='rounded-2xl border border-slate-100 bg-white p-10 text-center'>
              <p className='text-slate-500'>No bursaries found for the selected filters.</p>
            </div>
          )}

          {/* Disclaimer */}
          <p className='rounded-xl border border-slate-100 bg-white px-4 py-3 text-xs leading-relaxed text-slate-400'>
            Bursary data sourced from{' '}
            <a
              href='https://www.zabursaries.co.za'
              target='_blank'
              rel='noopener noreferrer'
              className='underline hover:text-slate-600'
            >
              zabursaries.co.za
            </a>
            . Always check the closing date on each bursary page before applying. Bursaries may
            open and close throughout the year.
          </p>
        </div>
      )}
    </div>
  );
}

function BursaryCard({ bursary }: { bursary: FlatBursary }) {
  return (
    <div
      className='flex flex-col rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md'
      style={{ border: '1.5px solid #e2e8f0' }}
    >
      {/* Chips */}
      <div className='mb-3 flex flex-wrap items-center gap-2'>
        <span
          className='rounded-full px-2.5 py-0.5 text-xs font-semibold'
          style={{ background: `${AMBER}44`, color: NAVY }}
        >
          {bursary.category}
        </span>
        <span className='text-xs text-slate-400'>{bursary.subcategory}</span>
      </div>

      {/* Name link */}
      <a
        href={bursary.url}
        target='_blank'
        rel='noopener noreferrer'
        className='mb-auto text-sm font-bold leading-snug hover:underline'
        style={{ color: NAVY }}
      >
        {bursary.name}
      </a>

      {/* CTA button */}
      <a
        href={bursary.url}
        target='_blank'
        rel='noopener noreferrer'
        className='mt-4 inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold transition-opacity hover:opacity-85'
        style={{ background: NAVY, color: '#fff' }}
      >
        Visit Bursary
        <ExternalLink className='h-3.5 w-3.5' />
      </a>
    </div>
  );
}
