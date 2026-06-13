import type { Metadata } from 'next';
import { getToolsData } from '@/lib/tools/data';
import { CareerRecommenderClient } from './CareerRecommenderClient';

export const metadata: Metadata = {
  title: 'Career & Course Recommender — Find What to Study After Matric',
  description:
    'Not sure what to study? Enter your Grade 12 subjects and marks and get career and course suggestions matched to your strengths, with the South African institutions that offer them.',
  alternates: { canonical: '/tools/career-recommender' },
};

export default function CareerRecommenderPage() {
  const { institutions, programmes } = getToolsData();
  return (
    <CareerRecommenderClient institutions={institutions} programmes={programmes} />
  );
}
