'use client';

import { useEffect } from 'react';
import { useScene } from '@/lib/store/scene';

const SHAPES = ['noise','clusters','pipeline','bridge','grid','sphere','portrait','text:433','text:TOUSIF ALI','project:barhunter','project:casewise','project:genie','project:mailmerge','project:fhoneman','project:le-mans-t2','project:arsens-lab','project:feedback-cascade','project:nope'];

export default function Lab() {
  useEffect(() => {
    (window as unknown as { __scene: typeof useScene }).__scene = useScene;
  }, []);
  return (
    <main className="min-h-[300vh] p-6">
      <div className="fixed bottom-4 left-4 flex max-w-[80vw] flex-wrap gap-1">
        {SHAPES.map((s) => (
          <button className="label border border-surfaceBorder px-2 py-1 text-xs" key={s} onClick={() => useScene.getState().setIntent({ shape: s as never })} type="button">{s}</button>
        ))}
      </div>
    </main>
  );
}
