import { getToolsData } from '@/lib/tools/data';
import { CareerRecommenderClient } from './CareerRecommenderClient';

export default function CareerRecommenderPage() {
  const { institutions, programmes } = getToolsData();
  return (
    <CareerRecommenderClient institutions={institutions} programmes={programmes} />
  );
}
