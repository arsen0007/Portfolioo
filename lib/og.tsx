import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

type OgCardProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** A phrase inside the title to set in signal orange (the one accent). */
  accent?: string;
};

// SIGNAL: ink, bone and one orange. Same values as the site's dark tokens.
const INK = '#08080a';
const BONE = '#edeae3';
const FOG = '#8f8c86';
const SIGNAL = '#ff5a1f';

// A particle motif: noise on the left resolving into a lattice on the right,
// the same story the live site tells. Deterministic so every render matches.
const COLS = 21;
const ROWS = 26;
const STEP = 21;
const ORIGIN_X = 1200 - 64 - COLS * STEP;
const ORIGIN_Y = 52;

function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function particles() {
  const dots: { x: number; y: number; size: number; color: string }[] = [];
  for (let i = 0; i < COLS; i += 1) {
    const t = i / (COLS - 1);
    for (let j = 0; j < ROWS; j += 1) {
      const seed = i * 97 + j * 31;
      // Sparse where it is still noise, complete where it has become a system.
      if (hash(seed + 4) > 0.22 + 0.78 * t) continue;
      const chaos = (1 - t) ** 1.6 * 30;
      const x = ORIGIN_X + i * STEP + (hash(seed + 1) - 0.5) * 2 * chaos;
      const y = ORIGIN_Y + j * STEP + (hash(seed + 2) - 0.5) * 2 * chaos;
      const signal = t > 0.7 && hash(seed + 3) < (t - 0.62) * 0.55;
      const alpha = 0.14 + 0.4 * t;
      dots.push({
        x,
        y,
        size: signal ? 6 : 4,
        color: signal ? SIGNAL : `rgba(237,234,227,${alpha.toFixed(2)})`,
      });
    }
  }
  return dots;
}

/**
 * A social share card in the SIGNAL language: ink background, bone type in
 * Geist, a mono eyebrow with a live dot, and a dotted particle motif. Fonts are
 * bundled TTFs from assets/fonts (satori cannot read woff2) and loaded as local
 * assets, so rendering never depends on the network. Runs on the edge runtime.
 */
export async function renderOgCard({ accent, eyebrow, subtitle, title }: OgCardProps) {
  const [geist, geistMono] = await Promise.all([
    fetch(new URL('../assets/fonts/Geist-Medium.ttf', import.meta.url)).then((res) => res.arrayBuffer()),
    fetch(new URL('../assets/fonts/GeistMono-Regular.ttf', import.meta.url)).then((res) => res.arrayBuffer()),
  ]);

  // Long titles drop a size so they never overflow the card.
  const titleSize = title.length > 40 ? 78 : title.length > 16 ? 108 : 150;

  // Satori has no inline text runs, so the title is laid out word by word and
  // the words inside `accent` are coloured.
  const start = accent ? title.indexOf(accent) : -1;
  const end = start >= 0 && accent ? start + accent.length : -1;
  let cursor = 0;
  const words = title.split(' ').map((text) => {
    const from = cursor;
    cursor += text.length + 1;
    return { text, marked: start >= 0 && from >= start && from < end };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: INK,
          fontFamily: 'Geist',
          color: BONE,
        }}
      >
        {particles().map((dot, key) => (
          <div
            key={key}
            style={{
              position: 'absolute',
              left: dot.x,
              top: dot.y,
              width: dot.size,
              height: dot.size,
              borderRadius: 999,
              background: dot.color,
            }}
          />
        ))}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '64px 72px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: SIGNAL,
                boxShadow: `0 0 26px ${SIGNAL}`,
              }}
            />
            <div
              style={{
                display: 'flex',
                fontFamily: 'GeistMono',
                fontSize: 24,
                color: FOG,
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}
            >
              {eyebrow}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 26, maxWidth: 820 }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                fontSize: titleSize,
                lineHeight: 1.02,
                letterSpacing: -titleSize * 0.045,
                color: BONE,
              }}
            >
              {words.map((word, key) => (
                <div
                  key={key}
                  style={{ display: 'flex', marginRight: titleSize * 0.17, color: word.marked ? SIGNAL : BONE }}
                >
                  {word.text}
                </div>
              ))}
            </div>
            {subtitle ? (
              <div style={{ display: 'flex', fontSize: 32, lineHeight: 1.3, color: FOG, maxWidth: 760 }}>
                {subtitle}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingTop: 22,
              borderTop: '1px solid rgba(237,234,227,0.16)',
            }}
          >
            <div style={{ display: 'flex', fontSize: 30, letterSpacing: -0.5 }}>Tousif Ali</div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'GeistMono',
                fontSize: 22,
                color: FOG,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              tousifali.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: 'Geist', data: geist, style: 'normal', weight: 500 },
        { name: 'GeistMono', data: geistMono, style: 'normal', weight: 400 },
      ],
    },
  );
}
