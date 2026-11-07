import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

type OgCardProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

// The same warm paper, ink and single vermilion accent as the site.
const PAPER = '#faf8f5';
const INK = '#16140f';
const MUTED = '#5f5b52';
const ACCENT = '#c2410c';

/**
 * A social share card in the site's own typography. Newsreader (OFL licensed)
 * is bundled from assets/fonts and fetched as a local asset, so rendering never
 * depends on a network request. Runs on the edge runtime (see the route files).
 */
export async function renderOgCard({ eyebrow, subtitle, title }: OgCardProps) {
  const font = await fetch(new URL('../assets/fonts/Newsreader-Medium.ttf', import.meta.url)).then((res) => res.arrayBuffer());

  // Long titles drop a size so they never overflow the card.
  const titleSize = title.length > 40 ? 76 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: PAPER,
          padding: '72px 80px',
          fontFamily: 'Newsreader',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 56, height: 6, background: ACCENT }} />
          <div style={{ fontSize: 30, color: MUTED, letterSpacing: 2, textTransform: 'uppercase' }}>
            {eyebrow}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontSize: titleSize, lineHeight: 1.04, color: INK, letterSpacing: -2 }}>{title}</div>
          {subtitle ? (
            <div style={{ fontSize: 36, lineHeight: 1.3, color: MUTED, maxWidth: 980 }}>{subtitle}</div>
          ) : null}
        </div>

        <div style={{ fontSize: 32, color: INK }}>Tousif Ali</div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [{ name: 'Newsreader', data: font, style: 'normal', weight: 500 }],
    },
  );
}
