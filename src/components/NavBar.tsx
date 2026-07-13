import { ThemeToggle } from './ThemeToggle'

const links = [
  { href: '#benefits', label: 'Benefits' },
  { href: '#calculator', label: 'Calculator' },
  { href: '#plan-ahead', label: 'Plan Ahead' },
  { href: '#timeline', label: 'Rules & Timeline' },
  { href: '#faq', label: 'FAQ' },
]

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 bg-surface-1">
      <div className="border-b border-border px-6 py-1.5 text-center text-[11px] text-text-muted sm:px-10">
        Independent educational tool — not trumpaccounts.gov, the U.S. Treasury, or any government agency.
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <a href="#top" className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[13px] font-bold"
            style={{ background: `linear-gradient(155deg, var(--accent-gold-soft), var(--accent-gold))`, color: '#2a2007' }}
          >
            ★
          </span>
          <span className="font-display text-lg text-text-primary">Trump Accounts Explorer</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-text-secondary md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-text-primary">
              {link.label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
