import fs from 'node:fs';
import path from 'node:path';
import { BursaryFinderClient } from './BursaryFinderClient';

export const metadata = {
  title: 'Bursary & Funding Matcher | Fundibot',
  description:
    'Find bursaries and NSFAS funding matched to your field of study. 976 South African bursaries sourced from zabursaries.co.za.',
};

export type BursaryEntry = {
  name: string;
  url: string;
};

export type Subcategory = {
  name: string;
  bursaries: BursaryEntry[];
};

export type BursaryCategory = {
  category: string;
  subcategories: Subcategory[];
};

function loadBursaryData(): BursaryCategory[] {
  const filePath = path.join(
    process.cwd(),
    'seed',
    'final',
    'claude',
    'merged',
    'sa_bursaries.json',
  );
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as { categories: BursaryCategory[] };
  return parsed.categories;
}

export default function BursaryFinderPage() {
  const categories = loadBursaryData();
  return (
    <div className='min-h-screen pt-20' style={{ background: '#f0f2f5' }}>
      <BursaryFinderClient categories={categories} />
    </div>
  );
}
