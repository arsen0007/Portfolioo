import type { CaseStudyContent } from './types';

export const mailmerge: CaseStudyContent = {
  blocks: [
    {
      type: 'prose',
      eyebrow: 'How it grew',
      title: 'From one cleanup step to three tools',
      paragraphs: [
        'Messy spreadsheets were reaching outreach campaigns and causing duplicate sends and broken columns. It has since grown from a single cleanup step into a small three-tool suite — dedupe the list, build the merge template, follow the guide to send it — with every step visible, so a non-technical teammate can see what changed and trust the file before it goes out.',
        'Built as the final stage of the BarHunter pipeline — source, filter, contact. One system, end to end.',
      ],
    },
    {
      type: 'figure',
      eyebrow: 'The product',
      title: 'Clean, template, send',
      src: '/screenshots/mailmerge.webp',
      alt: 'Mail Merge Pro home screen with Email Cleaner, Template Builder, and Tutorial tools',
      width: 1600,
      height: 865,
      caption:
        'Mail Merge Pro, live. The counters in this screenshot are a snapshot from when it was taken; the current figures are below.',
    },
    {
      type: 'steps',
      eyebrow: 'How it works',
      title: 'Four steps, each one visible',
      items: [
        {
          label: 'Upload',
          body: 'Upload a contact list (CSV or XLSX) and pick the email column',
        },
        {
          label: 'Review',
          body: 'Review the dedupe ledger — original rows, duplicates removed, final recipients, with a report of what got cut',
        },
        {
          label: 'Template',
          body: 'Build the merge template with variable slots and export it as a Word doc',
        },
        {
          label: 'Send',
          body: 'Follow the built-in Outlook tutorial to run the actual send',
        },
      ],
    },
    {
      type: 'links',
      eyebrow: 'Try it',
      title: 'The tool is live',
      items: [{ label: 'View live Mail Merge', href: 'https://mail-merge-cleaner.vercel.app/' }],
    },
  ],
};
