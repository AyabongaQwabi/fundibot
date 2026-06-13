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
  colors: string[] | null;
  motto: string | null;
};

export type ToolProgramme = {
  institution_id: string;
  name: string;
  normalized_name: string | null;
  qualification_type: string | null;
  faculty_name: string | null;
  min_aps: number | null;
  career_outcomes: string[];
  points_system: PointsSystem | null;
};

export type PointsSystem = 'aps_points' | 'uwc_points' | 'uct_fps' | 'up_points' | 'tvet_none';

export type UwcSubjectRequirement = {
  subject: string;
  uwc_code: number;
  operator?: 'OR' | 'AND';
  alternative?: { subject: string; uwc_code: number };
};

export type UctAdmissionBand = {
  band: 'A' | 'B' | 'C';
  label: 'guaranteed_admission' | 'probable_admission' | 'possible_admission';
  eligible: 'all_applicants' | 'sa_redress_only';
  score_type: 'fps' | 'wps' | null;
  minimum_score: number | null;
  subject_requirements: string[];
  nbt_required: boolean;
};

export type Pricing = {
  amount_min: number;
  amount_max?: number;
  currency: 'ZAR';
  label?: string;
  granularity: 'programme' | 'faculty' | 'institutional';
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
    application_url?: string | null;
    prospectus_url?: string | null;
    nsfas_supported?: boolean | null;
    distance_learning?: boolean | null;
    accreditation?: Record<string, string> | null;
    qualification_types?: string[];
  };
  profile?: {
    short_name?: string;
    logo?: string;
    colors?: string[];
    motto?: string;
    student_count?: number | string | null;
    nickname?: string | null;
    sports?: string[];
  };
  contact?: {
    emails?: string[];
    phone_numbers?: string[];
    physical_address?: string | null;
    postal_address?: string | null;
    socials?: Record<string, string | null>;
  };
  campuses?: Array<{
    name: string;
    city?: string | null;
    province?: string | null;
    is_main?: boolean | null;
    type?: string | null;
    address?: string | null;
    coordinates?: { lat?: number | null; lng?: number | null };
    contact?: string | null;
  }>;
  faculties?: Array<{
    id?: string | null;
    name: string;
    overview?: string | null;
    kind?: string | null;
  }>;
  programmes?: Array<{
    name: string;
    qualification_type?: string | null;
    faculty_name?: string | null;
    min_aps?: number | null;
    subjects_compulsory?: Array<{ subject: string; minimum_level?: number; minimum_percentage?: number | null; minimum_nsc_level?: number | null; notes?: string }> | string[];
    subject_or_groups?: unknown[];
    career_outcomes?: string[];
    duration?: string | null;
    study_mode?: string | null;
    nqf_level?: number | null;
    fees_per_year?: number | null;
    pricing?: Pricing | null;
    admission_requirements_raw?: string[];
    uwc_requirements?: UwcSubjectRequirement[];
    admission_bands?: UctAdmissionBand[];
    uct_fps_minimum?: number | null;
    uct_wps_minimum?: number | null;
    _points_system?: PointsSystem | null;
    _qual_type_inferred?: boolean;
    _admission_is_default?: boolean;
  }>;
  admission?: {
    aps_name?: string | null;
    aps_calculation_notes?: string | null;
    minimum_aps_for_bachelors?: number | null;
    minimum_aps_for_diplomas?: number | null;
    minimum_entry_note?: string | null;
    life_orientation_cap?: number | null;
    aps_rules?: Array<{
      id?: string;
      scope?: string;
      min_aps?: number;
      programme?: string | null;
      excerpt?: string | null;
    }>;
  };
};

/** Full institution profile assembled for the institution detail page. */
export type InstitutionProfile = {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  logo: string | null;
  institution_type: InstitutionType;
  province: string;
  city: string;
  official_website: string;
  application_url: string | null;
  prospectus_url: string | null;
  nsfas_supported: boolean | null;
  distance_learning: boolean | null;
  colors: string[] | null;
  motto: string | null;
  student_count: string | null;
  accreditation: Record<string, string> | null;
  qualification_types: string[];
  points_system: PointsSystem;
  contact: RichInstitution['contact'] | null;
  campuses: NonNullable<RichInstitution['campuses']>;
  faculties: NonNullable<RichInstitution['faculties']>;
  programmes: NonNullable<RichInstitution['programmes']>;
  admission: RichInstitution['admission'] | null;
};

export type SubjectMark = {
  subject: string;
  percentage: number;
};

export type ToolsData = {
  institutions: ToolInstitution[];
  programmes: ToolProgramme[];
};
