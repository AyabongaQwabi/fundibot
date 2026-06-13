'use client';

import { useState, useMemo } from 'react';
import { Calendar, Bell, ExternalLink, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';
import type { ToolInstitution } from '@/lib/tools/types';

type Deadline = {
  institutionId?: string;
  institution: string;
  type: 'university' | 'university-of-technology' | 'tvet-college';
  province: string;
  applicationOpen: string | null;  // ISO date or null
  applicationClose: string | null; // ISO date or null
  website: string | null;
  notes: string | null;
};

// Known 2025/2026 application deadlines — sourced from institutional websites
const DEADLINES: Deadline[] = [
  { institution: 'University of Cape Town (UCT)', type: 'university', province: 'Western Cape', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.uct.ac.za/apply', notes: 'Some faculties close earlier.' },
  { institution: 'University of the Witwatersrand (Wits)', type: 'university', province: 'Gauteng', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.wits.ac.za/apply', notes: null },
  { institution: 'Stellenbosch University (SU)', type: 'university', province: 'Western Cape', applicationOpen: '2025-03-01', applicationClose: '2025-09-30', website: 'https://www.sun.ac.za/apply', notes: 'Some programmes close in July.' },
  { institution: 'University of Pretoria (UP)', type: 'university', province: 'Gauteng', applicationOpen: '2025-03-01', applicationClose: '2025-09-30', website: 'https://www.up.ac.za/apply', notes: null },
  { institution: 'University of KwaZulu-Natal (UKZN)', type: 'university', province: 'KwaZulu-Natal', applicationOpen: '2025-05-01', applicationClose: '2025-09-30', website: 'https://applications.ukzn.ac.za', notes: null },
  { institution: 'University of Johannesburg (UJ)', type: 'university', province: 'Gauteng', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.uj.ac.za/apply', notes: null },
  { institution: 'Rhodes University', type: 'university', province: 'Eastern Cape', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.ru.ac.za/apply', notes: null },
  { institution: 'University of the Free State (UFS)', type: 'university', province: 'Free State', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.ufs.ac.za/apply', notes: null },
  { institution: 'University of the Western Cape (UWC)', type: 'university', province: 'Western Cape', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.uwc.ac.za/apply', notes: null },
  { institution: 'North-West University (NWU)', type: 'university', province: 'North West', applicationOpen: '2025-03-01', applicationClose: '2025-08-31', website: 'https://www.nwu.ac.za/apply', notes: null },
  { institution: 'University of Limpopo (UL)', type: 'university', province: 'Limpopo', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.ul.ac.za/apply', notes: null },
  { institution: 'University of Venda (UNIVEN)', type: 'university', province: 'Limpopo', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.univen.ac.za/apply', notes: null },
  { institution: 'Walter Sisulu University (WSU)', type: 'university', province: 'Eastern Cape', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.wsu.ac.za/apply', notes: null },
  { institution: 'Nelson Mandela University (NMU)', type: 'university', province: 'Eastern Cape', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.mandela.ac.za/apply', notes: null },
  { institution: 'Sol Plaatje University (SPU)', type: 'university', province: 'Northern Cape', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.spu.ac.za/apply', notes: null },
  { institution: 'Mangosuthu University of Technology (MUT)', type: 'university-of-technology', province: 'KwaZulu-Natal', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.mut.ac.za/apply', notes: null },
  { institution: 'Durban University of Technology (DUT)', type: 'university-of-technology', province: 'KwaZulu-Natal', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.dut.ac.za/apply', notes: null },
  { institution: 'Cape Peninsula University of Technology (CPUT)', type: 'university-of-technology', province: 'Western Cape', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.cput.ac.za/apply', notes: null },
  { institution: 'Tshwane University of Technology (TUT)', type: 'university-of-technology', province: 'Gauteng', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.tut.ac.za/apply', notes: null },
  { institution: 'Central University of Technology (CUT)', type: 'university-of-technology', province: 'Free State', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.cut.ac.za/apply', notes: null },
  { institution: 'Vaal University of Technology (VUT)', type: 'university-of-technology', province: 'Gauteng', applicationOpen: '2025-04-01', applicationClose: '2025-09-30', website: 'https://www.vut.ac.za/apply', notes: null },
  { institution: 'TVET Colleges (most)', type: 'tvet-college', province: 'All provinces', applicationOpen: '2025-01-01', applicationClose: null, website: null, notes: 'TVET colleges accept applications on a rolling basis. Visit your nearest college or check the DHET website.' },
];

const TYPE_LABELS: Record<string, string> = {
  university: 'University',
  'university-of-technology': 'University of Technology',
  'tvet-college': 'TVET College',
};

function deadlineStatus(closeDate: string | null): 'open' | 'closing-soon' | 'closed' | 'unknown' {
  if (!closeDate) return 'unknown';
  const now = new Date();
  const close = new Date(closeDate);
  const diffDays = (close.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return 'closed';
  if (diffDays <= 30) return 'closing-soon';
  return 'open';
}

function StatusBadge({ status }: { status: 'open' | 'closing-soon' | 'closed' | 'unknown' }) {
  const map = {
    open: { label: 'Open', cls: 'bg-emerald-50 text-emerald-700', icon: CheckCircle },
    'closing-soon': { label: 'Closing Soon', cls: 'bg-amber-50 text-amber-700', icon: Clock },
    closed: { label: 'Closed', cls: 'bg-red-50 text-red-600', icon: AlertCircle },
    unknown: { label: 'Rolling / Check Website', cls: 'bg-slate-100 text-slate-500', icon: Info },
  };
  const { label, cls, icon: Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      <Icon className='h-3.5 w-3.5' />
      {label}
    </span>
  );
}

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
}

type Props = { institutions: ToolInstitution[] };

export function DeadlineTrackerClient({ institutions }: Props) {
  const [filterProvince, setFilterProvince] = useState('');
  const [filterType, setFilterType] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const provinces = ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'];

  const filtered = useMemo(() => {
    return DEADLINES.filter(
      (d) =>
        (!filterProvince || d.province === filterProvince || d.province === 'All provinces') &&
        (!filterType || d.type === filterType),
    );
  }, [filterProvince, filterType]);

  const toggleSave = (name: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className='mx-auto max-w-5xl px-4 py-8 sm:px-6'>
      <ToolsBreadcrumb items={[{ label: 'Tools', href: '/tools' }, { label: 'Application Deadline Tracker' }]} />

      <div className='mb-8'>
        <h1 className='text-2xl font-extrabold text-slate-900 md:text-3xl'>Application Deadline Tracker</h1>
        <p className='mt-2 text-slate-500'>
          Browse application opening and closing dates per institution. Save the ones relevant to you.
        </p>
      </div>

      {/* Filters */}
      <div className='mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3'>
        <select
          value={filterProvince}
          onChange={(e) => setFilterProvince(e.target.value)}
          className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700'
        >
          <option value=''>All provinces</option>
          {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700'
        >
          <option value=''>All types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        {(filterProvince || filterType) && (
          <button onClick={() => { setFilterProvince(''); setFilterType(''); }} className='text-xs text-brand-blue hover:underline'>
            Clear
          </button>
        )}
      </div>

      {/* Saved section */}
      {saved.size > 0 && (
        <div className='mb-6 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-4'>
          <p className='mb-2 text-xs font-semibold uppercase tracking-widest text-brand-blue'>Saved deadlines</p>
          <div className='flex flex-wrap gap-2'>
            {[...saved].map((name) => (
              <span key={name} className='flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-card'>
                <Bell className='h-3 w-3 text-brand-blue' />
                {name}
                <button onClick={() => toggleSave(name)} className='text-slate-400 hover:text-slate-700'>×</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Deadline cards */}
      <div className='space-y-3'>
        {filtered.map((d) => {
          const status = deadlineStatus(d.applicationClose);
          const isSaved = saved.has(d.institution);
          return (
            <div key={d.institution} className='rounded-2xl border border-slate-100 bg-white p-5 shadow-card'>
              <div className='flex flex-wrap items-start justify-between gap-3'>
                <div className='flex-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <h3 className='font-bold text-slate-900'>{d.institution}</h3>
                    <StatusBadge status={status} />
                  </div>
                  <div className='mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500'>
                    <span>{TYPE_LABELS[d.type]}</span>
                    <span>·</span>
                    <span>{d.province}</span>
                  </div>
                  <div className='mt-3 grid gap-2 text-sm sm:grid-cols-2'>
                    <div>
                      <span className='text-xs font-semibold text-slate-400'>Applications open</span>
                      <p className='text-slate-700'>{formatDate(d.applicationOpen)}</p>
                    </div>
                    <div>
                      <span className='text-xs font-semibold text-slate-400'>Applications close</span>
                      <p className='text-slate-700'>{formatDate(d.applicationClose)}</p>
                    </div>
                  </div>
                  {d.notes && (
                    <p className='mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5'>{d.notes}</p>
                  )}
                  {status === 'unknown' && d.website && (
                    <p className='mt-2 text-xs text-slate-500'>
                      Deadline not available in dataset — visit the{' '}
                      <a href={d.website} target='_blank' rel='noopener noreferrer' className='text-brand-blue hover:underline'>
                        official website
                      </a>{' '}
                      for current dates.
                    </p>
                  )}
                </div>
                <div className='flex items-center gap-2'>
                  {d.website && (
                    <a
                      href={d.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50'
                    >
                      Apply <ExternalLink className='h-3 w-3' />
                    </a>
                  )}
                  <button
                    onClick={() => toggleSave(d.institution)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSaved
                        ? 'bg-brand-blue text-white'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Bell className='h-3 w-3' />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className='rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400'>
          <Calendar className='mx-auto mb-3 h-8 w-8 opacity-30' />
          <p>No deadlines found for the selected filters.</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className='mt-8 flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500'>
        <Info className='mt-0.5 h-4 w-4 shrink-0' />
        <span>
          Application dates shown are based on historical patterns and publicly available information. Dates may change — always verify with the institution directly before submitting your application. This information is based on scraped data and may not reflect the most current requirements.
        </span>
      </div>
    </div>
  );
}
