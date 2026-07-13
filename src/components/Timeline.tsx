import { Section } from './Section'
import { timeline } from '../data/facts'

export function Timeline() {
  return (
    <Section
      id="timeline"
      eyebrow="The rules"
      title="A Trump Account's life, milestone by milestone"
      description="From the seed deposit at birth to unrestricted access after 59½ — here's what changes, and when."
    >
      <ol className="relative space-y-10 border-l border-border pl-8">
        {timeline.map((event) => (
          <li key={event.title} className="relative">
            <span
              className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ring-4 ring-surface-2"
              style={{ background: 'var(--cta-bg)', color: 'var(--cta-fg)' }}
            >
              {timeline.indexOf(event) + 1}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-hero">{event.age}</p>
            <h3 className="mt-1 text-lg font-semibold text-text-primary">{event.title}</h3>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-text-secondary">{event.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
