export function Hero() {
  return (
    <section id="top" className="px-6 pt-16 pb-20 sm:px-10 sm:pt-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-4 inline-flex items-center rounded-full border border-border bg-surface-card px-3 py-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
          One Big Beautiful Bill Act · Trump Accounts, live since July 4, 2026
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-6xl">
          A $1,000 head start —
          <br />
          and decades to compound it.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
          Trump Accounts hand every eligible child a federally-seeded, tax-deferred
          investment account. See what that seed can grow into, and map out the
          Roth conversions, penalty-free withdrawals, and retirement paths your
          clients can take with it.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#calculator"
            className="rounded-full bg-hero px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Try the compounding calculator
          </a>
          <a
            href="#plan-ahead"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-text-primary transition hover:bg-surface-card"
          >
            Explore planning scenarios
          </a>
        </div>
      </div>
    </section>
  )
}
