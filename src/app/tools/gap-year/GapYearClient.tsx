'use client';

import { useState, useMemo, useEffect } from 'react';
import { Info, ExternalLink, ChevronRight, BookOpen, Briefcase, GraduationCap, Wrench } from 'lucide-react';
import { ToolsBreadcrumb } from '../components/ToolsBreadcrumb';
import { calcAps } from '@/lib/tools/aps';
import { getSessionMarks } from '@/lib/tools/session';
import { ALL_NSC_SUBJECTS } from '@/lib/tools/constants';
import type { ToolInstitution, ToolProgramme } from '@/lib/tools/types';

type SubjectMark = { subject: string; percentage: number };

// Bridging/foundation programmes at SA universities
const FOUNDATION_PROGRAMMES = [
  { institution: 'University of Cape Town', programme: 'Academic Development Programme (ADP)', website: 'https://www.uct.ac.za/students/academic-development' },
  { institution: 'University of the Witwatersrand', programme: 'Foundation Programme', website: 'https://www.wits.ac.za/foundation/' },
  { institution: 'Stellenbosch University', programme: 'Extended Degree Programme (EDP)', website: 'https://www.sun.ac.za/edp' },
  { institution: 'University of Pretoria', programme: 'Foundation Programme', website: 'https://www.up.ac.za/foundation' },
  { institution: 'University of Johannesburg', programme: 'Extended Curriculum Programme', website: 'https://www.uj.ac.za/faculties/extended-curriculum' },
  { institution: 'Tshwane University of Technology', programme: 'Extended Programme', website: 'https://www.tut.ac.za/extended' },
  { institution: 'Cape Peninsula University of Technology', programme: 'Foundation Programmes', website: 'https://www.cput.ac.za/academics/foundation' },
];

// Known learnerships / apprenticeships
const LEARNERSHIPS = [
  { name: 'Electrical Apprenticeship (EWSETA)', subjects: ['electrical technology', 'physical sciences', 'mathematics'], link: 'https://www.ewseta.org.za' },
  { name: 'Plumbing Apprenticeship (CETA)', subjects: ['civil technology', 'mathematics'], link: 'https://www.ceta.org.za' },
  { name: 'IT Learnership (MICT SETA)', subjects: ['information technology', 'mathematics', 'computer applications'], link: 'https://www.mict.org.za' },
  { name: 'Accounting Learnership (FASSET)', subjects: ['accounting', 'mathematics'], link: 'https://www.fasset.org.za' },
  { name: 'Automotive Learnership (MERSETA)', subjects: ['mechanical technology', 'mathematics'], link: 'https://www.merseta.org.za' },
  { name: 'Agricultural Learnership (AGRISETA)', subjects: ['agricultural sciences', 'life sciences'], link: 'https://www.agriseta.co.za' },
  { name: 'Hospitality Learnership (CATHSSETA)', subjects: ['hospitality', 'tourism'], link: 'https://www.cathsseta.org.za' },
  { name: 'Finance Learnership (INSETA)', subjects: ['accounting', 'economics', 'mathematics'], link: 'https://www.inseta.org.za' },
  { name: 'Construction Learnership (CETA)', subjects: ['civil technology', 'mathematics'], link: 'https://www.ceta.org.za' },
  { name: 'Healthcare Support Learnership (HWSETA)', subjects: ['life sciences', 'physical sciences'], link: 'https://www.hwseta.org.za' },
];

// Short skills programmes
const SHORT_COURSES = [
  { name: 'CompTIA A+ (IT support)', field: 'IT', provider: 'Various providers', aps: 0 },
  { name: 'Digital Marketing Fundamentals', field: 'Marketing', provider: 'Google / Coursera', aps: 0 },
  { name: 'Data Analytics with Python', field: 'Data', provider: 'Coursera / DataCamp', aps: 0 },
  { name: 'Basic Coding (HTML/CSS/JS)', field: 'Tech', provider: 'freeCodeCamp', aps: 0 },
  { name: 'Financial Literacy & Bookkeeping', field: 'Finance', provider: 'Sage / Xero Partner', aps: 0 },
  { name: 'Office Administration (UNISA)', field: 'Admin', provider: 'UNISA', aps: 0 },
  { name: 'Child Development & ECD', field: 'Education', provider: 'HWSETA / SAIDE', aps: 0 },
  { name: 'Graphic Design Fundamentals', field: 'Design', provider: 'Coursera / Canva', aps: 0 },
];

type Props = {
  institutions: ToolInstitution[];
  programmes: ToolProgramme[];
};

function SubjectInput({ marks, setMarks }: { marks: SubjectMark[]; setMarks: React.Dispatch<React.SetStateAction<SubjectMark[]>> }) {
  return (
    <div className='space-y-3'>
      {marks.map((m, i) => (
        <div key={i} className='flex items-center gap-3'>
          <input
            list={`subjects-gap-${i}`}
            value={m.subject}
            onChange={(e) => setMarks((prev) => prev.map((x, j) => j === i ? { ...x, subject: e.target.value } : x))}
            placeholder='Subject…'
            className='flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none'
          />
          <datalist id={`subjects-gap-${i}`}>
            {ALL_NSC_SUBJECTS.map((s) => <option key={s} value={s} />)}
          </datalist>
          <input
            type='number'
            min={0}
            max={100}
            value={m.percentage || ''}
            onChange={(e) => setMarks((prev) => prev.map((x, j) => j === i ? { ...x, percentage: Number(e.target.value) } : x))}
            placeholder='%'
            className='w-20 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none'
          />
          <button
            onClick={() => setMarks((prev) => prev.filter((_, j) => j !== i))}
            className='text-slate-400 hover:text-slate-700'
            disabled={marks.length <= 1}
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={() => setMarks((prev) => [...prev, { subject: '', percentage: 0 }])}
        className='text-sm font-semibold text-brand-blue hover:underline'
      >
        + Add subject
      </button>
    </div>
  );
}

export function GapYearClient({ institutions, programmes }: Props) {
  const [marks, setMarks] = useState<SubjectMark[]>([
    { subject: 'English HL', percentage: 0 },
    { subject: 'Mathematics', percentage: 0 },
  ]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const session = getSessionMarks();
    if (session.length > 0) setMarks(session);
  }, []);

  const aps = useMemo(() => calcAps(marks), [marks]);

  const tvetIds = useMemo(
    () => new Set(institutions.filter((i) => i.institution_type === 'tvet-college').map((i) => i.id)),
    [institutions],
  );

  // TVET programmes the student qualifies for
  const tvetProgrammes = useMemo(() => {
    if (!searched) return [];
    return programmes.filter(
      (p) =>
        tvetIds.has(p.institution_id) &&
        (p.min_aps == null || p.min_aps <= 1 || p.min_aps <= aps),
    ).slice(0, 20);
  }, [searched, programmes, aps, tvetIds]);

  // Learnerships based on subjects
  const matchedLearnerships = useMemo(() => {
    if (!searched) return [];
    const subjectLower = marks.map((m) => m.subject.toLowerCase());
    return LEARNERSHIPS.filter((l) =>
      l.subjects.some((s) => subjectLower.some((m) => m.includes(s))),
    );
  }, [searched, marks]);

  // Foundation programmes — always show if APS < 30 or any mark < 50
  const needsBridging = aps < 30 || marks.some((m) => m.percentage < 50 && m.percentage > 0);

  const dataConfidence = 40; // mixed scraped + static

  return (
    <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6'>
      <ToolsBreadcrumb items={[{ label: 'Tools', href: '/tools' }, { label: 'Gap Year & Alternative Pathways' }]} />

      <div className='mb-8'>
        <h1 className='text-2xl font-extrabold text-slate-900 md:text-3xl'>Gap Year & Alternative Pathways</h1>
        <p className='mt-2 text-slate-500'>
          If your NSC results don&apos;t meet university requirements, there are strategic alternatives that can still lead to your goals.
        </p>
        <div className='mt-3 rounded-xl border border-brand-blue/20 bg-brand-blue/5 px-4 py-3 text-sm text-brand-blue'>
          These are not fallbacks — they are strategic choices taken by thousands of successful South Africans every year.
        </div>
      </div>

      {/* NSC results input */}
      <div className='mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
        <h2 className='mb-4 text-base font-bold text-slate-900'>Enter your NSC results</h2>
        <SubjectInput marks={marks} setMarks={setMarks} />
        <div className='mt-4 flex items-center justify-between'>
          <p className='text-sm text-slate-500'>
            Calculated APS: <strong className='text-slate-900'>{aps}</strong>
          </p>
          <button
            onClick={() => setSearched(true)}
            className='rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-500'
          >
            Find Pathways
          </button>
        </div>
      </div>

      {searched && (
        <div className='space-y-8'>
          {/* Data confidence */}
          <div className='flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600'>
            <Info className='h-4 w-4 shrink-0 text-slate-400' />
            <span>Data confidence: <strong>{dataConfidence}%</strong> — mix of scraped data and curated national resources.</span>
          </div>

          {/* TVET options */}
          <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100'>
                <GraduationCap className='h-5 w-5 text-emerald-700' />
              </div>
              <h2 className='text-base font-bold text-slate-900'>TVET Programmes You Qualify For Now</h2>
            </div>
            {tvetProgrammes.length > 0 ? (
              <ul className='space-y-2 text-sm text-slate-700'>
                {tvetProgrammes.map((p, i) => {
                  const inst = institutions.find((t) => t.id === p.institution_id);
                  return (
                    <li key={i} className='flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2'>
                      <span>{p.name}</span>
                      <span className='text-xs text-slate-400'>{inst?.name ?? ''}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className='text-sm text-slate-500'>
                No specific TVET programmes found — most TVET programmes have no minimum APS. Visit your nearest TVET college for available offerings.
              </p>
            )}
            <a
              href='/tools/tvet-planner'
              className='mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline'
            >
              Explore TVET pathways <ChevronRight className='h-4 w-4' />
            </a>
          </div>

          {/* Short courses */}
          <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100'>
                <BookOpen className='h-5 w-5 text-blue-700' />
              </div>
              <h2 className='text-base font-bold text-slate-900'>Short Courses & Skills Programmes</h2>
            </div>
            <div className='grid gap-3 sm:grid-cols-2'>
              {SHORT_COURSES.map((c) => (
                <div key={c.name} className='rounded-xl border border-slate-100 bg-slate-50 p-3'>
                  <p className='text-sm font-semibold text-slate-800'>{c.name}</p>
                  <p className='mt-0.5 text-xs text-slate-500'>Provider: {c.provider}</p>
                  <span className='mt-1.5 inline-block rounded-full bg-brand-blue/10 px-2 py-0.5 text-xs text-brand-blue'>
                    {c.field}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bridging / foundation */}
          <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100'>
                <ChevronRight className='h-5 w-5 text-purple-700' />
              </div>
              <div>
                <h2 className='text-base font-bold text-slate-900'>Bridging & Foundation Programmes</h2>
                <p className='text-xs text-slate-500'>Lead to full university admission after one additional year.</p>
              </div>
            </div>
            {needsBridging && (
              <div className='mb-4 rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-amber-800'>
                Based on your results, a foundation programme may be a good strategic option to gain full degree admission.
              </div>
            )}
            <div className='space-y-3'>
              {FOUNDATION_PROGRAMMES.map((f) => (
                <div key={f.institution} className='flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3'>
                  <div>
                    <p className='text-sm font-semibold text-slate-800'>{f.institution}</p>
                    <p className='text-xs text-slate-500'>{f.programme}</p>
                  </div>
                  <a
                    href={f.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline'
                  >
                    Visit <ExternalLink className='h-3 w-3' />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Learnerships */}
          <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-card'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100'>
                <Wrench className='h-5 w-5 text-amber-700' />
              </div>
              <div>
                <h2 className='text-base font-bold text-slate-900'>Learnerships & Apprenticeships</h2>
                <p className='text-xs text-slate-500'>Earn while you learn — matched to your subject profile.</p>
              </div>
            </div>
            {matchedLearnerships.length > 0 ? (
              <div className='space-y-3'>
                {matchedLearnerships.map((l) => (
                  <div key={l.name} className='flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3'>
                    <div>
                      <p className='text-sm font-semibold text-slate-800'>{l.name}</p>
                      <div className='mt-1 flex flex-wrap gap-1'>
                        {l.subjects.map((s) => (
                          <span key={s} className='rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600'>{s}</span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={l.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline'
                    >
                      Apply <ExternalLink className='h-3 w-3' />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className='space-y-3'>
                {LEARNERSHIPS.slice(0, 5).map((l) => (
                  <div key={l.name} className='flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3'>
                    <p className='text-sm font-semibold text-slate-800'>{l.name}</p>
                    <a href={l.link} target='_blank' rel='noopener noreferrer' className='text-xs font-semibold text-brand-blue hover:underline'>
                      Learn more
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className='flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500'>
            <Info className='mt-0.5 h-4 w-4 shrink-0' />
            <span>
              This information is based on scraped data and may not reflect the most current requirements. Always verify with the institution directly.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
