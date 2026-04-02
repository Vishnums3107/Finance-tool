import { formatCurrency } from '../lib/format'
import type { FinanceInsights } from '../types/finance'

interface InsightsPanelProps {
  insights: FinanceInsights
}

export const InsightsPanel = ({ insights }: InsightsPanelProps) => {
  const comparisonText =
    insights.comparisonPercent === null
      ? 'Not enough historical data for month-over-month comparison'
      : `${insights.comparisonPercent >= 0 ? '+' : ''}${insights.comparisonPercent.toFixed(1)}% vs previous month`

  const comparisonToneLabel =
    insights.comparisonDirection === 'up'
      ? 'Expense increase'
      : insights.comparisonDirection === 'down'
        ? 'Expense decrease'
        : insights.comparisonDirection === 'flat'
          ? 'No change'
          : 'Insufficient history'

  return (
    <div className="insights-list">
      <article className="insight-item">
        <h3>Highest Spending Category</h3>
        <p>{insights.highestCategoryName}</p>
        <small>{formatCurrency(insights.highestCategoryAmount)}</small>
      </article>

      <article className="insight-item">
        <h3>Monthly Expense Comparison</h3>
        <p>
          {insights.currentMonthLabel}: {formatCurrency(insights.currentMonthExpense)}
        </p>
        <small>
          {insights.previousMonthLabel}: {formatCurrency(insights.previousMonthExpense)}
        </small>
        <small className={`trend-pill trend-${insights.comparisonDirection}`}>
          {comparisonToneLabel}
        </small>
        <small>{comparisonText}</small>
      </article>

      <article className="insight-item">
        <h3>Observation</h3>
        <p>{insights.observation}</p>
      </article>
    </div>
  )
}
