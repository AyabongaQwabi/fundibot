import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fundibot',
  description: 'Find institutions, careers, and courses using South African admission tools.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
