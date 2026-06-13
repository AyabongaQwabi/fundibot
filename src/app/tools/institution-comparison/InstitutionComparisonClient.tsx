'use client';

import { useState, useMemo } from 'react';
import { X, Plus, Info, ExternalLink } from 'lucide-react';
import Fuse from 'fuse.js';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';
import { InstitutionLogo } from '../components/InstitutionLogo';
import type { ToolInstitution, ToolProgramme } from '@/lib/tools/types';

const TYPE_LABELS: Record<string, string> = {
  university: 'University',
  'university-of-technology': 'University of Technology',
  'tvet-college': 'TVET College',
};

type Props = {
  institutions: ToolInstitution[];
  programmes: ToolProgramme[];
};

type CompareRow = {
  label: string;
  values: (string | React.ReactNode)[];
};

export function InstitutionComparisonClient({ institutions, programmes }: Props) {
  const [selected, setSelected] = useState<ToolInstitution[]>([]);
  const [query, setQuery] = useState('');
  const [courseQuery, setCourseQuery] = useState('');

  const fuse = useMemo(
    () => new Fuse(institutions, { keys: ['name', 'short_name'], threshold: 0.35 }),
    [institutions],
  );

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return fuse
      .search(query)
      .map((r) => r.item)
      .filter((i) => !selected.find((s) => s.id === i.id))
      .slice(0, 8);
  }, [query, fuse, selected]);

  const add = (inst: ToolInstitution) => {
    if (selected.length < 4 && !selected.find((s) => s.id === inst.id)) {
      setSelected((prev) => [...prev, inst]);
    }
    setQuery('');
  };

  const remove = (id: string) => setSelected((prev) => prev.filter((i) => i.id !== id));

  // Programmes per selected institution
  const progsByInst = useMemo(() => {
    const map = new Map<string, ToolProgramme[]>();
    for (const inst of selected) {
      map.set(inst.id, programmes.filter((p) => p.institution_id === inst.id));
    }
    return map;
  }, [selected, programmes]);

  // Course overlap analysis
  const courseFilteredProgs = useMemo(() => {
    if (!courseQuery.trim()) return progsByInst;
    const lower = courseQuery.toLowerCase();
    const map = new Map<string, ToolProgramme[]>();
    for (const [id, progs] of progsByInst) {
      map.set(
        id,
        progs.filter((p) => (p.normalized_name ?? p.name).toLowerCase().includes(lower)),
      );
    }
    return map;
  }, [progsByInst, courseQuery]);

  // Shared programmes (by normalized name)
  const sharedCourses = useMemo(() => {
    if (selected.length < 2) return [];
    const sets = selected.map((inst) => new Set((courseFilteredProgs.get(inst.id) ?? []).map((p) => p.normalized_name ?? p.name)));
    const base = [...sets[0]];
    return base.filter((name) => sets.every((s) => s.has(name)));
  }, [selected, courseFilteredProgs]);

  // Unique courses per institution
  const uniqueCourses = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const inst of selected) {
      const others = selected.filter((i) => i.id !== inst.id);
      const otherNames = new Set(
        others.flatMap((o) => (courseFilteredProgs.get(o.id) ?? []).map((p) => p.normalized_name ?? p.name)),
      );
      const myNames = (courseFilteredProgs.get(inst.id) ?? []).map((p) => p.normalized_name ?? p.name);
      map.set(inst.id, myNames.filter((n) => !otherNames.has(n)).slice(0, 10));
    }
    return map;
  }, [selected, courseFilteredProgs]);

  // Qualification types per institution
  const qualTypes = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const inst of selected) {
      const types = [
        ...new Set((progsByInst.get(inst.id) ?? []).map((p) => p.qualification_type).filter(Boolean) as string[]),
      ];
      map.set(inst.id, types);
    }
    return map;
  }, [selected, progsByInst]);

  // APS range
  const apsRange = useMemo(() => {
    const map = new Map<string, { min: number; max: number } | null>();
    for (const inst of selected) {
      const apsList = (progsByInst.get(inst.id) ?? []).map((p) => p.min_aps).filter((a) => a != null && a > 1) as number[];
      map.set(inst.id, apsList.length > 0 ? { min: Math.min(...apsList), max: Math.max(...apsList) } : null);
    }
    return map;
  }, [selected, progsByInst]);

  const rows: CompareRow[] = selected.length > 0
    ? [
        { label: 'Institution type', values: selected.map((i) => TYPE_LABELS[i.institution_type] ?? i.institution_type) },
        { label: 'Province', values: selected.map((i) => i.province) },
        { label: 'City', values: selected.map((i) => i.city) },
        {
          label: 'Total programmes',
          values: selected.map((i) => (progsByInst.get(i.id) ?? []).length.toString()),
        },
        {
          label: 'Qualification types offered',
          values: selected.map((i) => (qualTypes.get(i.id) ?? []).join(', ') || '—'),
        },
        {
          label: 'APS range (programmes with APS)',
          values: selected.map((i) => {
            const r = apsRange.get(i.id);
            return r ? `${r.min} – ${r.max}` : 'N/A';
          }),
        },
        {
          label: 'Website',
          values: selected.map((i) =>
            i.official_website ? (
              <a
                key={i.id}
                href={i.official_website}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1 text-brand-blue hover:underline'
              >
                Visit <ExternalLink className='h-3 w-3' />
              </a>
            ) : (
              '—'
            ),
          ),
        },
      ]
    : [];

  return (
    <div className='mx-auto max-w-5xl px-4 py-8 sm:px-6'>
      <ToolsBreadcrumb items={[{ label: 'Tools', href: '/tools' }, { label: 'Institution Comparison' }]} />

      <div className='mb-8'>
        <h1 className='text-2xl font-extrabold text-slate-900 md:text-3xl'>Institution Comparison Tool</h1>
        <p className='mt-2 text-slate-500'>
          Compare up to 4 institutions side by side across programmes, admission requirements, fees, and more.
        </p>
      </div>

      {/* Search to add */}
      <div className='mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
        <label className='mb-2 block text-sm font-semibold text-slate-700'>
          Add institutions to compare ({selected.length}/4)
        </label>
        <div className='relative'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search institution name…'
            disabled={selected.length >= 4}
            className='w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 disabled:opacity-40'
          />
          {suggestions.length > 0 && (
            <ul className='absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card-hover'>
              {suggestions.map((inst) => (
                <li key={inst.id}>
                  <button
                    onClick={() => add(inst)}
                    className='flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50'
                  >
                    <InstitutionLogo logo={inst.logo} name={inst.name} className='!h-6 !w-14' />
                    <span className='font-medium text-slate-800'>{inst.name}</span>
                    <span className='ml-auto text-xs text-slate-400'>{inst.province}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className='mt-4 flex flex-wrap gap-2'>
            {selected.map((inst) => (
              <div
                key={inst.id}
                className='flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm'
              >
                <InstitutionLogo logo={inst.logo} name={inst.name} className='!h-5 !w-12' />
                <span className='font-medium text-slate-800'>{inst.short_name ?? inst.name}</span>
                <button onClick={() => remove(inst.id)} className='text-slate-400 hover:text-slate-700'>
                  <X className='h-3.5 w-3.5' />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected.length === 0 && (
        <div className='rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400'>
          <Plus className='mx-auto mb-3 h-8 w-8 opacity-30' />
          <p>Search for at least 2 institutions to start comparing.</p>
        </div>
      )}

      {selected.length >= 2 && (
        <div className='space-y-8'>
          {/* Side-by-side comparison table */}
          <div className='overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-card'>
            <table className='w-full text-sm'>
              <thead className='border-b border-slate-100 bg-slate-50'>
                <tr>
                  <th className='px-5 py-4 text-left text-xs font-semibold text-slate-400'></th>
                  {selected.map((inst) => (
                    <th key={inst.id} className='px-5 py-4 text-left'>
                      <div className='flex items-center gap-2'>
                        <InstitutionLogo logo={inst.logo} name={inst.name} className='!h-7 !w-16' />
                        <span className='text-sm font-bold text-slate-900'>{inst.short_name ?? inst.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-50'>
                {rows.map((row) => (
                  <tr key={row.label} className='hover:bg-slate-50/50'>
                    <td className='px-5 py-3.5 text-xs font-semibold text-slate-500'>{row.label}</td>
                    {row.values.map((val, i) => (
                      <td key={i} className='px-5 py-3.5 text-slate-700'>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Course filter */}
          <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
            <h2 className='mb-4 text-base font-bold text-slate-900'>Programme Overlap Analysis</h2>
            <input
              type='text'
              value={courseQuery}
              onChange={(e) => setCourseQuery(e.target.value)}
              placeholder='Filter by course name (optional)…'
              className='w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20'
            />

            {/* Shared courses */}
            {sharedCourses.length > 0 && (
              <div className='mt-5'>
                <p className='mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400'>
                  Programmes offered by all selected ({sharedCourses.length})
                </p>
                <div className='flex flex-wrap gap-2'>
                  {sharedCourses.slice(0, 30).map((name) => (
                    <span key={name} className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700'>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Unique per institution */}
            <div className='mt-5 grid gap-4' style={{ gridTemplateColumns: `repeat(${selected.length}, 1fr)` }}>
              {selected.map((inst) => {
                const unique = uniqueCourses.get(inst.id) ?? [];
                return (
                  <div key={inst.id}>
                    <p className='mb-2 text-xs font-semibold text-slate-500'>
                      Only at {inst.short_name ?? inst.name} ({unique.length})
                    </p>
                    {unique.length > 0 ? (
                      <ul className='space-y-1 text-xs text-slate-600'>
                        {unique.map((n) => <li key={n}>{n}</li>)}
                      </ul>
                    ) : (
                      <p className='text-xs text-slate-400'>None unique</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className='flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500'>
            <Info className='mt-0.5 h-4 w-4 shrink-0' />
            <span>
              This information is based on scraped data and may not reflect the most current requirements.
              Always verify with the institution directly.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
