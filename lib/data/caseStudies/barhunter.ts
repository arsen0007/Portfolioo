import type { CaseStudyContent } from './types';

export const barhunter: CaseStudyContent = {
  blocks: [
    {
      type: 'figure',
      eyebrow: 'The product',
      title: 'The recruiter dashboard',
      src: '/screenshots/barhunter-overview.webp',
      alt: 'BarHunter lead prospecting dashboard showing lead totals and the state, city, practice category, admission year and status filters, with California selected',
      width: 1600,
      height: 479,
      caption: 'Dashboard overview with the California filter selected. Cropped to leave out attorney records.',
    },
    {
      type: 'steps',
      eyebrow: 'Part 1',
      title: 'The scraping backend',
      items: [
        {
          label: 'Source research per jurisdiction',
          body: 'Every state and province runs a different system. The structure of each source is studied before any extraction is written — the source determines the approach.',
        },
        {
          label: 'Custom extraction per jurisdiction',
          body: 'Each jurisdiction gets its own purpose-built extractor. Reliability checks run continuously to detect degraded data before it reaches the database.',
        },
        {
          label: 'One clean lead schema',
          body: 'Raw records from every source are normalized into one canonical dataset: 16 practice categories, standardized fields, and fault-tolerant writes.',
        },
      ],
    },
    {
      type: 'steps',
      eyebrow: 'Part 2',
      title: 'The recruiter platform',
      items: [
        {
          label: 'Secure lead database',
          body: '94,363 leads in a structured database with row-level security. Recruiters see only the data they are authorized to access.',
        },
        {
          label: 'Campaign-ready search',
          body: 'Filter by state, city, practice category, admission year, and status. A usable campaign list appears in under 60 seconds.',
        },
        {
          label: 'Conflict detection before export',
          body: 'Selected leads are automatically checked against existing client lists. Conflicts are flagged and removed before the CSV is generated.',
        },
        {
          label: 'CSV to outreach workflow',
          body: 'Clean CSV export ready for mail merge. Downloads are logged so admins know who pulled what and when.',
        },
      ],
    },
    {
      type: 'facts',
      eyebrow: 'Coverage',
      title: 'Live in production, still growing',
      intro: 'Currently covers AZ, CA, MB, ON, WA - more jurisdictions being added.',
      items: [
        {
          value: '88,739',
          label: 'Active members, out of 94,363 total leads (94%)',
        },
        {
          value: '3 + 2',
          label: 'US states (Arizona, California, Washington) plus Canadian provinces (Manitoba, Ontario), 5 jurisdictions in total',
        },
      ],
    },
    {
      type: 'prose',
      eyebrow: 'Before and after',
      title: 'Hours of manual work, under 60 seconds',
      paragraphs: [
        '"What used to take hours of manual work now takes under 60 seconds."',
      ],
    },
    {
      type: 'prose',
      eyebrow: 'Trade-off',
      title: 'What the design costs, and why',
      paragraphs: [
        'Ingestion runs as its own system rather than inside the dashboard. That is more infrastructure to operate, but it means recruiters are never blocked on a public registry that is slow or down. And the output is a plain CSV rather than a new platform — the workflow already existed, so the product had to end where that workflow begins.',
      ],
    },
  ],
};
