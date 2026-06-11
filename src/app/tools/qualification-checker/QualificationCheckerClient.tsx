'use client';

import { useState, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { ALL_NSC_SUBJECTS } from '@/lib/tools/constants';
import { calcAps, percentageToAps } from '@/lib/tools/aps';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';
import type { ToolInstitution, ToolProgramme } from '@/lib/tools/types';

type SubjectMark = {
  subject: string;
  percentage: number;
};

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
  const [selectedCourse, setSelectedCourse] = useState('');
  const [apsScore, setApsScore] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const courseInputRef = useRef<HTMLInputElement>(null);

  const handleSubjectChange = (index: number, subject: string) => {
    const newMarks = [...marks];
    newMarks[index].subject = subject;
    setMarks(newMarks);
  };

  const handlePercentageChange = (index: number, percentage: number) => {
    const newMarks = [...marks];
    newMarks[index].percentage = Math.min(100, Math.max(0, percentage));
    setMarks(newMarks);
    setApsScore(calcAps(newMarks));
  };

  const handleAddSubject = () => {
    setMarks([...marks, { subject: '', percentage: 0 }]);
  };

  const handleRemoveSubject = (index: number) => {
    if (marks.length > 1) {
      setMarks(marks.filter((_, i) => i !== index));
    }
  };

  // Fuzzy search for courses
  const fuseOptions = {
    keys: ['normalized_name', 'name'],
    threshold: 0.3,
    minMatchCharLength: 2,
  };
  const fuse = new Fuse(programmes, fuseOptions);

  const filteredCourses = selectedCourse.trim()
    ? Array.from(
        new Set(
          fuse
            .search(selectedCourse)
            .map((r) => r.item.normalized_name)
            .filter(Boolean) as string[],
        ),
      ).sort()
    : [];

  // Find programmes matching the course and APS score
  const matchedProgrammes = selectedCourse
    ? programmes.filter(
        (p) =>
          p.normalized_name?.toLowerCase().includes(selectedCourse.toLowerCase()) &&
          (!p.min_aps || apsScore >= p.min_aps),
      )
    : [];

  // Get institutions offering matched programmes
  const qualifyingInstitutions = Array.from(
    new Set(matchedProgrammes.map((p) => p.institution_id)),
  )
    .map((id) => institutions.find((i) => i.id === id))
    .filter(Boolean) as ToolInstitution[];

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (courseInputRef.current && !courseInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='mx-auto max-w-5xl px-4 py-16'>
      <ToolsBreadcrumb currentPage='University Qualification Checker' />
      <h1 className='text-3xl font-semibold text-slate-900'>University Qualification Checker</h1>
      <p className='mt-4 text-slate-600'>
        Enter your Grade 12 marks to calculate your APS score and see which institutions you qualify for.
      </p>

      <div className='mt-8 space-y-8 rounded-3xl border border-slate-200 bg-white p-8'>
        {/* Subject Input Section */}
        <div>
          <h2 className='text-lg font-semibold text-slate-900'>Your Subjects & Marks</h2>
          <p className='mt-1 text-sm text-slate-600'>Enter percentages for your Grade 12 subjects (best 6 will count toward APS)</p>
          <div className='mt-4 space-y-3'>
            {marks.map((mark, idx) => (
              <div key={idx} className='flex gap-3'>
                <select
                  value={mark.subject}
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
                  value={mark.percentage}
                  onChange={(e) => handlePercentageChange(idx, parseInt(e.target.value) || 0)}
                  placeholder='%'
                  className='w-20 rounded-lg border border-slate-200 px-2 py-2 text-sm'
                />
                <div className='flex w-12 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-700'>
                  {percentageToAps(mark.percentage)} pts
                </div>
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

        {/* APS Score Display */}
        <div className='rounded-2xl bg-slate-50 p-4'>
          <p className='text-sm text-slate-600'>Your APS Score (best 6 subjects)</p>
          <div className='mt-2 text-4xl font-bold text-slate-900'>{apsScore}/42</div>
        </div>

        {/* Course Selection */}
        <div className='relative'>
          <label className='block text-sm font-semibold text-slate-900'>
            What course do you want to study?
          </label>
          <input
            ref={courseInputRef}
            type='text'
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder='Type a course name...'
            className='mt-2 w-full rounded-lg border border-slate-200 px-4 py-2'
          />
          {/* Fuzzy search suggestions dropdown */}
          {showSuggestions && selectedCourse.trim() && filteredCourses.length > 0 && (
            <div className='absolute top-full z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg'>
              {filteredCourses.map((course) => (
                <button
                  key={course}
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowSuggestions(false);
                  }}
                  className='w-full border-b border-slate-100 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50'
                >
                  {course}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {selectedCourse && qualifyingInstitutions.length > 0 && (
          <div>
            <h3 className='text-lg font-semibold text-slate-900'>
              You qualify for {matchedProgrammes.length} programme{matchedProgrammes.length !== 1 ? 's' : ''} at {qualifyingInstitutions.length} institution{qualifyingInstitutions.length !== 1 ? 's' : ''}
            </h3>
            <div className='mt-4 space-y-3'>
              {qualifyingInstitutions.map((inst) => {
                const instProgrammes = matchedProgrammes.filter((p) => p.institution_id === inst.id);
                return (
                  <div key={inst.id} className='rounded-2xl border border-slate-200 p-4'>
                    <h4 className='font-semibold text-slate-900'>{inst.name}</h4>
                    <p className='mt-1 text-xs text-slate-500'>{inst.city} • {inst.province}</p>
                    <div className='mt-3 space-y-1'>
                      {instProgrammes.map((prog, idx) => (
                        <p key={`${inst.id}-${prog.name}-${idx}`} className='text-sm text-slate-600'>
                          • {prog.name}
                          {prog.min_aps && ` (requires APS ${prog.min_aps}+)`}
                        </p>
                      ))}
                    </div>
                    {inst.official_website && (
                      <a
                        href={inst.official_website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='mt-3 inline-text-sm text-blue-600 hover:underline'
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

        {selectedCourse && qualifyingInstitutions.length === 0 && (
          <div className='rounded-2xl bg-amber-50 p-4 text-amber-900'>
            <p className='text-sm'>
              No institutions found offering "{selectedCourse}" that match your APS score. Try a different course or check institution websites directly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
