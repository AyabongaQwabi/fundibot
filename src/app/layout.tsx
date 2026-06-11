import type { Metadata } from 'next';
import './globals.css';
import { SiteNav } from '@/components/SiteNav';

export const metadata: Metadata = {
  title: 'Fundibot — Your Guide to Study After Matric',
  description: 'Calculate your APS score, find universities, explore courses, and discover careers that match your Grade 12 results. Free tools for South African learners.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
