import { useMemo, useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Section } from './Section'
import { DEFAULT_INPUTS, formatCurrency, projectGrowth, type GrowthInputs } from '../lib/calculations'

const RETURN_PRESETS = [
  { label: 'Conservative (5%)', value: 0.05 },
  { label: 'Historical S&P 500 (7%)', value: 0.07 },
  { label: 'Optimistic (9%)', value: 0.09 },
]

const END_AGE_PRESETS = [
  { label: 'Through age 18', value: 18 },
  { label: 'Through retirement (65)', value: 65 },
]

function StatTile({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="rounded-3xl bg-surface-card p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      <p className="tabular-nums font-display mt-2 flex items-center gap-2 text-3xl text-text-primary">
        <span className="h-6 w-px bg-gold" aria-hidden="true" />
        {value}
      </p>
      {sublabel && <p className="mt-1 text-xs text-text-secondary">{sublabel}</p>}
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const rows: { key: string; name: string; color: string; value: number }[] = [
    { key: 'trumpAccount', name: 'Trump Account', color: 'var(--series-hero)', value: 0 },
    { key: 'taxableBrokerage', name: 'Taxable brokerage', color: 'var(--series-context-1)', value: 0 },
    { key: 'cashSavings', name: 'Cash savings', color: 'var(--series-context-2)', value: 0 },
  ]
  for (const row of rows) {
    const point = payload.find((p: any) => p.dataKey === row.key)
    row.value = point ? point.value : 0
  }
  return (
    <div className="rounded-2xl bg-surface-card px-4 py-3 text-sm shadow-lg">
      <p className="mb-2 font-medium text-text-primary">Age {label}</p>
      {rows.map((row) => (
        <div key={row.key} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-2 text-text-secondary">
            <span className="h-2 w-2 rounded-full" style={{ background: row.color }} />
            {row.name}
          </span>
          <span className="tabular-nums font-medium text-text-primary">{formatCurrency(row.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function CompoundingCalculator() {
  const [inputs, setInputs] = useState<GrowthInputs>(DEFAULT_INPUTS)
  const [endAge, setEndAge] = useState(65)

  const data = useMemo(() => projectGrowth(inputs, endAge), [inputs, endAge])
  const at18 = useMemo(() => projectGrowth(inputs, 18)[18], [inputs])
  const atEnd = data[data.length - 1]

  const update = (patch: Partial<GrowthInputs>) => setInputs((prev) => ({ ...prev, ...patch }))

  return (
    <Section
      id="calculator"
      eyebrow="See it grow"
      title="The compounding calculator"
      description="Adjust contributions and assumptions to see how a Trump Account stacks up against a taxable brokerage account or a plain savings account for the same child."
    >
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6 rounded-3xl bg-surface-card p-6">
          <div>
            <label className="flex items-center justify-between text-sm font-medium text-text-primary">
              Annual family contribution
              <span className="tabular-nums text-text-secondary">{formatCurrency(inputs.annualContribution)}</span>
            </label>
            <input
              type="range"
              min={0}
              max={5000}
              step={100}
              value={inputs.annualContribution}
              onChange={(e) => update({ annualContribution: Number(e.target.value) })}
              className="mt-2 w-full accent-[var(--series-hero)]"
            />
            <p className="mt-1 text-xs text-text-muted">Family/individual cap is $5,000/year.</p>
          </div>

          <div>
            <label className="flex items-center justify-between text-sm font-medium text-text-primary">
              Employer contribution
              <span className="tabular-nums text-text-secondary">{formatCurrency(inputs.employerContribution)}</span>
            </label>
            <input
              type="range"
              min={0}
              max={2500}
              step={100}
              value={inputs.employerContribution}
              onChange={(e) => update({ employerContribution: Number(e.target.value) })}
              className="mt-2 w-full accent-[var(--series-hero)]"
            />
            <p className="mt-1 text-xs text-text-muted">Employer cap is $2,500/year.</p>
          </div>

          <div>
            <p className="text-sm font-medium text-text-primary">Expected annual return</p>
            <div className="mt-2 flex flex-col gap-1 rounded-full bg-surface-2 p-1">
              {RETURN_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => update({ annualReturnRate: preset.value })}
                  className="rounded-full px-4 py-2 text-left text-sm font-medium transition"
                  style={
                    inputs.annualReturnRate === preset.value
                      ? { background: 'var(--cta-bg)', color: 'var(--cta-fg)' }
                      : { color: 'var(--text-secondary)' }
                  }
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-text-primary">Project through</p>
            <div className="mt-2 flex gap-1 rounded-full bg-surface-2 p-1">
              {END_AGE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setEndAge(preset.value)}
                  className="flex-1 rounded-full px-3 py-2 text-sm font-medium transition"
                  style={
                    endAge === preset.value
                      ? { background: 'var(--cta-bg)', color: 'var(--cta-fg)' }
                      : { color: 'var(--text-secondary)' }
                  }
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <p className="border-t border-border pt-4 text-xs leading-relaxed text-text-muted">
            Illustrative only. Taxable brokerage assumes a {(inputs.taxableDragRate * 100).toFixed(0)}%
            annual tax drag from dividends/turnover; cash savings assumes a{' '}
            {(inputs.cashReturnRate * 100).toFixed(0)}% yield taxed as ordinary income. Contributions
            stop at age 18; no further contributions are modeled after that.
          </p>
        </div>

        <div>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <StatTile
              label="Trump Account at 18"
              value={formatCurrency(at18.trumpAccount, { compact: true })}
              sublabel={`vs. ${formatCurrency(at18.taxableBrokerage, { compact: true })} taxable`}
            />
            <StatTile
              label={`Trump Account at ${endAge}`}
              value={formatCurrency(atEnd.trumpAccount, { compact: true })}
              sublabel={`vs. ${formatCurrency(atEnd.taxableBrokerage, { compact: true })} taxable`}
            />
            <StatTile
              label="Total family contributed"
              value={formatCurrency(atEnd.contributions, { compact: true })}
              sublabel="Includes $1,000 seed deposit"
            />
          </div>

          <div className="rounded-3xl bg-surface-card p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-2 font-medium text-text-primary">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--series-hero)' }} />
                Trump Account
              </span>
              <span className="flex items-center gap-2 text-text-secondary">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--series-context-1)' }} />
                Taxable brokerage
              </span>
              <span className="flex items-center gap-2 text-text-secondary">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--series-context-2)' }} />
                Cash savings
              </span>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--series-hero)" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="var(--series-hero)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--gridline)" />
                <XAxis
                  dataKey="age"
                  tickLine={false}
                  axisLine={{ stroke: 'var(--baseline)' }}
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  tickFormatter={(v) => `${v}`}
                  interval={endAge > 18 ? 4 : 1}
                  label={{ value: 'Age', position: 'insideBottom', offset: -4, fill: 'var(--text-muted)', fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  tickFormatter={(v) => formatCurrency(v, { compact: true })}
                  width={64}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--baseline)', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="trumpAccount"
                  stroke="none"
                  fill="url(#heroFill)"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="cashSavings"
                  stroke="var(--series-context-2)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="taxableBrokerage"
                  stroke="var(--series-context-1)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="trumpAccount"
                  stroke="var(--series-hero)"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Section>
  )
}
