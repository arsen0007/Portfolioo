/**
 * CaseWise is confidential, so the proof is the measurement, not a screenshot.
 * Every number here is already published on the CaseWise case study; the bars
 * are drawn to scale (30 seconds is 3.3% of 15 minutes) so the comparison is
 * visual as well as stated. No case content is shown.
 */

const BEFORE_SECONDS = 15 * 60;
const AFTER_SECONDS = 30;

const facts = [
  { value: '2,700', label: 'cases a month' },
  { value: '31', label: 'legal issue types classified' },
  { value: '433 h', label: 'a month returned to a team of 7' },
] as const;

export function CaseWiseFigure() {
  const afterShare = (AFTER_SECONDS / BEFORE_SECONDS) * 100;

  return (
    <figure>
      <div className="border-t border-surfaceBorder pt-6">
        <p className="label text-textMuted">CaseWise / time to process one legal case</p>

        <div className="mt-8 space-y-8">
          <div>
            <dl className="flex items-baseline justify-between gap-4">
              <dt className="label text-textSecondary">By hand</dt>
              <dd className="font-display text-h3 font-medium tabular-nums text-textPrimary">15 minutes</dd>
            </dl>
            <div aria-hidden="true" className="mt-3 h-[10px] bg-surfaceBorderStrong bar-grow" />
          </div>

          <div>
            <dl className="flex items-baseline justify-between gap-4">
              <dt className="label flex items-center gap-2 text-textSecondary">
                <span aria-hidden="true" className="live-dot" /> With CaseWise
              </dt>
              <dd className="font-display text-h3 font-medium tabular-nums text-accent">30 seconds</dd>
            </dl>
            <div
              aria-hidden="true"
              className="mt-3 h-[10px] min-w-[6px] bg-accent bar-grow"
              style={{ width: `${afterShare}%` }}
            />
          </div>
        </div>

        <ul className="mt-10 grid gap-8 border-t border-surfaceBorder pt-6 sm:grid-cols-3">
          {facts.map((fact) => (
            <li key={fact.label}>
              <p className="font-display text-h2 font-medium tabular-nums tracking-[-0.04em] text-textPrimary">
                {fact.value}
              </p>
              <p className="label mt-2 text-textMuted">{fact.label}</p>
            </li>
          ))}
        </ul>
      </div>

      <figcaption className="label mt-6 text-textMuted">
        Measured on the production pipeline. Case contents are confidential and not shown.
      </figcaption>
    </figure>
  );
}
