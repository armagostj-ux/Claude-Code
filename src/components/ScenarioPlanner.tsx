import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Section } from './Section'
import {
  DEFAULT_INPUTS,
  formatCurrency,
  projectGrowth,
  projectRothVsTraditionalPath,
  scenarioExceptionWithdrawal,
  scenarioQualifiedWithdrawal,
  scenarioRothConversion,
  scenarioStandardEarlyWithdrawal,
  type ScenarioResult,
  type TaxContext,
} from '../lib/calculations'

const balanceAt18 = projectGrowth(DEFAULT_INPUTS, 18)[18].trumpAccount

type WithdrawalKey = 'standard' | 'home' | 'education' | 'business' | 'wait'
type ScenarioKey = WithdrawalKey | 'roth'

interface WithdrawalScenario {
  key: WithdrawalKey
  title: string
  blurb: string
  penalized: boolean
  compute: (amount: number, tax: TaxContext) => ScenarioResult
}

const WITHDRAWAL_SCENARIOS: WithdrawalScenario[] = [
  {
    key: 'standard',
    title: 'Early withdrawal, no exception',
    blurb: 'The default outcome before 59½ if nothing else applies.',
    penalized: true,
    compute: (amount, tax) => scenarioStandardEarlyWithdrawal(amount, tax),
  },
  {
    key: 'home',
    title: 'First-time home purchase',
    blurb: 'Penalty-free on up to $10,000.',
    penalized: false,
    compute: (amount, tax) => scenarioExceptionWithdrawal(amount, tax, 'a first home', 10000),
  },
  {
    key: 'education',
    title: 'Higher education',
    blurb: 'Tuition, books, and other qualified costs.',
    penalized: false,
    compute: (amount, tax) => scenarioExceptionWithdrawal(amount, tax, 'higher education'),
  },
  {
    key: 'business',
    title: 'Start a small business',
    blurb: 'Launch or invest in a small business.',
    penalized: false,
    compute: (amount, tax) => scenarioExceptionWithdrawal(amount, tax, 'a small business'),
  },
  {
    key: 'wait',
    title: 'Wait until 59½',
    blurb: 'No exception needed once the penalty window passes.',
    penalized: false,
    compute: (amount, tax) => scenarioQualifiedWithdrawal(amount, tax),
  },
]

const CARD_META: Record<ScenarioKey, { tag: string }> = {
  standard: { tag: 'Penalty applies' },
  home: { tag: 'No penalty' },
  education: { tag: 'No penalty' },
  business: { tag: 'No penalty' },
  wait: { tag: 'No penalty' },
  roth: { tag: 'Long-term play' },
}

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
        className="mt-2 w-full accent-[var(--series-hero)]"
      />
    </label>
  )
}

function ScenarioCard({
  title,
  blurb,
  tag,
  tone,
  active,
  onClick,
}: {
  title: string
  blurb: string
  tag: string
  tone: 'good' | 'critical' | 'accent'
  active: boolean
  onClick: () => void
}) {
  const toneColor = tone === 'good' ? 'var(--status-good)' : tone === 'critical' ? 'var(--status-critical)' : 'var(--series-hero)'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active ? 'border-hero bg-hero/10 shadow-sm' : 'border-border bg-surface-card hover:border-hero/40'
      }`}
    >
      <span
        className="inline-flex items-center gap-1.5 text-xs font-semibold"
        style={{ color: toneColor }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: toneColor }} />
        {tag}
      </span>
      <p className="mt-2 text-sm font-semibold text-text-primary">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-text-secondary">{blurb}</p>
    </button>
  )
}

function StackedBar({
  segments,
}: {
  segments: { label: string; value: number; color: string }[]
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  return (
    <div>
      <div className="flex h-8 w-full overflow-hidden rounded-lg border border-border">
        {segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <div
              key={s.label}
              style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
              title={`${s.label}: ${formatCurrency(s.value)}`}
            />
          ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-text-secondary">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.label}: <span className="tabular-nums font-medium text-text-primary">{formatCurrency(s.value)}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function WithdrawalDetail({ scenario, amount, ordinaryRate }: { scenario: WithdrawalScenario; amount: number; ordinaryRate: number }) {
  const tax: TaxContext = { ordinaryRate }
  const result = useMemo(() => scenario.compute(amount, tax), [scenario, amount, ordinaryRate])

  const baselineScenario = scenario.key === 'standard'
    ? WITHDRAWAL_SCENARIOS.find((s) => s.key === 'wait')!
    : WITHDRAWAL_SCENARIOS.find((s) => s.key === 'standard')!
  const baseline = useMemo(() => baselineScenario.compute(amount, tax), [baselineScenario, amount, ordinaryRate])
  const delta = result.netAmount - baseline.netAmount

  return (
    <div className="rounded-2xl border border-border bg-surface-card p-6">
      <p className="text-sm text-text-secondary">
        Withdrawing <span className="font-semibold text-text-primary">{formatCurrency(amount)}</span> for{' '}
        <span className="font-semibold text-text-primary">{scenario.title.toLowerCase()}</span>:
      </p>

      <div className="mt-5">
        <StackedBar
          segments={[
            { label: 'Kept', value: result.netAmount, color: scenario.penalized ? 'var(--series-context-1)' : 'var(--status-good)' },
            { label: 'Ordinary tax', value: result.taxOwed, color: 'var(--series-context-2)' },
            { label: '10% penalty', value: result.penaltyOwed, color: 'var(--status-critical)' },
          ]}
        />
      </div>

      <div
        className="mt-6 flex items-center gap-3 rounded-xl border p-4"
        style={{
          borderColor: delta >= 0 ? 'var(--status-good)' : 'var(--status-critical)',
          background: delta >= 0 ? 'var(--status-good-bg)' : 'var(--status-critical-bg)',
        }}
      >
        <span
          className="tabular-nums text-lg font-semibold"
          style={{ color: delta >= 0 ? 'var(--status-good)' : 'var(--status-critical)' }}
        >
          {delta >= 0 ? '+' : ''}{formatCurrency(delta)}
        </span>
        <span className="text-sm text-text-secondary">
          {delta >= 0
            ? `more kept than "${baselineScenario.title}" — the default if this exception didn't apply.`
            : `less than "${baselineScenario.title}" would keep. This is the cost of withdrawing without qualifying for an exception.`}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary">{result.notes}</p>
    </div>
  )
}

function RothDetail({
  conversionRate,
  retirementRate,
  returnRate,
  years,
}: {
  conversionRate: number
  retirementRate: number
  returnRate: number
  years: number
}) {
  const path = useMemo(
    () => projectRothVsTraditionalPath(balanceAt18, conversionRate, retirementRate, returnRate, years),
    [conversionRate, retirementRate, returnRate, years],
  )
  const conversion = useMemo(
    () => scenarioRothConversion(balanceAt18, conversionRate, returnRate, years),
    [conversionRate, returnRate, years],
  )
  const last = path[path.length - 1]
  const delta = last.rothNet - last.traditionalNet

  return (
    <div className="rounded-2xl border border-border bg-surface-card p-6">
      <p className="text-sm text-text-secondary">
        Starting from a <span className="font-semibold text-text-primary">{formatCurrency(balanceAt18, { compact: true })}</span>{' '}
        balance at 18, converting to a Roth costs{' '}
        <span className="font-semibold text-text-primary">{formatCurrency(conversion.taxOwedNow, { compact: true })}</span> in tax
        today — then grows completely tax-free.
      </p>

      <div className="mt-4">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={path} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--gridline)" />
            <XAxis
              dataKey="age"
              tickLine={false}
              axisLine={{ stroke: 'var(--baseline)' }}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              interval={Math.max(0, Math.floor(years / 8))}
              label={{ value: 'Age', position: 'insideBottom', offset: -4, fill: 'var(--text-muted)', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              tickFormatter={(v) => formatCurrency(v, { compact: true })}
              width={64}
            />
            <Tooltip
              formatter={(value: unknown, name: unknown) => [formatCurrency(value as number), name as string]}
              labelFormatter={(age) => `Age ${age}`}
              contentStyle={{
                background: 'var(--surface-card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="traditionalNet"
              name="Stay traditional (after eventual tax)"
              stroke="var(--series-context-1)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="rothNet"
              name="Convert to Roth (tax-free)"
              stroke="var(--series-hero)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: 'var(--series-hero)' }} /> Convert to Roth
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: 'var(--series-context-1)' }} /> Stay traditional
          </span>
        </div>
      </div>

      <div
        className="mt-6 flex items-center gap-3 rounded-xl border p-4"
        style={{
          borderColor: delta >= 0 ? 'var(--status-good)' : 'var(--status-critical)',
          background: delta >= 0 ? 'var(--status-good-bg)' : 'var(--status-critical-bg)',
        }}
      >
        <span
          className="tabular-nums text-lg font-semibold"
          style={{ color: delta >= 0 ? 'var(--status-good)' : 'var(--status-critical)' }}
        >
          {delta >= 0 ? '+' : ''}{formatCurrency(delta, { compact: true })}
        </span>
        <span className="text-sm text-text-secondary">
          {delta >= 0
            ? `more spendable value at age ${last.age} by converting now instead of staying traditional.`
            : `less spendable value at age ${last.age} — at these tax rates, staying traditional wins out.`}
        </span>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        Illustrative: the "stay traditional" line applies the retirement tax rate at every point for
        comparability, though tax is only actually owed when money is withdrawn.
      </p>
    </div>
  )
}

export function ScenarioPlanner() {
  const [selected, setSelected] = useState<ScenarioKey>('home')
  const [amount, setAmount] = useState(10000)
  const [ordinaryRate, setOrdinaryRate] = useState(0.22)
  const [conversionRate, setConversionRate] = useState(0.22)
  const [retirementRate, setRetirementRate] = useState(0.24)
  const [returnRate, setReturnRate] = useState(0.07)
  const [yearsToRetirement, setYearsToRetirement] = useState(47)

  const selectedWithdrawal = WITHDRAWAL_SCENARIOS.find((s) => s.key === selected)

  return (
    <Section
      id="plan-ahead"
      eyebrow="Plan ahead"
      title="Click a scenario to see how it plays out"
      description="Once the account becomes a traditional IRA at 18, the family faces real choices. Pick one below to see a worked example."
      tone="muted"
    >
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WITHDRAWAL_SCENARIOS.map((s) => (
          <ScenarioCard
            key={s.key}
            title={s.title}
            blurb={s.blurb}
            tag={CARD_META[s.key].tag}
            tone={s.penalized ? 'critical' : 'good'}
            active={selected === s.key}
            onClick={() => setSelected(s.key)}
          />
        ))}
        <ScenarioCard
          title="Convert to a Roth IRA at 18"
          blurb="Pay tax now, grow and withdraw tax-free forever after."
          tag={CARD_META.roth.tag}
          tone="accent"
          active={selected === 'roth'}
          onClick={() => setSelected('roth')}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="space-y-6 rounded-2xl border border-border bg-surface-card p-6">
          {selected === 'roth' ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
          <p className="border-t border-border pt-4 text-xs leading-relaxed text-text-muted">
            {selected === 'roth'
              ? 'A Roth conversion means paying ordinary income tax on the balance today — often while the child is in a low tax bracket — in exchange for tax-free growth later.'
              : 'Once the account becomes a traditional IRA at 18, a withdrawal before 59½ owes ordinary income tax plus a 10% penalty — unless it qualifies for an IRA exception.'}
          </p>
        </div>

        {selected === 'roth' || !selectedWithdrawal ? (
          <RothDetail conversionRate={conversionRate} retirementRate={retirementRate} returnRate={returnRate} years={yearsToRetirement} />
        ) : (
          <WithdrawalDetail scenario={selectedWithdrawal} amount={amount} ordinaryRate={ordinaryRate} />
        )}
      </div>
    </Section>
  )
}
