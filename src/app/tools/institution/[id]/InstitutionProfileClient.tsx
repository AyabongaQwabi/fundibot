'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { InstitutionLogo } from '../../components/InstitutionLogo';
import { ToolsBreadcrumb } from '../../components/ToolsBreadcrumb';
import type { InstitutionProfile } from '@/lib/tools/types';

type Props = { profile: InstitutionProfile };

const INSTITUTION_TYPE_LABEL: Record<string, string> = {
  university: 'University',
  'university-of-technology': 'University of Technology',
  'tvet-college': 'TVET College',
  seta: 'SETA',
};

const TABS = ['Overview', 'Programmes', 'Faculties', 'Campuses', 'Admission', 'Contact'] as const;
type Tab = (typeof TABS)[number];

export function InstitutionProfileClient({ profile }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [programmeSearch, setProgrammeSearch] = useState('');
  const [qualFilter, setQualFilter] = useState('');

  const qualTypes = useMemo(
    () => Array.from(new Set(profile.programmes.map((p) => p.qualification_type).filter(Boolean))).sort() as string[],
    [profile.programmes],
  );

  const filteredProgrammes = useMemo(() => {
    return profile.programmes.filter((p) => {
      const matchesSearch =
        !programmeSearch ||
        p.name.toLowerCase().includes(programmeSearch.toLowerCase());
      const matchesQual = !qualFilter || p.qualification_type === qualFilter;
      return matchesSearch && matchesQual;
    });
  }, [profile.programmes, programmeSearch, qualFilter]);

  // Tabs that have content
  const availableTabs = TABS.filter((t) => {
    if (t === 'Faculties') return profile.faculties.length > 0;
    if (t === 'Campuses') return profile.campuses.length > 0;
    if (t === 'Programmes') return profile.programmes.length > 0;
    if (t === 'Admission') return profile.admission != null;
    if (t === 'Contact') return profile.contact != null;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-sky-700 pb-10 pt-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ToolsBreadcrumb
            currentPage={profile.short_name ?? profile.name}
            extraCrumbs={[{ label: 'Institutions', href: '/tools/institutions' }]}
          />
          <div className="mt-4 flex items-start gap-5">
            <InstitutionLogo logo={profile.logo} name={profile.name} className="mt-1 ring-white/20" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/70">
                  {INSTITUTION_TYPE_LABEL[profile.institution_type] ?? profile.institution_type}
                </span>
                {profile.nsfas_supported && (
                  <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-300">
                    NSFAS Supported
                  </span>
                )}
                {profile.distance_learning && (
                  <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-300">
                    Distance Learning
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm text-white/60">
                {profile.city} · {profile.province}
                {profile.motto && <> · <em>{profile.motto}</em></>}
              </p>
            </div>
          </div>

          {/* Quick action links */}
          <div className="mt-6 flex flex-wrap gap-3">
            {profile.official_website && (
              <a href={profile.official_website} target="_blank" rel="noopener noreferrer"
                className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/20">
                Official Website →
              </a>
            )}
            {profile.application_url && (
              <a href={profile.application_url} target="_blank" rel="noopener noreferrer"
                className="rounded-full bg-brand-blue px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-blue-dark">
                Apply Now →
              </a>
            )}
            {profile.prospectus_url && (
              <a href={profile.prospectus_url} target="_blank" rel="noopener noreferrer"
                className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/20">
                Prospectus →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto">
            {availableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
                {tab === 'Programmes' && profile.programmes.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                    {profile.programmes.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        {/* ── OVERVIEW ── */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {profile.student_count && (
                <StatCard label="Students" value={Number(profile.student_count.replace(/,/g, '')).toLocaleString()} />
              )}
              {profile.programmes.length > 0 && (
                <StatCard label="Programmes" value={String(profile.programmes.length)} />
              )}
              {profile.faculties.length > 0 && (
                <StatCard label="Faculties" value={String(profile.faculties.length)} />
              )}
              {profile.campuses.length > 0 && (
                <StatCard label="Campuses" value={String(profile.campuses.length)} />
              )}
            </div>

            {/* Info card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <h2 className="font-semibold text-slate-900">Institution details</h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                <Detail label="Type" value={INSTITUTION_TYPE_LABEL[profile.institution_type]} />
                <Detail label="Province" value={profile.province} />
                <Detail label="City" value={profile.city} />
                {profile.motto && <Detail label="Motto" value={profile.motto} />}
                {profile.accreditation && (
                  <Detail
                    label="Accreditation"
                    value={Object.entries(profile.accreditation).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                  />
                )}
                {profile.qualification_types.length > 0 && (
                  <Detail label="Qualifications offered" value={profile.qualification_types.join(', ')} />
                )}
              </dl>
            </div>

            {/* Faculties preview */}
            {profile.faculties.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Faculties & departments</h2>
                  <button onClick={() => setActiveTab('Faculties')}
                    className="text-sm text-brand-blue hover:underline">View all</button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.faculties.slice(0, 8).map((f, i) => (
                    <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                      {f.name}
                    </span>
                  ))}
                  {profile.faculties.length > 8 && (
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-400">
                      +{profile.faculties.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Campuses preview */}
            {profile.campuses.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Campuses</h2>
                  {profile.campuses.length > 3 && (
                    <button onClick={() => setActiveTab('Campuses')}
                      className="text-sm text-brand-blue hover:underline">View all</button>
                  )}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {profile.campuses.slice(0, 4).map((c, i) => (
                    <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <p className="font-medium text-slate-800 text-sm">{c.name}</p>
                      {(c.city || c.province) && (
                        <p className="mt-0.5 text-xs text-slate-500">{[c.city, c.province].filter(Boolean).join(', ')}</p>
                      )}
                      {c.type && <p className="mt-0.5 text-xs text-slate-400">{c.type}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PROGRAMMES ── */}
        {activeTab === 'Programmes' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={programmeSearch}
                onChange={(e) => setProgrammeSearch(e.target.value)}
                placeholder="Search programmes..."
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {qualTypes.length > 1 && (
                <select
                  value={qualFilter}
                  onChange={(e) => setQualFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                >
                  <option value="">All qualifications</option>
                  {qualTypes.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Showing {filteredProgrammes.length} of {profile.programmes.length} programmes
            </p>

            {/* Group by faculty */}
            {(() => {
              const byFaculty = new Map<string, typeof filteredProgrammes>();
              for (const p of filteredProgrammes) {
                const key = p.faculty_name ?? 'Other';
                if (!byFaculty.has(key)) byFaculty.set(key, []);
                byFaculty.get(key)!.push(p);
              }
              return Array.from(byFaculty.entries()).map(([faculty, progs]) => (
                <div key={faculty} className="rounded-2xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 px-5 py-3">
                    <h3 className="text-sm font-semibold text-slate-700">{faculty}</h3>
                  </div>
                  <ul className="divide-y divide-slate-100">
                    {progs.map((p, i) => (
                      <li key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3">
                        <span className="text-sm text-slate-800">{p.name}</span>
                        {p.qualification_type && (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                            {formatQualType(p.qualification_type, p.name)}
                          </span>
                        )}
                        {p.min_aps && p.min_aps > 1 && profile.points_system === 'aps_points' && (
                          <span className="text-xs text-slate-400">APS {p.min_aps}+</span>
                        )}
                        {p.duration && (
                          <span className="text-xs text-slate-400">{p.duration}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ));
            })()}

            {filteredProgrammes.length === 0 && (
              <div className="rounded-2xl bg-slate-50 p-8 text-center text-slate-500 text-sm">
                No programmes match your search.
              </div>
            )}
          </div>
        )}

        {/* ── FACULTIES ── */}
        {activeTab === 'Faculties' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.faculties.map((f, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-semibold text-slate-900 capitalize">{f.name.toLowerCase()}</h3>
                {f.kind && f.kind !== f.name && (
                  <p className="mt-0.5 text-xs text-slate-400 capitalize">{f.kind}</p>
                )}
                {f.overview && f.overview !== f.name && (
                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">{f.overview}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── CAMPUSES ── */}
        {activeTab === 'Campuses' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.campuses.map((c, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{c.name}</h3>
                  {c.type && (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
                      {c.type}
                    </span>
                  )}
                </div>
                {(c.city || c.province) && (
                  <p className="text-sm text-slate-600">
                    {[c.city, c.province].filter(Boolean).join(', ')}
                  </p>
                )}
                {c.address && (
                  <p className="text-xs text-slate-500">{c.address}</p>
                )}
                {c.coordinates?.lat && c.coordinates?.lng && (
                  <a
                    href={`https://maps.google.com/?q=${c.coordinates.lat},${c.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-medium text-brand-blue hover:underline"
                  >
                    View on map →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── ADMISSION ── */}
        {activeTab === 'Admission' && profile.admission && (
          <div className="space-y-5">

            {/* Points system notice for special institutions */}
            {profile.points_system === 'uwc_points' && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">UWC Points System</p>
                <p className="mt-1 text-sm text-amber-800">
                  UWC does not use the standard NSC APS. Admission is based on UWC Points — a weighted score
                  where percentages map to codes (Code 4 = 50–59%, Code 5 = 60–69%, etc.). Language subjects
                  require at least English Code 4 and another language Code 3 across all faculties.
                </p>
              </div>
            )}
            {profile.points_system === 'uct_fps' && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 space-y-2">
                <p className="text-sm font-semibold text-blue-900">UCT Faculty Points System (FPS / WPS)</p>
                <p className="text-sm text-blue-800">
                  UCT uses a three-band system. Band A (Guaranteed) uses your Faculty Points Score (FPS);
                  Band B (Probable) uses a Weighted Points Score (WPS) that adds a disadvantage factor for SA
                  applicants; Band C (Possible) is for SA redress applicants only.
                </p>
                <p className="text-sm text-blue-800">
                  Technical Mathematics and Technical Science cannot substitute for Mathematics or Physical
                  Sciences. Health Sciences and Science faculties require NBT results.
                </p>
              </div>
            )}
            {profile.points_system === 'up_points' && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">
                  UP uses its own points calculation system. Verify requirements directly with the university.
                </p>
              </div>
            )}
            {profile.points_system === 'tvet_none' && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">
                  TVET colleges do not use APS scores. Entry is based on the NCV level or NATED programme
                  applied for. NCV Level 2 requires Grade 9; NATED N4–N6 requires Grade 12.
                </p>
              </div>
            )}

            {/* Standard APS summary */}
            {profile.points_system === 'aps_points' &&
              (profile.admission.minimum_aps_for_bachelors || profile.admission.minimum_aps_for_diplomas || profile.admission.aps_calculation_notes) && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                <h2 className="font-semibold text-slate-900">APS Requirements</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {profile.admission.minimum_aps_for_bachelors && (
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Minimum APS for Bachelor&apos;s</p>
                      <p className="mt-1 text-3xl font-bold text-slate-900">{profile.admission.minimum_aps_for_bachelors}</p>
                    </div>
                  )}
                  {profile.admission.minimum_aps_for_diplomas && (
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Minimum APS for Diplomas</p>
                      <p className="mt-1 text-3xl font-bold text-slate-900">{profile.admission.minimum_aps_for_diplomas}</p>
                    </div>
                  )}
                </div>
                {profile.admission.aps_calculation_notes && (
                  <p className="text-sm text-slate-600">{profile.admission.aps_calculation_notes}</p>
                )}
                {profile.admission.life_orientation_cap && (
                  <p className="text-sm text-slate-500">
                    Life Orientation capped at {profile.admission.life_orientation_cap} APS points
                  </p>
                )}
              </div>
            )}

            {/* APS rules */}
            {profile.admission.aps_rules && profile.admission.aps_rules.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
                <h2 className="font-semibold text-slate-900">Entry requirements by programme</h2>
                <ul className="divide-y divide-slate-100">
                  {profile.admission.aps_rules.map((rule, i) => (
                    <li key={i} className="py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          {rule.programme && (
                            <p className="text-sm font-medium text-slate-800">{rule.programme}</p>
                          )}
                          {rule.excerpt && (
                            <p className="mt-0.5 text-sm text-slate-600">{rule.excerpt}</p>
                          )}
                          {rule.scope && (
                            <p className="mt-0.5 text-xs text-slate-400 capitalize">{rule.scope}-level requirement</p>
                          )}
                        </div>
                        {rule.min_aps && profile.points_system === 'aps_points' && (
                          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                            APS {rule.min_aps}+
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {profile.application_url && (
              <a
                href={profile.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue-dark"
              >
                Apply to {profile.short_name ?? profile.name} →
              </a>
            )}
          </div>
        )}

        {/* ── CONTACT ── */}
        {activeTab === 'Contact' && profile.contact && (
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Phone */}
            {profile.contact.phone_numbers && profile.contact.phone_numbers.length > 0 && (
              <ContactCard title="Phone">
                {profile.contact.phone_numbers.map((n, i) => (
                  <a key={i} href={`tel:${n.replace(/\s/g, '')}`}
                    className="block text-sm text-brand-blue hover:underline">{n}</a>
                ))}
              </ContactCard>
            )}

            {/* Email */}
            {profile.contact.emails && profile.contact.emails.filter(isValidEmail).length > 0 && (
              <ContactCard title="Email">
                {profile.contact.emails.filter(isValidEmail).slice(0, 4).map((e, i) => (
                  <a key={i} href={`mailto:${e}`}
                    className="block text-sm text-brand-blue hover:underline truncate">{e}</a>
                ))}
              </ContactCard>
            )}

            {/* Physical address */}
            {profile.contact.physical_address && (
              <ContactCard title="Physical Address">
                <p className="text-sm text-slate-700">{profile.contact.physical_address}</p>
              </ContactCard>
            )}

            {/* Postal address */}
            {profile.contact.postal_address && (
              <ContactCard title="Postal Address">
                <p className="text-sm text-slate-700">{profile.contact.postal_address}</p>
              </ContactCard>
            )}

            {/* Social media */}
            {profile.contact.socials && Object.entries(profile.contact.socials).some(([, v]) => v) && (
              <ContactCard title="Social Media">
                {Object.entries(profile.contact.socials)
                  .filter(([, url]) => url)
                  .map(([platform, url]) => (
                    <a key={platform} href={url!} target="_blank" rel="noopener noreferrer"
                      className="block text-sm capitalize text-brand-blue hover:underline">
                      {platform} →
                    </a>
                  ))}
              </ContactCard>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small helpers ──

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-800">{value}</dd>
    </div>
  );
}

function ContactCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {children}
    </div>
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !email.includes(' ');
}
// Render TVET qual types with level detail; pass through university types unchanged
function formatQualType(qualType: string, progName: string): string {
  const qt = qualType.toLowerCase();
  const name = progName.toLowerCase();
  if (qt.includes('ncv') || qt.includes('national certificate vocational') || qt === 'nc(v)') {
    if (name.includes('level 2') || name.includes('ncv 2')) return 'NCV Certificate — Level 2';
    if (name.includes('level 3') || name.includes('ncv 3')) return 'NCV Certificate — Level 3';
    if (name.includes('level 4') || name.includes('ncv 4')) return 'NCV Certificate — Level 4';
    return 'NCV Certificate';
  }
  // N-certificate granularity
  for (const n of [2, 3, 4, 5, 6]) {
    if (qt === `n${n} certificate` || name.includes(`national certificate: n${n}`) || name.includes(` n${n}`) ) {
      return `N${n} Certificate`;
    }
  }
  return qualType;
}
