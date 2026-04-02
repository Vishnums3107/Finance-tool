import type {
  CategoryBreakdownPoint,
  FinanceSummary,
  MonthlyTrendPoint,
} from '../types/finance'
import { BalanceTrendChart } from './BalanceTrendChart'
import { CategoryBreakdownChart } from './CategoryBreakdownChart'
import { SummaryCards } from './SummaryCards'

interface DashboardOverviewProps {
  summary: FinanceSummary
  monthlyTrend: MonthlyTrendPoint[]
  categoryBreakdown: CategoryBreakdownPoint[]
}

export const DashboardOverview = ({
  summary,
  monthlyTrend,
  categoryBreakdown,
}: DashboardOverviewProps) => {
  return (
    <section className="panel overview-section reveal delay-1">
      <div className="panel-heading">
        <h2>Dashboard Overview</h2>
        <p>Summary metrics and visual performance indicators.</p>
      </div>

      <SummaryCards summary={summary} />

      <div className="charts-grid overview-charts">
        <article className="chart-card">
          <h3>Balance Trend (Time-Based)</h3>
          <p className="card-caption">Monthly movement across income, expenses, and running balance.</p>
          <BalanceTrendChart data={monthlyTrend} />
        </article>

        <article className="chart-card">
          <h3>Spending Breakdown (Categorical)</h3>
          <p className="card-caption">Expense allocation split by category contribution.</p>
          <CategoryBreakdownChart data={categoryBreakdown} />
        </article>
      </div>
    </section>
  )
}
