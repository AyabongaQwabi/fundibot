export type InstitutionType =
  | 'university'
  | 'tvet-college'
  | 'university-of-technology'
  | 'seta';

export type Institution = {
  institution_id: string;
  slug: string;
  name: string;
  institution_type: InstitutionType;
  province: string;
  city: string;
  official_website: string;
  programmes_count: number;
  faculties_count: number;
  campuses_count: number;
  aps_rules_count: number;
  has_profile: boolean;
  rich_file: string;
};

export type Programme = {
  institution_id: string;
  institution_name: string;
  institution_type: InstitutionType;
  province: string;
  city: string;
  name: string;
  normalized_name: string | null;
  qualification_type: string | null;
  nqf_level: number | null;
  faculty_name: string | null;
  min_aps: number | null;
  duration: string | null;
  career_outcomes: string[];
  rich_file: string;
};

export type ToolInstitution = {
  id: string;
  slug: string;
  name: string;
  institution_type: InstitutionType;
  province: string;
  city: string;
  official_website: string;
  logo: string | null;
  short_name: string | null;
};

export type ToolProgramme = {
  institution_id: string;
  name: string;
  normalized_name: string | null;
  qualification_type: string | null;
  faculty_name: string | null;
  min_aps: number | null;
  career_outcomes: string[];
};

export type RichInstitution = {
  meta: {
    institution_id: string;
    slug: string;
    name: string;
    institution_type: InstitutionType;
    province: string;
    city: string;
    official_website: string;
  };
  profile?: {
    short_name?: string;
    logo?: string;
  };
  programmes?: Array<{
    name: string;
    qualification_type?: string;
    faculty_name?: string;
    min_aps?: number | null;
    subjects_compulsory?: string[];
    career_outcomes?: string[];
  }>;
};

export type SubjectMark = {
  subject: string;
  percentage: number;
};

export type ToolsData = {
  institutions: ToolInstitution[];
  programmes: ToolProgramme[];
};
