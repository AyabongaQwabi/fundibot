'use client';

import { useState, useMemo } from 'react';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';
import { ALL_NSC_SUBJECTS } from '@/lib/tools/constants';
import { percentageToAps } from '@/lib/tools/aps';
import {
  matchClustersFromSubjects,
  CAREER_TITLES,
  clusterSearchKeyword,
} from '@/lib/tools/career-map';
import type { ToolInstitution, ToolProgramme } from '@/lib/tools/types';

type Props = {
  institutions: ToolInstitution[];
  programmes: ToolProgramme[];
};

type SubjectMark = {
  subject: string;
  percentage: number;
};

export function CareerRecommenderClient({ institutions, programmes }: Props) {
  const [subjects, setSubjects] = useState<SubjectMark[]>([
    { subject: 'Mathematics', percentage: 0 },
    { subject: 'Physical Sciences', percentage: 0 },
    { subject: 'English HL', percentage: 0 },
  ]);

  const handleSubjectChange = (index: number, subject: string) => {
    const newSubjects = [...subjects];
    newSubjects[index].subject = subject;
    setSubjects(newSubjects);
  };

  const handlePercentageChange = (index: number, percentage: number) => {
    const newSubjects = [...subjects];
    newSubjects[index].percentage = Math.min(100, Math.max(0, percentage));
    setSubjects(newSubjects);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { subject: '', percentage: 0 }]);
  };

  const handleRemoveSubject = (index: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  const recommendedClusters = useMemo(() => {
    const validSubjects = subjects
      .filter((s) => s.subject.trim())
      .map((s) => s.subject);
    return matchClustersFromSubjects(validSubjects);
  }, [subjects]);

  const recommendedCareers = useMemo(() => {
    return recommendedClusters
      .flatMap((cluster) => CAREER_TITLES[cluster] || [])
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 12);
  }, [recommendedClusters]);

  const recommendedCourses = useMemo(() => {
    if (recommendedClusters.length === 0) return [];

    const keywords = recommendedClusters.map((c) => clusterSearchKeyword(c));
    return programmes
      .filter((p) =>
        keywords.some((k) =>
          p.normalized_name?.toLowerCase().includes(k.toLowerCase()) ||
          p.name.toLowerCase().includes(k.toLowerCase()),
        ),
      )
      .slice(0, 20);
  }, [recommendedClusters, programmes]);

  const programmesByInstitution = useMemo(() => {
    const map = new Map<string, ToolProgramme[]>();
    recommendedCourses.forEach((prog) => {
      if (!map.has(prog.institution_id)) map.set(prog.institution_id, []);
      map.get(prog.institution_id)!.push(prog);
    });
    return map;
  }, [recommendedCourses]);

  const recommendedInstitutions = Array.from(programmesByInstitution.keys())
    .map((id) => institutions.find((i) => i.id === id))
    .filter(Boolean) as ToolInstitution[];

  const avgPercentage =
    subjects.filter((s) => s.percentage > 0).length > 0
      ? Math.round(
          subjects.filter((s) => s.percentage > 0).reduce((sum, s) => sum + s.percentage, 0) /
            subjects.filter((s) => s.percentage > 0).length,
        )
      : 0;

  return (
    <div className='mx-auto max-w-5xl px-4 py-16'>
      <ToolsBreadcrumb currentPage='Career & Course Recommender' />
      <h1 className='text-3xl font-semibold text-slate-900'>Career & Course Recommender</h1>
      <p className='mt-4 text-slate-600'>
        Tell us your subjects and approximate marks — we'll recommend career paths and matching programmes.
      </p>

      <div className='mt-8 space-y-8 rounded-3xl border border-slate-200 bg-white p-8'>
        {/* Subject Input */}
        <div>
          <h2 className='text-lg font-semibold text-slate-900'>Your subjects</h2>
          <p className='mt-1 text-sm text-slate-600'>Select the subjects you're studying</p>
          <div className='mt-4 space-y-3'>
            {subjects.map((subj, idx) => (
              <div key={idx} className='flex gap-3'>
                <select
                  value={subj.subject}
                  onChange={(e) => handleSubjectChange(idx, e.target.value)}
                  className='flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm'
                >
                  <option value=''>Select subject</option>
                  {ALL_NSC_SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  type='number'
                  min='0'
                  max='100'
                  value={subj.percentage}
                  onChange={(e) => handlePercentageChange(idx, parseInt(e.target.value) || 0)}
                  placeholder='%'
                  className='w-20 rounded-lg border border-slate-200 px-2 py-2 text-sm'
                />
                <button
                  onClick={() => handleRemoveSubject(idx)}
                  className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100'
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddSubject}
            className='mt-4 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200'
          >
            + Add subject
          </button>
        </div>

        {/* Performance Summary */}
        {avgPercentage > 0 && (
          <div className='rounded-2xl bg-slate-50 p-4'>
            <p className='text-sm text-slate-600'>Your average performance</p>
            <div className='mt-2 flex items-baseline gap-2'>
              <div className='text-3xl font-bold text-slate-900'>{avgPercentage}%</div>
              <div className='text-xs text-slate-500'>
                (APS {percentageToAps(avgPercentage)} if all were counted)
              </div>
            </div>
          </div>
        )}

        {/* Career Recommendations */}
        {recommendedCareers.length > 0 && (
          <div>
            <h3 className='text-lg font-semibold text-slate-900'>Recommended career paths</h3>
            <div className='mt-4 flex flex-wrap gap-2'>
              {recommendedCareers.map((career) => (
                <div
                  key={career}
                  className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700'
                >
                  {career}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Recommendations */}
        {recommendedCourses.length > 0 && (
          <div>
            <h3 className='text-lg font-semibold text-slate-900'>
              {recommendedCourses.length} recommended programme{recommendedCourses.length !== 1 ? 's' : ''}
            </h3>
            <div className='mt-4 space-y-4'>
              {recommendedInstitutions.map((inst) => {
                const instProgs = programmesByInstitution.get(inst.id) || [];
                return (
                  <div key={inst.id} className='rounded-2xl border border-slate-200 p-4'>
                    <h4 className='font-semibold text-slate-900'>{inst.name}</h4>
                    <p className='mt-1 text-xs text-slate-500'>{inst.city} • {inst.province}</p>
                    <ul className='mt-3 space-y-1'>
                      {instProgs.map((prog) => (
                        <li key={prog.name} className='text-sm text-slate-600'>
                          • {prog.name}
                          {prog.min_aps && ` (APS ${prog.min_aps}+)`}
                        </li>
                      ))}
                    </ul>
                    {inst.official_website && (
                      <a
                        href={inst.official_website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='mt-3 inline-block text-sm text-blue-600 hover:underline'
                      >
                        Visit website →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {subjects.every((s) => !s.subject) && (
          <div className='rounded-2xl bg-slate-50 p-6 text-center text-slate-600'>
            <p className='text-sm'>Select at least one subject to get career and course recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
