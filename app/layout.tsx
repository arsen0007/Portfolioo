import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Instrument_Sans, JetBrains_Mono, Newsreader } from 'next/font/google';
import '@/styles/globals.css';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

// Display serif. A variable font with an optical-size axis, so headlines get
// tighter forms at large sizes and sturdier ones when small.
const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-display',
  // `optional`: use the web font only if it is ready almost immediately,
  // otherwise keep the serif fallback for this page view. That removes the
  // font-swap layout shift. Next cannot derive size-adjust metrics for this
  // family, so a late swap would move the content below every headline.
  display: 'optional',
  adjustFontFallback: false,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
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

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0e0e0d' },
    { media: '(prefers-color-scheme: light)', color: '#faf8f5' },
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
                // Theme: an explicit choice (stored by the toggle) wins;
                // otherwise follow the device setting.
                var systemDark = false;
                try {
                  systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                } catch (error) {}
                var dark = systemDark;
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'dark' || saved === 'light') {
                    dark = saved === 'dark';
                  }
                } catch (error) {}
                document.documentElement.classList.toggle('dark', dark);
              })();
            `,
          }}
        />
      </head>
      <body
        className={cn(
          newsreader.variable,
          instrumentSans.variable,
          jetBrainsMono.variable,
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
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <div id="main-content">{children}</div>
        <Footer />
        <GoogleAnalytics measurementId="G-JMYVGZQCKT" />
      </body>
    </html>
  );
}
