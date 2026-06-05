import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Instrument_Sans, JetBrains_Mono, Syne } from 'next/font/google';
import '@xyflow/react/dist/style.css';
import '@/styles/globals.css';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PageTransition } from '@/components/layout/PageTransition';
import { cn } from '@/lib/utils';

const syne = Syne({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tousifali.com'),
  title: {
    default: 'Tousif Ali — AI Product & Solutions Builder',
    template: '%s | Tousif Ali',
  },
  description:
    'I build AI systems that replace manual work. CaseWise saved 433 hours/month and was integrated into the core system. BarHunter sourced 100K+ leads. Global Hackathon Winner.',
  keywords: [
    'AI Product Builder',
    'Solutions Architect',
    'AI Automation',
    'Next.js Portfolio',
    'CaseWise',
    'Legal Tech AI',
    'Product Management',
  ],
  authors: [{ name: 'Tousif Ali' }],
  creator: 'Tousif Ali',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tousifali.com',
    siteName: 'Tousif Ali Portfolio',
    title: 'Tousif Ali — AI Product & Solutions Builder',
    description:
      'Building systems that create measurable impact. 100K+ leads sourced. 433 hours/month saved. Global Hackathon Winner.',
    images: [
      {
        url: '/og-image.png', // Ensure this exists in your public folder
        width: 1200,
        height: 630,
        alt: 'Tousif Ali — AI Product & Solutions Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tousif Ali — AI Product & Solutions Builder',
    description: 'I build AI systems that replace manual work. 100K+ leads sourced. 433h saved monthly.',
    images: ['/og-image.png'],
    creator: '@tousifali',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'light') {
                    // explicit light choice — respect it
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (error) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={cn(
          syne.variable,
          instrumentSans.variable,
          jetBrainsMono.variable,
          'bg-canvas font-body text-textPrimary antialiased',
        )}
      >
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
