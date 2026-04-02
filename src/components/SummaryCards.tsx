import { formatCompactCurrency, formatCount } from '../lib/format'
import type { FinanceSummary } from '../types/finance'

interface SummaryCardsProps {
  summary: FinanceSummary
}

export const SummaryCards = ({ summary }: SummaryCardsProps) => {
  const cards = [
    {
      label: 'Total Balance',
      value: formatCompactCurrency(summary.balance),
      tone: summary.balance >= 0 ? 'positive' : 'negative',
      hint: 'Net cash position',
    },
    {
      label: 'Total Income',
      value: formatCompactCurrency(summary.income),
      tone: 'positive',
      hint: 'Recorded inflows',
    },
    {
      label: 'Total Expenses',
      value: formatCompactCurrency(summary.expenses),
      tone: 'negative',
      hint: 'Recorded outflows',
    },
    {
      label: 'Savings Rate',
      value: `${summary.savingsRate.toFixed(1)}%`,
      tone: summary.savingsRate >= 0 ? 'positive' : 'negative',
      hint: `${formatCount(summary.transactionCount)} processed entries`,
    },
  ] as const

  return (
    <div className="summary-grid">
      {cards.map((card, index) => (
        <article
          className={`summary-card tone-${card.tone}`}
          key={card.label}
          style={{ animationDelay: `${index * 0.07}s` }}
        >
          <p className="summary-label">{card.label}</p>
          <p className="summary-value">{card.value}</p>
          <p className="summary-hint">{card.hint}</p>
        </article>
      ))}
    </div>
  )
}
