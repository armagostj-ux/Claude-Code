import type { ReactNode } from 'react'

interface SectionProps {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
  tone?: 'default' | 'muted'
}

export function Section({ id, eyebrow, title, description, children, tone = 'default' }: SectionProps) {
  return (
    <section
      id={id}
      className={`px-6 py-20 sm:px-10 ${tone === 'muted' ? 'bg-surface-1' : ''}`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-hero">{eyebrow}</p>
          )}
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">{title}</h2>
          {description && <p className="mt-4 text-base text-text-secondary sm:text-lg">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}
