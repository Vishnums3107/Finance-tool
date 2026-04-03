import { formatCompactCurrency, formatCount } from '../lib/format'
import type { FinanceSummary } from '../types/finance'
import { AnimatedNumber } from './AnimatedNumber'

interface SummaryCardsProps {
  summary: FinanceSummary
}

export const SummaryCards = ({ summary }: SummaryCardsProps) => {
  const cards = [
    {
      label: 'Total Balance',
      rawValue: summary.balance,
      formattedValue: formatCompactCurrency(summary.balance),
      tone: summary.balance >= 0 ? 'positive' : 'negative',
      hint: 'Net cash position',
      prefix: '$',
      isCurrency: true,
    },
    {
      label: 'Total Income',
      rawValue: summary.income,
      formattedValue: formatCompactCurrency(summary.income),
      tone: 'positive',
      hint: 'Recorded inflows',
      prefix: '$',
      isCurrency: true,
    },
    {
      label: 'Total Expenses',
      rawValue: summary.expenses,
      formattedValue: formatCompactCurrency(summary.expenses),
      tone: 'negative',
      hint: 'Recorded outflows',
      prefix: '$',
      isCurrency: true,
    },
    {
      label: 'Savings Rate',
      rawValue: summary.savingsRate,
      formattedValue: `${summary.savingsRate.toFixed(1)}%`,
      tone: summary.savingsRate >= 0 ? 'positive' : 'negative',
      hint: `${formatCount(summary.transactionCount)} processed entries`,
      prefix: '',
      isCurrency: false,
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
          <p className="summary-value">
            {card.prefix}
            <AnimatedNumber
              value={card.rawValue}
              formatter={(n) =>
                card.isCurrency
                  ? new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      maximumFractionDigits: 1,
                    }).format(n)
                  : `${n.toFixed(1)}%`
              }
            />
          </p>
          <p className="summary-hint">{card.hint}</p>
        </article>
      ))}
    </div>
  )
}

