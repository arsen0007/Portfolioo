import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';
import { colorMix, themeColors } from '@/lib/constants/colors';
import { projects } from '@/lib/data/projects';

const project = projects.find((p) => p.id === 'arsens-lab')!;
const accent = themeColors.cyan;

function Eyebrow({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <p
      className="font-mono text-[11px] font-medium uppercase tracking-[0.14em]"
      style={{ color: color ?? 'var(--text-muted)' }}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 text-balance font-display text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-textPrimary md:text-[32px]">
      {children}
    </h2>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 grid max-w-[680px] gap-4 font-body text-[15px] leading-[1.85] text-textSecondary">
      {children}
    </div>
  );
}

const layers = [
  {
    name: 'MCP servers',
    color: 'cyan' as const,
    body: 'Audio, camera, terminal, browser, a scoped database, and Alexa — each exposing real hardware or data as tools any MCP client can call.',
  },
  {
    name: 'Agents',
    color: 'purple' as const,
    body: 'Long-running processes that use those tools. Genie, the voice runtime, lives here.',
  },
  {
    name: 'APIs',
    color: 'blue' as const,
    body: 'Shared internal services the layers above depend on, including the messaging bridge.',
  },
  {
    name: 'Workflows',
    color: 'green' as const,
    body: 'Event-driven automation. A message triggers a camera capture, a spoken notification, or a service restart — each one narrow, authorised, and stateless.',
  },
];

const failures = [
  {
    title: 'A crash loop that looked healthy',
    body: 'One service failed three times on every boot for months. It bound an address that did not exist yet, because ordering after a dependency starts is not the same as ordering after it finishes. An automatic restart policy masked it perfectly — by the time anyone looked, the service was up and the end state looked fine.',
    lesson: 'Automatic recovery is a good feature and an excellent disguise.',
  },
  {
    title: 'A silent wrong answer',
    body: 'The gallery fetched its manifest with a relative URL. Visited without a trailing slash, the browser resolved it against the site root and got a different service’s 404 response — valid JSON, wrong shape. The length check returned undefined and the page cheerfully rendered "No recordings yet". No error anywhere. The recordings were fine.',
    lesson: 'A silent wrong answer is worse than an error. An error gets investigated.',
  },
  {
    title: 'One symlink took down everything',
    body: 'A recursive directory walk followed a symlink into my home directory and blocked the event loop for the entire process — not the media route, the whole server. It is now walked explicitly, skipping symlinks, bounded by depth and count.',
    lesson: 'A synchronous call on a network-facing path is an availability bug waiting for the right input.',
  },
];

const openGaps = [
  {
    title: 'No readiness gates',
    body: 'Workflows still start before the servers they call and rely on retrying. Making "started" mean "ready" is the real fix.',
  },
  {
    title: 'No push alerting',
    body: 'The control plane is pull-only. A 3am failure goes red with nobody looking at it. State-change notifications are the obvious next step, and the bridge already exists.',
  },
  {
    title: 'A latent bind-order bug',
    body: 'One service still carries the bug described above. It survives because it happens to start late enough that the address exists by then. That is timing luck, not design.',
  },
  {
    title: 'An unverified mobile layout',
    body: 'Written, never rendered. Several interaction paths are in the same state. Untested code is not finished code, it is just code.',
  },
];

export default function ArsensLabPage() {
  return (
    <main className="dot-grid relative overflow-hidden pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[820px]"
        style={{
          background: [
            `radial-gradient(ellipse 70% 44% at 50% 0%, ${colorMix(accent, 16)}, transparent 70%)`,
            `radial-gradient(ellipse 44% 38% at 6% 30%, ${colorMix(themeColors.blue, 10)}, transparent 65%)`,
          ].join(', '),
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 pt-28">
        <FadeIn>
          <Link
            className="group inline-flex items-center gap-2 font-body text-[13px] text-textSecondary transition-colors duration-200 hover:text-textPrimary"
            href="/projects"
          >
            <svg
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
              fill="none"
              height="12"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
              viewBox="0 0 12 12"
              width="12"
            >
              <path d="M9.5 6h-7M5.5 2.5L2 6l3.5 3.5" />
            </svg>
            All projects
          </Link>
        </FadeIn>

        {/* Hero */}
        <FadeIn delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
              style={{
                borderColor: colorMix(accent, 32),
                background: colorMix(accent, 10),
                color: accent,
              }}
            >
              Self-hosted AI infrastructure
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
              style={{
                borderColor: colorMix(themeColors.green, 30),
                background: colorMix(themeColors.green, 10),
                color: themeColors.green,
              }}
            >
              <span
                aria-hidden="true"
                className="available-pulse h-1.5 w-1.5 rounded-full"
                style={{ background: themeColors.green }}
              />
              Active · 14 services
            </span>
          </div>

          <h1 className="mt-6 text-balance font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] text-textPrimary md:text-[64px]">
            Arsen&apos;s Lab
          </h1>

          <p className="mt-5 max-w-[640px] text-balance font-display text-[20px] font-medium leading-[1.35] text-textPrimary md:text-[24px]">
            I built the infrastructure my AI tools run on.
          </p>

          <p className="mt-5 max-w-[660px] font-body text-[15.5px] leading-[1.8] text-textSecondary">
            Most people consume AI tools. This is the layer underneath — the servers that
            hand a model real capability, and the operational discipline required to keep
            fourteen of them alive on a single board. It runs on a Raspberry Pi in my house,
            and it has been up long enough to teach me things a tutorial cannot.
          </p>
        </FadeIn>

        {/* Metrics */}
        <FadeIn delay={0.1}>
          <dl className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {project.impact.map((metric) => (
              <div
                className="rounded-[14px] border p-5"
                key={metric.label}
                style={{
                  borderColor: colorMix(accent, 20),
                  background: `radial-gradient(ellipse 100% 70% at 50% 0%, ${colorMix(accent, 9)}, transparent 70%), var(--surface)`,
                }}
              >
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <p
                    className="font-display text-[28px] font-semibold leading-none tracking-[-0.02em]"
                    style={{ color: accent }}
                  >
                    {metric.value}
                  </p>
                  <p className="mt-2.5 font-body text-[12px] leading-[1.45] text-textMuted">
                    {metric.label}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>

        {/* Hardware photo */}
        <FadeIn delay={0.14}>
          <div className="mt-6">
            <MediaPlaceholder
              accent="cyan"
              hint="The actual board, cabled up, ideally with the mic HAT and camera visible. This is the most memorable asset on the site — a real machine beats any diagram."
              label="Photo — the Raspberry Pi running the lab"
              ratio="16 / 9"
            />
          </div>
        </FadeIn>

        {/* Problem */}
        <FadeIn delay={0.05}>
          <section className="mt-20">
            <Eyebrow>The problem</Eyebrow>
            <SectionTitle>Giving a model real hands is not an API call.</SectionTitle>
            <Prose>
              <p>
                I wanted an AI assistant that could do things, not just say things — take a
                photo, speak in the room, run a command, drive a browser, query a database.
              </p>
              <p>
                Every commercial option asked me to route my home through someone
                else&apos;s cloud. A camera subscription means my footage lives on a
                company&apos;s servers under their retention policy. That was the wrong
                trade for a device pointed at my own house.
              </p>
              <p>
                The technical question underneath was more interesting:{' '}
                <strong className="font-semibold text-textPrimary">
                  what does it actually take to give a model safe access to real hardware?
                </strong>{' '}
                Not &ldquo;call an API&rdquo; — the whole path. How capability gets exposed,
                how it gets scoped, what happens when the thing crashes at 3am, and who is
                allowed to restart it. The only way to find out was to build the layer and
                then be responsible for it.
              </p>
            </Prose>
          </section>
        </FadeIn>

        {/* What I built — layers */}
        <FadeIn delay={0.05}>
          <section className="mt-20">
            <Eyebrow>What I built</Eyebrow>
            <SectionTitle>Four layers, fourteen services, one supervisor.</SectionTitle>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {layers.map((layer, index) => {
                const layerAccent = themeColors[layer.color];

                return (
                  <div
                    className="relative overflow-hidden rounded-[16px] border p-6"
                    key={layer.name}
                    style={{
                      borderColor: colorMix(layerAccent, 22),
                      background: `radial-gradient(ellipse 110% 60% at 0% 0%, ${colorMix(layerAccent, 10)}, transparent 62%), var(--surface)`,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-full w-[2px]"
                      style={{
                        background: `linear-gradient(180deg, ${layerAccent}, ${colorMix(layerAccent, 12)})`,
                      }}
                    />
                    <div className="flex items-center gap-2.5">
                      <span
                        className="grid h-6 w-6 place-items-center rounded-full border font-mono text-[9px] tabular-nums"
                        style={{
                          borderColor: colorMix(layerAccent, 40),
                          background: colorMix(layerAccent, 12),
                          color: layerAccent,
                        }}
                      >
                        {index + 1}
                      </span>
                      <Eyebrow color={layerAccent}>{layer.name}</Eyebrow>
                    </div>
                    <p className="mt-4 font-body text-[14px] leading-[1.75] text-textSecondary">
                      {layer.body}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 max-w-[680px] font-body text-[14px] leading-[1.75] text-textMuted">
              Every component carries a decisions file — a document explaining why it looks
              the way it does, including the alternatives rejected and why. Code records
              what; the decisions file records why, which is the part that decays fastest
              and costs most to reconstruct.
            </p>
          </section>
        </FadeIn>

        {/* The organising idea */}
        <FadeIn delay={0.05}>
          <section className="mt-20">
            <Eyebrow color={accent}>The organising idea</Eyebrow>
            <blockquote
              className="mt-6 rounded-[20px] border-l-2 py-2 pl-7"
              style={{ borderColor: accent }}
            >
              <p className="max-w-[620px] font-display text-[24px] font-medium leading-[1.3] tracking-[-0.015em] text-textPrimary md:text-[28px]">
                systemd owns state. Everything else is a client of it.
              </p>
            </blockquote>
            <Prose>
              <p>
                No component tracks whether another is running. They ask the supervisor.
              </p>
              <p>
                That one rule is why a message and a dashboard button can control the same
                service and never disagree. There is no cache to invalidate and no second
                source of truth to drift. Two independent control surfaces, one authority.
              </p>
              <p>
                It sounds obvious written down. It is the kind of thing you only commit to
                after you have watched two components disagree about reality.
              </p>
            </Prose>
          </section>
        </FadeIn>

        {/* The trade-off */}
        <FadeIn delay={0.05}>
          <section className="mt-20">
            <div
              className="relative overflow-hidden rounded-[22px] border p-8 md:p-10"
              style={{
                borderColor: colorMix(themeColors.amber, 26),
                background: `radial-gradient(ellipse 70% 80% at 100% 0%, ${colorMix(themeColors.amber, 12)}, transparent 64%), var(--surface)`,
              }}
            >
              <Eyebrow color={themeColors.amber}>The trade-off</Eyebrow>
              <SectionTitle>I gave up the feature I actually wanted.</SectionTitle>
              <Prose>
                <p>
                  The original plan was a spoken boot announcement — the Pi says
                  &ldquo;camera is online&rdquo; when it comes up. It was a nice idea and it
                  cannot work.
                </p>
                <p>
                  The thing that would announce readiness is the audio server, which is
                  itself one of the services booting. Worse, the audio and camera servers
                  are structurally near-last on <em>every</em> boot — they depend on the
                  network layer, which takes 20&ndash;50 seconds. Anything wanting to
                  announce their readiness must already be running, and it isn&apos;t.
                </p>
              </Prose>

              <div
                className="mt-7 rounded-[16px] border-l-2 py-1 pl-6"
                style={{ borderColor: colorMix(themeColors.amber, 60) }}
              >
                <p className="max-w-[600px] font-display text-[19px] font-medium leading-[1.4] text-textPrimary md:text-[21px]">
                  An announcer is a <em>consumer</em> of readiness, and therefore races. A
                  dashboard is an <em>observer</em> — it needs nothing from anyone, so the
                  race stops existing rather than being worked around.
                </p>
              </div>

              <Prose>
                <p>
                  The control plane has no startup dependencies at all. It binds loopback,
                  comes up almost immediately, and reports everything else honestly as it
                  arrives. I gave up the feature I originally wanted and got a system with
                  no startup race in exchange. That was the right trade, and it took a
                  failed design to see it.
                </p>
              </Prose>
            </div>
          </section>
        </FadeIn>

        {/* Dashboard screenshot */}
        <FadeIn delay={0.05}>
          <div className="mt-6">
            <MediaPlaceholder
              accent="blue"
              hint="The control plane showing service states, the boot timeline, and the health tiles. Crop or redact anything host-specific before publishing."
              label="Screenshot — the control plane"
              ratio="16 / 10"
            />
          </div>
        </FadeIn>

        {/* Risk class + privilege */}
        <FadeIn delay={0.05}>
          <section className="mt-20">
            <Eyebrow>Security</Eyebrow>
            <SectionTitle>Not everything deserves the same reach.</SectionTitle>
            <Prose>
              <p>
                Hardware that produces data — a microphone, a camera — is one risk class. A
                database holding accumulated state is a different one. Treating them
                uniformly would be the mistake, so they are exposed differently,
                deliberately, and the difference is written down rather than remembered.
              </p>
              <p>
                The rule I settled on: a service is reachable only from as far away as its
                blast radius justifies, and any change to that has to be a decision someone
                made on purpose, not a default that drifted.
              </p>
              <p>
                The database server got the strictest treatment — a dedicated
                least-privilege role that starts with <em>no</em> permissions and is granted
                access per table as tables are created, so its reach equals exactly what it
                was handed rather than &ldquo;everything in the database&rdquo;. On top of
                that sit five independent layers: a statement-type allowlist checked before
                anything reaches the driver, writes off by default behind an explicit flag,
                an unconditional deny-list for destructive and privilege-granting statements
                that holds <em>even when writes are enabled</em>, a row cap so a runaway
                query cannot flood a response back into a model&apos;s context, and
                connection pooling. Any one of them is defeatable. The point is that they
                fail independently.
              </p>
              <p>
                I also rejected the easier option. Hosted Postgres would have been less
                work, and I wrote down why I didn&apos;t take it: sub-millisecond local
                queries against 50&ndash;300ms over the network, no dependency on home
                internet or a third party&apos;s uptime, and data that never leaves the box.
                The managed extras solve problems a single local agent does not have.
              </p>
            </Prose>

            <div
              className="mt-8 rounded-[18px] border p-7"
              style={{
                borderColor: colorMix(themeColors.purple, 24),
                background: colorMix(themeColors.purple, 6),
              }}
            >
              <Eyebrow color={themeColors.purple}>The privilege model</Eyebrow>
              <p className="mt-4 max-w-[660px] font-body text-[14.5px] leading-[1.8] text-textSecondary">
                The control plane is network-facing, so I assumed it would eventually have a
                bug. It runs unprivileged and never invokes the service manager directly for
                anything that changes state — it calls one small root-owned wrapper through
                a single narrowly-scoped rule. The wrapper takes short names, never unit
                names, so caller input never reaches the supervisor as an argument. The
                whitelist is root-owned, because{' '}
                <strong className="font-semibold text-textPrimary">
                  a whitelist writable by the process it constrains is not a whitelist
                </strong>
                . And file deletion — the sharpest edge — runs with no elevated privileges
                at all, so the guard is the containment check itself: every path is verified
                against the resolved root twice, before and after symlink resolution.
              </p>
              <p className="mt-4 max-w-[660px] font-body text-[14.5px] leading-[1.8] text-textMuted">
                My own account already has unrestricted access, so none of this constrains
                me. That is the point. It ensures a bug in a web server can only toggle a
                known list of services instead of becoming arbitrary root.
              </p>
            </div>
          </section>
        </FadeIn>

        {/* Measured */}
        <FadeIn delay={0.05}>
          <section className="mt-20">
            <Eyebrow>Measuring instead of guessing</Eyebrow>
            <SectionTitle>One line cost eighteen seconds.</SectionTitle>
            <Prose>
              <p>
                The control plane&apos;s whole job is showing why something is slow, so it
                was embarrassing to find the answer was: itself.
              </p>
              <p>
                It shipped with one dependency line — wait for the network layer — added
                &ldquo;just to be safe&rdquo;. It binds loopback. It never needed the
                network. That single line gated startup behind a chain taking roughly
                eighteen seconds to resolve. I deleted it and measured again.
              </p>
            </Prose>

            <p
              className="mt-7 max-w-[640px] border-l-2 pl-6 font-display text-[18px] font-medium leading-[1.45] text-textPrimary md:text-[20px]"
              style={{ borderColor: colorMix(themeColors.amber, 60) }}
            >
              The service built specifically to prove that unnecessary dependencies delay
              startup shipped with an unnecessary dependency that delayed its startup.
            </p>

            <Prose>
              <p>
                Two things generalise.{' '}
                <strong className="font-semibold text-textPrimary">
                  &ldquo;Started&rdquo; does not mean &ldquo;ready&rdquo;
                </strong>{' '}
                — the supervisor marks a service active the moment the process forks, which
                is before it binds a port. So the control plane probes the port too, and
                shows the disagreement between the two signals as its own state:{' '}
                <em>up, but not answering yet</em>. That state is real, it lasts a couple of
                seconds on every restart, and hiding it would be a lie. And restart counts
                are the fingerprint of a startup race, which is why that number is on every
                row.
              </p>
            </Prose>
          </section>
        </FadeIn>

        {/* Failures */}
        <FadeIn delay={0.05}>
          <section className="mt-20">
            <Eyebrow>What broke</Eyebrow>
            <SectionTitle>The bugs worth keeping.</SectionTitle>

            <div className="mt-8 grid gap-3">
              {failures.map((failure) => (
                <div
                  className="rounded-[16px] border p-6 md:p-7"
                  key={failure.title}
                  style={{
                    borderColor: 'var(--surface-border-strong)',
                    background: 'var(--surface)',
                  }}
                >
                  <h3 className="font-display text-[18px] font-semibold leading-tight text-textPrimary">
                    {failure.title}
                  </h3>
                  <p className="mt-3 max-w-[680px] font-body text-[14px] leading-[1.8] text-textSecondary">
                    {failure.body}
                  </p>
                  <p
                    className="mt-4 border-t pt-4 font-body text-[13.5px] font-medium italic leading-snug"
                    style={{ borderColor: 'var(--surface-border)', color: accent }}
                  >
                    {failure.lesson}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Open gaps */}
        <FadeIn delay={0.05}>
          <section className="mt-20">
            <Eyebrow color={themeColors.amber}>Still broken</Eyebrow>
            <SectionTitle>What I have not fixed yet.</SectionTitle>
            <p className="mt-5 max-w-[640px] font-body text-[15px] leading-[1.8] text-textSecondary">
              Published deliberately. A system with no known gaps is a system nobody has
              looked at closely.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {openGaps.map((gap) => (
                <div
                  className="rounded-[14px] border p-5"
                  key={gap.title}
                  style={{
                    borderColor: colorMix(themeColors.amber, 20),
                    background: colorMix(themeColors.amber, 5),
                  }}
                >
                  <h3 className="font-display text-[15px] font-semibold text-textPrimary">
                    {gap.title}
                  </h3>
                  <p className="mt-2.5 font-body text-[13.5px] leading-[1.7] text-textMuted">
                    {gap.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Stack */}
        <FadeIn delay={0.05}>
          <section className="mt-20">
            <Eyebrow>Stack</Eyebrow>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span className="tech-badge" key={tech}>
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Next */}
        <FadeIn delay={0.05}>
          <nav
            aria-label="More projects"
            className="mt-20 flex flex-wrap gap-3 border-t pt-10"
            style={{ borderColor: 'var(--surface-border)' }}
          >
            <Link
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-body text-[14px] font-medium text-textPrimary transition-colors duration-200"
              href="/projects/genie"
              style={{ borderColor: colorMix(themeColors.purple, 34) }}
            >
              Genie — the agent that runs on this
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-body text-[14px] font-medium text-textSecondary transition-colors duration-200 hover:text-textPrimary"
              href="/projects"
              style={{ borderColor: 'var(--surface-border-strong)' }}
            >
              All projects
            </Link>
          </nav>
        </FadeIn>
      </div>
    </main>
  );
}
