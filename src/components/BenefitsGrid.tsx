import type { ReactNode } from 'react'
import { Section } from './Section'
import { benefits } from '../data/facts'

const icons: Record<string, ReactNode> = {
  'Free money': (
    <path d="M7 12c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5M12 8v1.5M12 14.5V16" />
  ),
  'Tax-deferred growth': <path d="M6 15l3.5-4 3 2.5L17 8m0 0h-3.5M17 8v3.5" />,
  'Built-in discipline': <path d="M7 16V11M12 16V8M17 16v-5" />,
  'Family + employer funding': <path d="M9 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm6 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM5 17c0-1.9 1.8-3.5 4-3.5s4 1.6 4 3.5M13 13.7c.6-.4 1.3-.7 2-.7 2.2 0 4 1.6 4 3.5" />,
  'Automatic conversion': <path d="M7 8h8l-2-2m2 2-2 2M17 16H9l2 2m-2-2 2-2" />,
  'Flexible exit ramps': <path d="M8 7v4c0 1.5 1 2.5 2.5 2.5H14M14 13.5 11.5 11M14 13.5 11.5 16M8 7l-2 2M8 7l2 2" />,
}

export function BenefitsGrid() {
  return (
    <Section
      id="benefits"
      eyebrow="Why they matter"
      title="Six reasons you should consider opening a Trump Account"
      description="Each feature compounds with the others — free seed money invested for free, with no annual tax drag, for up to 18 years before anyone touches it."
      tone="muted"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="rounded-3xl bg-surface-card p-6">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ background: 'var(--series-hero-fill)' }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {icons[benefit.tag]}
              </svg>
            </span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-text-muted">{benefit.tag}</p>
            <h3 className="mt-1 text-lg font-semibold text-text-primary">{benefit.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{benefit.description}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
