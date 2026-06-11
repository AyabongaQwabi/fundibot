import { getToolsData } from '@/lib/tools/data';
import { QualificationCheckerClient } from './QualificationCheckerClient';

export default function QualificationCheckerPage() {
  const { institutions, programmes } = getToolsData();
  return (
    <QualificationCheckerClient institutions={institutions} programmes={programmes} />
  );
}
