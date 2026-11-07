import type { CaseStudyContent } from './types';

export const arsensLab: CaseStudyContent = {
  blocks: [
    {
      type: 'prose',
      eyebrow: 'Why self-hosted',
      title: 'Giving a model real hands is not an API call.',
      paragraphs: [
        "Every commercial option asked me to route my home through someone else's cloud. A camera subscription means my footage lives on a company's servers under their retention policy. That was the wrong trade for a device pointed at my own house.",
        'The only way to find out what it takes to give a model safe access to real hardware was to build the layer and then be responsible for it.',
      ],
    },
    {
      type: 'list',
      eyebrow: 'The four layers',
      title: 'Four layers, fourteen services, one supervisor.',
      items: [
        {
          title: 'MCP servers',
          body: 'Audio, camera, terminal, browser, a scoped database, and Alexa — each exposing real hardware or data as tools any MCP client can call.',
        },
        {
          title: 'Agents',
          body: 'Long-running processes that use those tools. Genie, the voice runtime, lives here.',
        },
        {
          title: 'APIs',
          body: 'Shared internal services the layers above depend on, including the messaging bridge.',
        },
        {
          title: 'Workflows',
          body: 'Event-driven automation. A message triggers a camera capture, a spoken notification, or a service restart — each one narrow, authorised, and stateless.',
        },
      ],
    },
    {
      type: 'prose',
      eyebrow: 'The organising idea',
      title: 'systemd owns state. Everything else is a client of it.',
      paragraphs: [
        'No component tracks whether another is running. They ask the supervisor.',
        'That one rule is why a message and a dashboard button can control the same service and never disagree. There is no cache to invalidate and no second source of truth to drift. Two independent control surfaces, one authority.',
        'It sounds obvious written down. It is the kind of thing you only commit to after you have watched two components disagree about reality.',
      ],
    },
    {
      type: 'prose',
      eyebrow: 'The trade-off',
      title: 'I gave up the feature I actually wanted.',
      paragraphs: [
        'The original plan was a spoken boot announcement — the Pi says "camera is online" when it comes up. It was a nice idea and it cannot work.',
        "The thing that would announce readiness is the audio server, which is itself one of the services booting. Worse, the audio and camera servers are structurally near-last on every boot — they depend on the network layer, which takes 20–50 seconds. Anything wanting to announce their readiness must already be running, and it isn't.",
        'An announcer is a consumer of readiness, and therefore races. A dashboard is an observer — it needs nothing from anyone, so the race stops existing rather than being worked around.',
        'The control plane has no startup dependencies at all. It binds loopback, comes up almost immediately, and reports everything else honestly as it arrives. I gave up the feature I originally wanted and got a system with no startup race in exchange. That was the right trade, and it took a failed design to see it.',
      ],
    },
    {
      type: 'prose',
      eyebrow: 'Security',
      title: 'Not everything deserves the same reach.',
      paragraphs: [
        'Hardware that produces data — a microphone, a camera — is one risk class. A database holding accumulated state is a different one. Treating them uniformly would be the mistake, so they are exposed differently, deliberately, and the difference is written down rather than remembered.',
        'The rule I settled on: a service is reachable only from as far away as its blast radius justifies, and any change to that has to be a decision someone made on purpose, not a default that drifted.',
        'The database server got the strictest treatment — a dedicated least-privilege role that starts with no permissions and is granted access per table as tables are created, so its reach equals exactly what it was handed rather than "everything in the database". On top of that sit five independent layers: a statement-type allowlist checked before anything reaches the driver, writes off by default behind an explicit flag, an unconditional deny-list for destructive and privilege-granting statements that holds even when writes are enabled, a row cap so a runaway query cannot flood a response back into a model\'s context, and connection pooling. Any one of them is defeatable. The point is that they fail independently.',
        "I also rejected the easier option. Hosted Postgres would have been less work, and I wrote down why I didn't take it: sub-millisecond local queries against 50–300ms over the network, no dependency on home internet or a third party's uptime, and data that never leaves the box. The managed extras solve problems a single local agent does not have.",
      ],
    },
    {
      type: 'prose',
      eyebrow: 'The privilege model',
      title: 'What a bug in the web server can reach.',
      paragraphs: [
        'The control plane is network-facing, so I assumed it would eventually have a bug. It runs unprivileged and never invokes the service manager directly for anything that changes state — it calls one small root-owned wrapper through a single narrowly-scoped rule. The wrapper takes short names, never unit names, so caller input never reaches the supervisor as an argument. The whitelist is root-owned, because a whitelist writable by the process it constrains is not a whitelist. And file deletion — the sharpest edge — runs with no elevated privileges at all, so the guard is the containment check itself: every path is verified against the resolved root twice, before and after symlink resolution.',
        'My own account already has unrestricted access, so none of this constrains me. That is the point. It ensures a bug in a web server can only toggle a known list of services instead of becoming arbitrary root.',
      ],
    },
    {
      type: 'prose',
      eyebrow: 'Measuring instead of guessing',
      title: 'One line cost eighteen seconds.',
      paragraphs: [
        "The control plane's whole job is showing why something is slow, so it was embarrassing to find the answer was: itself.",
        'It shipped with one dependency line — wait for the network layer — added "just to be safe". It binds loopback. It never needed the network. That single line gated startup behind a chain taking roughly eighteen seconds to resolve. I deleted it and measured again.',
        'The service built specifically to prove that unnecessary dependencies delay startup shipped with an unnecessary dependency that delayed its startup.',
        '"Started" does not mean "ready" — the supervisor marks a service active the moment the process forks, which is before it binds a port. So the control plane probes the port too, and shows the disagreement between the two signals as its own state: up, but not answering yet. That state is real, it lasts a couple of seconds on every restart, and hiding it would be a lie. And restart counts are the fingerprint of a startup race, which is why that number is on every row.',
      ],
    },
    {
      type: 'list',
      eyebrow: 'What broke',
      title: 'The bugs worth keeping.',
      items: [
        {
          title: 'A crash loop that looked healthy',
          body: 'One service failed three times on every boot for months. It bound an address that did not exist yet, because ordering after a dependency starts is not the same as ordering after it finishes. An automatic restart policy masked it perfectly — by the time anyone looked, the service was up and the end state looked fine. Lesson: automatic recovery is a good feature and an excellent disguise.',
        },
        {
          title: 'A silent wrong answer',
          body: 'The gallery fetched its manifest with a relative URL. Visited without a trailing slash, the browser resolved it against the site root and got a different service\'s 404 response — valid JSON, wrong shape. The length check returned undefined and the page cheerfully rendered "No recordings yet". No error anywhere. The recordings were fine. Lesson: a silent wrong answer is worse than an error. An error gets investigated.',
        },
        {
          title: 'One symlink took down everything',
          body: 'A recursive directory walk followed a symlink into my home directory and blocked the event loop for the entire process — not the media route, the whole server. It is now walked explicitly, skipping symlinks, bounded by depth and count. Lesson: a synchronous call on a network-facing path is an availability bug waiting for the right input.',
        },
      ],
    },
    {
      type: 'list',
      eyebrow: 'Still broken',
      title: 'What I have not fixed yet.',
      intro:
        'Published deliberately. A system with no known gaps is a system nobody has looked at closely.',
      items: [
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
      ],
    },
  ],
};
