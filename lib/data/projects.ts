import type { AccentColor } from '@/lib/constants/colors';

export type ProjectStatus = 'live' | 'active' | 'completed' | 'upcoming';

export type ProjectImpactMetric = {
  value: string;
  label: string;
};

export type ProjectDecision = {
  title: string;
  body: string;
};

export type ProjectStory = {
  role: string;
  scope: string;
  context: string;
  productMove: string;
  decisions: ProjectDecision[];
  constraints: string[];
  outcome: string;
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  color: AccentColor;
  status: ProjectStatus;
  tier: number;
  confidential?: boolean;
  liveUrl?: string;
  problem: string;
  whatIBuilt: string;
  architecture: string[];
  techStack: string[];
  impact: ProjectImpactMetric[];
  proof: string[];
  story: ProjectStory;
};

export const projects: Project[] = [
  {
    id: 'barhunter',
    name: 'BarHunter',
    tagline: 'A full-stack lead sourcing platform built for legal recruiters - attorney profiles scraped from state bar databases across the US and Canada, normalized, and searchable in one place.',
    color: 'green',
    status: 'live',
    tier: 1,
    liveUrl: 'https://barhunter.vercel.app/',
    problem:
      "Legal recruiters had no system. To find attorney leads they were going to state bar websites one by one, searching manually, and copy-pasting individual profiles into spreadsheets - name, contact, practice area, status - by hand. No bulk export. No filter. Just copy, paste, repeat. Getting 100 leads could take days. Across every US state and Canadian province, each site built completely differently, the process was endless. I started automating it - and I'm still going.",
    whatIBuilt:
      'A full-stack platform that automates the entire pipeline from data sourcing to filtered export. Built two connected systems: a scraping and import pipeline that sources lawyer data from US state bar databases and Canadian law society exports, and a recruiter dashboard with filters, conflict checking, CSV export, admin tracking, and recruiter stats.',
    architecture: [
      'Reverse-engineer each registry',
      'Custom scraper per jurisdiction',
      'One clean lead schema',
      'Secure lead database',
      'Campaign-ready search',
      'Pre-export conflict removal',
      'CSV to outreach workflow',
    ],
    techStack: [
      'Next.js 14',
      'TypeScript',
      'Supabase',
      'PostgreSQL',
      'RLS',
      'Python',
      'Playwright',
      'httpx',
      'BeautifulSoup',
      'pandas',
      'Vercel',
    ],
    impact: [
      { value: '94,363', label: 'Total Leads' },
      { value: '94%', label: 'Active Members' },
      { value: '16', label: 'Practice Categories' },
      { value: '5', label: 'States / Provinces' },
    ],
    proof: [
      'Built around real recruiter workflow instead of a generic lead table.',
      'Combined public sourcing, normalization, filtering, conflict checks, and export into one path.',
      'Created a reusable source of truth recruiters can return to instead of rebuilding lists manually.',
    ],
    story: {
      role: 'Product builder and full-stack developer',
      scope: 'Data pipeline, recruiter dashboard, admin tracking, export workflow',
      context:
        'The real pain was not finding one lawyer. It was repeating the same search pattern across state bars, copying inconsistent records, checking conflicts, and still ending with a list recruiters had to clean again.',
      productMove:
        'I reframed the work from a scraping task into an operating system for lead sourcing: ingest once, normalize once, filter many times, and export only when the list is recruiter-ready.',
      decisions: [
        {
          title: 'Separate ingestion from recruiter work',
          body:
            'The scraping and import layer runs as its own system so recruiters are not waiting on raw public sites while they work inside the dashboard.',
        },
        {
          title: 'Normalize before filtering',
          body:
            'State bar and law society data arrives in different shapes, so the useful product was the cleaned database, not the scraper alone.',
        },
        {
          title: 'Put conflict checks before export',
          body:
            'Recruiters needed confidence before outreach. Conflict filtering became part of the flow instead of a separate manual pass.',
        },
        {
          title: 'Make admin visibility part of the product',
          body:
            'Recruiter stats and admin tracking turned the tool from a list generator into a managed workflow.',
        },
      ],
      constraints: [
        'Public data sources are inconsistent and change shape across jurisdictions.',
        'Recruiters needed a familiar CSV output, not a complex new workflow to learn.',
        'The dashboard had to balance power filters with quick scanning.',
      ],
      outcome:
        'BarHunter moved lead sourcing from scattered manual research into a repeatable operating system. A recruiter can go from zero to a campaign-ready CSV in under 60 seconds.',
    },
  },
  {
    id: 'casewise',
    name: 'CaseWise',
    tagline: 'An AI pipeline that replaced manual legal case processing - built in-house, adopted at the company level.',
    color: 'blue',
    status: 'live',
    tier: 1,
    confidential: true,
    problem:
      'The legal team of 7 members was handling approximately 2,700 cases per month. Each case required manual classification, summarization, and attorney outreach preparation - a process that took 5 to 15 minutes per case and depended heavily on legal knowledge many team members did not have. Complex cases required waiting for senior guidance. The intake team of 32 members faced the same classification challenge at scale.',
    whatIBuilt:
      'An AI-assisted workflow that reads directly from the core case management system (UCMS) via DOM scraping. It automates case classification across a taxonomy of 31+ legal issue types, generates structured summaries from messy call notes, and produces ready-to-use attorney outreach templates.',
    architecture: [
      'Classification',
      'Summarization',
      'Attorney Outreach',
      'Human Review',
    ],
    techStack: [
      'AI/LLM Workflows',
      'Browser Automation',
      'Next.js',
      'TypeScript',
      'Product Management',
      'UCMS Integration',
    ],
    impact: [
      { value: '96%', label: 'Time reduction' },
      { value: '433h', label: 'Saved per month (Legal)' },
      { value: '2,700', label: 'Cases monthly' },
      { value: '1,254%', label: 'Estimated ROI' },
    ],
    proof: [
      'Awarded $5,000 Product School scholarship by CEO Alan King.',
      'CTO directed embedding into UCMS (Core System).',
      'Paired with Senior System Architect and AI Team Lead for development.',
      'CISO publicly called the system "Extraordinary".',
    ],
    story: {
      role: 'AI product builder and workflow designer',
      scope: 'Problem discovery, MVP development, AI prompt engineering, C-suite pitching',
      context:
        'Legal intake was a cognitive bottleneck. Staff were acting as manual routers for complex legal data they weren’t fully trained to categorize, leading to delays and senior staff burnout.',
      productMove:
        'I built a tool that meets the user where they already work (UCMS) and collapses the "Read-Think-Write" cycle from 15 minutes into 30 seconds of review.',
      decisions: [
        {
          title: 'Direct DOM Scraping over API',
          body:
            'To prove value fast without waiting for backend API access, I built CaseWise to read and write directly to the UCMS interface.',
        },
        {
          title: 'Human-in-the-loop review',
          body:
            'The AI provides the "first draft" of classification and summary, but the agent retains final authority before the data is committed to the core system.',
        },
        {
          title: 'Focus on Taxonomy Accuracy',
          body:
            'Mapping 31+ legal issue types accurately was the key to moving the project from a "cool demo" to a core system integration.',
        },
      ],
      constraints: [
        'Strict legal data privacy requirements.',
        'Integration with a legacy case management system (UCMS).',
        'Varying levels of technical and legal expertise among users.',
      ],
      outcome:
        'CaseWise evolved from a solo prototype to a CTO-backed core system feature, buying back over 5,000 hours of team productivity annually.',
    },
  },
  {
    id: 'mailmerge',
    name: 'Mail Merge Tool',
    tagline: 'Bulk data cleanup and outreach preparation',
    color: 'cyan',
    status: 'live',
    tier: 2,
    problem:
      'Bulk contact data needed cleaning before outreach campaigns. Without cleanup, mail merge campaigns had duplicate sends, broken column formats, and errors that slowed recruiters down.',
    whatIBuilt:
      'A web tool that prepares bulk data for mail merge workflows. Features include duplicate removal, column splitting, data cleanup, step-by-step visual tutorials, and reusable templates that non-technical team members can follow.',
    architecture: [
      'Bulk Data Upload',
      'Duplicate Removal',
      'Column Splitting',
      'Cleaned Export',
      'Tutorial & Templates',
    ],
    techStack: ['Next.js', 'Python', 'Vercel'],
    impact: [
      { value: 'Live', label: 'Still in active use' },
      { value: '0', label: 'Manual dedup errors' },
    ],
    proof: [
      'Built for non-technical users preparing real outreach files.',
      'Reduced recurring cleanup mistakes before campaign sends.',
      'Packaged repeatable instructions and templates into the workflow.',
    ],
    story: {
      role: 'Workflow automation builder',
      scope: 'Data cleanup, tutorial flow, export preparation',
      context:
        'The issue was small but persistent: messy spreadsheets were entering outreach workflows and creating duplicate sends, broken formats, and avoidable manual cleanup.',
      productMove:
        'I turned a recurring spreadsheet cleanup task into a guided preparation flow that team members could run before campaign work.',
      decisions: [
        {
          title: 'Make cleanup visible',
          body:
            'Instead of hiding the process behind a script, the tool shows clear steps so users understand what changed before export.',
        },
        {
          title: 'Optimize for repeat use',
          body:
            'Templates and tutorials were included because the workflow had to survive beyond the first person who knew how it worked.',
        },
        {
          title: 'Keep the tool narrow',
          body:
            'The product intentionally focuses on deduping, splitting, cleaning, and exporting rather than becoming a full campaign platform.',
        },
      ],
      constraints: [
        'Users needed a simple flow that did not require technical confidence.',
        'Input files could arrive in inconsistent column structures.',
        'The output had to fit existing mail merge behavior.',
      ],
      outcome:
        'The Mail Merge Tool solved an unglamorous but real workflow leak. It made campaign preparation cleaner, repeatable, and easier for non-technical teammates to trust.',
    },
  },
  {
    id: 'fhoneman',
    name: 'Fhoneman',
    tagline: 'Phone repair business website with booking workflow',
    color: 'purple',
    status: 'live',
    tier: 3,
    liveUrl: 'https://fhoneman.in',
    problem:
      'A local phone repair business had no online presence and was losing potential customers who searched for repair services online.',
    whatIBuilt:
      'Designed and launched a public service website with repair booking flow, emergency inquiry capture, trust sections, and custom form logic for multiple contact scenarios.',
    architecture: [
      'Landing Page',
      'Service Sections',
      'Booking Form',
      'Emergency Inquiry',
      'Custom Form Logic',
    ],
    techStack: ['Hostinger Site Builder', 'Custom HTML/CSS', 'Custom Form Logic'],
    impact: [
      { value: 'Live', label: 'Public website' },
      { value: 'fhoneman.in', label: 'Live URL' },
    ],
    proof: [
      'Launched a live public website for a local service business.',
      'Created separate inquiry paths for normal booking and urgent repair needs.',
      'Added trust-building sections around services, availability, and contact flow.',
    ],
    story: {
      role: 'Website designer and launch builder',
      scope: 'Service website, booking flow, inquiry capture, custom form logic',
      context:
        'The business had offline service capability but no digital front door. Customers searching online had no clear place to understand services, build trust, or request help.',
      productMove:
        'I treated the website as a conversion workflow, not a brochure: identify the repair need, build confidence, and route the customer to the right contact path.',
      decisions: [
        {
          title: 'Lead with service clarity',
          body:
            'The page structure makes repair categories and booking intent easy to understand before asking the customer to take action.',
        },
        {
          title: 'Separate urgent and regular inquiries',
          body:
            'Emergency capture and standard booking were split so high-intent customers could move faster.',
        },
        {
          title: 'Use custom form behavior where it mattered',
          body:
            'Form logic was tailored to multiple contact scenarios instead of forcing every customer into one generic message box.',
        },
      ],
      constraints: [
        'The site needed to launch quickly on the tools available to the business.',
        'The design had to feel trustworthy without requiring a large brand system.',
        'The flow had to work for customers with different levels of urgency.',
      ],
      outcome:
        'Fhoneman gained a live online presence with a practical booking path. The project shows the same pattern at a smaller scale: turn an operational gap into a simple system people can actually use.',
    },
  },
];
