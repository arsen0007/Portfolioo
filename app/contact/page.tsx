import { ContactForm } from '@/components/contact/ContactForm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { FadeIn } from '@/components/ui/FadeIn';
import { colorMix, themeColors } from '@/lib/constants/colors';

const channels = [
  {
    href: 'https://www.linkedin.com/in/tousif-ali--/',
    label: 'LinkedIn',
    value: 'Tousif Ali',
    external: true,
  },
  {
    href: 'https://github.com/arsen0007',
    label: 'GitHub',
    value: 'github.com/arsen0007',
    external: true,
  },
  {
    href: 'mailto:tousifarsen@gmail.com',
    label: 'Email',
    value: 'tousifarsen@gmail.com',
    external: false,
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
    value: 'Whether AI is actually the right answer, or whether the problem is upstream of it',
  },
  {
    label: 'Where the time goes',
    value: 'Which steps in that process are real work and which are only habit',
  },
  {
    label: 'What it would take',
    value: 'A rough shape of the system, and the parts that would be hard',
  },
];

export default function ContactPage() {
  return (
    <main className="dot-grid relative min-h-screen overflow-hidden pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
        style={{
          background: [
            `radial-gradient(ellipse 60% 46% at 50% 0%, ${colorMix(themeColors.blue, 14)}, transparent 70%)`,
            `radial-gradient(ellipse 40% 36% at 92% 20%, ${colorMix(themeColors.cyan, 9)}, transparent 65%)`,
          ].join(', '),
        }}
      />

      <Breadcrumb
        items={[
          { href: '/', label: 'Tousif Ali' },
          { label: 'Contact' },
        ]}
      />

      <section className="relative mx-auto max-w-5xl px-6 pt-12">
        <FadeIn className="max-w-[760px]">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-textMuted">
            Contact
          </p>
          <h1 className="mt-4 text-balance font-display text-[32px] font-semibold leading-[1.12] tracking-[-0.025em] text-textPrimary md:text-[40px]">
            If your team is doing something by hand that a system should own, I want to
            hear about it.
          </h1>
          <p className="mt-5 font-body text-[16px] leading-[1.75] text-textSecondary">
            Describe the repeated task — the manual process, roughly how much time it eats,
            and who does it today. I will tell you where the time is actually going and
            whether AI is the right answer for it. Sometimes it is not, and that is a
            useful answer too.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          <FadeIn delay={0.06}>
            <ContactForm />
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="grid gap-8">
              {/* What you get back — practitioner framing, no availability signal */}
              <div
                className="rounded-[18px] border p-6"
                style={{
                  borderColor: colorMix(themeColors.cyan, 24),
                  background: `radial-gradient(ellipse 100% 60% at 0% 0%, ${colorMix(themeColors.cyan, 9)}, transparent 66%), var(--surface)`,
                }}
              >
                <p
                  className="font-mono text-[10.5px] uppercase tracking-[0.12em]"
                  style={{ color: themeColors.cyan }}
                >
                  What you get back
                </p>

                <dl className="mt-5 grid gap-4">
                  {whatYouGetBack.map((item) => (
                    <div key={item.label}>
                      <dt className="font-body text-[13.5px] font-semibold text-textPrimary">
                        {item.label}
                      </dt>
                      <dd className="mt-1 font-body text-[13px] leading-[1.6] text-textSecondary">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p
                  className="mt-6 border-t pt-4 font-body text-[12.5px] leading-[1.6] text-textMuted"
                  style={{ borderColor: 'var(--surface-border)' }}
                >
                  No pitch attached. I like these problems, and I have opinions about most
                  of them.
                </p>
              </div>

              {/* Direct channels */}
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-textMuted">
                  Elsewhere
                </p>
                <ul className="mt-4 grid gap-2">
                  {channels.map((channel) => (
                    <li key={channel.label}>
                      <a
                        className="group flex items-center justify-between gap-3 rounded-[12px] border px-4 py-3 transition-colors duration-200"
                        href={channel.href}
                        rel={channel.external ? 'noopener noreferrer' : undefined}
                        style={{ borderColor: 'var(--surface-border)' }}
                        target={channel.external ? '_blank' : undefined}
                      >
                        <span>
                          <span className="block font-body text-[13.5px] font-medium text-textPrimary">
                            {channel.label}
                          </span>
                          <span className="mt-0.5 block font-mono text-[11px] text-textMuted">
                            {channel.value}
                          </span>
                        </span>
                        <svg
                          aria-hidden="true"
                          className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                          fill="none"
                          height="12"
                          stroke={themeColors.blue}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.6"
                          viewBox="0 0 12 12"
                          width="12"
                        >
                          <path d="M2.5 9.5l7-7M9.5 2.5H4m5.5 0v5.5" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
