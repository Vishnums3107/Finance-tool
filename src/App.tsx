import { useState } from 'react'
import { DashboardOverview } from './components/DashboardOverview'
import { DateRangeSelectorMock } from './components/DateRangeSelectorMock'
import { InsightsSection } from './components/InsightsSection'
import { RoleBasedAccessSection } from './components/RoleBasedAccessSection'
import { StateManagementSection } from './components/StateManagementSection'
import { TransactionsSection } from './components/TransactionsSection'
import { dateRangePresetLabels, type DateRangePreset } from './lib/dateRange'
import { exportTransactionsCsv } from './lib/export'
import { formatCount } from './lib/format'
import { useFinanceDashboardState } from './store/useFinanceDashboardState'

function App() {
  const [reportingRange, setReportingRange] = useState<DateRangePreset>('qtd')

  const {
    role,
    filters,
    editingTransaction,
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
  } = useFinanceDashboardState()

  const latestMonth = monthlyTrend[monthlyTrend.length - 1]?.monthLabel ?? 'N/A'

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
            <span className="meta-chip">Transactions: {formatCount(summary.transactionCount)}</span>
            <span className="meta-chip">Active Filters: {activeFilterCount}</span>
          </div>
          <p className="print-only print-context">
            Export Snapshot: Role {role.toUpperCase()} | Date Range {dateRangePresetLabels[reportingRange]}
          </p>
        </div>

        <div className="topbar-actions screen-only">
          <DateRangeSelectorMock
            value={reportingRange}
            onChange={setReportingRange}
          />
          <button
            type="button"
            className="primary-button"
            onClick={() => exportTransactionsCsv(filteredTransactions)}
            disabled={!canManageTransactions || filteredTransactions.length === 0}
            title={
              canManageTransactions
                ? 'Export filtered transactions'
                : 'Viewer mode is read-only. Switch to Admin to export.'
            }
          >
            Export Filtered CSV
          </button>
        </div>
      </header>

      <main className="layout-grid">
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
            transactionCount={summary.transactionCount}
            activeFilterCount={activeFilterCount}
            filters={filters}
          />
        </aside>
      </main>
    </div>
  )
}

export default App
