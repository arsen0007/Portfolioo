import { CertificateGallery } from '@/components/recognition/CertificateGallery';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Figure } from '@/components/ui/Figure';
import { Metric } from '@/components/ui/Metric';
import { Quote } from '@/components/ui/Quote';
import { Eyebrow } from '@/components/ui/Section';
import { Split } from '@/components/ui/Split';
import { certs } from '@/lib/data/certifications';
import { recognition } from '@/lib/data/recognition';

/**
 * One page for every kind of outside validation. The quotes and the
 * certification list each live in exactly one data file (recognition.ts and
 * certifications.ts); other pages read from those rather than keeping copies.
 */
export default function RecognitionPage() {
  const { credentialsTier, leadershipTier, topTier } = recognition;

  const find = (id: string) => leadershipTier.find((person) => person.id === id);
  const manager = find('fernando');
  const ceo = find('ceo');
  const ciso = find('ciso');
  const cto = find('cto');
  const hackathon = credentialsTier.find((item) => item.id === 'hackathon');

  const completed = certs.filter((cert) => cert.status === 'completed').length;

  return (
    <main className="pb-[clamp(3.5rem,9vw,7.5rem)]">
      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'Recognition' },
        ]}
      />

      <Container className="pt-8 md:pt-12">
        <header className="max-w-3xl">
          <Eyebrow>Recognition</Eyebrow>
          <h1 className="mt-4 text-balance font-display text-h1 text-textPrimary">
            Validated by leadership, peers and the public record.
          </h1>
          <p className="mt-6 text-lead text-textSecondary">
            Not praise for effort: a response to shipped systems.
          </p>
        </header>

        {manager ? (
          <Quote
            attribution={`${manager.name}, ${manager.role}`}
            className="mt-14 lg:mt-20"
            consequence={manager.highlight}
          >
            {manager.quote.replace(/^"|"$/g, '')}
          </Quote>
        ) : null}
      </Container>

      <div className="mt-[clamp(3.5rem,9vw,7.5rem)]">
        <Split
          eyebrow="The public record"
          intro={`${topTier.source}, ${topTier.date}`}
          title={topTier.title}
        >
          <Quote attribution={`${topTier.source} · ${topTier.date}`}>{topTier.quote}</Quote>
          <ButtonLink className="mt-8" href={topTier.link} variant="link">
            Read on Workplace Options ↗
          </ButtonLink>
        </Split>

        <Split
          eyebrow="What leaders said"
          intro="Quotes matter less than what each person did next."
          title="Words, and the decisions behind them."
        >
          <div className="space-y-14">
            {[ceo, ciso].map((person) =>
              person ? (
                <Quote
                  attribution={`${person.name}, ${person.role}`}
                  consequence={person.highlight}
                  key={person.id}
                >
                  {person.quote}
                </Quote>
              ) : null,
            )}

            {cto ? (
              <div className="border-t border-surfaceBorder pt-8">
                <p className="text-small font-medium text-textMuted">
                  {cto.name}, {cto.role}
                </p>
                <p className="mt-3 font-display text-h3 text-textPrimary">{cto.highlight}</p>
                <ol className="mt-6 grid gap-3 text-textSecondary sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
                  <li>
                    <span className="block font-medium text-textPrimary">CaseWise</span>
                    <span className="text-small text-textMuted">Internal prototype</span>
                  </li>
                  <li aria-hidden="true" className="hidden text-textMuted sm:block">
                    →
                  </li>
                  <li>
                    <span className="block font-medium text-textPrimary">CTO directive</span>
                    <span className="text-small text-textMuted">{cto.quote}</span>
                  </li>
                  <li aria-hidden="true" className="hidden text-textMuted sm:block">
                    →
                  </li>
                  <li>
                    <span className="block font-medium text-textPrimary">Core system</span>
                    <span className="text-small text-textMuted">
                      Company-wide integration, in progress
                    </span>
                  </li>
                </ol>
                <p className="mt-6 text-small text-textMuted">
                  No quote is needed here. The CTO backing production integration is the
                  endorsement.
                </p>
              </div>
            ) : null}

            {manager?.kudoImage ? (
              <Figure
                alt={`Excellence recognition from ${manager.name}, ${manager.role}`}
                caption={`${manager.name}, ${manager.role}: ${manager.highlight}.`}
                height={535}
                src={manager.kudoImage}
                width={1600}
              />
            ) : null}
          </div>
        </Split>

        {hackathon ? (
          <Split eyebrow="Credential" intro={hackathon.subtitle} title={hackathon.title}>
            {hackathon.detail ? (
              <p className="max-w-prose text-lead text-textSecondary">{hackathon.detail}</p>
            ) : null}
            {hackathon.facts ? (
              <div className="mt-10 grid gap-8 border-t border-surfaceBorder pt-8 sm:grid-cols-3">
                {hackathon.facts.map((fact) => (
                  <Metric caption={fact.label} key={fact.label} value={fact.value} />
                ))}
              </div>
            ) : null}
            {hackathon.href ? (
              <ButtonLink className="mt-8" href={hackathon.href} variant="link">
                Read the case study →
              </ButtonLink>
            ) : null}
          </Split>
        ) : null}

        <Split
          eyebrow="Credentials · Product School"
          id="certifications"
          intro="A CEO-sponsored curriculum. Each certificate links to the issuer's own verification page."
          title={`${completed} certifications earned.`}
        >
          <CertificateGallery />
        </Split>
      </div>
    </main>
  );
}
