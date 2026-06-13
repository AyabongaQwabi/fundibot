'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';
import { InstitutionLogo } from '../components/InstitutionLogo';
import { ALL_NSC_SUBJECTS } from '@/lib/tools/constants';
import { calcAps, percentageToAps } from '@/lib/tools/aps';
import { topClusters, scoreClusters, CAREER_TITLES, CLUSTER_PROGRAMME_KEYWORDS } from '@/lib/tools/career-map';
import type { ToolInstitution, ToolProgramme } from '@/lib/tools/types';

type Props = {
  institutions: ToolInstitution[];
  programmes: ToolProgramme[];
};

type SubjectMark = { subject: string; percentage: number };

const MAX_PROGRAMMES_PER_INSTITUTION = 3;
const MAX_INSTITUTIONS = 8;

export function CareerRecommenderClient({ institutions, programmes }: Props) {
  const [subjects, setSubjects] = useState<SubjectMark[]>([
    { subject: 'Mathematics', percentage: 0 },
    { subject: 'Physical Sciences', percentage: 0 },
    { subject: 'English HL', percentage: 0 },
  ]);

  const handleSubjectChange = (index: number, subject: string) => {
    setSubjects((prev) => prev.map((s, i) => (i === index ? { ...s, subject } : s)));
  };

  const handlePercentageChange = (index: number, percentage: number) => {
    setSubjects((prev) =>
      prev.map((s, i) => (i === index ? { ...s, percentage: Math.min(100, Math.max(0, percentage)) } : s)),
    );
  };

  const handleAddSubject = () => {
    setSubjects((prev) => [...prev, { subject: '', percentage: 0 }]);
  };

  const handleRemoveSubject = (index: number) => {
    if (subjects.length > 1) setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const hasInput = subjects.some((s) => s.subject.trim() && s.percentage > 0);

  const apsScore = useMemo(() => calcAps(subjects), [subjects]);

  const avgPercentage = useMemo(() => {
    const valid = subjects.filter((s) => s.subject.trim() && s.percentage > 0);
    if (!valid.length) return 0;
    return Math.round(valid.reduce((sum, s) => sum + s.percentage, 0) / valid.length);
  }, [subjects]);

  // Scored clusters — ranked by how much the student's marks point at them
  const rankedClusters = useMemo(() => scoreClusters(subjects), [subjects]);
  const topClusterNames = useMemo(() => topClusters(subjects, 6), [subjects]);

  // Career titles from top clusters, deduplicated
  const recommendedCareers = useMemo(() => {
    return topClusterNames
      .flatMap((c) => CAREER_TITLES[c] ?? [])
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 15);
  }, [topClusterNames]);

  // Find matching programmes: search all keywords for top clusters,
  // filter by APS, then spread results across institutions (max 3 per institution)
  const institutionResults = useMemo(() => {
    if (!hasInput || topClusterNames.length === 0) return [];

    const keywords = topClusterNames.flatMap((c) => CLUSTER_PROGRAMME_KEYWORDS[c] ?? [c.toLowerCase()]);
    const uniqueKeywords = [...new Set(keywords)];

    // Filter programmes matching any keyword and passing APS gate
    const matched = programmes.filter((p) => {
      const name = (p.normalized_name ?? p.name).toLowerCase();
      const passesAps = !p.min_aps || p.min_aps <= 1 || apsScore >= p.min_aps;
      return passesAps && uniqueKeywords.some((kw) => name.includes(kw));
    });

    // Group by institution
    const byInst = new Map<string, ToolProgramme[]>();
    for (const prog of matched) {
      if (!byInst.has(prog.institution_id)) byInst.set(prog.institution_id, []);
      byInst.get(prog.institution_id)!.push(prog);
    }

    // Sort institutions: prefer those with more matches, then cap per institution
    return Array.from(byInst.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, MAX_INSTITUTIONS)
      .map(([instId, progs]) => ({
        institution: institutions.find((i) => i.id === instId),
        programmes: progs.slice(0, MAX_PROGRAMMES_PER_INSTITUTION),
        totalMatch: progs.length,
      }))
      .filter((r) => r.institution != null) as Array<{
        institution: ToolInstitution;
        programmes: ToolProgramme[];
        totalMatch: number;
      }>;
  }, [topClusterNames, programmes, institutions, apsScore, hasInput]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-sky-700 pb-12 pt-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ToolsBreadcrumb currentPage="Career & Course Recommender" />
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Career & Course Recommender
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/60">
            Enter your subjects and marks — we&apos;ll recommend career paths and matching
            programmes based on your strengths.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">

          {/* Subject Input */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your subjects & marks</h2>
            <p className="mt-1 text-sm text-slate-500">
              Higher marks = stronger recommendations. Your APS score filters which programmes you qualify for.
            </p>
            <div className="mt-4 space-y-3">
              {subjects.map((subj, idx) => (
                <div key={idx} className="flex gap-3">
                  <select
                    value={subj.subject}
                    onChange={(e) => handleSubjectChange(idx, e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="">Select subject</option>
                    {ALL_NSC_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={subj.percentage || ''}
                    onChange={(e) => handlePercentageChange(idx, parseInt(e.target.value) || 0)}
                    placeholder="%"
                    className="w-20 rounded-lg border border-slate-200 px-2 py-2 text-center text-sm"
                  />
                  <div className="flex w-14 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                    {subj.percentage > 0 ? `${percentageToAps(subj.percentage)} pts` : '—'}
                  </div>
                  <button
                    onClick={() => handleRemoveSubject(idx)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddSubject}
              className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              + Add subject
            </button>
          </div>

          {/* Score Summary */}
          {hasInput && (
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">APS score</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{apsScore}<span className="text-base font-normal text-slate-400">/42</span></p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Average mark</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{avgPercentage}<span className="text-base font-normal text-slate-400">%</span></p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs text-slate-500">Top strength</p>
                <p className="mt-1 text-base font-semibold text-slate-800 leading-snug">
                  {rankedClusters[0]?.cluster ?? '—'}
                </p>
              </div>
            </div>
          )}

          {/* Career paths */}
          {recommendedCareers.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-slate-900">Recommended career paths</h3>
              <p className="mt-0.5 text-xs text-slate-500">Based on your subject combination and performance</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {recommendedCareers.map((career) => (
                  <span
                    key={career}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Strength breakdown */}
          {rankedClusters.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-slate-900">Your field strengths</h3>
              <p className="mt-0.5 text-xs text-slate-500">Fields scored by how strongly your marks point toward them</p>
              <div className="mt-3 space-y-2">
                {rankedClusters.slice(0, 6).map(({ cluster, score }, i) => {
                  const maxScore = rankedClusters[0]?.score ?? 1;
                  const pct = Math.round((score / maxScore) * 100);
                  return (
                    <div key={cluster} className="flex items-center gap-3">
                      <div className="w-5 text-xs font-semibold text-slate-400">{i + 1}</div>
                      <div className="w-40 shrink-0 text-sm text-slate-700">{cluster}</div>
                      <div className="flex-1 overflow-hidden rounded-full bg-slate-100 h-2">
                        <div
                          className="h-2 rounded-full bg-slate-700 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching programmes */}
          {institutionResults.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Programmes you may qualify for
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Filtered to programmes within your APS range, sorted by relevance
              </p>
              <div className="mt-4 space-y-3">
                {institutionResults.map(({ institution, programmes: instProgs, totalMatch }) => (
                  <div
                    key={institution.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <InstitutionLogo logo={institution.logo} name={institution.name} />
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {institution.short_name && (
                              <span className="mr-1.5 font-extrabold text-slate-700">
                                {institution.short_name} |
                              </span>
                            )}
                            {institution.name}
                          </h4>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {institution.city} · {institution.province}
                          </p>
                        </div>
                      </div>
                      {totalMatch > MAX_PROGRAMMES_PER_INSTITUTION && (
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
                          +{totalMatch - MAX_PROGRAMMES_PER_INSTITUTION} more
                        </span>
                      )}
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {instProgs.map((prog, idx) => (
                        <li key={`${institution.id}-${prog.name}-${idx}`} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-slate-700">
                          <span className="text-slate-400 text-xs">▸</span>
                          <span>{prog.name}</span>
                          {prog.min_aps && prog.min_aps > 1 && (
                            <span className="text-xs text-slate-400">APS {prog.min_aps}+</span>
                          )}
                          {prog.qualification_type && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                              {prog.qualification_type}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3">
                      {institution.official_website && (
                        <a
                          href={institution.official_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          Visit official website →
                        </a>
                      )}
                      <Link
                        href={`/tools/institution/${institution.id}`}
                        className="text-sm font-medium text-slate-500 hover:text-slate-800 hover:underline"
                      >
                        View full profile →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasInput && institutionResults.length === 0 && recommendedCareers.length > 0 && (
            <div className="rounded-2xl bg-amber-50 p-4 text-amber-900">
              <p className="text-sm font-medium">No programmes found within your APS range</p>
              <p className="mt-1 text-sm">
                Your current APS is {apsScore}. Try improving your marks or check the course finder
                for institutions that may have lower entry requirements.
              </p>
            </div>
          )}

          {!hasInput && (
            <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
              <p className="text-sm">Select subjects and enter your marks to get recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
