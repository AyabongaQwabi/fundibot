'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';
import { InstitutionLogo } from '../components/InstitutionLogo';
import { INSTITUTION_TYPE_FILTERS } from '@/lib/tools/constants';
import type { ToolInstitution, ToolProgramme, InstitutionType } from '@/lib/tools/types';

type Props = {
  institutions: ToolInstitution[];
  programmes: ToolProgramme[];
};

// Named color → hex. Covers every value found in the seed data.
const NAMED_COLORS: Record<string, string> = {
  // standard
  red: '#dc2626',
  blue: '#2563eb',
  green: '#16a34a',
  yellow: '#ca8a04',
  orange: '#ea580c',
  purple: '#7c3aed',
  pink: '#db2777',
  black: '#000000',
  white: '#ffffff',
  gold: '#b45309',
  grey: '#6b7280',
  gray: '#6b7280',
  // extended / descriptive
  maroon: '#7f1d1d',
  turquoise: '#0d9488',
  sapphire: '#1d4ed8',
  dandelion: '#ca8a04',
  skyblue: '#0ea5e9',
  'baby blue': '#38bdf8',
  'royal blue': '#1d4ed8',
  'light blue': '#38bdf8',
  'dark blue': '#1e3a8a',
  'light purple': '#a78bfa',
  'confident maroon': '#7f1d1d',
  'brilliant gold': '#b45309',
};

function parseColor(raw: string): string {
  const normalized = raw.trim().toLowerCase();
  return NAMED_COLORS[normalized] ?? '#64748b'; // slate-500 fallback
}

/** Blend a hex color with white to produce a muted pastel version. */
function mutedHex(hex: string, factor = 0.18): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mr = Math.round(r + (255 - r) * (1 - factor));
  const mg = Math.round(g + (255 - g) * (1 - factor));
  const mb = Math.round(b + (255 - b) * (1 - factor));
  return `rgb(${mr},${mg},${mb})`;
}

/** Relative luminance (WCAG). */
function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Pick black or white text to meet ≥4.5:1 contrast against a background. */
function readableTextColor(bgHex: string): string {
  return contrastRatio(bgHex, '#ffffff') >= 4.5 ? '#ffffff' : '#0f172a';
}

type CardColors = {
  accent: string;      // saturated accent for left border & badge bg
  cardBg: string;      // very light muted card background
  badgeBg: string;     // muted accent for programme badge
  badgeText: string;   // readable text on badge
  linkColor: string;   // accent for website link
};

function resolveCardColors(colors: string[] | null): CardColors {
  const fallbackAccent = '#64748b';

  let accent = fallbackAccent;

  if (colors && colors.length > 0) {
    const parsed = parseColor(colors[0]);
    // For very dark / near-black colors, nudge to a mid-tone for accent use
    const lum = luminance(parsed);
    if (lum < 0.02) {
      // near-black — use slate accent so card doesn't look broken
      accent = '#334155';
    } else if (lum > 0.9) {
      // near-white — find next usable color
      const next = colors.slice(1).map(parseColor).find((h) => luminance(h) < 0.9);
      accent = next ?? fallbackAccent;
    } else {
      accent = parsed;
    }
  }

  const cardBg = mutedHex(accent, 0.08);   // very faint wash
  const badgeBg = mutedHex(accent, 0.25);  // slightly more saturated badge
  const badgeText = readableTextColor(badgeBg);
  const linkColor = luminance(accent) < 0.5 ? accent : '#0369a1'; // keep links legible

  return { accent, cardBg, badgeBg, badgeText, linkColor };
}

export function CourseFinderClient({ institutions, programmes }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | InstitutionType>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const provinces = Array.from(new Set(institutions.map((i) => i.province))).sort();

  const fuse = useMemo(() => {
    return new Fuse(programmes, {
      keys: ['normalized_name', 'name'],
      threshold: 0.3,
      minMatchCharLength: 2,
    });
  }, [programmes]);

  const filteredProgrammes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).map((r) => r.item);
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
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-900 pb-12 pt-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ToolsBreadcrumb currentPage="Course & Institution Finder" />
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Course & Institution Finder
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/60">
            Search for a course and filter by province to find universities and colleges offering
            that qualification.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-900">Course name</label>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Start typing a course name..."
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {showSuggestions && searchQuery.trim() && uniqueCourses.length > 0 && (
                <div className="absolute top-full z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                  {uniqueCourses.map((course) => (
                    <button
                      key={course}
                      onClick={() => {
                        setSearchQuery(course);
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-900">Province</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2"
                >
                  <option value="">All provinces</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  Institution type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as 'all' | InstitutionType)}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2"
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
              <p className="text-sm font-semibold text-slate-900">
                Found{' '}
                <span className="text-slate-600">
                  {results.length} institution{results.length !== 1 ? 's' : ''}
                </span>{' '}
                offering &ldquo;{searchQuery}&rdquo;
              </p>

              <div className="mt-4 space-y-3">
                {results.map(({ institution, programmes: instProgrammes }) => {
                  const { accent, cardBg, badgeBg, badgeText, linkColor } = resolveCardColors(
                    institution.colors,
                  );

                  return (
                    <div
                      key={institution.id}
                      style={{
                        backgroundColor: cardBg,
                        borderLeftColor: accent,
                      }}
                      className="rounded-2xl border border-slate-200/80 border-l-4 p-5 transition-shadow hover:shadow-md"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <InstitutionLogo logo={institution.logo} name={institution.name} />
                          <div>
                            <h3 className="font-bold text-slate-900 leading-snug">
                              {institution.short_name && institution.short_name.trim() !== '' && (
                                <span style={{ color: accent }} className="mr-1.5 font-extrabold">
                                  {institution.short_name}
                                </span>
                              )}
                              <span className="font-semibold text-slate-700">{institution.name}</span>
                            </h3>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {institution.city} · {institution.province}
                            </p>
                          </div>
                        </div>

                        {/* Institution type pill */}
                        <span
                          style={{ backgroundColor: badgeBg, color: badgeText }}
                          className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                        >
                          {institution.institution_type.replace(/-/g, ' ')}
                        </span>
                      </div>

                      {/* Programmes */}
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Matching programmes
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {instProgrammes.map((prog, idx) => (
                            <li
                              key={`${institution.id}-${prog.name}-${idx}`}
                              className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-slate-700"
                            >
                              <span
                                style={{ color: accent }}
                                className="mt-0.5 text-xs leading-none"
                                aria-hidden
                              >
                                ▸
                              </span>
                              <span>{prog.name}</span>
                              {prog.min_aps && prog.min_aps !== 0 && (
                                <span className="text-xs text-slate-400">APS {prog.min_aps}+</span>
                              )}
                              {prog.qualification_type && (
                                <span
                                  style={{ backgroundColor: badgeBg, color: badgeText }}
                                  className="rounded px-1.5 py-0.5 text-xs font-medium"
                                >
                                  {prog.qualification_type}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Footer */}
                      {institution.official_website && (
                        <div className="mt-4 border-t border-slate-200/60 pt-3">
                          <a
                            href={institution.official_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: linkColor }}
                            className="text-sm font-medium hover:underline"
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
          ) : searchQuery ? (
            <div className="rounded-2xl bg-amber-50 p-4 text-amber-900">
              <p className="text-sm">
                No results for &ldquo;{searchQuery}&rdquo;. Try a different course name or browse
                available programmes.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
              <p className="text-sm">Enter a course name above to search for institutions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
