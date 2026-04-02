import { useEffect, useState } from 'react'
import { DashboardOverview } from './components/DashboardOverview'
import { DateRangeSelectorMock } from './components/DateRangeSelectorMock'
import { InsightsSection } from './components/InsightsSection'
import { NoDataBanner } from './components/NoDataBanner'
import { RoleBasedAccessSection } from './components/RoleBasedAccessSection'
import { StateManagementSection } from './components/StateManagementSection'
import { ThemeToggle } from './components/ThemeToggle'
import { TransactionsSection } from './components/TransactionsSection'
import { dateRangePresetLabels, type DateRangePreset } from './lib/dateRange'
import { exportTransactionsCsv, exportTransactionsJson } from './lib/export'
import { formatCount } from './lib/format'
import { useFinanceDashboardState } from './store/useFinanceDashboardState'
import { useUiPreferencesStore } from './store/useUiPreferencesStore'

function App() {
  const [reportingRange, setReportingRange] = useState<DateRangePreset>('qtd')

  const {
    role,
    filters,
    editingTransaction,
    transactionCount,
    isMockApiLoading,
    mockApiError,
    filteredTransactions,
    summary,
    monthlyTrend,
    categoryBreakdown,
    insights,
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
    if (transactionCount === 0 && !isMockApiLoading && mockApiError === null) {
      void loadTransactionsFromMockApi()
    }
  }, [
    transactionCount,
    isMockApiLoading,
    mockApiError,
    loadTransactionsFromMockApi,
  ])

  const latestMonth = monthlyTrend[monthlyTrend.length - 1]?.monthLabel ?? 'N/A'
  const hasNoTransactions = transactionCount === 0
  const mockApiStatus = isMockApiLoading
    ? 'Loading'
    : mockApiError
      ? 'Error'
      : 'Ready'

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
              onClick={() => exportTransactionsCsv(filteredTransactions)}
              disabled={!canManageTransactions || filteredTransactions.length === 0}
              title={
                canManageTransactions
                  ? 'Export filtered transactions to CSV'
                  : 'Viewer mode is read-only. Switch to Admin to export.'
              }
            >
              Export CSV
            </button>

            <button
              type="button"
              className="ghost-button"
              onClick={() => exportTransactionsJson(filteredTransactions)}
              disabled={!canManageTransactions || filteredTransactions.length === 0}
              title={
                canManageTransactions
                  ? 'Export filtered transactions to JSON'
                  : 'Viewer mode is read-only. Switch to Admin to export.'
              }
            >
              Export JSON
            </button>
          </div>
        </div>
      </header>

      <main className="layout-grid">
        {hasNoTransactions && (
          <NoDataBanner
            role={role}
            isMockApiLoading={isMockApiLoading}
            mockApiError={mockApiError}
            onLoadFromMockApi={() => {
              void loadTransactionsFromMockApi()
            }}
            onRestoreDemoData={restoreDemoData}
          />
        )}

        <DashboardOverview
          summary={summary}
          monthlyTrend={monthlyTrend}
          categoryBreakdown={categoryBreakdown}
        />

        <TransactionsSection
          role={role}
          filters={filters}
          categories={categories}
          months={months}
          transactions={filteredTransactions}
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

          <InsightsSection insights={insights} />

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
