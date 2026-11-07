import type { CaseStudyContent } from './types';

export const fhoneman: CaseStudyContent = {
  blocks: [
    {
      type: 'prose',
      eyebrow: 'A deliberate choice',
      title: 'Built so the owner could run it without me',
      paragraphs: [
        'A local phone repair business with no online presence, turned into a working booking site with separate paths for urgent and standard repairs. Built on a site builder on purpose, so the owner could keep running it without me.',
      ],
    },
    {
      type: 'figure',
      eyebrow: 'The site',
      title: 'Doorstep service, 20 minutes or less',
      src: '/screenshots/fhoneman.webp',
      alt: 'Fhoneman hero — doorstep phone repair service',
      width: 1600,
      height: 741,
      caption: 'Live hero on fhoneman.in, with the Book a Repair and Emergency Repair paths up front.',
    },
  ],
};
