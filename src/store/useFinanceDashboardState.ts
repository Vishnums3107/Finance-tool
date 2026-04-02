import { useMemo } from 'react'
import {
  getCategoryBreakdown,
  getFinanceSummary,
  getInsights,
  getMonthlyTrend,
} from '../lib/analytics'
import {
  filterAndSortTransactions,
  getUniqueCategories,
  getUniqueMonths,
} from '../lib/transactions'
import { useFinanceStore } from './useFinanceStore'

export const useFinanceDashboardState = () => {
  const role = useFinanceStore((state) => state.role)
  const transactions = useFinanceStore((state) => state.transactions)
  const filters = useFinanceStore((state) => state.filters)
  const editingTransactionId = useFinanceStore((state) => state.editingTransactionId)
  const isMockApiLoading = useFinanceStore((state) => state.isMockApiLoading)
  const mockApiError = useFinanceStore((state) => state.mockApiError)

  const setRole = useFinanceStore((state) => state.setRole)
  const setFilters = useFinanceStore((state) => state.setFilters)
  const resetFilters = useFinanceStore((state) => state.resetFilters)
  const setEditingTransactionId = useFinanceStore(
    (state) => state.setEditingTransactionId,
  )
  const clearEditingTransaction = useFinanceStore(
    (state) => state.clearEditingTransaction,
  )
  const addTransaction = useFinanceStore((state) => state.addTransaction)
  const updateTransaction = useFinanceStore((state) => state.updateTransaction)
  const restoreDemoData = useFinanceStore((state) => state.restoreDemoData)
  const loadTransactionsFromMockApi = useFinanceStore(
    (state) => state.loadTransactionsFromMockApi,
  )

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

  const activeFilterCount = useMemo(() => {
    let count = 0

    if (filters.search.trim().length > 0) {
      count += 1
    }

    if (filters.type !== 'all') {
      count += 1
    }

    if (filters.category !== 'all') {
      count += 1
    }

    if (filters.month !== 'all') {
      count += 1
    }

    if (filters.minAmount !== null) {
      count += 1
    }

    if (filters.maxAmount !== null) {
      count += 1
    }

    if (filters.groupBy !== 'none') {
      count += 1
    }

    return count
  }, [filters])

  const canManageTransactions = role === 'admin'

  return {
    role,
    transactions,
    transactionCount: transactions.length,
    filters,
    editingTransaction,
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
  }
}
