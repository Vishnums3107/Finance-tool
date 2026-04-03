import { useMemo } from 'react'
import { formatCurrency } from '../lib/format'
import { getGroupedTransactionSummaries } from '../lib/transactions'
import type {
  Transaction,
  TransactionFilters,
  UserRole,
} from '../types/finance'
import { TransactionFiltersBar } from './TransactionFilters'
import { TransactionTable } from './TransactionTable'

interface TransactionsSectionProps {
  role: UserRole
  filters: TransactionFilters
  categories: string[]
  months: string[]
  transactions: Transaction[]
  onUpdateFilters: (nextFilters: Partial<TransactionFilters>) => void
  onResetFilters: () => void
  onEditTransaction: (transactionId: string) => void
  onDeleteTransaction: (transactionId: string) => void
}

export const TransactionsSection = ({
  role,
  filters,
  categories,
  months,
  transactions,
  onUpdateFilters,
  onResetFilters,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionsSectionProps) => {
  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.month !== 'all' ||
    filters.minAmount !== null ||
    filters.maxAmount !== null ||
    filters.groupBy !== 'none'

  const groupedSummaries = useMemo(
    () => getGroupedTransactionSummaries(transactions, filters.groupBy),
    [transactions, filters.groupBy],
  )

  return (
    <section className="panel transactions-panel reveal delay-2">
      <div className="panel-heading">
        <h2>Transactions Section</h2>
        <p>Date, amount, category, and type with filtering, sorting, and search.</p>
      </div>

      <p className="transactions-meta">
        {hasActiveFilters
          ? `Filtered view: ${transactions.length} matching record${
              transactions.length === 1 ? '' : 's'
            }.`
          : `Full view: ${transactions.length} total record${
              transactions.length === 1 ? '' : 's'
            }.`}
      </p>

      <p className="transactions-meta role-context">
        Mode: {role === 'admin' ? 'Admin (edit enabled)' : 'Viewer (read-only)'}
      </p>

      <TransactionFiltersBar
        filters={filters}
        categories={categories}
        months={months}
        onUpdateFilters={onUpdateFilters}
        onReset={onResetFilters}
      />

      {groupedSummaries.length > 0 && (
        <div className="grouping-grid" aria-label="Grouped transaction summaries">
          {groupedSummaries.map((summary) => (
            <article key={summary.groupKey} className="grouping-card">
              <h3>{summary.label}</h3>
              <p>{summary.count} transactions</p>
              <small>Income: {formatCurrency(summary.income)}</small>
              <small>Expenses: {formatCurrency(summary.expenses)}</small>
              <small>Net: {formatCurrency(summary.net)}</small>
            </article>
          ))}
        </div>
      )}

      <TransactionTable
        role={role}
        transactions={transactions}
        onEditTransaction={onEditTransaction}
        onDeleteTransaction={onDeleteTransaction}
      />
    </section>
  )
}
