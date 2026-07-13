import { useState } from 'react'
import { Section } from './Section'
import { faqs } from '../data/facts'

function FAQItemRow({ question, answer, last }: { question: string; answer: string; last: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={last ? '' : 'border-b border-border'}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-text-primary">{question}</span>
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2 text-text-muted transition-transform"
          style={{ transform: open ? 'rotate(45deg)' : undefined }}
        >
          +
        </span>
      </button>
      {open && <p className="pb-5 text-sm leading-relaxed text-text-secondary">{answer}</p>}
    </div>
  )
}

export function FAQ() {
  return (
    <Section id="faq" eyebrow="Details" title="Frequently asked questions">
      <div className="mx-auto max-w-2xl rounded-3xl bg-surface-card px-6 sm:px-8">
        {faqs.map((item, i) => (
          <FAQItemRow key={item.question} {...item} last={i === faqs.length - 1} />
        ))}
      </div>
    </Section>
  )
}
