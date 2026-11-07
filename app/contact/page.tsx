import { ContactForm } from '@/components/contact/ContactForm';
import { CopyEmail } from '@/components/contact/CopyEmail';
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
      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'Contact' },
        ]}
      />

      <Container className="pt-8 md:pt-12">
        <header className="max-w-3xl">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-4 text-balance font-display text-h1 text-textPrimary">
            If your team is doing something by hand that a system should own, I want to hear about
            it.
          </h1>
          <p className="mt-6 text-lead text-textSecondary">
            Describe the repeated task: the manual process, roughly how much time it eats, and who
            does it today. I will tell you where the time is actually going and whether AI is the
            right answer for it. Sometimes it is not, and that is a useful answer too.
          </p>
        </header>

        {/* Email first: the lowest-friction way in. */}
        <div className="mt-10 border-y border-surfaceBorder py-8">
          <p className="text-small text-textMuted">Write to me directly</p>
          <a
            className="mt-2 block break-words py-2 font-display text-h2 text-textPrimary underline decoration-accent decoration-2 underline-offset-8 hover:decoration-textPrimary"
            href={`mailto:${EMAIL}`}
          >
            {EMAIL}
          </a>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <CopyEmail email={EMAIL} />
          </div>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-h3 text-textPrimary">Or use the form</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="font-display text-h3 text-textPrimary">What you get back</h2>
            <dl className="mt-6 border-t border-surfaceBorder">
              {whatYouGetBack.map((item) => (
                <div className="border-b border-surfaceBorder py-4" key={item.label}>
                  <dt className="font-medium text-textPrimary">{item.label}</dt>
                  <dd className="mt-1 text-small text-textSecondary">{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-small text-textMuted">
              No pitch attached. I like these problems, and I have opinions about most of them.
            </p>

            <h2 className="mt-12 font-display text-h3 text-textPrimary">Elsewhere</h2>
            <ul className="mt-4 border-t border-surfaceBorder">
              {channels.map((channel) => (
                <li className="border-b border-surfaceBorder" key={channel.label}>
                  <a
                    className="flex min-h-14 items-center justify-between gap-4 py-3 text-textPrimary hover:text-accent"
                    href={channel.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>
                      <span className="block font-medium">{channel.label}</span>
                      <span className="block text-small text-textMuted">{channel.value}</span>
                    </span>
                    <span aria-hidden="true" className="text-textMuted">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </main>
  );
}
