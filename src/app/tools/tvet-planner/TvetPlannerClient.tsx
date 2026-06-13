'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, Info, ExternalLink } from 'lucide-react';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';
import { InstitutionLogo } from '../components/InstitutionLogo';
import type { ToolInstitution, ToolProgramme } from '@/lib/tools/types';

// NCV pathway explanation
const NCV_LEVELS = [
  {
    level: 'NCV Level 2',
    entry: 'Grade 9 pass',
    duration: '1 year',
    description: 'Entry level — equivalent to Grade 10. Provides foundational vocational skills.',
    unlocks: ['NCV Level 3'],
  },
  {
    level: 'NCV Level 3',
    entry: 'NCV Level 2 pass',
    duration: '1 year',
    description: 'Intermediate level — equivalent to Grade 11.',
    unlocks: ['NCV Level 4'],
  },
  {
    level: 'NCV Level 4',
    entry: 'NCV Level 3 pass',
    duration: '1 year',
    description:
      'Final NCV level — equivalent to Grade 12. An NCV L4 certificate with distinctions may qualify for university admission.',
    unlocks: ['University of Technology entry (with merits)', 'Employment in sector', 'Further learnerships'],
  },
];

// NATED pathway
const NATED_LEVELS = [
  { level: 'N1', entry: 'Grade 9 pass', description: 'Foundational trade theory. Typically paired with workplace training.' },
  { level: 'N2', entry: 'N1 pass', description: 'Intermediate trade theory.' },
  { level: 'N3', entry: 'N2 pass', description: 'Advanced trade theory. N3 + 18 months practical = Trade Certificate (Red Seal).' },
  { level: 'N4', entry: 'Grade 12 / N3 pass', description: 'Business & engineering studies — NQF Level 5.' },
  { level: 'N5', entry: 'N4 pass', description: 'Second year of N Diploma studies.' },
  { level: 'N6', entry: 'N5 pass', description: 'N6 + 18 months workplace experience = National N Diploma.' },
];

const TVET_SECTORS: Record<string, { employment: string[]; furtherStudy: string[] }> = {
  'Engineering Studies': {
    employment: ['Electrician', 'Mechanic', 'Welder', 'Construction Worker', 'Maintenance Technician'],
    furtherStudy: ['University of Technology (Electrical/Mechanical Engineering)'],
  },
  'Business Studies': {
    employment: ['Office Administrator', 'Bookkeeper', 'HR Assistant', 'Sales Representative'],
    furtherStudy: ['Bachelor of Commerce', 'National Diploma in Management'],
  },
  'Hospitality': {
    employment: ['Chef', 'Hotel Receptionist', 'Food & Beverage Manager', 'Caterer'],
    furtherStudy: ['Diploma in Hospitality Management'],
  },
  'Information Technology': {
    employment: ['IT Technician', 'Help Desk Support', 'Network Administrator'],
    furtherStudy: ['Bachelor of IT', 'CompTIA Certification'],
  },
  'Agriculture': {
    employment: ['Farm Manager', 'Agricultural Technician', 'Irrigation Specialist'],
    furtherStudy: ['Diploma in Agriculture', 'BSc Agriculture'],
  },
  'Tourism': {
    employment: ['Tour Guide', 'Travel Agent', 'Game Lodge Receptionist'],
    furtherStudy: ['Diploma in Tourism Management'],
  },
  'Education & Development': {
    employment: ['ECD Practitioner', 'Youth Worker', 'Community Developer'],
    furtherStudy: ['Bachelor of Education (Foundation Phase)'],
  },
};

type Props = {
  institutions: ToolInstitution[];
  programmes: ToolProgramme[];
};

export function TvetPlannerClient({ institutions, programmes }: Props) {
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [activePathway, setActivePathway] = useState<'ncv' | 'nated'>('ncv');

  const provinces = [
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
    'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
  ];

  const tvetInstitutions = useMemo(
    () => institutions.filter((i) => i.institution_type === 'tvet-college'),
    [institutions],
  );

  const filteredTvets = useMemo(() => {
    return tvetInstitutions.filter(
      (i) => !selectedProvince || i.province === selectedProvince,
    );
  }, [tvetInstitutions, selectedProvince]);

  // Build a set of TVET institution IDs for fast lookup
  const tvetIds = useMemo(() => new Set(tvetInstitutions.map((i) => i.id)), [tvetInstitutions]);

  // Build institution map for province filtering of programmes
  const instById = useMemo(() => {
    const map = new Map<string, typeof institutions[0]>();
    for (const i of institutions) map.set(i.id, i);
    return map;
  }, [institutions]);

  // Find TVET programmes matching sector keyword
  const sectorProgrammes = useMemo(() => {
    if (!selectedSector) return [];
    const lower = selectedSector.toLowerCase().split(' ')[0];
    return programmes.filter((p) => {
      if (!tvetIds.has(p.institution_id)) return false;
      const inst = instById.get(p.institution_id);
      if (selectedProvince && inst?.province !== selectedProvince) return false;
      return (
        p.name.toLowerCase().includes(lower) ||
        (p.faculty_name ?? '').toLowerCase().includes(lower)
      );
    });
  }, [selectedSector, programmes, selectedProvince, tvetIds, instById]);

  const sectorInfo = selectedSector ? TVET_SECTORS[selectedSector] : null;

  return (
    <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6'>
      <ToolsBreadcrumb items={[{ label: 'Tools', href: '/tools' }, { label: 'TVET & NCV Pathway Planner' }]} />

      <div className='mb-8'>
        <h1 className='text-2xl font-extrabold text-slate-900 md:text-3xl'>TVET & NCV Pathway Planner</h1>
        <p className='mt-2 text-slate-500'>
          Understand the NCV and NATED pathways — what each level unlocks and where it can take you.
        </p>
      </div>

      {/* Pathway toggle */}
      <div className='mb-8 flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1'>
        {(['ncv', 'nated'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setActivePathway(p)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              activePathway === p
                ? 'bg-white shadow-card text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {p === 'ncv' ? 'NCV Pathway (Levels 2–4)' : 'NATED Pathway (N1–N6)'}
          </button>
        ))}
      </div>

      {/* NCV Pathway */}
      {activePathway === 'ncv' && (
        <div className='mb-10 space-y-4'>
          <p className='text-sm text-slate-600'>
            The <strong>National Certificate (Vocational)</strong> is a 3-year programme at TVET colleges from Level 2 to
            Level 4. It replaces the traditional Grade 10–12 schooling pathway with a vocational focus.
          </p>
          <div className='space-y-3'>
            {NCV_LEVELS.map((level, i) => (
              <div key={level.level} className='flex gap-4'>
                <div className='flex flex-col items-center'>
                  <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white'>
                    {i + 1}
                  </div>
                  {i < NCV_LEVELS.length - 1 && (
                    <div className='mt-1 flex-1 w-0.5 bg-brand-blue/20' style={{ minHeight: 40 }} />
                  )}
                </div>
                <div className='pb-6'>
                  <h3 className='font-bold text-slate-900'>{level.level}</h3>
                  <p className='text-xs text-slate-500'>Entry: {level.entry} · Duration: {level.duration}</p>
                  <p className='mt-1 text-sm text-slate-600'>{level.description}</p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {level.unlocks.map((u) => (
                      <span key={u} className='flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600'>
                        <ChevronRight className='h-3 w-3 text-brand-blue' /> {u}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NATED Pathway */}
      {activePathway === 'nated' && (
        <div className='mb-10 space-y-4'>
          <p className='text-sm text-slate-600'>
            The <strong>NATED</strong> (formerly Nated Report 191) qualification runs from N1 to N6. Completing N6 plus
            18 months of approved workplace experience leads to a <strong>National N Diploma</strong>.
          </p>
          <div className='grid gap-3 sm:grid-cols-2'>
            {NATED_LEVELS.map((level) => (
              <div key={level.level} className='rounded-xl border border-slate-100 bg-white p-4 shadow-card'>
                <div className='flex items-center gap-2'>
                  <span className='flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700'>
                    {level.level}
                  </span>
                  <span className='text-xs text-slate-500'>Entry: {level.entry}</span>
                </div>
                <p className='mt-2 text-sm text-slate-600'>{level.description}</p>
              </div>
            ))}
          </div>
          <div className='rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800'>
            <strong>N3 trade route:</strong> N1 + N2 + N3 + 18 months practical experience = Artisan Trade Certificate
            (Red Seal). Recognised nationally for trades like electrician, plumber, and boilermaker.
          </div>
        </div>
      )}

      {/* Find TVET colleges */}
      <div className='mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
        <h2 className='mb-4 text-base font-bold text-slate-900'>Find TVET Colleges</h2>
        <div className='flex flex-wrap gap-3'>
          <div>
            <label className='mb-1 block text-xs font-semibold text-slate-500'>Province</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className='rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-brand-blue focus:outline-none'
            >
              <option value=''>All provinces</option>
              {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className='mb-1 block text-xs font-semibold text-slate-500'>Trade / Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className='rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-brand-blue focus:outline-none'
            >
              <option value=''>All sectors</option>
              {Object.keys(TVET_SECTORS).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Sector info */}
        {sectorInfo && (
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            <div className='rounded-xl bg-slate-50 p-4'>
              <p className='mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400'>Employment sectors</p>
              <ul className='space-y-1 text-sm text-slate-700'>
                {sectorInfo.employment.map((e) => (
                  <li key={e} className='flex items-center gap-1.5'>
                    <span className='h-1.5 w-1.5 rounded-full bg-brand-blue' /> {e}
                  </li>
                ))}
              </ul>
            </div>
            <div className='rounded-xl bg-slate-50 p-4'>
              <p className='mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400'>Further study options</p>
              <ul className='space-y-1 text-sm text-slate-700'>
                {sectorInfo.furtherStudy.map((f) => (
                  <li key={f} className='flex items-center gap-1.5'>
                    <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Matching programmes from dataset */}
        {selectedSector && sectorProgrammes.length > 0 && (
          <div className='mt-5'>
            <p className='mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400'>
              Matching programmes in dataset ({sectorProgrammes.length})
            </p>
            <div className='max-h-56 space-y-2 overflow-y-auto'>
              {sectorProgrammes.slice(0, 30).map((p, i) => {
                const inst = filteredTvets.find((t) => t.id === p.institution_id);
                return (
                  <div key={i} className='flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm'>
                    <span className='text-slate-700'>{p.name}</span>
                    <span className='text-xs text-slate-400'>{inst?.name ?? p.institution_id}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TVET institutions list */}
        <div className='mt-5'>
          <p className='mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400'>
            TVET Colleges{selectedProvince ? ` in ${selectedProvince}` : ''} ({filteredTvets.length})
          </p>
          <div className='grid gap-3 sm:grid-cols-2'>
            {filteredTvets.map((inst) => (
              <div key={inst.id} className='flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2'>
                <InstitutionLogo logo={inst.logo} name={inst.name} className='!h-7 !w-16' />
                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium text-slate-800'>{inst.name}</p>
                  <p className='text-xs text-slate-400'>{inst.province}</p>
                </div>
                {inst.official_website && (
                  <a href={inst.official_website} target='_blank' rel='noopener noreferrer' className='ml-auto text-slate-400 hover:text-brand-blue'>
                    <ExternalLink className='h-4 w-4' />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500'>
        <Info className='mt-0.5 h-4 w-4 shrink-0' />
        <span>
          This information is based on scraped data and may not reflect the most current requirements.
          Entry requirements and pathway rules are set by the DHET. Always verify with the institution directly.
        </span>
      </div>
    </div>
  );
}
