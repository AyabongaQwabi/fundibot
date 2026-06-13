'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { InstitutionLogo } from '../components/InstitutionLogo';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';
import { INSTITUTION_TYPE_FILTERS } from '@/lib/tools/constants';
import type { ToolInstitution, InstitutionType } from '@/lib/tools/types';

export function InstitutionsBrowser({ institutions }: { institutions: ToolInstitution[] }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | InstitutionType>('all');
  const [provinceFilter, setProvinceFilter] = useState('');

  const provinces = useMemo(
    () => Array.from(new Set(institutions.map((i) => i.province).filter(Boolean))).sort(),
    [institutions],
  );

  const filtered = useMemo(() => {
    return institutions.filter((i) => {
      const matchesSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || i.institution_type === typeFilter;
      const matchesProvince = !provinceFilter || i.province === provinceFilter;
      return matchesSearch && matchesType && matchesProvince;
    });
  }, [institutions, search, typeFilter, provinceFilter]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-sky-700 pb-12 pt-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ToolsBreadcrumb currentPage="Institutions" />
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            All Institutions
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/60">
            Browse every university, university of technology and TVET college in South Africa.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search institutions..."
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | InstitutionType)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
          >
            {INSTITUTION_TYPE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">All provinces</option>
            {provinces.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <p className="mt-4 mb-4 text-xs text-slate-500">
          {filtered.length} institution{filtered.length !== 1 ? 's' : ''}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((inst) => (
            <Link
              key={inst.id}
              href={`/tools/institution/${inst.id}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <InstitutionLogo logo={inst.logo} name={inst.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900 text-sm">
                  {inst.short_name ? (
                    <><span className="text-slate-400 font-normal">{inst.short_name} · </span>{inst.name}</>
                  ) : inst.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{inst.city} · {inst.province}</p>
                <span className="mt-1.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 capitalize">
                  {inst.institution_type.replace(/-/g, ' ')}
                </span>
              </div>
              <span className="shrink-0 text-slate-300 text-lg">›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
