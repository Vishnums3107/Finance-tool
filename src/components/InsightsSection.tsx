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
        <p>Highest spending category, monthly comparison, and practical observation.</p>
      </div>
      <InsightsPanel insights={insights} />
    </section>
  )
}
