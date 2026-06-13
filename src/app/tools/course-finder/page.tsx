import type { Metadata } from 'next';
import { getToolsData } from '@/lib/tools/data';
import { CourseFinderClient } from './CourseFinderClient';

export const metadata: Metadata = {
  title: 'Course & Institution Finder — Search Every SA University & College',
  description:
    'Search any course and see every South African institution that offers it, with APS requirements and direct links. Covers universities, universities of technology and TVET colleges. Free, no login.',
  alternates: { canonical: '/tools/course-finder' },
};

export default function CourseFinderPage() {
  const { institutions, programmes } = getToolsData();
  return <CourseFinderClient institutions={institutions} programmes={programmes} />;
}
