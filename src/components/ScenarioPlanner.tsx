import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Section } from './Section'
import {
  DEFAULT_INPUTS,
  formatCurrency,
  projectGrowth,
  projectTraditionalHold,
  scenarioExceptionWithdrawal,
  scenarioQualifiedWithdrawal,
  scenarioRothConversion,
  scenarioStandardEarlyWithdrawal,
} from '../lib/calculations'

const balanceAt18 = projectGrowth(DEFAULT_INPUTS, 18)[18].trumpAccount

type Tab = 'withdraw' | 'roth'

function LabeledSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  format: (v: number) => string
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm font-medium text-text-primary">
        {label}
        <span className="tabular-nums text-text-secondary">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[#1c5cab]"
      />
    </label>
  )
}

function WithdrawalTab() {
  const [amount, setAmount] = useState(10000)
  const [ordinaryRate, setOrdinaryRate] = useState(0.22)

  const results = useMemo(() => {
    const tax = { ordinaryRate }
    return [
      { ...scenarioStandardEarlyWithdrawal(amount, tax), penalized: true },
      { ...scenarioExceptionWithdrawal(amount, tax, 'a first home', 10000), penalized: false },
      { ...scenarioExceptionWithdrawal(amount, tax, 'higher education'), penalized: false },
      { ...scenarioExceptionWithdrawal(amount, tax, 'a small business'), penalized: false },
      { ...scenarioQualifiedWithdrawal(amount, tax), penalized: false },
    ]
  }, [amount, ordinaryRate])

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <div className="space-y-6 rounded-2xl border border-border bg-surface-card p-6">
        <LabeledSlider
          label="Withdrawal amount"
          value={amount}
          onChange={setAmount}
          min={1000}
          max={30000}
          step={500}
          format={(v) => formatCurrency(v)}
        />
        <LabeledSlider
          label="Ordinary income tax rate"
          value={ordinaryRate}
          onChange={setOrdinaryRate}
          min={0.1}
          max={0.37}
          step={0.01}
          format={(v) => `${Math.round(v * 100)}%`}
        />
        <p className="border-t border-border pt-4 text-xs leading-relaxed text-text-muted">
          Once the account becomes a traditional IRA at 18, a withdrawal before 59½ owes ordinary
          income tax plus a 10% penalty — unless it qualifies for an IRA exception like a first
          home, education, or a small business. After 59½, only ordinary tax applies.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface-card p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={results} layout="vertical" margin={{ top: 8, right: 40, bottom: 8, left: 8 }}>
            <CartesianGrid horizontal={false} stroke="var(--gridline)" />
            <XAxis
              type="number"
              tickFormatter={(v) => formatCurrency(v, { compact: true })}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--baseline)' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={170}
              tick={{ fill: 'var(--text-primary)', fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="netAmount" radius={[0, 4, 4, 0]} maxBarSize={28} isAnimationActive={false}>
              {results.map((r) => (
                <Cell key={r.label} fill={r.penalized ? 'var(--status-critical)' : 'var(--status-good)'} />
              ))}
              <LabelList
                dataKey="netAmount"
                position="right"
                formatter={(v: unknown) => formatCurrency(v as number)}
                fill="var(--text-primary)"
                fontSize={13}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: 'var(--status-good)' }} /> No penalty
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: 'var(--status-critical)' }} /> 10% penalty applies
          </span>
        </div>
        <p className="mt-4 text-sm text-text-secondary">
          Net-of-tax proceeds on a {formatCurrency(amount)} withdrawal. Qualifying for an exception —
          or simply waiting until 59½ — keeps the same {formatCurrency(amount * ordinaryRate, { compact: true })}{' '}
          in ordinary tax but avoids the extra {formatCurrency(amount * 0.1, { compact: true })} penalty.
        </p>
      </div>
    </div>
  )
}

function RothTab() {
  const [conversionRate, setConversionRate] = useState(0.22)
  const [retirementRate, setRetirementRate] = useState(0.24)
  const [returnRate, setReturnRate] = useState(0.07)
  const [yearsToRetirement, setYearsToRetirement] = useState(47)

  const traditionalHold = useMemo(
    () => projectTraditionalHold(balanceAt18, returnRate, yearsToRetirement, retirementRate),
    [returnRate, yearsToRetirement, retirementRate],
  )
  const rothConversion = useMemo(
    () => scenarioRothConversion(balanceAt18, conversionRate, returnRate, yearsToRetirement),
    [conversionRate, returnRate, yearsToRetirement],
  )

  const chartData = [
    { label: 'Stay traditional, withdraw at retirement', net: traditionalHold.netAtRetirement, penalized: true },
    { label: 'Convert to Roth at 18', net: rothConversion.taxFreeAtWithdrawal, penalized: false },
  ]

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <div className="space-y-6 rounded-2xl border border-border bg-surface-card p-6">
        <LabeledSlider
          label="Tax rate if converted now (age 18)"
          value={conversionRate}
          onChange={setConversionRate}
          min={0.1}
          max={0.37}
          step={0.01}
          format={(v) => `${Math.round(v * 100)}%`}
        />
        <LabeledSlider
          label="Tax rate if withdrawn at retirement"
          value={retirementRate}
          onChange={setRetirementRate}
          min={0.1}
          max={0.37}
          step={0.01}
          format={(v) => `${Math.round(v * 100)}%`}
        />
        <LabeledSlider
          label="Years to retirement"
          value={yearsToRetirement}
          onChange={setYearsToRetirement}
          min={10}
          max={55}
          step={1}
          format={(v) => `${v} yrs`}
        />
        <LabeledSlider
          label="Expected annual return"
          value={returnRate}
          onChange={setReturnRate}
          min={0.03}
          max={0.1}
          step={0.005}
          format={(v) => `${(v * 100).toFixed(1)}%`}
        />
        <p className="border-t border-border pt-4 text-xs leading-relaxed text-text-muted">
          A Roth conversion means paying ordinary income tax on the balance today — often while the
          child is in a low tax bracket — in exchange for tax-free growth and tax-free qualified
          withdrawals for the rest of their life.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface-card p-4 sm:p-6">
        <p className="mb-4 text-sm text-text-secondary">
          Starting from a {formatCurrency(balanceAt18, { compact: true })} balance at 18.
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 60, bottom: 8, left: 8 }}>
            <CartesianGrid horizontal={false} stroke="var(--gridline)" />
            <XAxis
              type="number"
              tickFormatter={(v) => formatCurrency(v, { compact: true })}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--baseline)' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={220}
              tick={{ fill: 'var(--text-primary)', fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="net" radius={[0, 4, 4, 0]} maxBarSize={36} isAnimationActive={false}>
              {chartData.map((d) => (
                <Cell key={d.label} fill={d.penalized ? 'var(--series-context-1)' : 'var(--series-hero)'} />
              ))}
              <LabelList
                dataKey="net"
                position="right"
                formatter={(v: unknown) => formatCurrency(v as number, { compact: true })}
                fill="var(--text-primary)"
                fontSize={13}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-4 text-sm text-text-secondary">
          Net, after-tax value at retirement: converting now costs{' '}
          {formatCurrency(rothConversion.taxOwedNow, { compact: true })} in tax today, but the
          remaining {formatCurrency(rothConversion.netAfterConversionTax, { compact: true })} then
          compounds completely tax-free for {yearsToRetirement} years.
        </p>
      </div>
    </div>
  )
}

export function ScenarioPlanner() {
  const [tab, setTab] = useState<Tab>('withdraw')

  return (
    <Section
      id="plan-ahead"
      eyebrow="Plan ahead"
      title="Roth conversions, early withdrawals, and everything in between"
      description="Once the account becomes a traditional IRA at 18, the family faces real choices. Model the trade-offs before making them."
      tone="muted"
    >
      <div className="mb-8 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setTab('withdraw')}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            tab === 'withdraw' ? 'bg-hero text-white' : 'border border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          Early withdrawal exceptions
        </button>
        <button
          type="button"
          onClick={() => setTab('roth')}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            tab === 'roth' ? 'bg-hero text-white' : 'border border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          Roth conversion vs. holding
        </button>
      </div>

      {tab === 'withdraw' ? <WithdrawalTab /> : <RothTab />}
    </Section>
  )
}
