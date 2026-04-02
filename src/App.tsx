import { useMemo, useState } from 'react'
import { DashboardOverview } from './components/DashboardOverview'
import { DateRangeSelectorMock } from './components/DateRangeSelectorMock'
import { InsightsSection } from './components/InsightsSection'
import { RoleBasedAccessSection } from './components/RoleBasedAccessSection'
import { TransactionsSection } from './components/TransactionsSection'
import { dateRangePresetLabels, type DateRangePreset } from './lib/dateRange'
import {
  getCategoryBreakdown,
  getFinanceSummary,
  getInsights,
  getMonthlyTrend,
} from './lib/analytics'
import { exportTransactionsCsv } from './lib/export'
import { formatCount } from './lib/format'
import { filterAndSortTransactions, getUniqueCategories, getUniqueMonths } from './lib/transactions'
import { useFinanceStore } from './store/useFinanceStore'

function App() {
  const [reportingRange, setReportingRange] = useState<DateRangePreset>('qtd')

  const role = useFinanceStore((state) => state.role)
  const transactions = useFinanceStore((state) => state.transactions)
  const filters = useFinanceStore((state) => state.filters)
  const editingTransactionId = useFinanceStore((state) => state.editingTransactionId)
  const setRole = useFinanceStore((state) => state.setRole)
  const setFilters = useFinanceStore((state) => state.setFilters)
  const resetFilters = useFinanceStore((state) => state.resetFilters)
  const setEditingTransactionId = useFinanceStore(
    (state) => state.setEditingTransactionId,
  )
  const addTransaction = useFinanceStore((state) => state.addTransaction)
  const updateTransaction = useFinanceStore((state) => state.updateTransaction)

  const filteredTransactions = useMemo(
    () => filterAndSortTransactions(transactions, filters),
    [transactions, filters],
  )

  const summary = useMemo(() => getFinanceSummary(transactions), [transactions])

  const monthlyTrend = useMemo(() => getMonthlyTrend(transactions), [transactions])

  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(transactions),
    [transactions],
  )

  const insights = useMemo(() => getInsights(transactions), [transactions])

  const categories = useMemo(() => getUniqueCategories(transactions), [transactions])
  const months = useMemo(() => getUniqueMonths(transactions), [transactions])

  const editingTransaction = useMemo(
    () =>
      transactions.find((transaction) => transaction.id === editingTransactionId) ??
      null,
    [editingTransactionId, transactions],
  )

  const latestMonth = monthlyTrend[monthlyTrend.length - 1]?.monthLabel ?? 'N/A'
  const canManageTransactions = role === 'admin'

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

              setEditingTransactionId(null)
            }}
            onCancelEdit={() => setEditingTransactionId(null)}
          />

          <InsightsSection insights={insights} />
        </aside>
      </main>
    </div>
  )
}

export default App
