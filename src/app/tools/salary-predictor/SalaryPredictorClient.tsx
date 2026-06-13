'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import salaryData from '../../../../seed/final/claude/merged/sa_occupations_salaries.json';

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

type SubjectEntry = { subject: string; mark: number | '' };

// ─── Constants ───────────────────────────────────────────────────────────────

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
  'Afrikaans',
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
  'Physical Education',
];

const SUBJECT_TO_CAREER = salaryData.subject_to_career_map as Record<string, string[]>;
const OCCUPATIONS = salaryData.occupations as Occupation[];

const HIGH_DEMAND_FIELDS = ['IT', 'Engineering', 'Medical', 'Medicine', 'Science'];
const NSFAS_QUALIFICATIONS = ['Degree', 'Diploma', 'Certificate/Diploma', 'N6/Diploma'];

const SECTOR_DESCRIPTIONS: Record<string, string> = {
  'Information Technology': 'Builds and maintains software, systems, and digital infrastructure.',
  'Management': 'Leads teams and organisations to achieve business goals.',
  'Medicine & Social Care': 'Diagnoses, treats, and supports patients across health conditions.',
  'Engineering': 'Designs solutions to technical and physical world problems.',
  'Finance': 'Manages money, investments, and financial risk.',
  'Law & Legislation': 'Represents clients and advises on legal matters.',
  'Banking': 'Provides financial services, loans, and investment products.',
  'Construction & Real Estate': 'Designs and builds physical spaces and structures.',
  'Marketing, Advertising, PR': 'Promotes products and builds brand awareness.',
  'Education': 'Teaches and develops learners at all levels.',
};

function getDescription(occ: Occupation): string {
  return (
    SECTOR_DESCRIPTIONS[occ.sector] ??
    `Works in the ${occ.sector.toLowerCase()} field as a ${occ.title.toLowerCase()}.`
  );
}

// ─── Logic helpers ────────────────────────────────────────────────────────────

function getTier(mark: number): 'strong' | 'good' | 'adequate' | 'weak' {
  if (mark >= 80) return 'strong';
  if (mark >= 60) return 'good';
  if (mark >= 50) return 'adequate';
  return 'weak';
}

function getWeight(mark: number): number {
  const tier = getTier(mark);
  if (tier === 'strong') return 2;
  if (tier === 'good') return 1;
  if (tier === 'adequate') return 0.5;
  return 0;
}

/** Normalize a subject name to match keys in subject_to_career_map */
function normalizeSubject(sub: string): string {
  // Direct map for common aliases
  const aliases: Record<string, string> = {
    'English Home Language': 'English Home Language',
    'English First Additional Language': 'English First Additional Language',
    Afrikaans: 'Languages (isiXhosa, isiZulu, Sesotho etc.)',
    isiZulu: 'Languages (isiXhosa, isiZulu, Sesotho etc.)',
    isiXhosa: 'Languages (isiXhosa, isiZulu, Sesotho etc.)',
    Sesotho: 'Languages (isiXhosa, isiZulu, Sesotho etc.)',
  };
  return aliases[sub] ?? sub;
}

type CareerResult = {
  featured: Occupation;
  others: Occupation[];
  topFields: string[];
  weakestSubject: SubjectEntry | null;
};

function computeResults(subjects: SubjectEntry[]): CareerResult | null {
  const valid = subjects.filter((s) => s.subject && typeof s.mark === 'number' && s.mark >= 50);
  if (valid.length < 3) return null;

  // Weight career fields
  const fieldWeights: Record<string, number> = {};
  for (const { subject, mark } of valid) {
    const key = normalizeSubject(subject);
    const fields = SUBJECT_TO_CAREER[key] ?? [];
    const w = getWeight(mark as number);
    for (const f of fields) {
      fieldWeights[f] = (fieldWeights[f] ?? 0) + w;
    }
  }

  const topFields = Object.entries(fieldWeights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([f]) => f);

  if (!topFields.length) return null;

  const matched = OCCUPATIONS.filter((o) =>
    o.career_fields.some((f) => topFields.includes(f)),
  ).sort((a, b) => b.salary_mid - a.salary_mid);

  if (!matched.length) return null;

  // Find weakest subject (lowest mark among those >= 50)
  const eligible = subjects.filter((s) => s.subject && typeof s.mark === 'number' && (s.mark as number) >= 50);
  const weakest = eligible.reduce((w, s) => ((s.mark as number) < (w.mark as number) ? s : w), eligible[0]);

  return {
    featured: matched[0],
    others: matched.slice(1, 5),
    topFields,
    weakestSubject: weakest ?? null,
  };
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const fromRef = useRef<number>(0);

  useEffect(() => {
    if (!active) { setValue(0); return; }
    fromRef.current = 0;
    startRef.current = 0;
    const duration = 1400;

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(fromRef.current + (target - fromRef.current) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, active]);

  return value;
}

// ─── Formatting ───────────────────────────────────────────────────────────────

function fmtR(n: number) {
  return `R${n.toLocaleString('en-ZA')}`;
}

function fmtQual(q: string) {
  if (q.startsWith('B') || q === 'Degree' || q.includes('Degree')) return 'Degree';
  if (q.includes('Diploma') && q.includes('Certificate')) return 'Certificate or Diploma';
  if (q.includes('Diploma')) return 'Diploma';
  if (q.includes('Certificate')) return 'Certificate';
  if (q.includes('Masters') || q.includes('PhD')) return 'Postgraduate Degree';
  return q;
}

function isNsfas(q: string) {
  return NSFAS_QUALIFICATIONS.some((nq) => q.includes(nq));
}

function isHighDemand(occ: Occupation) {
  return occ.career_fields.some((f) => HIGH_DEMAND_FIELDS.includes(f));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function QualBadge({ qual }: { qual: string }) {
  const label = fmtQual(qual);
  const nsfas = isNsfas(qual);
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
      {nsfas && <span>📚</span>}
      {label}
      {nsfas && <span className="ml-1 opacity-70">NSFAS eligible</span>}
    </span>
  );
}

function OccCard({
  occ,
  onClick,
  expanded,
}: {
  occ: Occupation;
  onClick: () => void;
  expanded: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border text-left transition-all duration-200 hover:scale-[1.01] hover:shadow-card-hover ${
        expanded ? 'border-brand-gold bg-amber-50' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-slate-900">{occ.title}</p>
            <p className="mt-0.5 text-sm text-slate-500">{occ.sector}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-extrabold text-brand-gold-dark">~{fmtR(occ.salary_mid)}/mo</p>
            <p className="text-xs text-slate-400">{fmtQual(occ.qualification)}</p>
          </div>
        </div>

        {isHighDemand(occ) && (
          <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            🔥 High demand in SA
          </span>
        )}

        {expanded && (
          <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
            <p className="text-sm text-slate-600">{getDescription(occ)}</p>
            <p className="text-sm font-medium text-slate-500">
              Range: {fmtR(occ.salary_min)} to {fmtR(occ.salary_max)} per month
            </p>
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SalaryPredictorClient() {
  const [subjects, setSubjects] = useState<SubjectEntry[]>([
    { subject: 'Mathematics', mark: '' },
    { subject: 'English Home Language', mark: '' },
    { subject: '', mark: '' },
  ]);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [shuffledIndex, setShuffledIndex] = useState(0);
  const [improveValue, setImproveValue] = useState<number | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);

  // ── computed
  const results = useMemo(() => computeResults(subjects), [subjects]);

  // When results change, reset shuffle state
  useEffect(() => { setShuffledIndex(0); setShuffleKey((k) => k + 1); }, [results?.featured.title]);

  // The currently displayed featured occupation
  const allMatched = useMemo(() => {
    if (!results) return [];
    return [results.featured, ...results.others];
  }, [results]);

  const featuredOcc = allMatched[shuffledIndex] ?? results?.featured;

  // "What if I improve?" — recalculate with boosted weakest mark
  const improvedResults = useMemo(() => {
    if (!results?.weakestSubject || improveValue === null) return null;
    const boosted = subjects.map((s) =>
      s.subject === results.weakestSubject!.subject ? { ...s, mark: improveValue } : s,
    );
    return computeResults(boosted);
  }, [subjects, results, improveValue]);

  const improvedFeatured = improvedResults?.featured;

  // Counter targets
  const counterTarget = featuredOcc?.salary_mid ?? 0;
  const counterValue = useCountUp(counterTarget, !!featuredOcc);

  // ── handlers
  const setSubjectField = (i: number, subject: string) => {
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, subject } : s)));
  };

  const setMarkField = (i: number, raw: string) => {
    const n = raw === '' ? '' : Math.min(100, Math.max(0, parseInt(raw) || 0));
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, mark: n } : s)));
  };

  const addRow = () => setSubjects((prev) => [...prev, { subject: '', mark: '' }]);
  const removeRow = (i: number) => {
    if (subjects.length > 3) setSubjects((prev) => prev.filter((_, idx) => idx !== i));
  };

  const shuffle = useCallback(() => {
    if (!allMatched.length) return;
    const next = (shuffledIndex + 1) % allMatched.length;
    setShuffledIndex(next);
    setShuffleKey((k) => k + 1);
  }, [allMatched, shuffledIndex]);

  const handleShare = () => {
    if (!featuredOcc) return;
    const text = `I could earn ${fmtR(featuredOcc.salary_mid)}/month as a ${featuredOcc.title} — check your own career potential at Fundibot!`;
    if (navigator.share) {
      navigator.share({ title: 'What Could You Earn?', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  // Nudge: no English subject entered
  const hasEnglish = subjects.some(
    (s) =>
      s.subject === 'English Home Language' ||
      s.subject === 'English First Additional Language',
  );

  const validCount = subjects.filter(
    (s) => s.subject && typeof s.mark === 'number' && (s.mark as number) >= 50,
  ).length;

  const weakestMark = results?.weakestSubject?.mark as number | undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* ── Subject input ─────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        <h2 className="text-lg font-bold text-slate-900">Your subjects and marks</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter at least 3 subjects with 50% or more to unlock your results.
        </p>

        <div className="mt-5 space-y-3">
          {subjects.map((row, i) => {
            const tier = typeof row.mark === 'number' && row.mark > 0 ? getTier(row.mark) : null;
            const tierClasses: Record<string, string> = {
              strong: 'text-emerald-600',
              good: 'text-brand-gold-dark',
              adequate: 'text-orange-500',
              weak: 'text-red-500',
            };
            const tierBorder: Record<string, string> = {
              strong: 'border-emerald-300',
              good: 'border-amber-300',
              adequate: 'border-orange-300',
              weak: 'border-red-300',
            };
            const tierLabels: Record<string, string> = {
              strong: 'Strong',
              good: 'Good',
              adequate: 'Adequate',
              weak: 'Weak',
            };

            return (
              <div key={i} className="flex items-center gap-2 sm:gap-3">
                <select
                  value={row.subject}
                  onChange={(e) => setSubjectField(i, e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">Select subject...</option>
                  {NSC_SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={row.mark}
                  onChange={(e) => setMarkField(i, e.target.value)}
                  placeholder="%"
                  className={`w-20 shrink-0 rounded-xl border px-2 py-2.5 text-center text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-100 ${tier ? tierBorder[tier] : 'border-slate-200'}`}
                />

                <div className={`w-16 shrink-0 text-center text-xs font-semibold ${tier ? tierClasses[tier] : 'text-slate-300'}`}>
                  {tier ? tierLabels[tier] : '—'}
                </div>

                <button
                  onClick={() => removeRow(i)}
                  disabled={subjects.length <= 3}
                  className="rounded-lg px-2 py-2 text-sm text-red-400 transition-opacity disabled:opacity-20 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {!hasEnglish && (
          <p className="mt-3 text-xs font-medium text-amber-600">
            Tip: Add your English mark for a more accurate result.
          </p>
        )}

        <button
          onClick={addRow}
          className="mt-4 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
        >
          + Add another subject
        </button>

        {validCount > 0 && validCount < 3 && (
          <p className="mt-3 text-sm text-slate-400">
            Add {3 - validCount} more subject{3 - validCount !== 1 ? 's' : ''} with 50% or more to see results.
          </p>
        )}
      </div>

      {/* ── Results ──────────────────────────────────────────────── */}
      {results && featuredOcc && (
        <div className="mt-8 space-y-6">

          {/* Featured hero card */}
          <div
            key={shuffleKey}
            className="relative overflow-hidden rounded-3xl border-2 border-brand-gold bg-sky-700 shadow-glow-sky"
            style={{ animation: 'fadeIn 0.4s ease-out forwards' }}
          >
            <div className="h-1.5 w-full bg-brand-gold" />

            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-gold-light">
                Based on your subjects, you could become a...
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {featuredOcc.title}
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  {featuredOcc.sector}
                </span>
                <QualBadge qual={featuredOcc.qualification} />
                {isHighDemand(featuredOcc) && (
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                    🔥 High demand in SA
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                    You could be earning
                  </p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold tabular-nums text-brand-gold sm:text-6xl">
                      {fmtR(counterValue)}
                    </span>
                    <span className="text-lg font-medium text-white/50">/month</span>
                  </div>
                </div>

                <div className="sm:ml-auto">
                  <p className="text-xs text-white/40">Monthly range</p>
                  <p className="mt-0.5 text-sm font-semibold text-white">
                    {fmtR(featuredOcc.salary_min)} to {fmtR(featuredOcc.salary_max)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={shuffle}
                  className="flex items-center gap-2 rounded-xl border border-brand-gold/40 bg-brand-gold/15 px-4 py-2.5 text-sm font-semibold text-brand-gold-light transition-all hover:scale-105 active:scale-95"
                >
                  🔀 Shuffle careers
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
                >
                  🔗 Share my result
                </button>
              </div>

              {showShareToast && (
                <div className="mt-3 rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300">
                  Copied to clipboard!
                </div>
              )}
            </div>
          </div>

          {/* "Also consider" cards */}
          {results.others.length > 0 && (
            <div>
              <h3 className="mb-4 text-base font-bold text-slate-900">You could also consider these careers:</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {results.others.map((occ, i) => (
                  <OccCard
                    key={occ.title}
                    occ={occ}
                    expanded={expandedCard === i}
                    onClick={() => setExpandedCard((prev) => (prev === i ? null : i))}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Tap any card to expand the salary range and details.
              </p>
            </div>
          )}

          {/* What if I improve? */}
          {results.weakestSubject && weakestMark !== undefined && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
              <h3 className="text-base font-bold text-slate-900">What if I improve?</h3>
              <p className="mt-1 text-sm text-slate-500">
                Your weakest qualifying subject is{' '}
                <span className="font-semibold text-sky-600">{results.weakestSubject.subject}</span>{' '}
                at {weakestMark}%. Drag the slider to see how a higher mark changes your top match.
              </p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>{weakestMark}% (current)</span>
                  <span className="text-sky-600">{improveValue ?? weakestMark}%</span>
                  <span>100%</span>
                </div>
                <input
                  type="range"
                  min={weakestMark}
                  max={100}
                  value={improveValue ?? weakestMark}
                  onChange={(e) => setImproveValue(parseInt(e.target.value))}
                  className="mt-2 w-full cursor-pointer accent-sky-500"
                />
              </div>

              {improveValue !== null && improvedFeatured && (
                <div className="mt-4 rounded-2xl border-l-4 border-brand-gold bg-amber-50 p-4">
                  {improvedFeatured.title === results.featured.title ? (
                    <p className="text-sm font-medium text-slate-800">
                      Your top match stays{' '}
                      <span className="font-bold text-sky-600">{improvedFeatured.title}</span>, but your field strength increases.
                      Keep pushing.
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-slate-800">
                      With {improveValue}% in {results.weakestSubject.subject}, your top match becomes{' '}
                      <span className="font-bold text-sky-600">{improvedFeatured.title}</span> at{' '}
                      <span className="font-bold text-emerald-600">{fmtR(improvedFeatured.salary_mid)}/month</span>.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Career fields matched */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Your career fields:
            </span>
            {results.topFields.map((f) => (
              <span
                key={f}
                className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Disclaimer ────────────────────────────────────────────── */}
      <div className="mt-10 rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-400">
        Salary ranges sourced from Paylab.com SA salary survey data (2026). These are gross monthly estimates and
        vary by experience, location, and employer. Use as a guide only.
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
