import type { Metadata, Viewport } from 'next';
import { Nunito, Baloo_2 } from 'next/font/google';
import './globals.css';
import { SiteNav } from '@/components/SiteNav';
import { SiteJsonLd } from '@/components/seo/JsonLd';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-baloo',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fundibot.co.za'),
  title: {
    default: 'Fundibot — College in Your Pocket | Free Course Finder for SA Matrics',
    template: '%s | Fundibot',
  },
  description:
    'Free, no-login course and institution finder built for every South African matriculant. Search 75+ universities, UoTs and TVET colleges, check your APS, and find careers that fit. Sharp sharp.',
  applicationName: 'Fundibot',
  authors: [{ name: 'Fundibot' }],
  creator: 'Fundibot',
  publisher: 'Fundibot',
  manifest: '/manifest.webmanifest',
  keywords: [
    'APS calculator',
    'course finder South Africa',
    'universities South Africa',
    'TVET colleges',
    'NSFAS bursaries',
    'what to study after matric',
    'university applications South Africa',
    'career guidance matric',
    'NSC requirements',
    'UoT colleges',
  ],
  alternates: {
    canonical: '/',
  },
  category: 'education',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Fundibot — College in Your Pocket',
    description:
      'Find your course before your parents choose for you. Free course, institution and bursary finder for every South African matriculant.',
    url: 'https://fundibot.co.za',
    siteName: 'Fundibot',
    type: 'website',
    locale: 'en_ZA',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fundibot — college in your pocket',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fundibot — College in Your Pocket',
    description:
      'Free course, institution and bursary finder for every South African matriculant. No login, no stress.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#1B7FE3',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`bg-white ${nunito.variable} ${baloo.variable}`}>
      <body className='font-sans'>
        <SiteJsonLd />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
