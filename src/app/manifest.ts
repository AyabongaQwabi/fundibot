import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fundibot — College in Your Pocket',
    short_name: 'Fundibot',
    description:
      'Free course, institution and bursary finder for every South African matriculant. No login, no stress.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1B7FE3',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    categories: ['education', 'reference'],
    lang: 'en-ZA',
  };
}
