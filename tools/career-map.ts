export const SUBJECT_CAREER_CLUSTERS: Record<string, string[]> = {
  mathematics: ['Engineering', 'Data Science & IT', 'Finance & Accounting', 'Architecture'],
  'physical sciences': ['Engineering', 'Medicine & Health Sciences', 'Environmental Science'],
  'life sciences': [
    'Medicine & Health Sciences',
    'Veterinary Science',
    'Biotechnology',
    'Agriculture',
  ],
  'agricultural sciences': ['Agriculture', 'Environmental Science', 'Food Science'],
  accounting: ['Finance & Accounting', 'Business & Management', 'Auditing'],
  'business studies': ['Business & Management', 'Entrepreneurship', 'Marketing'],
  economics: ['Economics', 'Finance & Accounting', 'Business & Management'],
  history: ['Law', 'Politics & Governance', 'Social Sciences', 'Journalism'],
  geography: ['Environmental Science', 'Urban Planning', 'Geology', 'GIS'],
  'information technology': ['Data Science & IT', 'Software Development', 'Cybersecurity'],
  'computer applications': ['Data Science & IT', 'Digital Media', 'Business Systems'],
  english: ['Journalism', 'Education', 'Law', 'Communications'],
  'visual arts': ['Design & Creative Arts', 'Architecture', 'Media'],
  music: ['Performing Arts', 'Music Production', 'Education'],
  'dramatic arts': ['Performing Arts', 'Film & Media', 'Communications'],
  tourism: ['Hospitality & Tourism', 'Business & Management'],
  hospitality: ['Hospitality & Tourism', 'Culinary Arts'],
  'civil technology': ['Civil Engineering', 'Construction', 'Architecture'],
  'electrical technology': ['Electrical Engineering', 'Electronics', 'Renewable Energy'],
  'mechanical technology': ['Mechanical Engineering', 'Manufacturing', 'Automotive'],
};

export const CAREER_TITLES: Record<string, string[]> = {
  Engineering: ['Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Mining Engineer'],
  'Data Science & IT': ['Software Developer', 'Data Analyst', 'Systems Analyst', 'DevOps Engineer'],
  'Finance & Accounting': ['Chartered Accountant', 'Financial Analyst', 'Auditor', 'Tax Consultant'],
  Architecture: ['Architect', 'Urban Designer', 'Interior Designer', 'Landscape Architect'],
  'Medicine & Health Sciences': ['Doctor', 'Nurse', 'Physiotherapist', 'Pharmacist', 'Dentist'],
  'Environmental Science': ['Environmental Scientist', 'Ecologist', 'Conservation Officer'],
  'Veterinary Science': ['Veterinarian', 'Animal Health Technician', 'Wildlife Biologist'],
  Biotechnology: ['Biotechnologist', 'Lab Technician', 'Research Scientist'],
  Agriculture: ['Agricultural Scientist', 'Farm Manager', 'Agronomist'],
  'Food Science': ['Food Technologist', 'Quality Controller', 'Nutritionist'],
  'Business & Management': ['Business Analyst', 'Operations Manager', 'HR Manager'],
  Entrepreneurship: ['Startup Founder', 'Business Consultant', 'Franchise Owner'],
  Marketing: ['Marketing Manager', 'Brand Strategist', 'Digital Marketer'],
  Economics: ['Economist', 'Policy Analyst', 'Investment Banker'],
  Auditing: ['Internal Auditor', 'Forensic Accountant', 'Compliance Officer'],
  Law: ['Attorney', 'Advocate', 'Legal Advisor', 'Magistrate'],
  'Politics & Governance': ['Policy Advisor', 'Diplomat', 'Public Administrator'],
  'Social Sciences': ['Social Worker', 'Sociologist', 'Community Developer'],
  Journalism: ['Journalist', 'Editor', 'Content Writer', 'Broadcast Producer'],
  'Urban Planning': ['Town Planner', 'Transport Planner', 'Housing Developer'],
  Geology: ['Geologist', 'Mining Geologist', 'Hydrologist'],
  GIS: ['GIS Specialist', 'Cartographer', 'Remote Sensing Analyst'],
  'Software Development': ['Full-stack Developer', 'Mobile Developer', 'Game Developer'],
  Cybersecurity: ['Security Analyst', 'Penetration Tester', 'CISO'],
  'Digital Media': ['UX Designer', 'Multimedia Designer', 'Web Developer'],
  'Business Systems': ['ERP Consultant', 'Business Systems Analyst'],
  Education: ['Teacher', 'Curriculum Developer', 'Education Administrator'],
  Communications: ['PR Specialist', 'Communications Manager', 'Copywriter'],
  'Design & Creative Arts': ['Graphic Designer', 'Illustrator', 'Art Director'],
  Media: ['Film Producer', 'Photographer', 'Video Editor'],
  'Performing Arts': ['Actor', 'Dancer', 'Theatre Director'],
  'Music Production': ['Music Producer', 'Sound Engineer', 'Composer'],
  'Film & Media': ['Film Director', 'Screenwriter', 'Cinematographer'],
  'Hospitality & Tourism': ['Hotel Manager', 'Tour Operator', 'Event Planner'],
  'Culinary Arts': ['Chef', 'Pastry Chef', 'Food & Beverage Manager'],
  'Civil Engineering': ['Structural Engineer', 'Water Engineer', 'Project Manager'],
  Construction: ['Construction Manager', 'Quantity Surveyor', 'Site Engineer'],
  'Electrical Engineering': ['Power Systems Engineer', 'Control Systems Engineer'],
  Electronics: ['Electronics Engineer', 'Embedded Systems Developer'],
  'Renewable Energy': ['Solar Engineer', 'Wind Energy Technician'],
  'Mechanical Engineering': ['Mechanical Design Engineer', 'Automotive Engineer'],
  Manufacturing: ['Production Manager', 'Industrial Engineer'],
  Automotive: ['Automotive Engineer', 'Mechanic Supervisor'],
};

/** Match career clusters from a subject name via partial keyword match. */
export function matchClusters(subject: string): string[] {
  const lower = subject.toLowerCase();
  const clusters = new Set<string>();

  for (const [keyword, clusterList] of Object.entries(SUBJECT_CAREER_CLUSTERS)) {
    if (lower.includes(keyword)) {
      clusterList.forEach((c) => clusters.add(c));
    }
  }

  return Array.from(clusters);
}

/** Collect unique clusters from multiple subjects. */
export function matchClustersFromSubjects(subjects: string[]): string[] {
  const clusters = new Set<string>();
  for (const subject of subjects) {
    matchClusters(subject).forEach((c) => clusters.add(c));
  }
  return Array.from(clusters);
}

/** Keyword to pre-fill course finder search from a cluster name. */
export function clusterSearchKeyword(cluster: string): string {
  const map: Record<string, string> = {
    Engineering: 'engineering',
    'Medicine & Health Sciences': 'medicine',
    'Data Science & IT': 'computer science',
    'Finance & Accounting': 'accounting',
    Law: 'law',
    Nursing: 'nursing',
  };
  return map[cluster] ?? cluster.split(' ')[0].toLowerCase();
}
