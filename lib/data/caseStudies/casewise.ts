import type { CaseStudyContent } from './types';

export const casewise: CaseStudyContent = {
  blocks: [
    {
      type: 'steps',
      eyebrow: 'Pipeline',
      title: 'Three stages, with a person at the end',
      items: [
        {
          label: 'Classification',
          body: 'AI reads the case description and maps it to the correct category and subcategory, with no legal expertise required from the intake team.',
        },
        {
          label: 'Summarization',
          body: 'Generates a clean structured case summary from messy call notes.',
        },
        {
          label: 'Attorney outreach',
          body: 'Produces a ready-to-use outreach draft pulled directly from the case details.',
        },
      ],
      note: 'Human review is built in: classifications and summaries can be edited before anything is committed.',
    },
    {
      type: 'steps',
      eyebrow: 'Timeline',
      title: 'From prototype to core system',
      items: [
        {
          label: '2025',
          body: 'Built the internal prototype. CEO-sponsored Product School scholarship. Featured on the company blog.',
        },
        {
          label: '2026',
          body: 'CTO integrating it into the core system. Ongoing.',
        },
      ],
    },
    {
      type: 'prose',
      eyebrow: 'What the attention turned into',
      title: 'The room most case studies leave out',
      paragraphs: [
        "For months, I worked directly with a Senior System Architect and an AI Team Lead, learning how architecture gets diagrammed before it's built, how to evaluate a model instead of trusting a demo, and how to put a real cost on an idea instead of just being enthusiastic about it. A product designer showed me how a workflow actually gets pitched to a room full of executives. None of it came with a syllabus. It came from treating my own project as the classroom.",
      ],
    },
    {
      type: 'quote',
      eyebrow: 'C-suite response',
      title: "They didn't just say it was good. They acted on it.",
      source: 'ceo',
    },
    {
      type: 'links',
      eyebrow: 'Public record',
      title: 'Featured as a company innovation story',
      items: [
        {
          label: 'Pitch-It Summer 2025: Innovation from the Inside Out (Workplace Options Blog, July 2025)',
          href: 'https://www.workplaceoptions.com/blog/pitch-it-summer-2025-innovation-from-the-inside-out/',
        },
      ],
    },
  ],
};
