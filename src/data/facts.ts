// Sourced facts about Trump Accounts (created by the "Working Families Tax Cuts"
// provisions of the One Big Beautiful Bill Act, signed July 2025; accounts opened
// starting July 4, 2026). Cited to IRS guidance and financial-press coverage as of
// mid-2026. Rules are new and subject to further Treasury/IRS regulation — verify
// current details before advising clients.

export interface Benefit {
  title: string
  description: string
  tag: string
}

export const benefits: Benefit[] = [
  {
    tag: 'Free money',
    title: '$1,000 federal seed deposit',
    description:
      'U.S.-citizen children born January 1, 2025 – December 31, 2028 with a Social Security number receive an automatic $1,000 deposit from the Treasury — before a family contributes a dollar.',
  },
  {
    tag: 'Tax-deferred growth',
    title: 'No annual tax drag',
    description:
      'Like a traditional IRA, investment gains inside the account are not taxed year to year. Every dollar of return stays invested and keeps compounding instead of leaking to taxes.',
  },
  {
    tag: 'Built-in discipline',
    title: 'Low-cost index investing only',
    description:
      'Funds must sit in low-cost U.S. stock index funds (expense ratio capped at 0.10%, no leverage) — the same diversified, low-fee approach most advisors already recommend, chosen automatically.',
  },
  {
    tag: 'Family + employer funding',
    title: 'Up to $5,000/year from family, $2,500 from employers',
    description:
      'Parents, relatives, and friends can contribute up to $5,000 per year (indexed for inflation after 2027); employers can kick in up to $2,500/year on top — turning it into a benefit employers can offer.',
  },
  {
    tag: 'Automatic conversion',
    title: 'Becomes the child’s own IRA at 18',
    description:
      'No paperwork scramble: the account automatically converts to a traditional IRA owned by the child on January 1 of the year they turn 18, carrying its full balance and tax-deferred status forward.',
  },
  {
    tag: 'Flexible exit ramps',
    title: 'Roth conversion — or penalty-free exceptions',
    description:
      'Once it’s a traditional IRA, the standard playbook opens up: convert to a Roth for tax-free growth, or tap it penalty-free for a first home, education, or a small business.',
  },
]

export interface TimelineEvent {
  age: string
  title: string
  description: string
}

export const timeline: TimelineEvent[] = [
  {
    age: 'Birth',
    title: '$1,000 seed deposit',
    description:
      'A child born 2025–2028 with a Social Security number and U.S. citizenship gets an automatic $1,000 Treasury deposit once an account is opened.',
  },
  {
    age: 'Ages 0–17',
    title: 'Growth period',
    description:
      'Family (up to $5,000/yr) and employers (up to $2,500/yr) can contribute. Funds are locked in low-cost U.S. stock index funds and cannot be withdrawn.',
  },
  {
    age: 'Jan 1, turns 18',
    title: 'Automatic IRA conversion',
    description:
      'The account converts into a traditional IRA owned by the (now adult) child. Standard IRA rules — including RMDs and the 10% early-withdrawal penalty — begin to apply.',
  },
  {
    age: '18–59½',
    title: 'Roth conversion or penalty-free exceptions',
    description:
      'The owner can convert to a Roth IRA (pay tax now, grow tax-free after), or withdraw penalty-free for a first home, higher education, or a small business — ordinary income tax still applies unless it’s a Roth.',
  },
  {
    age: '59½+',
    title: 'Unrestricted, penalty-free access',
    description:
      'Like any traditional or Roth IRA at this stage: no more 10% penalty. Traditional withdrawals are taxed as ordinary income; qualified Roth withdrawals are tax-free.',
  },
]

export interface FAQItem {
  question: string
  answer: string
}

export const faqs: FAQItem[] = [
  {
    question: 'Who is eligible for the $1,000 seed deposit?',
    answer:
      'U.S. citizen children born between January 1, 2025 and December 31, 2028, with a valid Social Security number issued before the account is opened.',
  },
  {
    question: 'Can a child born outside that window still have a Trump Account?',
    answer:
      'Yes — anyone can open a Trump Account for an eligible child and contribute to it; only the $1,000 government seed deposit is limited to children born 2025–2028.',
  },
  {
    question: 'How much can be contributed each year?',
    answer:
      'Up to $5,000 per year combined from parents, family, and other individuals (indexed for inflation starting after 2027), plus up to $2,500 per year from an employer — on top of the one-time $1,000 government seed deposit.',
  },
  {
    question: 'What can the money be invested in?',
    answer:
      'By law, funds must be held in low-cost U.S. stock index funds (expense ratio capped at 0.10%, no leverage or derivatives) during the growth period — similar to a total-market or S&P 500 index fund.',
  },
  {
    question: 'When can the money be touched?',
    answer:
      'Generally not before January 1 of the year the child turns 18. At that point the account automatically becomes a traditional IRA in the child’s name, and standard IRA distribution rules apply.',
  },
  {
    question: 'What happens if money is withdrawn before age 59½?',
    answer:
      'Same as any traditional IRA: ordinary income tax plus a 10% early-withdrawal penalty — unless an exception applies, such as a first-time home purchase (up to $10,000), qualified higher-education expenses, a birth/adoption (up to $5,000), disability, certain medical expenses, or starting a small business.',
  },
  {
    question: 'Can it be converted to a Roth IRA?',
    answer:
      'Yes. Once the account becomes a traditional IRA at 18, the owner can do a Roth conversion like any other traditional IRA — paying ordinary income tax on the converted balance now in exchange for tax-free growth and tax-free qualified withdrawals later.',
  },
  {
    question: 'Is this official tax or investment advice?',
    answer:
      'No. This site is an educational illustration built on publicly reported rules as of mid-2026. Contribution limits, eligibility, and distribution rules are set by statute and IRS guidance that may still evolve — confirm current details with a qualified tax or financial advisor before acting.',
  },
]

export const sources = [
  { label: 'IRS — Working Families Tax Cuts / Trump Accounts guidance', url: 'https://www.irs.gov/newsroom/treasury-irs-issue-guidance-on-trump-accounts-established-under-the-working-families-tax-cuts-notice-announces-upcoming-regulations' },
  { label: 'Congressional Research Service — Trump Accounts: Overview and Policy Considerations', url: 'https://www.congress.gov/crs-product/R48910' },
  { label: 'Fidelity — What are Trump Accounts and how do you open one?', url: 'https://www.fidelity.com/learning-center/personal-finance/trump-accounts' },
  { label: 'Saving for College — Trump Accounts Explained', url: 'https://www.savingforcollege.com/article/trump-account-tax-deferred-savings-children' },
]
