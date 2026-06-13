import fs from 'node:fs';
import path from 'node:path';
import type { Institution, Programme, RichInstitution } from './types';

const SEED_DIR = path.join(process.cwd(), 'seed', 'final', 'claude', 'merged');

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

export type InstitutionStat = {
  id: string;
  name: string;
  type: string;
  province: string;
  programmeCount: number;
  facultyCount: number;
  hasPricing: boolean;
  hasAdmission: boolean;
  dataSource: 'pdf' | 'website' | 'both' | 'unknown';
};

export type StatsData = {
  totalInstitutions: number;
  totalProgrammes: number;
  totalFaculties: number;
  totalPdfDocuments: number;
  institutionsWithPricing: number;
  institutionsWithAdmission: number;
  byInstitutionType: Record<string, number>;
  byProvince: Record<string, number>;
  byQualificationType: Record<string, number>;
  programmesByInstitution: Array<{ name: string; count: number; type: string }>;
  programmesByProvince: Array<{ province: string; count: number }>;
  withAdmissionReqs: number;
  withoutAdmissionReqs: number;
  withPricing: number;
  withoutPricing: number;
  institutionTable: InstitutionStat[];
};

export function getStatsData(): StatsData {
  const indexPath = path.join(SEED_DIR, 'index.json');
  const programmesIndexPath = path.join(SEED_DIR, 'index.programmes.json');

  const indexRaw = readJson<{
    total_institutions: number;
    by_type: Record<string, number>;
    institutions: Institution[];
  }>(indexPath);

  const programmesRaw = readJson<{ total: number; programmes: Programme[] }>(programmesIndexPath);

  const nonSeta = indexRaw.institutions.filter((i) => i.institution_type !== 'seta');
  const nonSetaIds = new Set(nonSeta.map((i) => i.institution_id));
  const programmes = programmesRaw.programmes.filter((p) => nonSetaIds.has(p.institution_id));

  // Count faculties from index
  const totalFaculties = nonSeta.reduce((sum, i) => sum + (i.faculties_count ?? 0), 0);

  // Programmes per institution
  const progCountByInstitution = new Map<string, number>();
  for (const p of programmes) {
    progCountByInstitution.set(p.institution_id, (progCountByInstitution.get(p.institution_id) ?? 0) + 1);
  }

  // Programmes per province
  const progByProvince = new Map<string, number>();
  for (const p of programmes) {
    if (p.province) {
      progByProvince.set(p.province, (progByProvince.get(p.province) ?? 0) + 1);
    }
  }

  // By qualification type
  const byQualType = new Map<string, number>();
  for (const p of programmes) {
    const qt = p.qualification_type ?? 'Unknown';
    byQualType.set(qt, (byQualType.get(qt) ?? 0) + 1);
  }

  // By institution type (non-seta)
  const byType: Record<string, number> = {};
  for (const inst of nonSeta) {
    byType[inst.institution_type] = (byType[inst.institution_type] ?? 0) + 1;
  }

  // By province (institutions)
  const byProvince: Record<string, number> = {};
  for (const inst of nonSeta) {
    if (inst.province) {
      byProvince[inst.province] = (byProvince[inst.province] ?? 0) + 1;
    }
  }

  // Per-institution detailed stats from rich files
  let institutionsWithPricing = 0;
  let institutionsWithAdmission = 0;
  let withPricing = 0;
  let withoutPricing = 0;
  let withAdmissionReqs = 0;
  let withoutAdmissionReqs = 0;
  let totalPdfDocuments = 0;

  const institutionTable: InstitutionStat[] = [];

  for (const inst of nonSeta) {
    let hasPricing = false;
    let hasAdmission = false;
    let dataSource: InstitutionStat['dataSource'] = 'unknown';

    if (inst.has_profile && inst.rich_file) {
      try {
        const richPath = path.join(process.cwd(), 'seed', inst.rich_file);
        if (fs.existsSync(richPath)) {
          const rich = readJson<RichInstitution>(richPath);
          hasPricing = (rich.programmes ?? []).some(
            (p) => p.pricing != null || (p.fees_per_year != null && p.fees_per_year > 0),
          );
          hasAdmission =
            (rich.admission?.aps_rules?.length ?? 0) > 0 ||
            (rich.programmes ?? []).some(
              (p) =>
                (p.subjects_compulsory && (p.subjects_compulsory as unknown[]).length > 0) ||
                (p.admission_requirements_raw && p.admission_requirements_raw.length > 0),
            );

          // Rough data source heuristic from rich file name
          if (inst.rich_file.includes('prospectus') || inst.rich_file.includes('pdf')) {
            dataSource = 'pdf';
          } else if (inst.rich_file.includes('website') || inst.rich_file.includes('crawl')) {
            dataSource = 'website';
          } else if (inst.has_profile) {
            dataSource = 'both';
          }

          // Count pricing on programme level
          for (const p of rich.programmes ?? []) {
            if (p.pricing != null || (p.fees_per_year != null && p.fees_per_year > 0)) {
              withPricing++;
            } else {
              withoutPricing++;
            }
            if (
              (p.subjects_compulsory && (p.subjects_compulsory as unknown[]).length > 0) ||
              (p.admission_requirements_raw && p.admission_requirements_raw.length > 0) ||
              (p.min_aps != null && p.min_aps > 0)
            ) {
              withAdmissionReqs++;
            } else {
              withoutAdmissionReqs++;
            }
          }

          // Count prospectus as PDF document
          if (inst.rich_file) totalPdfDocuments++;
        }
      } catch {
        // skip
      }
    } else {
      // Count programmes from index for institutions without rich file
      const pc = progCountByInstitution.get(inst.institution_id) ?? 0;
      withoutPricing += pc;
      withoutAdmissionReqs += pc;
    }

    if (hasPricing) institutionsWithPricing++;
    if (hasAdmission) institutionsWithAdmission++;

    institutionTable.push({
      id: inst.institution_id,
      name: inst.name,
      type: inst.institution_type,
      province: inst.province,
      programmeCount: progCountByInstitution.get(inst.institution_id) ?? 0,
      facultyCount: inst.faculties_count ?? 0,
      hasPricing,
      hasAdmission,
      dataSource,
    });
  }

  // Sort table by programme count desc
  institutionTable.sort((a, b) => b.programmeCount - a.programmeCount);

  const programmesByInstitution = nonSeta
    .map((inst) => ({
      name: inst.name,
      count: progCountByInstitution.get(inst.institution_id) ?? 0,
      type: inst.institution_type,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  const programmesByProvince = Array.from(progByProvince.entries())
    .map(([province, count]) => ({ province, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalInstitutions: nonSeta.length,
    totalProgrammes: programmes.length,
    totalFaculties,
    totalPdfDocuments,
    institutionsWithPricing,
    institutionsWithAdmission,
    byInstitutionType: byType,
    byProvince,
    byQualificationType: Object.fromEntries(byQualType),
    programmesByInstitution,
    programmesByProvince,
    withAdmissionReqs,
    withoutAdmissionReqs,
    withPricing,
    withoutPricing,
    institutionTable,
  };
}
