import type { Metadata } from 'next';
import { Suspense } from 'react';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { SceneRoot } from '@/components/canvas/SceneRoot';
import { Cursor } from '@/components/motion/Cursor';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { TransitionResolver } from '@/components/motion/TransitionLink';

// SIGNAL type system, self-hosted (OFL): Geist for display and body, Geist
// Mono for the system voice, Instrument Serif italic for the human accent.
const geist = localFont({
  src: '../assets/fonts/Geist-Variable.woff2',
  variable: '--font-body',
  weight: '100 900',
  display: 'swap',
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

const geistMono = localFont({
  src: '../assets/fonts/GeistMono-Variable.woff2',
  variable: '--font-mono',
  weight: '100 900',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});

const instrumentSerif = localFont({
  src: [
    { path: '../assets/fonts/instrument-serif-latin-400-normal.woff2', style: 'normal', weight: '400' },
    { path: '../assets/fonts/instrument-serif-latin-400-italic.woff2', style: 'italic', weight: '400' },
  ],
  variable: '--font-serif',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#08080a' },
    { media: '(prefers-color-scheme: light)', color: '#08080a' },
  ],
  // Lets the page extend under notches; the header and menu pad for it.
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tousifali.com'),
  alternates: { canonical: './' },
  title: {
    default: 'Tousif Ali — AI systems that replace manual work',
    template: '%s | Tousif Ali',
  },
  description:
    'I build AI systems that replace manual work. CaseWise saved 433 hours/month and earned CTO backing for core-system integration. BarHunter sourced 94,363 leads. Global Hackathon Winner.',
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
    title: 'Tousif Ali — AI systems that replace manual work',
    description:
      'Building systems that create measurable impact. 94,363 leads sourced. 433 hours/month saved. Global Hackathon Winner.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tousif Ali — AI systems that replace manual work',
    description: 'I build AI systems that replace manual work. 94,363 leads sourced. 433h saved monthly.',
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
                var root = document.documentElement;
                // Theme: dark-first. An explicit choice (stored by the toggle) wins.
                var dark = true;
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'light') dark = false;
                } catch (error) {}
                root.classList.toggle('dark', dark);
                // Motion: reveals hide content only when JS runs and motion is allowed.
                try {
                  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    root.classList.add('motion-ok');
                  }
                } catch (error) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={cn(
          geist.variable,
          geistMono.variable,
          instrumentSerif.variable,
          'bg-canvas font-body text-textPrimary antialiased',
        )}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Tousif Ali',
              url: 'https://tousifali.com',
              email: 'mailto:tousifarsen@gmail.com',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Bengaluru',
                addressCountry: 'IN',
              },
              sameAs: [
                'https://github.com/arsen0007',
                'https://www.linkedin.com/in/tousif-ali--/',
              ],
              knowsAbout: [
                'AI Product Management',
                'Workflow Automation',
                'LLM Applications',
                'Full-stack Development',
              ],
            }),
          }}
          type="application/ld+json"
        />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SceneRoot />
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <div className="relative z-10" id="main-content">
          {children}
        </div>
        <Footer />
        <div aria-hidden="true" className="grain" />
        <Cursor />
        <SmoothScroll />
        <TransitionResolver />
        <GoogleAnalytics measurementId="G-JMYVGZQCKT" />
      </body>
    </html>
  );
}
