import { sources } from '../data/facts'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-1 px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl text-sm text-text-secondary">
        <p className="font-medium text-text-primary">Sources</p>
        <ul className="mt-2 space-y-1">
          {sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer" className="text-hero hover:underline">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-text-muted">
          This is an independent, third-party educational tool — it is not trumpaccounts.gov, the
          U.S. Treasury, the IRS, or any government or Trump-affiliated entity, and is not
          endorsed by them. Educational and illustrative only — not tax, legal, or investment
          advice. Trump Accounts were created by the 2025 One Big Beautiful Bill Act and became
          available July 4, 2026;
          figures, contribution limits, and rules reflect published guidance as of mid-2026 and may
          be updated by further Treasury/IRS regulation. All growth projections use hypothetical,
          constant rates of return for illustration and are not guarantees of future performance.
          Consult a qualified tax or financial advisor before acting.
        </p>
      </div>
    </footer>
  )
}
