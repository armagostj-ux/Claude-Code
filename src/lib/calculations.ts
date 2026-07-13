// Illustrative financial modeling for Trump Account projections.
// Simplifications are intentional (see inline notes) — this is an educational/
// illustrative tool, not tax advice. All figures are hypothetical.

export interface GrowthInputs {
  birthYear: number
  seedAmount: number
  annualContribution: number
  employerContribution: number
  annualReturnRate: number // e.g. 0.07 for 7%
  contributionYears: number // years contributions continue (capped at 18)
  taxableDragRate: number // annual effective tax drag applied to a taxable brokerage's return
  cashReturnRate: number // savings-account style return for the "no investing" baseline
}

export interface YearPoint {
  year: number
  age: number
  trumpAccount: number
  taxableBrokerage: number
  cashSavings: number
  contributions: number
}

const DEFAULT_TAX_DRAG = 0.15 // approximates annual drag from dividends/turnover taxed at LTCG rates
const DEFAULT_CASH_RETURN = 0.02

export const DEFAULT_INPUTS: GrowthInputs = {
  birthYear: new Date().getFullYear(),
  seedAmount: 1000,
  annualContribution: 2500,
  employerContribution: 0,
  annualReturnRate: 0.07,
  contributionYears: 18,
  taxableDragRate: DEFAULT_TAX_DRAG,
  cashReturnRate: DEFAULT_CASH_RETURN,
}

/** Projects all three accounts year-by-year from birth through a target end age. */
export function projectGrowth(inputs: GrowthInputs, endAge: number): YearPoint[] {
  const {
    birthYear,
    seedAmount,
    annualContribution,
    employerContribution,
    annualReturnRate,
    contributionYears,
    taxableDragRate,
    cashReturnRate,
  } = inputs

  const taxableEffectiveRate = annualReturnRate * (1 - taxableDragRate)
  const totalAnnualContribution = annualContribution + employerContribution

  const points: YearPoint[] = []
  let trump = seedAmount
  let taxable = 0 // taxable brokerage gets no free seed money
  let cash = 0
  let contributions = seedAmount

  points.push({ year: birthYear, age: 0, trumpAccount: trump, taxableBrokerage: taxable, cashSavings: cash, contributions })

  for (let age = 1; age <= endAge; age++) {
    const contributing = age <= contributionYears
    const contribution = contributing ? totalAnnualContribution : 0

    trump = trump * (1 + annualReturnRate) + contribution
    taxable = taxable * (1 + taxableEffectiveRate) + contribution
    cash = cash * (1 + cashReturnRate) + contribution
    if (contributing) contributions += contribution

    points.push({
      year: birthYear + age,
      age,
      trumpAccount: trump,
      taxableBrokerage: taxable,
      cashSavings: cash,
      contributions,
    })
  }

  return points
}

export function balanceAtAge(inputs: GrowthInputs, age: number): YearPoint {
  const points = projectGrowth(inputs, age)
  return points[points.length - 1]
}

// --- Life-event scenarios, evaluated on the traditional-IRA balance at age 18+ ---

export interface TaxContext {
  ordinaryRate: number // marginal income tax rate applied to taxable distributions
}

export interface ScenarioResult {
  label: string
  grossAmount: number
  taxOwed: number
  penaltyOwed: number
  netAmount: number
  notes: string
}

const EARLY_WITHDRAWAL_PENALTY = 0.1

/** Standard early withdrawal: ordinary income tax + 10% penalty, no exception applies. */
export function scenarioStandardEarlyWithdrawal(amount: number, tax: TaxContext): ScenarioResult {
  const taxOwed = amount * tax.ordinaryRate
  const penaltyOwed = amount * EARLY_WITHDRAWAL_PENALTY
  return {
    label: 'Withdraw early, no exception',
    grossAmount: amount,
    taxOwed,
    penaltyOwed,
    netAmount: amount - taxOwed - penaltyOwed,
    notes: 'Ordinary income tax plus the 10% early-distribution penalty, same as a traditional IRA taken before 59½.',
  }
}

/** Penalty-free exception (first home, higher education, small business, birth/adoption, etc.). */
export function scenarioExceptionWithdrawal(
  amount: number,
  tax: TaxContext,
  exceptionLabel: string,
  cap?: number,
): ScenarioResult {
  const eligibleAmount = cap ? Math.min(amount, cap) : amount
  const taxOwed = eligibleAmount * tax.ordinaryRate
  return {
    label: `Withdraw for ${exceptionLabel}`,
    grossAmount: eligibleAmount,
    taxOwed,
    penaltyOwed: 0,
    netAmount: eligibleAmount - taxOwed,
    notes: cap
      ? `Ordinary income tax only — the 10% penalty is waived under the IRA exception (capped at $${cap.toLocaleString()}).`
      : 'Ordinary income tax only — the 10% penalty is waived under this IRA exception.',
  }
}

/** Withdraw after 59½: ordinary income tax only, no penalty. */
export function scenarioQualifiedWithdrawal(amount: number, tax: TaxContext): ScenarioResult {
  const taxOwed = amount * tax.ordinaryRate
  return {
    label: 'Withdraw after 59½',
    grossAmount: amount,
    taxOwed,
    penaltyOwed: 0,
    netAmount: amount - taxOwed,
    notes: 'No penalty applies once the account owner is past 59½ — ordinary income tax only, like any traditional IRA.',
  }
}

export interface RothConversionResult {
  balanceConverted: number
  taxOwedNow: number
  netAfterConversionTax: number
  projectedAtRetirement: number
  taxFreeAtWithdrawal: number
}

/**
 * Converts the traditional-IRA balance to a Roth: tax due now on the full balance,
 * then tax-free compounding and tax-free qualified withdrawals thereafter.
 */
export function scenarioRothConversion(
  balance: number,
  conversionTaxRate: number,
  annualReturnRate: number,
  yearsToRetirement: number,
): RothConversionResult {
  const taxOwedNow = balance * conversionTaxRate
  const netAfterConversionTax = balance - taxOwedNow
  const projectedAtRetirement = netAfterConversionTax * Math.pow(1 + annualReturnRate, yearsToRetirement)
  return {
    balanceConverted: balance,
    taxOwedNow,
    netAfterConversionTax,
    projectedAtRetirement,
    taxFreeAtWithdrawal: projectedAtRetirement,
  }
}

/** Same balance, left as a traditional IRA, growing tax-deferred until withdrawal at retirement. */
export function projectTraditionalHold(
  balance: number,
  annualReturnRate: number,
  yearsToRetirement: number,
  ordinaryRateAtRetirement: number,
): { grossAtRetirement: number; taxOwed: number; netAtRetirement: number } {
  const grossAtRetirement = balance * Math.pow(1 + annualReturnRate, yearsToRetirement)
  const taxOwed = grossAtRetirement * ordinaryRateAtRetirement
  return { grossAtRetirement, taxOwed, netAtRetirement: grossAtRetirement - taxOwed }
}

export interface RothPathPoint {
  age: number
  traditionalNet: number
  rothNet: number
}

/**
 * Year-by-year comparison of "stay traditional" vs. "convert to Roth at 18," expressed as
 * spendable (after-tax) value at each age — traditional's eventual tax is applied at every
 * point for comparability, which is an illustrative simplification (real tax is only owed on
 * actual withdrawal).
 */
export function projectRothVsTraditionalPath(
  balance: number,
  conversionTaxRate: number,
  retirementTaxRate: number,
  annualReturnRate: number,
  years: number,
): RothPathPoint[] {
  const points: RothPathPoint[] = []
  let traditionalGross = balance
  let roth = balance * (1 - conversionTaxRate)
  points.push({ age: 18, traditionalNet: traditionalGross * (1 - retirementTaxRate), rothNet: roth })
  for (let i = 1; i <= years; i++) {
    traditionalGross *= 1 + annualReturnRate
    roth *= 1 + annualReturnRate
    points.push({ age: 18 + i, traditionalNet: traditionalGross * (1 - retirementTaxRate), rothNet: roth })
  }
  return points
}

export function formatCurrency(value: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
