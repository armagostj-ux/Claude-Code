import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      className="rounded-full border px-3 py-1.5 text-sm transition hover:border-[rgba(243,236,217,0.6)] hover:text-[#f3ecd9]"
      style={{ borderColor: 'rgba(243,236,217,0.3)', color: 'rgba(243,236,217,0.75)' }}
      aria-label="Toggle dark mode"
    >
      {theme === 'light' ? 'Dark mode' : 'Light mode'}
    </button>
  )
}
