'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, X, Info, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';
import { ALL_NSC_SUBJECTS } from '@/lib/tools/constants';
import { SUBJECT_CAREER_CLUSTERS, CAREER_TITLES } from '@/lib/tools/career-map';
import { getSessionMarks } from '@/lib/tools/session';

// Subject → career clusters
function getClustersForSubject(subject: string): string[] {
  const lower = subject.toLowerCase();
  for (const [key, clusters] of Object.entries(SUBJECT_CAREER_CLUSTERS)) {
    if (lower.includes(key)) return clusters;
  }
  return [];
}

// Subject value score: how many unique clusters it unlocks
function subjectScore(subject: string): number {
  return new Set(getClustersForSubject(subject)).size;
}

const ALL_CLUSTERS = [...new Set(Object.values(SUBJECT_CAREER_CLUSTERS).flat())].sort();

export function SubjectAdvisorClient() {
  const [current, setCurrent] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [scenario, setScenario] = useState<{ type: 'add' | 'drop'; subject: string } | null>(null);

  // Prefill from session
  useEffect(() => {
    const marks = getSessionMarks();
    if (marks.length > 0) {
      setCurrent(marks.map((m) => m.subject).filter(Boolean));
    }
  }, []);

  const suggestions = useMemo(() => {
    const lower = inputVal.toLowerCase();
    if (!lower) return ALL_NSC_SUBJECTS;
    return ALL_NSC_SUBJECTS.filter(
      (s) => s.toLowerCase().includes(lower) && !current.includes(s),
    );
  }, [inputVal, current]);

  const add = (subject: string) => {
    if (!current.includes(subject)) setCurrent((prev) => [...prev, subject]);
    setInputVal('');
  };

  const remove = (subject: string) => setCurrent((prev) => prev.filter((s) => s !== subject));

  // Current clusters
  const currentClusters = useMemo(
    () => new Set(current.flatMap(getClustersForSubject)),
    [current],
  );

  // Careers available now
  const currentCareers = useMemo(
    () => [...currentClusters].flatMap((c) => CAREER_TITLES[c] ?? []),
    [currentClusters],
  );

  // Scenario: what changes
  const scenarioClusters = useMemo(() => {
    if (!scenario) return null;
    const adjusted =
      scenario.type === 'add'
        ? [...current, scenario.subject]
        : current.filter((s) => s !== scenario.subject);
    return new Set(adjusted.flatMap(getClustersForSubject));
  }, [scenario, current]);

  const gained = useMemo(() => {
    if (!scenarioClusters) return [];
    return [...scenarioClusters].filter((c) => !currentClusters.has(c));
  }, [scenarioClusters, currentClusters]);

  const lost = useMemo(() => {
    if (!scenarioClusters) return [];
    return [...currentClusters].filter((c) => !scenarioClusters.has(c));
  }, [scenarioClusters, currentClusters]);

  // Subject value scores
  const subjectScores = useMemo(
    () =>
      ALL_NSC_SUBJECTS.map((s) => ({ subject: s, score: subjectScore(s) }))
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score),
    [],
  );

  return (
    <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6'>
      <ToolsBreadcrumb items={[{ label: 'Tools', href: '/tools' }, { label: 'Subject Combination Advisor' }]} />

      <div className='mb-8'>
        <h1 className='text-2xl font-extrabold text-slate-900 md:text-3xl'>Subject Combination Advisor</h1>
        <p className='mt-2 text-slate-500'>
          For Grade 10 & 11 students. See which careers and courses your subject combination unlocks — and what changes if you add or drop a subject.
        </p>
      </div>

      {/* Subject input */}
      <div className='mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
        <label className='mb-2 block text-sm font-semibold text-slate-700'>Your current subjects</label>
        <div className='relative'>
          <input
            type='text'
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder='Type to search subjects…'
            className='w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20'
          />
          {inputVal && suggestions.length > 0 && (
            <ul className='absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-card-hover'>
              {suggestions.slice(0, 10).map((s) => (
                <li key={s}>
                  <button
                    onClick={() => add(s)}
                    className='w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50'
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {current.length > 0 && (
          <div className='mt-4 flex flex-wrap gap-2'>
            {current.map((s) => (
              <span
                key={s}
                className='flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3 py-1 text-sm font-medium text-brand-blue'
              >
                {s}
                <button onClick={() => remove(s)} className='hover:text-brand-blue-dark'>
                  <X className='h-3 w-3' />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {current.length > 0 && (
        <div className='space-y-8'>
          {/* Current unlocked careers */}
          <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
            <h2 className='mb-4 text-base font-bold text-slate-900'>
              Careers & courses unlocked by your current combination
            </h2>
            <div className='mb-4 flex flex-wrap gap-2'>
              {[...currentClusters].map((c) => (
                <span key={c} className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>
                  {c}
                </span>
              ))}
            </div>
            <ul className='grid gap-1 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-3'>
              {currentCareers.slice(0, 30).map((career) => (
                <li key={career} className='flex items-center gap-1.5'>
                  <span className='h-1.5 w-1.5 rounded-full bg-brand-blue' />
                  {career}
                </li>
              ))}
            </ul>
            {currentClusters.size === 0 && (
              <p className='text-sm text-slate-400'>Add subjects from the list above to see careers unlocked.</p>
            )}
          </div>

          {/* Scenario tester */}
          <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
            <h2 className='mb-4 text-base font-bold text-slate-900'>Scenario: What if I add or drop a subject?</h2>
            <div className='flex flex-wrap gap-3'>
              <div>
                <label className='mb-1 block text-xs font-semibold text-slate-500'>Action</label>
                <select
                  value={scenario?.type ?? ''}
                  onChange={(e) =>
                    setScenario((prev) =>
                      prev ? { ...prev, type: e.target.value as 'add' | 'drop' } : { type: e.target.value as 'add' | 'drop', subject: '' },
                    )
                  }
                  className='rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-brand-blue focus:outline-none'
                >
                  <option value=''>Select…</option>
                  <option value='add'>Add a subject</option>
                  <option value='drop'>Drop a subject</option>
                </select>
              </div>

              {scenario?.type && (
                <div>
                  <label className='mb-1 block text-xs font-semibold text-slate-500'>Subject</label>
                  <select
                    value={scenario.subject}
                    onChange={(e) => setScenario((prev) => prev ? { ...prev, subject: e.target.value } : null)}
                    className='rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-brand-blue focus:outline-none'
                  >
                    <option value=''>Select subject…</option>
                    {(scenario.type === 'drop' ? current : ALL_NSC_SUBJECTS.filter((s) => !current.includes(s))).map(
                      (s) => <option key={s} value={s}>{s}</option>,
                    )}
                  </select>
                </div>
              )}
            </div>

            {scenario?.subject && scenarioClusters && (
              <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                {gained.length > 0 && (
                  <div className='rounded-xl bg-emerald-50 p-4'>
                    <div className='mb-2 flex items-center gap-2'>
                      <TrendingUp className='h-4 w-4 text-emerald-600' />
                      <span className='text-xs font-bold uppercase tracking-widest text-emerald-700'>
                        Careers you would gain
                      </span>
                    </div>
                    <ul className='space-y-1 text-sm text-emerald-800'>
                      {gained.flatMap((c) => CAREER_TITLES[c] ?? []).slice(0, 15).map((career) => (
                        <li key={career} className='flex items-center gap-1.5'>
                          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                          {career}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lost.length > 0 && (
                  <div className='rounded-xl bg-red-50 p-4'>
                    <div className='mb-2 flex items-center gap-2'>
                      <TrendingDown className='h-4 w-4 text-red-600' />
                      <span className='text-xs font-bold uppercase tracking-widest text-red-700'>
                        Careers you would lose
                      </span>
                    </div>
                    <ul className='space-y-1 text-sm text-red-800'>
                      {lost.flatMap((c) => CAREER_TITLES[c] ?? []).slice(0, 15).map((career) => (
                        <li key={career} className='flex items-center gap-1.5'>
                          <span className='h-1.5 w-1.5 rounded-full bg-red-400' />
                          {career}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {gained.length === 0 && lost.length === 0 && (
                  <p className='text-sm text-slate-500'>No change in accessible career fields for this subject.</p>
                )}
              </div>
            )}
          </div>

          {/* Subject value ranking */}
          <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
            <h2 className='mb-1 text-base font-bold text-slate-900'>Subject Value Score</h2>
            <p className='mb-4 text-xs text-slate-500'>
              Ranked by how many career fields each subject unlocks across the dataset.
            </p>
            <div className='space-y-2'>
              {subjectScores.slice(0, 15).map((s, i) => (
                <div key={s.subject} className='flex items-center gap-3'>
                  <span className='w-5 text-right text-xs font-semibold text-slate-400'>{i + 1}</span>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <span className={`text-sm font-medium ${current.includes(s.subject) ? 'text-brand-blue' : 'text-slate-700'}`}>
                        {s.subject}
                        {current.includes(s.subject) && (
                          <span className='ml-1.5 inline-flex items-center gap-0.5 text-xs text-brand-blue'>
                            <Star className='h-3 w-3' /> current
                          </span>
                        )}
                      </span>
                      <span className='text-xs text-slate-400'>{s.score} career fields</span>
                    </div>
                    <div className='mt-1 h-1.5 rounded-full bg-slate-100'>
                      <div
                        className='h-1.5 rounded-full bg-brand-blue'
                        style={{ width: `${(s.score / subjectScores[0].score) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className='flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500'>
            <Info className='mt-0.5 h-4 w-4 shrink-0' />
            <span>
              Career and course suggestions are based on scraped admission requirement data and may not be exhaustive.
              Always verify subject requirements with your school and target institution directly.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
