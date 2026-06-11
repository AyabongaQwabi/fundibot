import { getToolsData } from '@/lib/tools/data';
import { CourseFinderClient } from './CourseFinderClient';

export default function CourseFinderPage() {
  const { institutions, programmes } = getToolsData();
  return <CourseFinderClient institutions={institutions} programmes={programmes} />;
}
