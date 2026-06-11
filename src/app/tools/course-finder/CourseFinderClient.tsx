'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';
import { INSTITUTION_TYPE_FILTERS } from '@/lib/tools/constants';
import type { ToolInstitution, ToolProgramme, InstitutionType } from '@/lib/tools/types';

type Props = {
  institutions: ToolInstitution[];
  programmes: ToolProgramme[];
};

export function CourseFinderClient({ institutions, programmes }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | InstitutionType>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const provinces = Array.from(new Set(institutions.map((i) => i.province))).sort();

  // Fuzzy search for programmes
  const fuse = useMemo(() => {
    return new Fuse(programmes, {
      keys: ['normalized_name', 'name'],
      threshold: 0.3,
      minMatchCharLength: 2,
    });
  }, [programmes]);

  const filteredProgrammes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const results = fuse.search(searchQuery);
    return results.map((r) => r.item);
  }, [searchQuery, fuse]);

  const uniqueCourses = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return Array.from(
      new Set(filteredProgrammes.map((p) => p.normalized_name).filter(Boolean) as string[]),
    ).sort();
  }, [filteredProgrammes, searchQuery]);

  const filteredInstitutions = useMemo(() => {
    return institutions.filter((i) => {
      const hasMatchingProgramme = filteredProgrammes.some((p) => p.institution_id === i.id);
      const matchesProvince = !selectedProvince || i.province === selectedProvince;
      const matchesType = selectedType === 'all' || i.institution_type === selectedType;
      return hasMatchingProgramme && matchesProvince && matchesType;
    });
  }, [filteredProgrammes, selectedProvince, selectedType, institutions]);

  const results = filteredInstitutions.map((inst) => ({
    institution: inst,
    programmes: filteredProgrammes.filter((p) => p.institution_id === inst.id),
  }));

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='bg-navy-900 pb-12 pt-28'>
        <div className='mx-auto max-w-5xl px-4 sm:px-6'>
          <ToolsBreadcrumb currentPage='Course & Institution Finder' />
          <h1 className='mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl'>Course & Institution Finder</h1>
          <p className='mt-3 max-w-2xl text-lg text-white/60'>
            Search for a course and filter by province to find universities and colleges offering that qualification.
          </p>
        </div>
      </div>

      <div className='mx-auto max-w-5xl px-4 py-10 sm:px-6'>
      <div className='space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8'>
        {/* Search and Filters */}
        <div className='space-y-4'>
          <div className='relative'>
            <label className='block text-sm font-semibold text-slate-900'>Course name</label>
            <input
              ref={searchInputRef}
              type='text'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder='Start typing a course name...'
              className='mt-2 w-full rounded-lg border border-slate-200 px-4 py-3'
            />
            {/* Fuzzy search suggestions dropdown */}
            {showSuggestions && searchQuery.trim() && uniqueCourses.length > 0 && (
              <div className='absolute top-full z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg'>
                {uniqueCourses.map((course) => (
                  <button
                    key={course}
                    onClick={() => {
                      setSearchQuery(course);
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

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='block text-sm font-semibold text-slate-900'>Province</label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className='mt-2 w-full rounded-lg border border-slate-200 px-4 py-2'
              >
                <option value=''>All provinces</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-semibold text-slate-900'>Institution type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as 'all' | InstitutionType)}
                className='mt-2 w-full rounded-lg border border-slate-200 px-4 py-2'
              >
                {INSTITUTION_TYPE_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {searchQuery && results.length > 0 ? (
          <div>
            <h2 className='font-semibold text-slate-900'>
              Found {results.length} institution{results.length !== 1 ? 's' : ''} offering "{searchQuery}"
            </h2>
            <div className='mt-6 space-y-4'>
              {results.map(({ institution, programmes: instProgrammes }) => (
                <div key={institution.id} className='rounded-2xl border border-slate-200 p-4'>
                  <h3 className='font-semibold text-slate-900'>{institution.name}</h3>
                  <p className='mt-1 text-xs text-slate-500'>
                    {institution.city} • {institution.province}
                  </p>
                  <div className='mt-3'>
                    <p className='text-xs font-semibold uppercase text-slate-600'>Programmes:</p>
                    <ul className='mt-2 space-y-1'>
                      {instProgrammes.map((prog, idx) => (
                        <li key={`${institution.id}-${prog.name}-${idx}`} className='text-sm text-slate-700'>
                          • {prog.name}
                          {prog.min_aps && ` (APS ${prog.min_aps}+)`}
                          {prog.qualification_type && ` — ${prog.qualification_type}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {institution.official_website && (
                    <a
                      href={institution.official_website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='mt-3 inline-block text-sm text-blue-600 hover:underline'
                    >
                      Visit website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : searchQuery ? (
          <div className='rounded-2xl bg-amber-50 p-4 text-amber-900'>
            <p className='text-sm'>
              No results for "{searchQuery}". Try searching for a different course name or browse available programmes.
            </p>
          </div>
        ) : (
          <div className='rounded-2xl bg-slate-50 p-6 text-center text-slate-600'>
            <p className='text-sm'>Enter a course name to search for institutions.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
