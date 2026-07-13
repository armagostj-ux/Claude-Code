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
    <header className="sticky top-0 z-40" style={{ background: 'var(--masthead-navy)' }}>
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, var(--accent-gold-strong), var(--accent-gold), var(--accent-gold-strong))' }} />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 sm:px-10">
        <a href="#top" className="flex items-center gap-2.5 font-semibold" style={{ color: '#f3ecd9' }}>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold font-display"
            style={{ background: 'var(--accent-gold)', color: 'var(--masthead-navy)', border: '1px solid rgba(243,236,217,0.4)' }}
          >
            TA
          </span>
          <span className="font-display text-[15px] tracking-wide">Trump Accounts Explorer</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm md:flex" style={{ color: 'rgba(243,236,217,0.75)' }}>
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-[#f3ecd9]">
              {link.label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
      <div
        className="border-t px-6 py-1.5 text-center text-[11px] sm:px-10"
        style={{ borderColor: 'rgba(243,236,217,0.12)', color: 'rgba(243,236,217,0.55)' }}
      >
        Independent educational tool — not trumpaccounts.gov, the U.S. Treasury, or any government agency.
      </div>
    </header>
  )
}
