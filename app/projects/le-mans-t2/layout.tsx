import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Le Man's T2 — real-time failure prediction for endurance racing",
  description:
    'Global winner of the ClearRoute x Le Mans 24h Hackathon. A real-time failure prediction system built in 24 hours that outputs laps-to-failure rather than a probability — because a lap count is already a decision.',
};

export default function LeMansT2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
