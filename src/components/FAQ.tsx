import { useState } from 'react'
import { Section } from './Section'
import { faqs } from '../data/facts'

function FAQItemRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-text-primary">{question}</span>
        <span className={`shrink-0 text-text-muted transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && <p className="mt-3 text-sm leading-relaxed text-text-secondary">{answer}</p>}
    </div>
  )
}

export function FAQ() {
  return (
    <Section id="faq" eyebrow="Details" title="Frequently asked questions" tone="muted">
      <div className="mx-auto max-w-2xl">
        {faqs.map((item) => (
          <FAQItemRow key={item.question} {...item} />
        ))}
      </div>
    </Section>
  )
}
