import type { CaseStudyContent } from './types';

export const leMansT2: CaseStudyContent = {
  blocks: [
    {
      type: 'prose',
      eyebrow: 'What this is',
      title: 'A competition build, not a production system',
      paragraphs: [
        'Worth being clear about what this is: a twenty-four hour competition build by a team of five, not a production system with users. The idea and the architecture were mine; four other people built it with me. What it demonstrates is a decision made under time pressure and judged by other people — which is the part that does not transfer from a portfolio.',
      ],
    },
    {
      type: 'list',
      eyebrow: 'The decision that won it',
      title: 'Predict laps, not probability',
      intro: 'Same underlying prediction, two different outputs.',
      items: [
        {
          title: 'What a model usually says: 73% chance of failure',
          body: 'Technically correct, and it hands the hard part back to a person who is already busy. Seventy-three percent of what, by when, and do I pit now?',
        },
        {
          title: 'What we shipped: 9 laps remaining',
          body: 'Same underlying prediction. But a lap count is already a decision — it lines up with pit windows, stint planning, and the way a race engineer thinks under pressure.',
        },
      ],
    },
    {
      type: 'prose',
      eyebrow: 'Output contract',
      title: 'A number you can act on',
      paragraphs: [
        'Most teams reach for a better model. The thing that made ours useful was not the algorithm — it was choosing an output contract that matched how the user already works. A probability is a number you have to interpret. A lap count is a number you can act on.',
        'The judging reflected that. Entries were assessed on impact to real team performance rather than demo polish, and that is the difference between a model that is impressive and a model that gets used.',
      ],
    },
  ],
};
