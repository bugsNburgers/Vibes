import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'vibes — suprateeky yawagal',
  description: 'Not in the README. The personal side of suprateeky — anime, music, and animals.',
  metadataBase: new URL('https://vibes.suprateekyawagal.in'),
  openGraph: {
    title: 'vibes — suprateeky yawagal',
    description: 'Not in the README.',
    url: 'https://vibes.suprateekyawagal.in',
    siteName: 'vibes',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'vibes — suprateeky yawagal',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
