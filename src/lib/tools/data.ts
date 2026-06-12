import fs from 'node:fs';
import path from 'node:path';
import type {
  Institution,
  Programme,
  RichInstitution,
  ToolInstitution,
  ToolProgramme,
  ToolsData,
} from './types';

// Point to the seed data in the fundibot folder (outside src/)
const SEED_DIR = path.join(process.cwd(), 'seed', 'final', 'claude', 'merged');
const LOGOS_DIR = path.join(process.cwd(), 'public', 'logos');

/** Build a map of institution_id → local public path for downloaded logos. */
function buildLogoMap(): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(LOGOS_DIR)) return map;
  for (const file of fs.readdirSync(LOGOS_DIR)) {
    const id = path.basename(file, path.extname(file));
    map.set(id, `/logos/${file}`);
  }
  return map;
}

const logoMap = buildLogoMap();

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function isSeta(type: string): boolean {
  return type === 'seta';
}

function loadProfileFromRich(richFile: string): { logo: string | null; short_name: string | null, colors: string[] | null; motto: string | null; } {
  try {
    const fullPath = path.join(process.cwd(), 'seed', richFile);
    if (!fs.existsSync(fullPath)) return { logo: null, short_name: null, motto: null, colors: null };
    const rich = readJson<RichInstitution>(fullPath);
    return {
      logo: rich.profile?.logo ?? null,
      short_name: rich.profile?.short_name ?? null,
      colors:rich.profile?.colors ?? null,
      motto: rich.profile?.motto ?? null,
    };
  } catch {
    return { logo: null, short_name: null, motto: null, colors: null };
  }
}


let cachedData: ToolsData | null = null;

function loadToolsData(): ToolsData {
//   if (cachedData) {
//     console.log("returning cached data", cachedData)
//     return cachedData;

//   }


  const indexPath = path.join(SEED_DIR, 'index.json');
  const programmesIndexPath = path.join(SEED_DIR, 'index.programmes.json');

  if (!fs.existsSync(indexPath) || !fs.existsSync(programmesIndexPath)) {
    console.warn('Tools data not found. Returning empty datasets.');
    return { institutions: [], programmes: [] };
  }

  const index = readJson<{ institutions: Institution[] }>(indexPath);
  const programmesIndex = readJson<{ programmes: Programme[] }>(programmesIndexPath);

  const nonSetaInstitutions = index.institutions.filter(
    (i) => !isSeta(i.institution_type),
  );
  const nonSetaIds = new Set(nonSetaInstitutions.map((i) => i.institution_id));

  const institutions: ToolInstitution[] = nonSetaInstitutions.map((inst) => {
    const profile = inst.has_profile
      ? loadProfileFromRich(inst.rich_file)
      : { logo: null, short_name: null, colors: [], motto: null };

    return {
      id: inst.institution_id,
      slug: inst.slug,
      name: inst.name,
      institution_type: inst.institution_type,
      province: inst.province,
      city: inst.city,
      official_website: inst.official_website,
      logo: logoMap.get(inst.institution_id) ?? null,
      short_name: profile.short_name,
      colors: profile.colors,
      motto: profile.motto,
    };
  });


  const programmes: ToolProgramme[] = programmesIndex.programmes
    .filter((p) => nonSetaIds.has(p.institution_id))
    .map((p) => ({
      institution_id: p.institution_id,
      name: p.name,
      normalized_name: p.normalized_name,
      qualification_type: p.qualification_type,
      faculty_name: p.faculty_name,
      min_aps: p.min_aps,
      career_outcomes: p.career_outcomes ?? [],
    }));

  cachedData = { institutions, programmes };
  return cachedData;
}

export function getInstitutions(): ToolInstitution[] {
  return loadToolsData().institutions;
}

export function getProgrammes(): ToolProgramme[] {
  return loadToolsData().programmes;
}

export function getToolsData(): ToolsData {
  return loadToolsData();
}

export function getInstitutionById(id: string): RichInstitution | null {
  const institutions = getInstitutions();
  const inst = institutions.find((i) => i.id === id);
  if (!inst) return null;

  const richPath = path.join(
    SEED_DIR,
    'institutions',
    `institution-${inst.id}-${inst.slug}.rich.json`,
  );
  if (!fs.existsSync(richPath)) return null;
  return readJson<RichInstitution>(richPath);
}
