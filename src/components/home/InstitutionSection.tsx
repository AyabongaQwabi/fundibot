import Link from 'next/link';
import { ArrowRight, MapPin, BookOpen } from 'lucide-react';

const institutions = [
  { abbr: 'UCT', name: 'University of Cape Town', province: 'Western Cape', type: 'University', programmes: 180, color: 'bg-blue-600' },
  { abbr: 'WITS', name: 'University of the Witwatersrand', province: 'Gauteng', type: 'University', programmes: 165, color: 'bg-blue-800' },
  { abbr: 'SU', name: 'Stellenbosch University', province: 'Western Cape', type: 'University', programmes: 155, color: 'bg-red-800' },
  { abbr: 'UP', name: 'University of Pretoria', province: 'Gauteng', type: 'University', programmes: 190, color: 'bg-blue-700' },
  { abbr: 'UKZN', name: 'University of KwaZulu-Natal', province: 'KwaZulu-Natal', type: 'University', programmes: 140, color: 'bg-teal-700' },
  { abbr: 'UJ', name: 'University of Johannesburg', province: 'Gauteng', type: 'University', programmes: 135, color: 'bg-orange-600' },
  { abbr: 'CPUT', name: 'Cape Peninsula University of Technology', province: 'Western Cape', type: 'University of Technology', programmes: 95, color: 'bg-green-700' },
  { abbr: 'TUT', name: 'Tshwane University of Technology', province: 'Gauteng', type: 'University of Technology', programmes: 110, color: 'bg-purple-700' },
];

const typeColor: Record<string, string> = {
  'University': 'bg-brand-blue/10 text-brand-blue',
  'University of Technology': 'bg-purple-500/10 text-purple-600',
  'TVET College': 'bg-emerald-500/10 text-emerald-700',
};

export function InstitutionSection() {
  return (
    <section className='bg-white py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <span className='section-tag mb-5'>Institutions</span>
            <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>
              Every institution. One search.
            </h2>
            <p className='mt-3 text-lg text-slate-500'>
              Universities, UoTs, and TVET colleges — all in one place. No PDFs required.
            </p>
          </div>
          <Link href='/tools/course-finder' className='btn-outline flex-shrink-0'>
            Browse all <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        <div className='mt-12 flex gap-5 overflow-x-auto pb-4 scrollbar-hide'>
          {institutions.map((inst) => (
            <Link
              key={inst.abbr}
              href='/tools/course-finder'
              className='group flex w-64 flex-shrink-0 flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-slate-200'
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${inst.color} mb-4 shadow-sm`}>
                <span className='text-xs font-black text-white'>{inst.abbr.slice(0, 2)}</span>
              </div>

              <h3 className='line-clamp-2 text-sm font-bold text-slate-900 leading-snug'>{inst.name}</h3>

              <div className='mt-3 flex flex-col gap-1.5'>
                <div className='flex items-center gap-1.5 text-xs text-slate-500'>
                  <MapPin className='h-3 w-3' />
                  {inst.province}
                </div>
                <div className='flex items-center gap-1.5 text-xs text-slate-500'>
                  <BookOpen className='h-3 w-3' />
                  {inst.programmes}+ programmes
                </div>
              </div>

              <div className='mt-3'>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeColor[inst.type] ?? 'bg-slate-100 text-slate-600'}`}>
                  {inst.type}
                </span>
              </div>
            </Link>
          ))}

          <Link
            href='/tools/course-finder'
            className='flex w-48 flex-shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-5 text-center transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/5'
          >
            <span className='text-3xl'>🏛️</span>
            <p className='mt-3 text-sm font-semibold text-slate-700'>All institutions</p>
            <p className='mt-1 text-xs text-slate-400'>50+ nationwide</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
