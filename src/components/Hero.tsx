export function Hero() {
  return (
    <section id="top" className="px-6 pt-16 pb-20 sm:px-10 sm:pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <span
          className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
          style={{ background: 'linear-gradient(155deg, var(--accent-gold-soft), var(--accent-gold))', color: '#2a2007' }}
          aria-hidden="true"
        >
          ★
        </span>
        <h1 className="font-display text-4xl leading-[1.15] tracking-tight text-text-primary [text-wrap:balance] sm:text-6xl">
          A $1,000 head start —
          <br />
          and decades to compound it.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
          Trump Accounts hand every eligible child a federally-seeded, tax-deferred
          investment account. See what that seed can grow into, and map out the
          Roth conversions, penalty-free withdrawals, and retirement paths your
          clients can take with it.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#calculator"
            className="rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition hover:opacity-90"
            style={{ background: 'var(--cta-bg)', color: 'var(--cta-fg)' }}
          >
            Try the compounding calculator
          </a>
          <a
            href="#plan-ahead"
            className="rounded-full px-6 py-3 text-sm font-semibold text-text-secondary transition hover:text-text-primary"
          >
            Explore planning scenarios →
          </a>
        </div>
      </div>
    </section>
  )
}
