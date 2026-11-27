import Image from 'next/image';
import { SceneIntentOnMount } from '@/components/canvas/SceneTrigger';
import { Reveal } from '@/components/motion/Reveal';
import { LeaderQuote } from '@/components/recognition/LeaderQuote';
import { Plaque } from '@/components/recognition/Plaque';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Section';
import { certs } from '@/lib/data/certifications';
import { recognition } from '@/lib/data/recognition';

/** The strongest outside validation first. */
const plaqueOrder = ['gdp-challenge', 'hackathon'];

const sectionPad = 'py-[clamp(4.5rem,10vw,9rem)]';

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

  // Every credential that has a story to tell (the Product School list has its own section).
  const plaques = credentialsTier
    .filter((item) => item.detail)
    .sort((a, b) => plaqueOrder.indexOf(a.id) - plaqueOrder.indexOf(b.id));

  const teaser = certs.filter((cert) => cert.file).slice(0, 4);
  const completed = certs.filter((cert) => cert.status === 'completed').length;

  return (
    <main className="pb-[clamp(3.5rem,9vw,7.5rem)]">
      <SceneIntentOnMount intensity={0.5} layout="right" shape="sphere" signal={0.4} />

      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'Recognition' },
        ]}
      />

      <Container className="pb-[clamp(3rem,6vw,5rem)] pt-10 md:pt-16">
        <Eyebrow index="01">Recognition</Eyebrow>
        <Reveal
          as="h1"
          className="mt-6 max-w-[15ch] text-balance font-display text-display font-medium text-textPrimary"
          immediate
        >
          Validated by leadership, peers and the{' '}
          <em className="font-serif font-normal italic tracking-[-0.03em]">public record.</em>
        </Reveal>
        <p className="mt-10 max-w-xl text-lead text-textSecondary">
          Not praise for effort: a response to shipped systems.
        </p>
      </Container>

      {/* 02 · Plaques */}
      <Container>
        <div className="border-b border-surfaceBorderStrong">
          {plaques.map((credential, index) => (
            <Plaque credential={credential} index={index} key={credential.id} total={plaques.length} />
          ))}
        </div>
      </Container>

      {/* 03 · Leadership, in their words */}
      <Container className={sectionPad}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow index="03">What leaders said</Eyebrow>
            <Reveal as="h2" className="mt-5 text-balance font-display text-h1 font-medium text-textPrimary">
              Words, and the <em className="font-serif font-normal italic tracking-[-0.02em]">decisions</em> behind them.
            </Reveal>
          </div>
          <p className="text-textSecondary lg:col-span-3 lg:col-start-10">
            Quotes matter less than what each person did next.
          </p>
        </div>

        {manager ? (
          <LeaderQuote
            attribution={`${manager.name}, ${manager.role}`}
            className="mt-[clamp(3rem,7vw,6rem)] max-w-6xl"
            consequence={manager.highlight}
            size="xl"
          >
            {manager.quote.replace(/^"|"$/g, '')}
          </LeaderQuote>
        ) : null}

        <div className="mt-[clamp(4rem,9vw,8rem)] grid gap-x-12 gap-y-16 border-t border-surfaceBorder pt-[clamp(3rem,6vw,5rem)] lg:grid-cols-2">
          {[ceo, ciso].map((person) =>
            person ? (
              <LeaderQuote
                attribution={`${person.name}, ${person.role}`}
                consequence={person.highlight}
                key={person.id}
              >
                {person.quote}
              </LeaderQuote>
            ) : null,
          )}
        </div>

        {cto ? (
          <div className="mt-[clamp(4rem,9vw,8rem)] border-t border-surfaceBorder pt-[clamp(3rem,6vw,5rem)]">
            <p className="label text-textMuted">
              {cto.name}, {cto.role}
            </p>
            <Reveal as="p" className="mt-4 max-w-4xl text-balance font-display text-h2 font-medium text-textPrimary">
              {cto.highlight}
            </Reveal>
            <ol className="mt-12 grid border-l border-t border-surfaceBorderStrong sm:grid-cols-3">
              {[
                { label: 'Internal prototype', value: 'CaseWise' },
                { label: cto.quote, value: 'CTO directive' },
                { label: 'Company-wide integration, in progress', value: 'Core system' },
              ].map((step, stepIndex) => (
                <li className="relative border-b border-r border-surfaceBorderStrong p-6 sm:p-8" key={step.value}>
                  <p className="label text-accent">{String(stepIndex + 1).padStart(2, '0')}</p>
                  <p className="mt-6 font-display text-h3 font-medium text-textPrimary">{step.value}</p>
                  <p className="label mt-3 max-w-[30ch] leading-relaxed text-textMuted">{step.label}</p>
                  {stepIndex < 2 ? (
                    <span
                      aria-hidden="true"
                      className="absolute right-4 top-6 hidden font-mono text-textMuted sm:block"
                    >
                      →
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
            <p className="mt-6 max-w-prose text-small text-textMuted">
              No quote is needed here. The CTO backing production integration is the endorsement.
            </p>
          </div>
        ) : null}

        {manager?.kudoImage ? (
          <figure className="mt-[clamp(4rem,9vw,8rem)] max-w-3xl">
            <div className="border border-surfaceBorderStrong p-2">
              <Image
                alt={`Excellence recognition from ${manager.name}, ${manager.role}`}
                className="h-auto w-full"
                height={535}
                sizes="(min-width: 1024px) 768px, 100vw"
                src={manager.kudoImage}
                width={1600}
              />
            </div>
            <figcaption className="mt-4 flex gap-3 text-small text-textMuted">
              <span aria-hidden="true" className="label pt-0.5 text-accent">
                Fig.
              </span>
              <span>
                {manager.name}, {manager.role}: {manager.highlight}.
              </span>
            </figcaption>
          </figure>
        ) : null}
      </Container>

      {/* 04 · The public record */}
      <section className="border-t border-surfaceBorder">
        <Container className={sectionPad}>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow index="04">The public record</Eyebrow>
              <Reveal as="h2" className="mt-5 text-balance font-display text-h2 font-medium text-textPrimary">
                {topTier.title}
              </Reveal>
              <p className="label mt-5 text-textMuted">
                {topTier.source} · {topTier.date}
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <LeaderQuote attribution={`${topTier.source} · ${topTier.date}`}>{topTier.quote}</LeaderQuote>
              <ButtonLink className="mt-8" href={topTier.link} variant="link">
                Read on Workplace Options ↗
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* 05 · Certificates: a teaser; the full record lives at /certifications */}
      <section className="scroll-mt-[var(--header-h)] border-t border-surfaceBorder" id="certifications">
        <Container className={sectionPad}>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <Eyebrow index="05">Credentials · Product School</Eyebrow>
              <Reveal as="h2" className="mt-5 text-balance font-display text-h1 font-medium text-textPrimary">
                <span className="tabular-nums">{completed}</span>{' '}
                <em className="font-serif font-normal italic tracking-[-0.02em]">certifications</em> earned.
              </Reveal>
              <p className="mt-6 max-w-md text-textSecondary">
                A CEO-sponsored curriculum, each certificate matched to the shipped work it fed into.
              </p>
              <ButtonLink className="mt-8" href="/certifications" variant="secondary">
                Open the learning record
              </ButtonLink>
            </div>
            <ul aria-hidden="true" className="grid grid-cols-4 gap-3 lg:col-span-5 lg:col-start-8">
              {teaser.map((cert) => (
                <li className="relative aspect-[1.42/1] overflow-hidden border border-surfaceBorder bg-surface" key={cert.id}>
                  <Image alt="" className="object-cover" fill sizes="(min-width: 1024px) 140px, 22vw" src={cert.file!} />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </main>
  );
}
