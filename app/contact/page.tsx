import { SceneIntentOnMount, SceneTrigger } from '@/components/canvas/SceneTrigger';
import { ContactForm } from '@/components/contact/ContactForm';
import { CopyEmail } from '@/components/contact/CopyEmail';
import { LocalTime } from '@/components/layout/LocalTime';
import { Reveal } from '@/components/motion/Reveal';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Section';

const EMAIL = 'tousifarsen@gmail.com';

const channels = [
  {
    href: 'https://www.linkedin.com/in/tousif-ali--/',
    label: 'LinkedIn',
    value: 'Tousif Ali',
  },
  {
    href: 'https://github.com/arsen0007',
    label: 'GitHub',
    value: 'github.com/arsen0007',
  },
] as const;

/**
 * Deliberately no availability or job-seeking signal anywhere on this page.
 * The position is practitioner, not candidate: describe a repeated task and get
 * a straight answer back. That reads as expertise rather than as looking.
 */
const whatYouGetBack = [
  {
    label: 'An honest read',
    value: 'Whether AI is actually the right answer, or whether the problem is upstream of it.',
  },
  {
    label: 'Where the time goes',
    value: 'Which steps in that process are real work and which are only habit.',
  },
  {
    label: 'What it would take',
    value: 'A rough shape of the system, and the parts that would be hard.',
  },
] as const;

export default function ContactPage() {
  return (
    <main className="pb-[clamp(3.5rem,9vw,7.5rem)]">
      {/* The field gathers in the middle and leans in, as if listening. */}
      <SceneIntentOnMount intensity={0.5} layout="center" shape="sphere" signal={0.6} />

      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'Contact' },
        ]}
      />

      <Container className="pt-10 md:pt-16">
        <Eyebrow index="01">Contact</Eyebrow>
        <Reveal
          as="h1"
          className="mt-6 text-balance font-display text-mega font-medium text-textPrimary"
          immediate
        >
          Let&apos;s build the{' '}
          <em className="font-serif font-normal italic tracking-[-0.04em]">system.</em>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12">
          <p className="max-w-[48ch] text-lead text-textSecondary lg:col-span-6">
            If your team is doing something by hand that a system should own, I want to hear about
            it. Describe the repeated task: the manual process, roughly how much time it eats, and
            who does it today. I will tell you where the time is actually going and whether AI is
            the right answer for it. Sometimes it is not, and that is a useful answer too.
          </p>
          <p className="label flex flex-wrap items-center gap-x-5 gap-y-2 text-textMuted lg:col-span-4 lg:col-start-9 lg:justify-end lg:self-end">
            <span aria-hidden="true" className="live-dot" />
            <LocalTime />
            <span>Replies within a day or so</span>
          </p>
        </div>

        {/* Email first: the lowest-friction way in. */}
        <div className="mt-[clamp(3.5rem,8vw,7rem)] border-t border-surfaceBorderStrong pt-10">
          <p className="label text-textMuted">Write to me directly</p>
          <div className="mt-6">
            <CopyEmail email={EMAIL} />
          </div>
        </div>

        {/* The reading part: the field recedes so the sentence stays legible. */}
        <SceneTrigger as="div" intensity={0.16} layout="center" shape="sphere" signal={0.6}>
        {/* The sentence form. */}
        <div className="mt-[clamp(4.5rem,10vw,9rem)] border-t border-surfaceBorder pt-10">
          <Eyebrow index="02">Or write it as a sentence</Eyebrow>
          <div className="mt-10 max-w-6xl">
            <ContactForm />
          </div>
        </div>

        <div className="mt-[clamp(4.5rem,10vw,9rem)] border-t border-surfaceBorder pt-10">
          <Eyebrow index="03">What you get back</Eyebrow>
          <dl className="mt-10 grid border-l border-t border-surfaceBorderStrong md:grid-cols-3">
            {whatYouGetBack.map((item, index) => (
              <div className="border-b border-r border-surfaceBorderStrong p-6 sm:p-8" key={item.label}>
                <p className="label text-accent">{String(index + 1).padStart(2, '0')}</p>
                <dt className="mt-6 font-display text-h3 font-medium text-textPrimary">{item.label}</dt>
                <dd className="mt-3 max-w-[34ch] text-textSecondary">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-small text-textMuted">
            No pitch attached. I like these problems, and I have opinions about most of them.
          </p>
        </div>

        <div className="mt-[clamp(4.5rem,10vw,9rem)] border-t border-surfaceBorder pt-10">
          <Eyebrow index="04">Elsewhere</Eyebrow>
          <ul className="mt-8 border-t border-surfaceBorderStrong">
            {channels.map((channel) => (
              <li className="border-b border-surfaceBorderStrong" key={channel.label}>
                <a
                  className="group relative flex min-h-24 items-center justify-between gap-6 py-6 sm:py-8"
                  data-cursor="link"
                  href={channel.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="block font-display text-[clamp(2.6rem,1.4rem+6vw,7rem)] font-medium leading-none tracking-[-0.05em] text-textPrimary transition-transform duration-700 ease-out group-hover:translate-x-4 group-focus-visible:translate-x-4">
                    {channel.label}
                  </span>
                  <span className="flex items-center gap-5">
                    <span className="label hidden text-textMuted sm:block">{channel.value}</span>
                    <span
                      aria-hidden="true"
                      className="font-display text-[clamp(1.8rem,1rem+3vw,4rem)] leading-none text-textMuted transition-[transform,color] duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
                    >
                      ↗
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
        </SceneTrigger>
      </Container>
    </main>
  );
}
