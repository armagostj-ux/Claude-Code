import { Section } from './Section'
import { benefits } from '../data/facts'

export function BenefitsGrid() {
  return (
    <Section
      id="benefits"
      eyebrow="Why they matter"
      title="Six reasons Trump Accounts are worth a client conversation"
      description="Each feature compounds with the others — free seed money invested for free, with no annual tax drag, for up to 18 years before anyone touches it."
      tone="muted"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="inline-flex rounded-full bg-hero/10 px-2.5 py-1 text-xs font-semibold text-hero">
              {benefit.tag}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-text-primary">{benefit.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{benefit.description}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
