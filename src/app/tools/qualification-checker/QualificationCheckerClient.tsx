'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { ALL_NSC_SUBJECTS } from '@/lib/tools/constants';
import { calcAps, percentageToAps } from '@/lib/tools/aps';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';
import { InstitutionLogo } from '../components/InstitutionLogo';
import type { ToolInstitution, ToolProgramme } from '@/lib/tools/types';

type SubjectMark = { subject: string; percentage: number };

type Props = {
  institutions: ToolInstitution[];
  programmes: ToolProgramme[];
};

export function QualificationCheckerClient({ institutions, programmes }: Props) {
  const [marks, setMarks] = useState<SubjectMark[]>([
    { subject: 'Mathematics', percentage: 0 },
    { subject: 'English HL', percentage: 0 },
    { subject: 'Physical Sciences', percentage: 0 },
  ]);
  const [courseQuery, setCourseQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const courseInputRef = useRef<HTMLInputElement>(null);

  const handleSubjectChange = (index: number, subject: string) => {
    setMarks((prev) => prev.map((m, i) => (i === index ? { ...m, subject } : m)));
  };

  const handlePercentageChange = (index: number, percentage: number) => {
    setMarks((prev) =>
      prev.map((m, i) => (i === index ? { ...m, percentage: Math.min(100, Math.max(0, percentage)) } : m)),
    );
  };

  const handleAddSubject = () => {
    setMarks((prev) => [...prev, { subject: '', percentage: 0 }]);
  };

  const handleRemoveSubject = (index: number) => {
    if (marks.length > 1) setMarks((prev) => prev.filter((_, i) => i !== index));
  };

  const apsScore = useMemo(() => calcAps(marks), [marks]);

  // Fuzzy search index — built once
  const fuse = useMemo(
    () =>
      new Fuse(programmes, {
        keys: ['normalized_name', 'name'],
        threshold: 0.3,
        minMatchCharLength: 2,
      }),
    [programmes],
  );

  // Unique course name suggestions from fuzzy search
  const suggestions = useMemo(() => {
    if (!courseQuery.trim()) return [];
    return Array.from(
      new Set(
        fuse
          .search(courseQuery)
          .map((r) => r.item.normalized_name ?? r.item.name)
          .filter(Boolean),
      ),
    ).slice(0, 12);
  }, [courseQuery, fuse]);

  // Programmes matching the selected course that the student qualifies for
  const matchedProgrammes = useMemo(() => {
    if (!selectedCourse) return [];
    const lower = selectedCourse.toLowerCase();
    return programmes.filter((p) => {
      const name = (p.normalized_name ?? p.name).toLowerCase();
      const nameMatch = name === lower || name.includes(lower);
      const passesAps = !p.min_aps || p.min_aps <= 1 || apsScore >= p.min_aps;
      return nameMatch && passesAps;
    });
  }, [selectedCourse, programmes, apsScore]);

  // Programmes matching the course but requiring a higher APS (so we can show "close" results)
  const nearMissProgrammes = useMemo(() => {
    if (!selectedCourse || matchedProgrammes.length > 0) return [];
    const lower = selectedCourse.toLowerCase();
    return programmes.filter((p) => {
      const name = (p.normalized_name ?? p.name).toLowerCase();
      return (name === lower || name.includes(lower)) && p.min_aps && apsScore < p.min_aps;
    });
  }, [selectedCourse, programmes, apsScore, matchedProgrammes.length]);

  const qualifyingInstitutions = useMemo(() => {
    const ids = new Set(matchedProgrammes.map((p) => p.institution_id));
    return institutions.filter((i) => ids.has(i.id));
  }, [matchedProgrammes, institutions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (courseInputRef.current && !courseInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasMarks = marks.some((m) => m.subject.trim() && m.percentage > 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-900 pb-12 pt-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ToolsBreadcrumb currentPage="University Qualification Checker" />
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            University Qualification Checker
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/60">
            Enter your Grade 12 marks, then search for a course to see exactly which institutions
            you qualify for based on your APS score.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">

          {/* Subject Input */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your subjects & marks</h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter percentages for your Grade 12 subjects. Best 6 subjects count toward APS.
            </p>
            <div className="mt-4 space-y-3">
              {marks.map((mark, idx) => (
                <div key={idx} className="flex gap-3">
                  <select
                    value={mark.subject}
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
                    value={mark.percentage || ''}
                    onChange={(e) => handlePercentageChange(idx, parseInt(e.target.value) || 0)}
                    placeholder="%"
                    className="w-20 rounded-lg border border-slate-200 px-2 py-2 text-center text-sm"
                  />
                  <div className="flex w-14 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                    {mark.percentage > 0 ? `${percentageToAps(mark.percentage)} pts` : '—'}
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

          {/* APS Score */}
          <div className="flex items-center gap-6 rounded-2xl bg-slate-50 p-4">
            <div>
              <p className="text-xs text-slate-500">Your APS score</p>
              <p className="mt-1 text-4xl font-bold text-slate-900">
                {apsScore}
                <span className="text-base font-normal text-slate-400">/42</span>
              </p>
            </div>
            <div className="flex-1 text-sm text-slate-500 leading-relaxed">
              {apsScore === 0 && 'Enter your marks above to calculate your APS score.'}
              {apsScore > 0 && apsScore < 20 && 'Your APS qualifies for TVET colleges and some diploma programmes.'}
              {apsScore >= 20 && apsScore < 28 && 'Your APS qualifies for diploma programmes and some degree programmes.'}
              {apsScore >= 28 && apsScore < 35 && 'Your APS qualifies for most degree programmes.'}
              {apsScore >= 35 && 'Your APS qualifies for competitive programmes including medicine and law.'}
            </div>
          </div>

          {/* Course Search */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Find a course</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search for the course you want to study — we&apos;ll show which institutions you qualify for.
            </p>
            <div className="relative mt-3">
              <input
                ref={courseInputRef}
                type="text"
                value={courseQuery}
                onChange={(e) => {
                  setCourseQuery(e.target.value);
                  setSelectedCourse('');
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Type a course name..."
                className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                  {suggestions.map((course) => (
                    <button
                      key={course}
                      onClick={() => {
                        setCourseQuery(course);
                        setSelectedCourse(course);
                        setShowSuggestions(false);
                      }}
                      className="w-full border-b border-slate-100 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {course}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results — qualifying */}
          {selectedCourse && qualifyingInstitutions.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                You qualify at {qualifyingInstitutions.length} institution
                {qualifyingInstitutions.length !== 1 ? 's' : ''}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Showing institutions where your APS of {apsScore} meets the minimum requirement
              </p>
              <div className="mt-4 space-y-3">
                {qualifyingInstitutions.map((inst) => {
                  const instProgrammes = matchedProgrammes.filter(
                    (p) => p.institution_id === inst.id,
                  );
                  return (
                    <div key={inst.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center gap-3">
                        <InstitutionLogo logo={inst.logo} name={inst.name} />
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {inst.short_name && (
                              <span className="mr-1.5 font-extrabold">{inst.short_name} |</span>
                            )}
                            {inst.name}
                          </h4>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {inst.city} · {inst.province}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1.5">
                        {instProgrammes.map((prog, idx) => (
                          <div
                            key={`${inst.id}-${prog.name}-${idx}`}
                            className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-slate-700"
                          >
                            <span className="text-xs text-green-600">✓</span>
                            <span>{prog.name}</span>
                            {prog.min_aps && prog.min_aps > 1 && (
                              <span className="text-xs text-slate-400">
                                requires APS {prog.min_aps}+
                              </span>
                            )}
                            {prog.qualification_type && (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                                {prog.qualification_type}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      {inst.official_website && (
                        <div className="mt-3 border-t border-slate-100 pt-3">
                          <a
                            href={inst.official_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:underline"
                          >
                            Visit official website →
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Near-miss — found the course but APS too low */}
          {selectedCourse && qualifyingInstitutions.length === 0 && nearMissProgrammes.length > 0 && (
            <div className="rounded-2xl bg-amber-50 p-5">
              <p className="font-semibold text-amber-900">
                Your APS of {apsScore} is below the requirement at {nearMissProgrammes.length} institution
                {nearMissProgrammes.length !== 1 ? 's' : ''}
              </p>
              <p className="mt-1 text-sm text-amber-800">
                Here&apos;s what you&apos;d need to qualify:
              </p>
              <ul className="mt-3 space-y-1">
                {nearMissProgrammes.slice(0, 5).map((prog, idx) => {
                  const inst = institutions.find((i) => i.id === prog.institution_id);
                  return (
                    <li key={idx} className="text-sm text-amber-900">
                      <span className="font-medium">{inst?.short_name ?? inst?.name ?? 'Unknown'}</span>
                      {' — '}requires APS {prog.min_aps}+
                      {prog.min_aps && (
                        <span className="ml-1 text-amber-700">
                          (you need {prog.min_aps - apsScore} more point{prog.min_aps - apsScore !== 1 ? 's' : ''})
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* No results at all */}
          {selectedCourse && qualifyingInstitutions.length === 0 && nearMissProgrammes.length === 0 && (
            <div className="rounded-2xl bg-amber-50 p-4 text-amber-900">
              <p className="text-sm">
                No institutions found offering &ldquo;{selectedCourse}&rdquo; in our database. Try
                searching for a different course name or use the Course Finder to browse by
                province.
              </p>
            </div>
          )}

          {!selectedCourse && !courseQuery && !hasMarks && (
            <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
              <p className="text-sm">Enter your marks and search for a course to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
