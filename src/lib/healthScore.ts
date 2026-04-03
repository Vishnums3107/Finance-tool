import type { FinanceSummary, Transaction } from '../types/finance'

export interface HealthScoreResult {
  score: number               // 0–100
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  label: string
  factors: HealthFactor[]
}

export interface HealthFactor {
  name: string
  score: number               // 0–100
  weight: number
  tip: string
}

/**
 * Computes a composite "Financial Health Score" from 0–100 based on:
 *   1. Savings Rate (30%) — higher savings = healthier
 *   2. Expense Diversity (20%) — spread across categories = less risk
 *   3. Income Consistency (25%) — steady income months
 *   4. Balance Trend (25%) — is the cumulative balance growing?
 */
export function computeHealthScore(
  summary: FinanceSummary,
  transactions: Transaction[],
): HealthScoreResult {
  const factors: HealthFactor[] = []

  // ─── 1. Savings Rate (30%) ────────────────────────────────
  const savingsRateClamped = Math.max(0, Math.min(summary.savingsRate, 100))
  const savingsScore = savingsRateClamped // 0–100 directly
  factors.push({
    name: 'Savings Rate',
    score: Math.round(savingsScore),
    weight: 30,
    tip:
      savingsScore >= 60
        ? 'Excellent savings discipline!'
        : savingsScore >= 30
          ? 'Decent savings — aim for 50%+ for long-term wealth.'
          : 'Low savings rate; review discretionary spending.',
  })

  // ─── 2. Expense Diversity (20%) ───────────────────────────
  const expenseCategories = new Set(
    transactions
      .filter((t) => t.type === 'expense')
      .map((t) => t.category),
  )
  const categoryCount = expenseCategories.size
  // 5+ categories = perfect diversity, 1 = concentrated risk
  const diversityScore = Math.min(100, (categoryCount / 5) * 100)
  factors.push({
    name: 'Expense Diversity',
    score: Math.round(diversityScore),
    weight: 20,
    tip:
      diversityScore >= 80
        ? 'Well-diversified spending across categories.'
        : diversityScore >= 40
          ? 'Moderate diversity — consider spreading spend.'
          : 'Spending is concentrated; diversify to reduce risk.',
  })

  // ─── 3. Income Consistency (25%) ──────────────────────────
  const incomeByMonth = new Map<string, number>()
  transactions
    .filter((t) => t.type === 'income')
    .forEach((t) => {
      const month = t.date.slice(0, 7)
      incomeByMonth.set(month, (incomeByMonth.get(month) ?? 0) + t.amount)
    })
  const incomeMonths = Array.from(incomeByMonth.values())
  let consistencyScore = 0
  if (incomeMonths.length >= 2) {
    const avg = incomeMonths.reduce((a, b) => a + b, 0) / incomeMonths.length
    const variance =
      incomeMonths.reduce((sum, v) => sum + (v - avg) ** 2, 0) / incomeMonths.length
    const cv = avg > 0 ? Math.sqrt(variance) / avg : 1
    // cv of 0 = perfectly consistent (100), cv >= 1 = very inconsistent (0)
    consistencyScore = Math.max(0, Math.min(100, (1 - cv) * 100))
  } else if (incomeMonths.length === 1) {
    consistencyScore = 50 // only one data point — neutral
  }
  factors.push({
    name: 'Income Stability',
    score: Math.round(consistencyScore),
    weight: 25,
    tip:
      consistencyScore >= 70
        ? 'Steady income stream detected.'
        : consistencyScore >= 40
          ? 'Some income fluctuation — build a buffer.'
          : 'Highly variable income; prioritize an emergency fund.',
  })

  // ─── 4. Balance Trend (25%) ───────────────────────────────
  let trendScore = 50 // neutral default
  if (summary.balance > 0 && summary.income > 0) {
    // positive and growing
    trendScore = Math.min(100, 50 + (summary.balance / summary.income) * 50)
  } else if (summary.balance < 0) {
    trendScore = Math.max(0, 50 + (summary.balance / (summary.expenses || 1)) * 50)
  }
  factors.push({
    name: 'Balance Trend',
    score: Math.round(trendScore),
    weight: 25,
    tip:
      trendScore >= 70
        ? 'Balance is trending positively!'
        : trendScore >= 40
          ? 'Balance is flat — look for growth opportunities.'
          : 'Balance declining; cut non-essential expenses.',
  })

  // ─── Composite Score ──────────────────────────────────────
  const totalWeight = factors.reduce((s, f) => s + f.weight, 0)
  const composite =
    factors.reduce((s, f) => s + (f.score * f.weight) / totalWeight, 0)
  const score = Math.round(Math.max(0, Math.min(100, composite)))

  const grade: HealthScoreResult['grade'] =
    score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F'

  const label =
    grade === 'A'
      ? 'Excellent'
      : grade === 'B'
        ? 'Good'
        : grade === 'C'
          ? 'Fair'
          : grade === 'D'
            ? 'Needs Work'
            : 'Critical'

  return { score, grade, label, factors }
}
