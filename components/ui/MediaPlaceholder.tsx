import { colorMix, themeColors } from '@/lib/constants/colors';
import type { AccentColor } from '@/lib/constants/colors';

type MediaPlaceholderProps = {
  accent?: AccentColor;
  /** What asset belongs here, e.g. "Photo — the Pi on the shelf". */
  label: string;
  /** Optional guidance: framing, aspect, what it needs to show. */
  hint?: string;
  kind?: 'image' | 'video';
  /** CSS aspect-ratio, e.g. "16 / 9". */
  ratio?: string;
};

/**
 * A labelled empty frame standing in for an asset that does not exist yet.
 *
 * Deliberately not a broken <img>: this renders the slot, states what belongs
 * in it, and reserves the correct space so the layout is already final when the
 * real file lands. Swap for <Image> and delete.
 */
export function MediaPlaceholder({
  accent = 'blue',
  label,
  hint,
  kind = 'image',
  ratio = '16 / 9',
}: MediaPlaceholderProps) {
  const color = themeColors[accent];

  return (
    <div
      className="relative grid w-full place-items-center overflow-hidden rounded-[16px] border border-dashed px-6 text-center"
      style={{
        aspectRatio: ratio,
        borderColor: colorMix(color, 34),
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${colorMix(color, 8)}, transparent 70%), var(--surface)`,
      }}
    >
      <div className="grid gap-2.5">
        <span
          className="mx-auto grid h-10 w-10 place-items-center rounded-full border"
          style={{ borderColor: colorMix(color, 40), background: colorMix(color, 10) }}
        >
          {kind === 'video' ? (
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke={color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 16 16"
            >
              <path d="M6 4.5l5.5 3.5L6 11.5z" />
              <rect height="12" rx="2.5" width="14" x="1" y="2" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke={color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 16 16"
            >
              <rect height="11" rx="2" width="14" x="1" y="2.5" />
              <circle cx="5.5" cy="6.5" r="1.2" />
              <path d="M2 11l3.5-3 2.5 2 3-2.5 4 3.5" />
            </svg>
          )}
        </span>

        <p className="font-body text-[13px] font-medium text-textPrimary">{label}</p>

        {hint ? (
          <p className="mx-auto max-w-[380px] font-body text-[12px] leading-[1.5] text-textMuted">
            {hint}
          </p>
        ) : null}

        <p
          className="font-mono text-[9px] uppercase tracking-[0.14em]"
          style={{ color: colorMix(color, 80) }}
        >
          Asset pending
        </p>
      </div>
    </div>
  );
}
