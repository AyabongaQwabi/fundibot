import type { Metadata } from 'next';
import { getToolsData } from '@/lib/tools/data';
import { QualificationCheckerClient } from './QualificationCheckerClient';

export const metadata: Metadata = {
  title: 'APS Qualification Checker — See Which Courses You Qualify For',
  description:
    'Enter your subjects and marks to instantly calculate your APS and see which South African university and college programmes you qualify for. Free APS calculator, no login needed.',
  alternates: { canonical: '/tools/qualification-checker' },
};

export default function QualificationCheckerPage() {
  const { institutions, programmes } = getToolsData();
  return (
    <QualificationCheckerClient institutions={institutions} programmes={programmes} />
  );
}
