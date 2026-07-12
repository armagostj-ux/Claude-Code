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
    <header className="sticky top-0 z-40 border-b border-border bg-surface-2/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 sm:px-10">
        <a href="#top" className="flex items-center gap-2 font-semibold text-text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-hero text-sm font-bold text-white">TA</span>
          Trump Accounts Explorer
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
