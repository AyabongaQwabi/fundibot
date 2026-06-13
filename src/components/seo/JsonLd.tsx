const BASE_URL = 'https://fundibot.co.za';

/**
 * Site-wide structured data: Organization + WebSite.
 * Rendered once in the root layout so every page carries entity context
 * for Google Knowledge Graph and AI search engines (GEO).
 */
export function SiteJsonLd() {
  const organization = {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Fundibot',
    alternateName: 'Fundibot — College in Your Pocket',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/icon-192.png`,
      width: 192,
      height: 192,
    },
    image: `${BASE_URL}/og-image.png`,
    description:
      'Fundibot is a free, no-login platform that helps South African matriculants find courses, institutions, bursaries and careers that fit their subjects and marks.',
    slogan: 'College in your pocket',
    areaServed: {
      '@type': 'Country',
      name: 'South Africa',
    },
    knowsAbout: [
      'APS calculation',
      'university admission requirements in South Africa',
      'TVET colleges',
      'NSFAS and bursaries',
      'career guidance',
    ],
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Fundibot',
    description: 'Free course, institution and bursary finder for South African matriculants.',
    inLanguage: 'en-ZA',
    publisher: { '@id': `${BASE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/tools/course-finder?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [organization, website],
  };

  return (
    <script
      type='application/ld+json'
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

/**
 * Reusable JSON-LD emitter for page-level structured data.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type='application/ld+json'
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export { BASE_URL };

/**
 * Builds a BreadcrumbList schema object from an ordered list of crumbs.
 */
export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}
