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

type Path = 'withdraw' | 'invest'
type ReasonKey = 'standard' | 'home' | 'education' | 'business' | 'wait'

interface Reason {
  key: ReasonKey
  label: string
  blurb: string
  penalized: boolean
  compute: (amount: number, tax: TaxContext) => ScenarioResult
}

const REASONS: Reason[] = [
  {
    key: 'standard',
    label: 'No exception',
    blurb: 'The default before 59½ if none of the exceptions below apply: ordinary income tax plus a 10% penalty.',
    penalized: true,
    compute: (amount, tax) => scenarioStandardEarlyWithdrawal(amount, tax),
  },
  {
    key: 'home',
    label: 'First-time home',
    blurb: 'Penalty-free on up to $10,000 toward a first home purchase.',
    penalized: false,
    compute: (amount, tax) => scenarioExceptionWithdrawal(amount, tax, 'a first home', 10000),
  },
  {
    key: 'education',
    label: 'Education',
    blurb: 'Penalty-free for qualified higher-education expenses — tuition, books, and similar costs.',
    penalized: false,
    compute: (amount, tax) => scenarioExceptionWithdrawal(amount, tax, 'higher education'),
  },
  {
    key: 'business',
    label: 'Small business',
    blurb: 'Penalty-free to launch or invest in a small business.',
    penalized: false,
    compute: (amount, tax) => scenarioExceptionWithdrawal(amount, tax, 'a small business'),
  },
  {
    key: 'wait',
    label: 'After 59½',
    blurb: "No exception needed — the 10% penalty only ever applied before 59½, so it's simply gone.",
    penalized: false,
    compute: (amount, tax) => scenarioQualifiedWithdrawal(amount, tax),
  },
]

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

function PillGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[]
  value: T
  onChange: (key: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className="rounded-full px-4 py-2 text-sm font-medium transition"
          style={
            value === opt.key
              ? { background: 'var(--cta-bg)', color: 'var(--cta-fg)' }
              : { background: 'var(--surface-2)', color: 'var(--text-secondary)' }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function StackedBar({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-2">
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
  )
}

function WithdrawPanel({ amount, ordinaryRate }: { amount: number; ordinaryRate: number }) {
  const [reasonKey, setReasonKey] = useState<ReasonKey>('home')
  const reason = REASONS.find((r) => r.key === reasonKey)!
  const tax: TaxContext = { ordinaryRate }

  const result = useMemo(() => reason.compute(amount, tax), [reason, amount, ordinaryRate])
  const baselineReason = reasonKey === 'standard' ? REASONS.find((r) => r.key === 'wait')! : REASONS.find((r) => r.key === 'standard')!
  const baseline = useMemo(() => baselineReason.compute(amount, tax), [baselineReason, amount, ordinaryRate])
  const delta = result.netAmount - baseline.netAmount

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-text-primary">Why are you withdrawing?</p>
        <PillGroup options={REASONS.map((r) => ({ key: r.key, label: r.label }))} value={reasonKey} onChange={setReasonKey} />
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{reason.blurb}</p>
      </div>

      <div className="rounded-3xl bg-surface-card p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
          Withdrawing {formatCurrency(amount)} · {reason.label.toLowerCase()}
        </p>
        <p className="font-display mt-2 text-4xl text-text-primary">{formatCurrency(result.netAmount)}</p>
        <p className="mt-1 text-sm text-text-secondary">
          you keep — {formatCurrency(result.taxOwed)} to income tax
          {result.penaltyOwed > 0 && <> and {formatCurrency(result.penaltyOwed)} to the 10% penalty</>}.
        </p>

        <div className="mt-4">
          <StackedBar
            segments={[
              { label: 'Kept', value: result.netAmount, color: reason.penalized ? 'var(--series-context-1)' : 'var(--status-good)' },
              { label: 'Income tax', value: result.taxOwed, color: 'var(--series-context-2)' },
              { label: '10% penalty', value: result.penaltyOwed, color: 'var(--status-critical)' },
            ]}
          />
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: reason.penalized ? 'var(--series-context-1)' : 'var(--status-good)' }} /> Kept
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: 'var(--series-context-2)' }} /> Income tax
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: 'var(--status-critical)' }} /> 10% penalty
            </span>
          </div>
        </div>

        <div
          className="mt-5 rounded-2xl p-4 text-sm"
          style={{ background: delta >= 0 ? 'var(--status-good-bg)' : 'var(--status-critical-bg)' }}
        >
          <span className="font-semibold" style={{ color: delta >= 0 ? 'var(--status-good)' : 'var(--status-critical)' }}>
            {delta >= 0 ? '+' : ''}{formatCurrency(delta)}
          </span>{' '}
          <span className="text-text-secondary">
            {delta >= 0
              ? `compared to withdrawing with "${baselineReason.label}" instead.`
              : `less than "${baselineReason.label}" would have kept — the cost of withdrawing without an exception.`}
          </span>
        </div>
      </div>
    </div>
  )
}

function InvestPanel({
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
  const rothWins = last.rothNet >= last.traditionalNet
  const delta = Math.abs(last.rothNet - last.traditionalNet)

  return (
    <div className="rounded-3xl bg-surface-card p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
        Spendable value at age {last.age}, starting from {formatCurrency(balanceAt18, { compact: true })} at 18
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl p-4" style={{ background: !rothWins ? 'var(--status-good-bg)' : 'var(--surface-2)' }}>
          <p className="text-sm text-text-secondary">Stay traditional</p>
          <p className="font-display mt-1 text-2xl text-text-primary">{formatCurrency(last.traditionalNet, { compact: true })}</p>
          {!rothWins && <p className="mt-1 text-xs font-semibold" style={{ color: 'var(--status-good)' }}>Wins by {formatCurrency(delta, { compact: true })}</p>}
        </div>
        <div className="rounded-2xl p-4" style={{ background: rothWins ? 'var(--status-good-bg)' : 'var(--surface-2)' }}>
          <p className="text-sm text-text-secondary">Convert to Roth at 18</p>
          <p className="font-display mt-1 text-2xl text-text-primary">{formatCurrency(last.rothNet, { compact: true })}</p>
          {rothWins && <p className="mt-1 text-xs font-semibold" style={{ color: 'var(--status-good)' }}>Wins by {formatCurrency(delta, { compact: true })}</p>}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        Converting costs {formatCurrency(conversion.taxOwedNow, { compact: true })} in tax today — often while the child
        is in a low bracket — in exchange for tax-free growth for the next {years} years.
      </p>

      <div className="mt-5">
        <ResponsiveContainer width="100%" height={220}>
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
              name="Stay traditional"
              stroke="var(--series-context-1)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="rothNet"
              name="Convert to Roth"
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

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        Illustrative: the "stay traditional" figure applies the retirement tax rate throughout for
        comparability, though tax is only actually owed when the money is withdrawn.
      </p>
    </div>
  )
}

export function ScenarioPlanner() {
  const [path, setPath] = useState<Path>('withdraw')
  const [amount, setAmount] = useState(10000)
  const [ordinaryRate, setOrdinaryRate] = useState(0.22)
  const [conversionRate, setConversionRate] = useState(0.22)
  const [retirementRate, setRetirementRate] = useState(0.24)
  const [returnRate, setReturnRate] = useState(0.07)
  const [yearsToRetirement, setYearsToRetirement] = useState(47)

  return (
    <Section
      id="plan-ahead"
      eyebrow="Plan ahead"
      title="What happens when the money becomes available?"
      description="At 18 the account becomes a traditional IRA. From there, the family has two basic choices — pull money out, or leave it invested. Pick one to see the numbers."
      tone="muted"
    >
      <div className="mb-8 flex justify-center">
        <PillGroup
          options={[
            { key: 'withdraw', label: 'Withdraw money' },
            { key: 'invest', label: 'Leave it invested' },
          ]}
          value={path}
          onChange={setPath}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="space-y-6 rounded-3xl bg-surface-card p-6">
          {path === 'withdraw' ? (
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
              <p className="border-t border-border pt-4 text-xs leading-relaxed text-text-muted">
                Before 59½, a withdrawal owes ordinary income tax plus a 10% penalty — unless it
                qualifies for an exception.
              </p>
            </>
          ) : (
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
              <p className="border-t border-border pt-4 text-xs leading-relaxed text-text-muted">
                A Roth conversion means paying tax on the balance today in exchange for tax-free
                growth and tax-free withdrawals later.
              </p>
            </>
          )}
        </div>

        {path === 'withdraw' ? (
          <WithdrawPanel amount={amount} ordinaryRate={ordinaryRate} />
        ) : (
          <InvestPanel conversionRate={conversionRate} retirementRate={retirementRate} returnRate={returnRate} years={yearsToRetirement} />
        )}
      </div>
    </Section>
  )
}
