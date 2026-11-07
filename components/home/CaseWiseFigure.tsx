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
      <div className="rounded-media border border-surfaceBorder bg-surface p-5 sm:p-8">
        <p className="text-small font-medium text-textPrimary">
          CaseWise: time to process one legal case
        </p>

        <dl className="mt-6 space-y-6">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-small text-textSecondary">By hand</dt>
              <dd className="font-display text-xl font-medium tabular-nums text-textPrimary">
                15 minutes
              </dd>
            </div>
            <div aria-hidden="true" className="mt-2 h-3 rounded-[3px] bg-surfaceBorderStrong bar-grow" />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-small text-textSecondary">With CaseWise</dt>
              <dd className="font-display text-xl font-medium tabular-nums text-accent">30 seconds</dd>
            </div>
            <div
              aria-hidden="true"
              className="mt-2 h-3 min-w-[6px] rounded-[3px] bg-accent bar-grow"
              style={{ width: `${afterShare}%` }}
            />
          </div>
        </dl>

        <ul className="mt-8 grid gap-6 border-t border-surfaceBorder pt-6 sm:grid-cols-3">
          {facts.map((fact) => (
            <li key={fact.label}>
              <p className="font-display text-h3 font-medium tabular-nums text-textPrimary">
                {fact.value}
              </p>
              <p className="mt-1 text-small text-textMuted">{fact.label}</p>
            </li>
          ))}
        </ul>
      </div>

      <figcaption className="mt-3 text-small text-textMuted">
        Measured on the production pipeline. Case contents are confidential and not shown.
      </figcaption>
    </figure>
  );
}
