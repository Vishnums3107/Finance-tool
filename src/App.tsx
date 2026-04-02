import { useEffect, useMemo, useRef, useState } from 'react'
import { ActionStatusBanner } from './components/ActionStatusBanner'
import { DashboardOverview } from './components/DashboardOverview'
import { DateRangeSelectorMock } from './components/DateRangeSelectorMock'
import { InsightsSection } from './components/InsightsSection'
import { NoDataBanner } from './components/NoDataBanner'
import { RoleBasedAccessSection } from './components/RoleBasedAccessSection'
import { StateManagementSection } from './components/StateManagementSection'
import { ThemeToggle } from './components/ThemeToggle'
import { TransactionsSection } from './components/TransactionsSection'
import {
  dateRangePresetLabels,
  filterByDateRangePreset,
  getLatestTransactionDate,
  type DateRangePreset,
} from './lib/dateRange'
import {
  getCategoryBreakdown,
  getFinanceSummary,
  getInsights,
  getMonthlyTrend,
} from './lib/analytics'
import { exportTransactionsCsv, exportTransactionsJson } from './lib/export'
import { formatCount } from './lib/format'
import { useFinanceDashboardState } from './store/useFinanceDashboardState'
import { useUiPreferencesStore } from './store/useUiPreferencesStore'

function App() {
  const [reportingRange, setReportingRange] = useState<DateRangePreset>('qtd')
  const [actionStatus, setActionStatus] = useState<{
    message: string
    tone: 'info' | 'success' | 'error'
  } | null>(null)
  const statusTimeoutRef = useRef<number | null>(null)

  const {
    role,
    transactions,
    filters,
    editingTransaction,
    transactionCount,
    isMockApiLoading,
    mockApiError,
    filteredTransactions,
    categories,
    months,
    activeFilterCount,
    canManageTransactions,
    setRole,
    setFilters,
    resetFilters,
    setEditingTransactionId,
    clearEditingTransaction,
    addTransaction,
    updateTransaction,
    restoreDemoData,
    loadTransactionsFromMockApi,
  } = useFinanceDashboardState()

  const themeMode = useUiPreferencesStore((state) => state.themeMode)
  const toggleThemeMode = useUiPreferencesStore((state) => state.toggleThemeMode)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode)
  }, [themeMode])

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current !== null) {
        window.clearTimeout(statusTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (transactionCount === 0 && !isMockApiLoading && mockApiError === null) {
      void loadTransactionsFromMockApi()
    }
  }, [
    transactionCount,
    isMockApiLoading,
    mockApiError,
    loadTransactionsFromMockApi,
  ])

  const dateRangeReferenceDate = useMemo(
    () => getLatestTransactionDate(transactions),
    [transactions],
  )

  const rangeTransactions = useMemo(
    () =>
      filterByDateRangePreset(
        transactions,
        reportingRange,
        dateRangeReferenceDate,
      ),
    [transactions, reportingRange, dateRangeReferenceDate],
  )

  const rangeFilteredTransactions = useMemo(
    () =>
      filterByDateRangePreset(
        filteredTransactions,
        reportingRange,
        dateRangeReferenceDate,
      ),
    [filteredTransactions, reportingRange, dateRangeReferenceDate],
  )

  const rangeSummary = useMemo(
    () => getFinanceSummary(rangeTransactions),
    [rangeTransactions],
  )

  const rangeMonthlyTrend = useMemo(
    () => getMonthlyTrend(rangeTransactions),
    [rangeTransactions],
  )

  const rangeCategoryBreakdown = useMemo(
    () => getCategoryBreakdown(rangeTransactions),
    [rangeTransactions],
  )

  const rangeInsights = useMemo(
    () => getInsights(rangeTransactions),
    [rangeTransactions],
  )

  const latestMonth =
    rangeMonthlyTrend[rangeMonthlyTrend.length - 1]?.monthLabel ?? 'N/A'
  const hasNoTransactions = transactionCount === 0
  const mockApiStatus = isMockApiLoading
    ? 'Loading'
    : mockApiError
      ? 'Error'
      : 'Ready'

  const showActionStatus = (
    message: string,
    tone: 'info' | 'success' | 'error',
  ) => {
    if (statusTimeoutRef.current !== null) {
      window.clearTimeout(statusTimeoutRef.current)
    }

    setActionStatus({ message, tone })

    statusTimeoutRef.current = window.setTimeout(() => {
      setActionStatus(null)
      statusTimeoutRef.current = null
    }, 2400)
  }

  const handleCsvExport = () => {
    const exported = exportTransactionsCsv(rangeFilteredTransactions)

    showActionStatus(
      exported ? 'CSV export completed.' : 'No records to export to CSV.',
      exported ? 'success' : 'info',
    )
  }

  const handleJsonExport = () => {
    const exported = exportTransactionsJson(rangeFilteredTransactions)

    showActionStatus(
      exported ? 'JSON export completed.' : 'No records to export to JSON.',
      exported ? 'success' : 'info',
    )
  }

  const handleMockApiSync = async () => {
    const isSuccessful = await loadTransactionsFromMockApi()

    showActionStatus(
      isSuccessful
        ? 'Mock API data synced successfully.'
        : 'Mock API sync failed. Use Restore Demo Data as fallback.',
      isSuccessful ? 'success' : 'error',
    )
  }

  return (
    <div className="app-shell">
      <header className="panel topbar reveal delay-0">
        <div>
          <p className="eyebrow">Business Finance Interface</p>
          <h1>Executive Finance Dashboard</h1>
          <p className="subtitle">
            Monitor cash flow, review spend trends, and support faster decisions.
          </p>
          <div className="topbar-meta">
            <span className="meta-chip">Reporting Month: {latestMonth}</span>
            <span className="meta-chip">Transactions: {formatCount(transactionCount)}</span>
            <span className="meta-chip">
              In Range: {formatCount(rangeTransactions.length)}
            </span>
            <span className="meta-chip">Active Filters: {activeFilterCount}</span>
            <span className="meta-chip">Mock API: {mockApiStatus}</span>
          </div>
          <p className="print-only print-context">
            Export Snapshot: Role {role.toUpperCase()} | Date Range {dateRangePresetLabels[reportingRange]}
          </p>
        </div>

        <div className="topbar-actions screen-only">
          <ThemeToggle themeMode={themeMode} onToggle={toggleThemeMode} />
          <DateRangeSelectorMock
            value={reportingRange}
            onChange={setReportingRange}
          />

          <div className="export-actions">
            <button
              type="button"
              className="primary-button"
              onClick={handleCsvExport}
              disabled={!canManageTransactions || rangeFilteredTransactions.length === 0}
              title={
                canManageTransactions
                  ? 'Export transactions in the current filter and date range to CSV'
                  : 'Viewer mode is read-only. Switch to Admin to export.'
              }
            >
              Export CSV
            </button>

            <button
              type="button"
              className="ghost-button"
              onClick={handleJsonExport}
              disabled={!canManageTransactions || rangeFilteredTransactions.length === 0}
              title={
                canManageTransactions
                  ? 'Export transactions in the current filter and date range to JSON'
                  : 'Viewer mode is read-only. Switch to Admin to export.'
              }
            >
              Export JSON
            </button>

            <button
              type="button"
              className="ghost-button sync-button"
              onClick={() => {
                void handleMockApiSync()
              }}
              disabled={isMockApiLoading}
              title="Refresh transaction dataset from mock API"
            >
              {isMockApiLoading ? 'Syncing...' : 'Sync Mock API'}
            </button>
          </div>
        </div>
      </header>

      {actionStatus && (
        <ActionStatusBanner
          message={actionStatus.message}
          tone={actionStatus.tone}
        />
      )}

      <main className="layout-grid">
        {hasNoTransactions && (
          <NoDataBanner
            role={role}
            isMockApiLoading={isMockApiLoading}
            mockApiError={mockApiError}
            onLoadFromMockApi={() => {
              void handleMockApiSync()
            }}
            onRestoreDemoData={restoreDemoData}
          />
        )}

        <DashboardOverview
          summary={rangeSummary}
          monthlyTrend={rangeMonthlyTrend}
          categoryBreakdown={rangeCategoryBreakdown}
        />

        <TransactionsSection
          role={role}
          filters={filters}
          categories={categories}
          months={months}
          transactions={rangeFilteredTransactions}
          onUpdateFilters={setFilters}
          onResetFilters={resetFilters}
          onEditTransaction={(transactionId) => {
            if (!canManageTransactions) {
              return
            }

            setEditingTransactionId(transactionId)
          }}
        />

        <aside className="side-stack">
          <RoleBasedAccessSection
            role={role}
            categories={categories}
            editingTransaction={editingTransaction}
            onChangeRole={setRole}
            onSubmitTransaction={(draft) => {
              if (!canManageTransactions) {
                return
              }

              if (editingTransaction) {
                updateTransaction(editingTransaction.id, draft)
              } else {
                addTransaction(draft)
              }

              clearEditingTransaction()
            }}
            onCancelEdit={clearEditingTransaction}
          />

          <InsightsSection insights={rangeInsights} />

          <StateManagementSection
            role={role}
            transactionCount={transactionCount}
            activeFilterCount={activeFilterCount}
            filters={filters}
          />
        </aside>
      </main>
    </div>
  )
}

export default App
