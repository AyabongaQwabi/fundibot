import { JsonLd, BASE_URL } from '@/components/seo/JsonLd';

const FAQS = [
  {
    q: 'What is Fundibot?',
    a: 'Fundibot is a free, no-login platform that helps South African matriculants find courses, institutions, bursaries and careers that match their subjects and marks. It covers universities, universities of technology and TVET colleges.',
  },
  {
    q: 'Is Fundibot free to use?',
    a: 'Yes. Every Fundibot tool — the course finder, APS qualification checker, career recommender, bursary matcher and institution comparison — is completely free and works without creating an account.',
  },
  {
    q: 'How do I calculate my APS score?',
    a: 'Your Admission Point Score (APS) is calculated by converting your final or predicted marks for your best subjects into points and adding them together. Fundibot\'s APS Qualification Checker does this automatically when you enter your subjects and marks, then shows the programmes you qualify for.',
  },
  {
    q: 'Which institutions does Fundibot cover?',
    a: 'Fundibot covers 75+ South African institutions, including public universities, universities of technology, and TVET colleges, with their faculties, campuses, programmes and admission requirements.',
  },
  {
    q: 'Can Fundibot help me find bursaries?',
    a: 'Yes. The Bursary & Funding Matcher lets you search nearly 1,000 South African bursaries and NSFAS-related funding matched to your field of study.',
  },
  {
    q: 'What can I study if I did not get the marks for university?',
    a: 'Plenty. Fundibot\'s Gap Year & Alternative Pathways tool shows TVET programmes, bridging courses, learnerships and short skills programmes you can qualify for with your current NSC results.',
  },
];

export function HomeJsonLd() {
  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Fundibot',
    url: BASE_URL,
    applicationCategory: 'EducationApplication',
    operatingSystem: 'Web',
    inLanguage: 'en-ZA',
    description:
      'Free course, institution and bursary finder for South African matriculants. Check your APS, compare institutions and discover careers that fit your subjects.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ZAR',
    },
    publisher: { '@id': `${BASE_URL}/#organization` },
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return <JsonLd data={[softwareApp, faqPage]} />;
}

export { FAQS };
