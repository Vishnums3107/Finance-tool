import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react'
import { ActionStatusBanner } from './components/ActionStatusBanner'
import { DateRangeSelectorMock } from './components/DateRangeSelectorMock'
import { FinancialHealthGauge } from './components/FinancialHealthGauge'
import { InsightsSection } from './components/InsightsSection'
import { NoDataBanner } from './components/NoDataBanner'
import { RoleStatusPanel } from './components/RoleStatusPanel'
import { RoleSwitcher } from './components/RoleSwitcher'
import { StateManagementSection } from './components/StateManagementSection'
import { ThemeToggle } from './components/ThemeToggle'
import { TransactionFormPanel } from './components/TransactionFormPanel'

// Lazy-loaded heavy components (contains charts and huge tables)
const DashboardOverview = lazy(() => import('./components/DashboardOverview').then((mod) => ({ default: mod.DashboardOverview })))
const TransactionsSection = lazy(() => import('./components/TransactionsSection').then((mod) => ({ default: mod.TransactionsSection })))
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
import { computeHealthScore } from './lib/healthScore'
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
    deleteTransaction,
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

  const rangeHealthScore = useMemo(
    () => computeHealthScore(rangeSummary, rangeTransactions),
    [rangeSummary, rangeTransactions],
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
          <div className="topbar-controls-row" style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <RoleSwitcher role={role} onChangeRole={setRole} />
            <ThemeToggle themeMode={themeMode} onToggle={toggleThemeMode} />
            <DateRangeSelectorMock
              value={reportingRange}
              onChange={setReportingRange}
            />
          </div>

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

      <main className="layout-stack">
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

        {/* 1. Top Level Metrics (Full Width) */}
        <Suspense fallback={<div className="panel" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading metrics...</div>}>
          <DashboardOverview
            summary={rangeSummary}
            monthlyTrend={rangeMonthlyTrend}
            categoryBreakdown={rangeCategoryBreakdown}
          />
        </Suspense>

        {/* 2. Middle Contextual Split (Insights + Role + Form) */}
        <div className="context-split">
          <InsightsSection insights={rangeInsights} />

          <RoleStatusPanel role={role} />

          <TransactionFormPanel
            role={role}
            categories={categories}
            editingTransaction={editingTransaction}
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

          <FinancialHealthGauge healthScore={rangeHealthScore} />
        </div>

        {/* 3. Deep Data Table (Full Width for max readability) */}
        <Suspense fallback={<div className="panel" style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading transaction data...</div>}>
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
            onDeleteTransaction={(transactionId) => {
              if (!canManageTransactions) {
                return
              }

              deleteTransaction(transactionId)
              showActionStatus('Transaction deleted.', 'success')
            }}
          />
        </Suspense>

        {/* 4. Footer Debug Area */}
        <div className="footer-debug">
          <StateManagementSection
            role={role}
            transactionCount={transactionCount}
            activeFilterCount={activeFilterCount}
            filters={filters}
          />
        </div>
      </main>
    </div>
  )
}

export default App
