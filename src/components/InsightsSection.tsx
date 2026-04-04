import type { FinanceInsights } from '../types/finance'
import { InsightsPanel } from './InsightsPanel'

interface InsightsSectionProps {
  insights: FinanceInsights
}

export const InsightsSection = ({ insights }: InsightsSectionProps) => {
  return (
    <section className="panel reveal delay-5 insights-section">
      <div className="panel-heading">
        <h2>Insights Section</h2>
        <p>Financial snapshot, month-over-month movement, category concentration, and largest expense details.</p>
      </div>
      <InsightsPanel insights={insights} />
    </section>
  )
}
