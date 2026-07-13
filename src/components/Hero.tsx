export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pt-16 pb-20 sm:px-10 sm:pt-24" style={{ background: 'var(--masthead-navy)' }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #f3ecd9 0, #f3ecd9 1px, transparent 1px, transparent 14px)',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <p
          className="mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider"
          style={{ borderColor: 'rgba(207,154,48,0.5)', color: 'var(--accent-gold-strong)', background: 'rgba(207,154,48,0.08)' }}
        >
          <span aria-hidden="true">★</span>
          One Big Beautiful Bill Act · Live since July 4, 2026
        </p>
        <h1
          className="font-display text-4xl leading-[1.1] tracking-tight [text-wrap:balance] sm:text-6xl"
          style={{ color: '#f9f5e9' }}
        >
          A $1,000 head start —
          <br />
          and decades to compound it.
        </h1>
        <div
          className="mx-auto mt-6 h-px w-24"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent-red), transparent)' }}
          aria-hidden="true"
        />
        <p className="mx-auto mt-6 max-w-2xl text-lg" style={{ color: 'rgba(243,236,217,0.78)' }}>
          Trump Accounts hand every eligible child a federally-seeded, tax-deferred
          investment account. See what that seed can grow into, and map out the
          Roth conversions, penalty-free withdrawals, and retirement paths your
          clients can take with it.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#calculator"
            className="rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition hover:opacity-90"
            style={{ background: 'var(--accent-gold)', color: 'var(--masthead-navy)' }}
          >
            Try the compounding calculator
          </a>
          <a
            href="#plan-ahead"
            className="rounded-full border px-6 py-3 text-sm font-semibold transition hover:bg-white/5"
            style={{ borderColor: 'rgba(243,236,217,0.35)', color: '#f3ecd9' }}
          >
            Explore planning scenarios
          </a>
        </div>
      </div>
    </section>
  )
}
