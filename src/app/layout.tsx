import type { Metadata, Viewport } from 'next';
import { Nunito, Baloo_2 } from 'next/font/google';
import './globals.css';
import { SiteNav } from '@/components/SiteNav';

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
  title: 'Fundibot — College in Your Pocket | Free Course Finder for SA Matrics',
  description:
    'Free, no-login course and institution finder built for every South African matriculant. Search 75+ universities, UoTs and TVET colleges, check your APS, and find careers that fit. Sharp sharp.',
  keywords: [
    'APS calculator',
    'course finder South Africa',
    'universities South Africa',
    'TVET colleges',
    'bursaries',
    'matric',
    'what to study',
  ],
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
    description: 'Find your course before your parents choose for you. Free for every South African matriculant.',
    type: 'website',
    locale: 'en_ZA',
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
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
