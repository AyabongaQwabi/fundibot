import type { InstitutionType } from './types';

export const NSC_SUBJECT_GROUPS = {
  Languages: [
    'Afrikaans HL',
    'Afrikaans FAL',
    'English HL',
    'English FAL',
    'IsiXhosa HL',
    'IsiZulu HL',
    'Sesotho HL',
    'Setswana HL',
    'Sepedi HL',
    'Tshivenda HL',
    'Xitsonga HL',
    'SiSwati HL',
  ],
  Mathematics: ['Mathematics', 'Mathematical Literacy', 'Technical Mathematics'],
  Sciences: [
    'Physical Sciences',
    'Life Sciences',
    'Agricultural Sciences',
    'Technical Sciences',
  ],
  Technology: [
    'Civil Technology',
    'Electrical Technology',
    'Mechanical Technology',
    'Engineering Graphic Design',
    'Information Technology',
    'Computer Applications Technology',
    'Coding & Robotics',
  ],
  Commerce: ['Accounting', 'Business Studies', 'Economics', 'Tourism', 'Hospitality Studies'],
  Humanities: [
    'History',
    'Geography',
    'Religion Studies',
    'Visual Arts',
    'Dramatic Arts',
    'Music',
    'Dance Studies',
  ],
} as const;

export const ALL_NSC_SUBJECTS = Object.values(NSC_SUBJECT_GROUPS).flat();

export const HOME_LANGUAGE_SUBJECTS = [
  'Afrikaans HL',
  'English HL',
  'IsiXhosa HL',
  'IsiZulu HL',
  'Sesotho HL',
  'Setswana HL',
  'Sepedi HL',
  'Tshivenda HL',
  'Xitsonga HL',
  'SiSwati HL',
];

export const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  university: 'University',
  'tvet-college': 'TVET College',
  'university-of-technology': 'University of Technology',
  seta: 'SETA',
};

export type InstitutionTypeFilter = 'all' | InstitutionType;

export const INSTITUTION_TYPE_FILTERS: { value: InstitutionTypeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'university', label: 'Universities' },
  { value: 'tvet-college', label: 'TVET Colleges' },
  { value: 'university-of-technology', label: 'Universities of Technology' },
];
