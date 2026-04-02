import type { UserRole } from '../types/finance'

interface NoDataBannerProps {
  role: UserRole
  isMockApiLoading: boolean
  mockApiError: string | null
  onLoadFromMockApi: () => void
  onRestoreDemoData: () => void
}

export const NoDataBanner = ({
  role,
  isMockApiLoading,
  mockApiError,
  onLoadFromMockApi,
  onRestoreDemoData,
}: NoDataBannerProps) => {
  const title = isMockApiLoading
    ? 'Loading Data from Mock API'
    : mockApiError
      ? 'Mock API Load Failed'
      : 'No Transaction Data Available'

  const description = isMockApiLoading
    ? 'Please wait while mock transactions are being loaded for this dashboard.'
    : mockApiError
      ? mockApiError
      : 'Your dashboard is currently empty. Load mock data or restore sample data to continue exploring summaries, charts, and insights.'

  return (
    <section className="panel no-data-banner reveal delay-1">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="no-data-actions">
        <button
          type="button"
          className="primary-button"
          onClick={onLoadFromMockApi}
          disabled={isMockApiLoading}
        >
          {isMockApiLoading ? 'Loading...' : 'Load Mock API Data'}
        </button>
        <button
          type="button"
          className="ghost-button"
          onClick={onRestoreDemoData}
          disabled={isMockApiLoading}
        >
          Restore Demo Data
        </button>
        <p>
          Current role: {role === 'admin' ? 'Admin' : 'Viewer'}
        </p>
      </div>
    </section>
  )
}
