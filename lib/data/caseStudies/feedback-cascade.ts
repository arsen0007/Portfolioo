import type { CaseStudyContent } from './types';

export const feedbackCascade: CaseStudyContent = {
  blocks: [
    {
      type: 'figure',
      eyebrow: 'The announcement',
      title: 'Named the winner of the first challenge',
      src: '/recognition-gdp-challenge.webp',
      alt: "The winner announcement for the first GDP Innovation Challenge, naming Feedback Cascade as the winning submission and describing its four mechanisms. Three colleagues' names and the results paragraph are covered.",
      width: 732,
      height: 915,
      caption:
        "The winner announcement on the company's internal network, September 2026. Three colleagues' names and the results paragraph are covered.",
    },
    {
      type: 'prose',
      eyebrow: 'Where it stands',
      title: 'Selected, not yet built',
      paragraphs: [
        'The idea was selected to move forward with support from the Member Experience team. The implementation phase has not started, so this page shows the proposal and the decision, not results.',
      ],
    },
  ],
};
