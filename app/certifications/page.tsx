import type { Metadata } from 'next';
import { SceneIntentOnMount } from '@/components/canvas/SceneTrigger';
import { CertificateRecord } from '@/components/certifications/CertificateRecord';
import { recordItems, recordStats } from '@/components/certifications/record';
import { Counter } from '@/components/motion/Counter';
import { Magnetic } from '@/components/motion/Magnetic';
import { Reveal } from '@/components/motion/Reveal';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Section';

const description =
  'The learning record: each Product School certificate matched to the shipped work it fed into, and an honest note where it has not been applied yet.';

export const metadata: Metadata = {
  title: 'Certifications',
  description,
  alternates: { canonical: '/certifications' },
  openGraph: { title: 'Certifications · Tousif Ali', description, url: '/certifications' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Certifications',
  numberOfItems: recordItems.length,
  itemListElement: recordItems.map((cert, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'EducationalOccupationalCredential',
      name: cert.fullTitle,
      credentialCategory: 'certificate',
      educationalLevel: cert.level,
      recognizedBy: { '@type': 'Organization', name: cert.issuer },
      ...(cert.link ? { url: cert.link } : {}),
    },
  })),
};

export default function CertificationsPage() {
  const stats = [
    { value: recordStats.completed, label: 'Completed' },
    ...(recordStats.inProgress > 0 ? [{ value: recordStats.inProgress, label: 'In progress' }] : []),
    { value: recordStats.applied, label: `Applied to shipped work, of ${recordStats.total}` },
    { value: recordStats.issuers, label: recordStats.issuers === 1 ? 'Issuer' : 'Issuers' },
  ];

  return (
    <main className="pb-[clamp(3.5rem,9vw,7.5rem)]">
      <SceneIntentOnMount intensity={0.4} layout="right" shape="grid" signal={0.35} />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        type="application/ld+json"
      />

      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'Certifications' },
        ]}
      />

      <Container className="pt-8 md:pt-12">
        <header>
          <Eyebrow index="01">The learning record</Eyebrow>
          <Reveal as="h1" className="mt-6 max-w-[14ch] text-balance font-display text-display text-textPrimary md:mt-8" immediate>
            Learned, then <em className="font-serif font-normal italic">applied</em>.
          </Reveal>
          <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-12">
            <Reveal
              as="p"
              className="max-w-[46ch] text-lead text-textSecondary md:col-span-6 md:col-start-1"
              delay={0.25}
              immediate
              mode="fade"
            >
              A CEO-sponsored curriculum, kept as a record rather than a wall of badges. Each certificate is matched to the
              shipped work it fed into. Where it has not been applied yet, the record says so.
            </Reveal>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-surfaceBorder pt-8 md:mt-20 md:grid-cols-4 md:gap-x-[var(--gutter)]">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-[clamp(2.75rem,6vw,5rem)] font-medium leading-none tracking-[-0.05em] tabular-nums text-textPrimary">
                  <Counter value={String(stat.value)} />
                </dd>
                <dt className="label mt-3 max-w-[22ch] text-textMuted">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </header>

        <div className="mt-[clamp(4rem,9vw,8rem)]">
          <CertificateRecord />
        </div>

        <aside className="mt-24 grid gap-10 border-t border-surfaceBorder pt-12 md:mt-32 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow index="02">The other half</Eyebrow>
            <Reveal as="p" className="mt-5 max-w-2xl text-balance font-display text-h2 text-textPrimary">
              Recognition, the other half: what people did with the <em className="font-serif font-normal italic">work</em>.
            </Reveal>
          </div>
          <div className="flex flex-wrap items-start gap-4 md:col-span-4 md:col-start-9 md:justify-end md:self-end">
            <Magnetic>
              <ButtonLink href="/recognition" size="lg">
                Read the recognition
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              Contact
            </ButtonLink>
          </div>
        </aside>
      </Container>
    </main>
  );
}
