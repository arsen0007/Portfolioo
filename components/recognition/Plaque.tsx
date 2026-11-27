import Image from 'next/image';
import { Counter } from '@/components/motion/Counter';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import type { CredentialRecognition } from '@/lib/data/recognition';

/** Sets the last word of a title in the serif-italic accent: one per heading. */
function AccentTitle({ title }: { title: string }) {
  const at = title.lastIndexOf(' ');
  if (at < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, at + 1)}
      <em className="font-serif font-normal italic tracking-[-0.03em]">{title.slice(at + 1)}</em>
    </>
  );
}

type PlaqueProps = {
  credential: CredentialRecognition;
  index: number;
  total: number;
};

/**
 * A recognition "plaque": a ruled slab with the title set huge, the meta in
 * mono and every number counting up. Everything is real text in DOM order.
 */
export function Plaque({ credential, index, total }: PlaqueProps) {
  const { detail, facts, href, image, subtitle, title } = credential;

  return (
    <article className="border-t border-surfaceBorderStrong py-[clamp(3rem,7vw,6.5rem)]">
      <div className="grid gap-x-10 gap-y-12 lg:grid-cols-12">
        <p className="label text-textMuted lg:col-span-1">
          <span className="text-accent">{String(index + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
        </p>

        <div className="lg:col-span-7">
          <p className="label text-textMuted">{subtitle}</p>
          <Reveal as="h2" className="mt-5 text-balance font-display text-h1 font-medium text-textPrimary">
            <AccentTitle title={title} />
          </Reveal>
          {detail ? <p className="mt-8 max-w-[58ch] text-lead text-textSecondary">{detail}</p> : null}
          {href ? (
            <ButtonLink className="mt-8" href={href} variant="link">
              Read the case study →
            </ButtonLink>
          ) : null}
          {image ? (
            <figure className="mt-12 max-w-md">
              <div className="border border-surfaceBorderStrong p-2">
                <Image
                  alt={image.alt}
                  className="h-auto w-full"
                  height={image.height}
                  sizes="(min-width: 1024px) 448px, 100vw"
                  src={image.src}
                  width={image.width}
                />
              </div>
              {image.caption ? (
                <figcaption className="mt-4 flex gap-3 text-small text-textMuted">
                  <span aria-hidden="true" className="label pt-0.5 text-accent">
                    Fig.
                  </span>
                  <span>{image.caption}</span>
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>

        {facts ? (
          <dl className="grid gap-0 self-start border-t border-surfaceBorder lg:col-span-4">
            {facts.map((fact, factIndex) => (
              <div className="flex flex-col-reverse gap-3 border-b border-surfaceBorder py-6" key={fact.label}>
                <dt className="label max-w-[34ch] text-textMuted">{fact.label}</dt>
                <dd
                  className={`font-display text-[clamp(3.5rem,2rem+5vw,7rem)] font-medium leading-[0.9] tracking-[-0.05em] tabular-nums ${
                    factIndex === 0 ? 'text-accent' : 'text-textPrimary'
                  }`}
                >
                  <Counter value={fact.value} />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </article>
  );
}
