import { formatCount, formatCurrency, formatSignedCurrency } from '../lib/format'
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
        <h3>Financial Snapshot</h3>
        <div className="insight-metrics">
          <div className="insight-metric">
            <span className="insight-metric-label">Income</span>
            <strong className="insight-metric-value">{formatCurrency(insights.income)}</strong>
            <small className="insight-metric-note">Total earned across the selected range</small>
          </div>

          <div className="insight-metric">
            <span className="insight-metric-label">Expenses</span>
            <strong className="insight-metric-value">{formatCurrency(insights.expenses)}</strong>
            <small className="insight-metric-note">Total spent across the selected range</small>
          </div>

          <div className="insight-metric">
            <span className="insight-metric-label">Balance</span>
            <strong
              className={`insight-metric-value ${insights.balance >= 0 ? 'value-positive' : 'value-negative'}`}
            >
              {formatSignedCurrency(insights.balance)}
            </strong>
            <small className="insight-metric-note">Net cash position</small>
          </div>

          <div className="insight-metric">
            <span className="insight-metric-label">Savings Rate</span>
            <strong className="insight-metric-value">{insights.savingsRate.toFixed(1)}%</strong>
            <small className="insight-metric-note">Balance as a share of income</small>
          </div>

          <div className="insight-metric">
            <span className="insight-metric-label">Transactions</span>
            <strong className="insight-metric-value">{formatCount(insights.transactionCount)}</strong>
            <small className="insight-metric-note">Records included in the view</small>
          </div>
        </div>
      </article>

      <article className="insight-item">
        <h3>Monthly Comparison</h3>
        <div className="insight-metrics insight-metrics-two-up">
          <div className="insight-metric">
            <span className="insight-metric-label">{insights.currentMonthLabel}</span>
            <strong
              className={`insight-metric-value ${insights.currentMonthNet >= 0 ? 'value-positive' : 'value-negative'}`}
            >
              {formatSignedCurrency(insights.currentMonthNet)}
            </strong>
            <small className="insight-metric-note">
              Income {formatCurrency(insights.currentMonthIncome)} · Expenses {formatCurrency(insights.currentMonthExpense)}
            </small>
          </div>

          <div className="insight-metric">
            <span className="insight-metric-label">{insights.previousMonthLabel}</span>
            <strong
              className={`insight-metric-value ${insights.previousMonthNet >= 0 ? 'value-positive' : 'value-negative'}`}
            >
              {formatSignedCurrency(insights.previousMonthNet)}
            </strong>
            <small className="insight-metric-note">
              Income {formatCurrency(insights.previousMonthIncome)} · Expenses {formatCurrency(insights.previousMonthExpense)}
            </small>
          </div>
        </div>

        <small className={`trend-pill trend-${insights.comparisonDirection}`}>
          {comparisonToneLabel}
        </small>
        <small>{comparisonText}</small>
      </article>

      <article className="insight-item">
        <h3>Category Concentration</h3>
        <p>Highest category: {insights.highestCategoryName}</p>
        <small>
          {formatCurrency(insights.highestCategoryAmount)} · {insights.highestCategoryShare.toFixed(1)}% of expenses
        </small>

        {insights.topExpenseCategories.length > 0 ? (
          <ul className="insight-ranking" aria-label="Top expense categories">
            {insights.topExpenseCategories.map((category, index) => (
              <li key={category.name} className="insight-ranking-item">
                <div className="insight-ranking-row">
                  <span>
                    {index + 1}. {category.name}
                  </span>
                  <span>
                    {formatCurrency(category.amount)} · {category.share.toFixed(1)}%
                  </span>
                </div>
                <div className="insight-ranking-track" aria-hidden>
                  <span
                    className="insight-ranking-fill"
                    style={{ width: `${Math.max(category.share, 4)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No expense categories to show yet.</p>
        )}
      </article>

      <article className="insight-item">
        <h3>Largest Single Expense</h3>
        <p>{insights.largestExpenseDescription}</p>
        <small>
          {insights.largestExpenseCategory} · {insights.largestExpenseDate}
        </small>
        <strong className="insight-largest-value">{formatCurrency(insights.largestExpenseAmount)}</strong>
      </article>

      <article className="insight-item">
        <h3>Observation</h3>
        <p>{insights.observation}</p>
      </article>
    </div>
  )
}
