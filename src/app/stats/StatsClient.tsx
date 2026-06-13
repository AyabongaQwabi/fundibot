'use client';

import { useState, useMemo } from 'react';
import type { StatsData } from '@/lib/tools/stats';
import { Download, Info, ChevronUp, ChevronDown } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  university: 'University',
  'university-of-technology': 'University of Technology',
  'tvet-college': 'TVET College',
  seta: 'SETA',
};

const TYPE_COLORS: Record<string, string> = {
  university: '#2563EB',
  'university-of-technology': '#7C3AED',
  'tvet-college': '#059669',
  seta: '#D97706',
};

const CHART_COLORS = [
  '#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626',
  '#0891B2', '#DB2777', '#65A30D', '#EA580C', '#4338CA',
];

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────

function HorizontalBarChart({
  data,
  colorFn,
  maxBars = 20,
}: {
  data: Array<{ label: string; value: number; color?: string }>;
  colorFn?: (label: string) => string;
  maxBars?: number;
}) {
  const visible = data.slice(0, maxBars);
  const max = Math.max(...visible.map((d) => d.value), 1);
  const barHeight = 28;
  const gap = 6;
  const labelWidth = 220;
  const chartWidth = 400;
  const height = visible.length * (barHeight + gap);

  return (
    <div className='overflow-x-auto'>
      <svg
        viewBox={`0 0 ${labelWidth + chartWidth + 60} ${height + 20}`}
        className='w-full'
        style={{ minHeight: height + 20 }}
      >
        {visible.map((d, i) => {
          const y = i * (barHeight + gap);
          const barW = Math.max((d.value / max) * chartWidth, 2);
          const color = d.color ?? colorFn?.(d.label) ?? CHART_COLORS[i % CHART_COLORS.length];
          return (
            <g key={d.label}>
              <text
                x={labelWidth - 8}
                y={y + barHeight / 2 + 5}
                textAnchor='end'
                fontSize={11}
                fill='#64748B'
                className='font-sans'
              >
                {d.label.length > 32 ? d.label.slice(0, 30) + '…' : d.label}
              </text>
              <rect x={labelWidth} y={y} width={barW} height={barHeight} rx={4} fill={color} opacity={0.85} />
              <text x={labelWidth + barW + 6} y={y + barHeight / 2 + 5} fontSize={11} fill='#334155'>
                {d.value.toLocaleString()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── SVG Pie Chart ────────────────────────────────────────────────────────────

function PieChart({ data }: { data: Array<{ label: string; value: number; color: string }> }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 80;
  const cx = 100;
  const cy = 100;

  let startAngle = -Math.PI / 2;
  const slices = data.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    const midAngle = startAngle + angle / 2;
    startAngle = endAngle;
    return { ...d, path, midAngle, pct: Math.round((d.value / total) * 100) };
  });

  return (
    <div className='flex flex-col items-center gap-4 sm:flex-row sm:items-start'>
      <svg viewBox='0 0 200 200' className='w-40 shrink-0'>
        {slices.map((s) => (
          <path key={s.label} d={s.path} fill={s.color} stroke='white' strokeWidth={1.5} />
        ))}
      </svg>
      <ul className='flex flex-col gap-2 text-sm'>
        {slices.map((s) => (
          <li key={s.label} className='flex items-center gap-2'>
            <span className='h-3 w-3 shrink-0 rounded-sm' style={{ background: s.color }} />
            <span className='text-slate-700'>{s.label}</span>
            <span className='ml-auto pl-4 font-semibold text-slate-900'>
              {s.value.toLocaleString()} <span className='text-slate-400'>({s.pct}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
      <p className='text-3xl font-extrabold text-slate-900'>{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className='mt-1 text-sm font-semibold text-slate-700'>{label}</p>
      {sub && <p className='mt-0.5 text-xs text-slate-400'>{sub}</p>}
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

type SortKey = 'name' | 'type' | 'province' | 'programmeCount' | 'facultyCount';

function InstitutionTable({
  data,
  filterProvince,
  filterType,
}: {
  data: StatsData['institutionTable'];
  filterProvince: string;
  filterType: string;
}) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({
    key: 'programmeCount',
    dir: 'desc',
  });

  const filtered = useMemo(() => {
    return data
      .filter((r) => (!filterProvince || r.province === filterProvince) && (!filterType || r.type === filterType))
      .sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        const cmp = typeof av === 'number' ? (av as number) - (bv as number) : String(av).localeCompare(String(bv));
        return sort.dir === 'asc' ? cmp : -cmp;
      });
  }, [data, filterProvince, filterType, sort]);

  const toggle = (key: SortKey) => {
    setSort((prev) => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sort.key === k ? (
      sort.dir === 'asc' ? <ChevronUp className='ml-1 inline h-3 w-3' /> : <ChevronDown className='ml-1 inline h-3 w-3' />
    ) : (
      <ChevronDown className='ml-1 inline h-3 w-3 opacity-30' />
    );

  return (
    <div className='overflow-x-auto rounded-xl border border-slate-100'>
      <table className='w-full text-sm'>
        <thead className='border-b border-slate-100 bg-slate-50'>
          <tr>
            {(
              [
                ['name', 'Institution'],
                ['type', 'Type'],
                ['province', 'Province'],
                ['programmeCount', 'Programmes'],
                ['facultyCount', 'Faculties'],
              ] as [SortKey, string][]
            ).map(([k, label]) => (
              <th
                key={k}
                className='cursor-pointer px-4 py-3 text-left text-xs font-semibold text-slate-500 hover:text-slate-700'
                onClick={() => toggle(k)}
              >
                {label}
                <SortIcon k={k} />
              </th>
            ))}
            <th className='px-4 py-3 text-left text-xs font-semibold text-slate-500'>Pricing</th>
            <th className='px-4 py-3 text-left text-xs font-semibold text-slate-500'>Admission Reqs</th>
            <th className='px-4 py-3 text-left text-xs font-semibold text-slate-500'>Source</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-50'>
          {filtered.map((row) => (
            <tr key={row.id} className='hover:bg-slate-50/50'>
              <td className='px-4 py-3 font-medium text-slate-800'>{row.name}</td>
              <td className='px-4 py-3'>
                <span
                  className='rounded-full px-2 py-0.5 text-xs font-medium'
                  style={{
                    background: (TYPE_COLORS[row.type] ?? '#64748B') + '18',
                    color: TYPE_COLORS[row.type] ?? '#64748B',
                  }}
                >
                  {TYPE_LABELS[row.type] ?? row.type}
                </span>
              </td>
              <td className='px-4 py-3 text-slate-600'>{row.province}</td>
              <td className='px-4 py-3 text-slate-700'>{row.programmeCount.toLocaleString()}</td>
              <td className='px-4 py-3 text-slate-700'>{row.facultyCount}</td>
              <td className='px-4 py-3'>
                <span className={row.hasPricing ? 'text-emerald-600' : 'text-slate-300'}>
                  {row.hasPricing ? '✓' : '–'}
                </span>
              </td>
              <td className='px-4 py-3'>
                <span className={row.hasAdmission ? 'text-emerald-600' : 'text-slate-300'}>
                  {row.hasAdmission ? '✓' : '–'}
                </span>
              </td>
              <td className='px-4 py-3 text-xs capitalize text-slate-500'>{row.dataSource}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className='px-4 py-12 text-center text-sm text-slate-400'>No institutions match the current filters.</div>
      )}
    </div>
  );
}

// ─── Main Client ──────────────────────────────────────────────────────────────

export function StatsClient({ stats }: { stats: StatsData }) {
  const [filterProvince, setFilterProvince] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterQualType, setFilterQualType] = useState('');

  const provinces = useMemo(
    () => Object.keys(stats.byProvince).sort(),
    [stats.byProvince],
  );

  const qualTypes = useMemo(
    () =>
      Object.entries(stats.byQualificationType)
        .sort((a, b) => b[1] - a[1])
        .map(([k]) => k),
    [stats.byQualificationType],
  );

  // Filtered programme counts by institution
  const filteredProgsByInst = useMemo(() => {
    return stats.programmesByInstitution
      .filter((r) => !filterType || r.type === filterType)
      .map((r) => ({
        label: r.name,
        value: r.count,
        color: TYPE_COLORS[r.type] ?? '#2563EB',
      }));
  }, [stats.programmesByInstitution, filterType]);

  const filteredProgsByProvince = useMemo(() => {
    return stats.programmesByProvince.map((r) => ({
      label: r.province,
      value: r.count,
    }));
  }, [stats.programmesByProvince]);

  const qualTypeData = useMemo(() => {
    return Object.entries(stats.byQualificationType)
      .filter(([k]) => !filterQualType || k === filterQualType)
      .sort(([, a], [, b]) => b - a)
      .map(([label, value], i) => ({ label, value, color: CHART_COLORS[i % CHART_COLORS.length] }));
  }, [stats.byQualificationType, filterQualType]);

  const instTypeData = useMemo(
    () =>
      Object.entries(stats.byInstitutionType)
        .filter(([k]) => !filterType || k === filterType)
        .map(([label, value]) => ({
          label: TYPE_LABELS[label] ?? label,
          value,
          color: TYPE_COLORS[label] ?? '#64748B',
        })),
    [stats.byInstitutionType, filterType],
  );

  const admissionPieData = [
    { label: 'With admission reqs', value: stats.withAdmissionReqs, color: '#2563EB' },
    { label: 'Without admission reqs', value: stats.withoutAdmissionReqs, color: '#CBD5E1' },
  ];

  const pricingPieData = [
    { label: 'With pricing data', value: stats.withPricing, color: '#059669' },
    { label: 'Without pricing data', value: stats.withoutPricing, color: '#CBD5E1' },
  ];

  const FilterBar = () => (
    <div className='flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3'>
      <span className='text-xs font-semibold uppercase tracking-widest text-slate-400'>Filter charts:</span>
      <select
        value={filterProvince}
        onChange={(e) => setFilterProvince(e.target.value)}
        className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700'
      >
        <option value=''>All provinces</option>
        {provinces.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700'
      >
        <option value=''>All institution types</option>
        {Object.entries(TYPE_LABELS).filter(([k]) => k !== 'seta').map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
      <select
        value={filterQualType}
        onChange={(e) => setFilterQualType(e.target.value)}
        className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700'
      >
        <option value=''>All qualification types</option>
        {qualTypes.map((q) => (
          <option key={q} value={q}>{q}</option>
        ))}
      </select>
      {(filterProvince || filterType || filterQualType) && (
        <button
          onClick={() => { setFilterProvince(''); setFilterType(''); setFilterQualType(''); }}
          className='text-xs text-brand-blue hover:underline'
        >
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <div className='mx-auto max-w-6xl px-4 py-10 sm:px-6'>

      {/* Attribution */}
      <div className='mb-10 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-6'>
        <div className='flex items-start gap-3'>
          <Info className='mt-0.5 h-5 w-5 shrink-0 text-brand-blue' />
          <div className='text-sm leading-relaxed text-slate-700'>
            <p>
              This information has been made available by{' '}
              <a href="https://business.qwabi.co.za"><strong>Qwabi Engineering</strong> </a>through scraping{' '}
              <strong>{stats.totalPdfDocuments} PDF documents</strong> and crawling institution websites across South Africa.
              We have done our best to ensure accuracy, however data may vary from official sources. We are not done yet —
              we will continue scraping and adding data from as many institutions as possible. South African institutions
              currently do not share this data in a standardised, publicly accessible format, which is why we built this.
            </p>
            <p className='mt-3'>
              If you would like access to the raw JSON dataset, you can download it below.
            </p>
            <a
              href='/dataset.zip'
              className='mt-3 inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:bg-brand-blue-dark'
            >
              <Download className='h-4 w-4' />
              Download Dataset — ZIP
            </a>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <h2 className='mb-4 text-xl font-bold text-slate-900'>Summary</h2>
      <div className='mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <StatCard label='Institutions Scraped' value={stats.totalInstitutions} />
        <StatCard label='Programmes in Dataset' value={stats.totalProgrammes} />
        <StatCard label='Faculties Indexed' value={stats.totalFaculties} />
        <StatCard label='PDF Documents Processed' value={stats.totalPdfDocuments} />
        <StatCard label='Institutions with Pricing Data' value={stats.institutionsWithPricing} sub={`of ${stats.totalInstitutions} institutions`} />
        <StatCard label='Institutions with Admission Requirements' value={stats.institutionsWithAdmission} sub={`of ${stats.totalInstitutions} institutions`} />
      </div>

      {/* Filters */}
      <div className='mb-8'>
        <FilterBar />
      </div>

      {/* Bar Charts */}
      <div className='mb-10 grid gap-8 lg:grid-cols-2'>
        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
          <h3 className='mb-4 text-base font-bold text-slate-900'>Programmes per Institution (top 30)</h3>
          <HorizontalBarChart data={filteredProgsByInst} maxBars={30} />
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
          <h3 className='mb-4 text-base font-bold text-slate-900'>Programmes per Province</h3>
          <HorizontalBarChart
            data={filteredProgsByProvince.map((r) => ({ label: r.label, value: r.value }))}
          />
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
          <h3 className='mb-4 text-base font-bold text-slate-900'>Programmes per Qualification Type</h3>
          <HorizontalBarChart data={qualTypeData} />
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
          <h3 className='mb-4 text-base font-bold text-slate-900'>Institutions by Type</h3>
          <HorizontalBarChart
            data={Object.entries(stats.byInstitutionType)
              .filter(([k]) => k !== 'seta' && (!filterType || k === filterType))
              .map(([k, v]) => ({ label: TYPE_LABELS[k] ?? k, value: v, color: TYPE_COLORS[k] }))}
          />
        </div>
      </div>

      {/* Pie Charts */}
      <div className='mb-10 grid gap-8 lg:grid-cols-2'>
        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
          <h3 className='mb-4 text-base font-bold text-slate-900'>Institution Types</h3>
          <PieChart data={instTypeData} />
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
          <h3 className='mb-4 text-base font-bold text-slate-900'>Qualification Types (top 6)</h3>
          <PieChart
            data={Object.entries(stats.byQualificationType)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([label, value], i) => ({ label, value, color: CHART_COLORS[i] }))}
          />
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
          <h3 className='mb-4 text-base font-bold text-slate-900'>Programmes — Admission Requirements</h3>
          <PieChart data={admissionPieData} />
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
          <h3 className='mb-4 text-base font-bold text-slate-900'>Programmes — Pricing Data</h3>
          <PieChart data={pricingPieData} />
        </div>
      </div>

      {/* Institution Table */}
      <div className='mb-10'>
        <h2 className='mb-4 text-xl font-bold text-slate-900'>Per-Institution Breakdown</h2>
        <InstitutionTable
          data={stats.institutionTable}
          filterProvince={filterProvince}
          filterType={filterType}
        />
      </div>

      {/* Disclaimer */}
      <p className='rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500'>
        This information is based on scraped data and may not reflect the most current requirements. Always verify with the institution directly.
      </p>
    </div>
  );
}
