// Maps NSC subject keywords → career clusters. Keys are lowercase substrings to match against subject names.
export const SUBJECT_CAREER_CLUSTERS: Record<string, string[]> = {
  mathematics: ['Engineering', 'Data Science & IT', 'Finance & Accounting', 'Architecture', 'Actuarial Science'],
  'mathematical literacy': ['Business & Management', 'Finance & Accounting', 'Hospitality & Tourism'],
  'physical sciences': ['Engineering', 'Medicine & Health Sciences', 'Environmental Science', 'Geology'],
  'life sciences': ['Medicine & Health Sciences', 'Veterinary Science', 'Biotechnology', 'Agriculture', 'Environmental Science'],
  'agricultural sciences': ['Agriculture', 'Environmental Science', 'Food Science', 'Veterinary Science'],
  accounting: ['Finance & Accounting', 'Business & Management', 'Auditing'],
  'business studies': ['Business & Management', 'Entrepreneurship', 'Marketing'],
  economics: ['Economics', 'Finance & Accounting', 'Business & Management', 'Actuarial Science'],
  history: ['Law', 'Politics & Governance', 'Social Sciences', 'Journalism', 'Education'],
  geography: ['Environmental Science', 'Urban Planning', 'Geology', 'GIS', 'Agriculture'],
  'information technology': ['Data Science & IT', 'Software Development', 'Cybersecurity'],
  'computer applications': ['Data Science & IT', 'Digital Media', 'Business Systems'],
  coding: ['Software Development', 'Data Science & IT'],
  english: ['Journalism', 'Education', 'Law', 'Communications', 'Social Sciences'],
  afrikaans: ['Education', 'Journalism', 'Communications'],
  'visual arts': ['Design & Creative Arts', 'Architecture', 'Media'],
  music: ['Performing Arts', 'Music Production', 'Education'],
  'dramatic arts': ['Performing Arts', 'Film & Media', 'Communications'],
  'dance studies': ['Performing Arts', 'Education'],
  tourism: ['Hospitality & Tourism', 'Business & Management'],
  hospitality: ['Hospitality & Tourism', 'Culinary Arts'],
  'civil technology': ['Civil Engineering', 'Construction', 'Architecture'],
  'electrical technology': ['Electrical Engineering', 'Electronics', 'Renewable Energy'],
  'mechanical technology': ['Mechanical Engineering', 'Manufacturing', 'Automotive'],
  'engineering graphic': ['Engineering', 'Architecture', 'Design & Creative Arts'],
  'religion studies': ['Social Sciences', 'Education'],
};

export const CAREER_TITLES: Record<string, string[]> = {
  Engineering: ['Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Mining Engineer'],
  'Data Science & IT': ['Software Developer', 'Data Analyst', 'Systems Analyst', 'DevOps Engineer'],
  'Finance & Accounting': ['Chartered Accountant', 'Financial Analyst', 'Auditor', 'Tax Consultant'],
  'Actuarial Science': ['Actuary', 'Risk Analyst', 'Quantitative Analyst'],
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

// Programme name keywords to search per cluster.
export const CLUSTER_PROGRAMME_KEYWORDS: Record<string, string[]> = {
  Engineering: ['engineering'],
  'Data Science & IT': ['computer science', 'information technology', 'data science', 'information systems'],
  'Finance & Accounting': ['accounting', 'finance', 'financial management'],
  'Actuarial Science': ['actuarial', 'statistics', 'mathematical science'],
  Architecture: ['architecture'],
  'Medicine & Health Sciences': ['medicine', 'health sciences', 'medical', 'clinical'],
  'Environmental Science': ['environmental', 'ecology', 'conservation'],
  'Veterinary Science': ['veterinary', 'animal science'],
  Biotechnology: ['biotechnology', 'biochemistry'],
  Agriculture: ['agriculture', 'agriscience', 'agronomy', 'horticulture'],
  'Food Science': ['food science', 'food technology', 'nutrition', 'dietetics'],
  'Business & Management': ['business administration', 'management', 'bcom', 'commerce'],
  Marketing: ['marketing'],
  Economics: ['economics', 'econometrics'],
  Auditing: ['auditing', 'forensic'],
  Law: ['law', 'llb'],
  'Social Sciences': ['social work', 'sociology', 'social science', 'community development'],
  Journalism: ['journalism', 'media studies', 'communication'],
  'Urban Planning': ['town planning', 'urban planning'],
  Geology: ['geology', 'geoscience', 'earth science'],
  'Software Development': ['software engineering', 'computer science'],
  Cybersecurity: ['cybersecurity', 'information security'],
  'Design & Creative Arts': ['design', 'fine arts', 'visual arts'],
  Education: ['education', 'teaching', 'bed '],
  'Hospitality & Tourism': ['tourism', 'hospitality', 'hotel management'],
  'Civil Engineering': ['civil engineering'],
  'Electrical Engineering': ['electrical engineering', 'electronics'],
  'Mechanical Engineering': ['mechanical engineering'],
  Pharmacy: ['pharmacy', 'pharmaceutical'],
  Psychology: ['psychology', 'counselling'],
};

export type SubjectInput = { subject: string; percentage: number };

/** Returns clusters scored by how strongly the subject set points toward them.
 *  Score = sum of percentages for each subject that maps to that cluster, so a
 *  student strong in both Maths (85%) and Physical Sciences (80%) scores
 *  Engineering 165, much higher than a student who only has one of them. */
export function scoreClusters(subjects: SubjectInput[]): Array<{ cluster: string; score: number }> {
  const scores = new Map<string, number>();

  for (const { subject, percentage } of subjects) {
    if (!subject.trim() || percentage <= 0) continue;
    const lower = subject.toLowerCase();

    for (const [keyword, clusters] of Object.entries(SUBJECT_CAREER_CLUSTERS)) {
      if (lower.includes(keyword)) {
        for (const cluster of clusters) {
          scores.set(cluster, (scores.get(cluster) ?? 0) + percentage);
        }
      }
    }
  }

  return Array.from(scores.entries())
    .map(([cluster, score]) => ({ cluster, score }))
    .sort((a, b) => b.score - a.score);
}

/** Top N clusters by weighted score. */
export function topClusters(subjects: SubjectInput[], n = 6): string[] {
  return scoreClusters(subjects).slice(0, n).map((e) => e.cluster);
}
