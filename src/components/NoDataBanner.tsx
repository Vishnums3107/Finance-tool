import type { UserRole } from '../types/finance'

interface NoDataBannerProps {
  role: UserRole
  onRestoreDemoData: () => void
}

export const NoDataBanner = ({ role, onRestoreDemoData }: NoDataBannerProps) => {
  return (
    <section className="panel no-data-banner reveal delay-1">
      <div>
        <h2>No Transaction Data Available</h2>
        <p>
          Your dashboard is currently empty. Restore sample data to continue exploring
          summaries, charts, and insights.
        </p>
      </div>

      <div className="no-data-actions">
        <button type="button" className="primary-button" onClick={onRestoreDemoData}>
          Restore Demo Data
        </button>
        <p>
          Current role: {role === 'admin' ? 'Admin' : 'Viewer'}
        </p>
      </div>
    </section>
  )
}
