import { formatMonthLabel, getMonthKey, normalizeSearch } from './format'
import type {
  Transaction,
  TransactionFilters,
  TransactionGroupBy,
  TransactionGroupSummary,
} from '../types/finance'

const asSignedAmount = (transaction: Transaction) =>
  transaction.type === 'income' ? transaction.amount : -transaction.amount

export const filterAndSortTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters,
) => {
  const search = normalizeSearch(filters.search)

  let normalizedMinAmount = filters.minAmount
  let normalizedMaxAmount = filters.maxAmount

  if (filters.minAmount !== null && filters.maxAmount !== null) {
    normalizedMinAmount = Math.min(filters.minAmount, filters.maxAmount)
    normalizedMaxAmount = Math.max(filters.minAmount, filters.maxAmount)
  }

  const filtered = transactions.filter((transaction) => {
    const searchMatch =
      search.length === 0 ||
      normalizeSearch(transaction.description).includes(search) ||
      normalizeSearch(transaction.category).includes(search)

    const typeMatch =
      filters.type === 'all' || transaction.type === filters.type

    const categoryMatch =
      filters.category === 'all' || transaction.category === filters.category

    const monthMatch =
      filters.month === 'all' || getMonthKey(transaction.date) === filters.month

    const minAmountMatch =
      normalizedMinAmount === null || transaction.amount >= normalizedMinAmount

    const maxAmountMatch =
      normalizedMaxAmount === null || transaction.amount <= normalizedMaxAmount

    return (
      searchMatch &&
      typeMatch &&
      categoryMatch &&
      monthMatch &&
      minAmountMatch &&
      maxAmountMatch
    )
  })

  const sorted = filtered.sort((a, b) => {
    let result = 0

    if (filters.sortBy === 'date') {
      result = a.date.localeCompare(b.date)
    }

    if (filters.sortBy === 'amount') {
      result = asSignedAmount(a) - asSignedAmount(b)
    }

    if (filters.sortBy === 'category') {
      result = a.category.localeCompare(b.category)
    }

    if (filters.sortBy === 'description') {
      result = a.description.localeCompare(b.description)
    }

    if (filters.sortBy === 'type') {
      result = a.type.localeCompare(b.type)
    }

    return filters.sortDir === 'asc' ? result : result * -1
  })

  return sorted
}

export const getGroupedTransactionSummaries = (
  transactions: Transaction[],
  groupBy: TransactionGroupBy,
): TransactionGroupSummary[] => {
  if (groupBy === 'none') {
    return []
  }

  const grouped = new Map<
    string,
    {
      label: string
      count: number
      income: number
      expenses: number
    }
  >()

  transactions.forEach((transaction) => {
    let groupKey = ''
    let label = ''

    if (groupBy === 'category') {
      groupKey = transaction.category
      label = transaction.category
    }

    if (groupBy === 'type') {
      groupKey = transaction.type
      label = transaction.type === 'income' ? 'Income' : 'Expense'
    }

    if (groupBy === 'month') {
      groupKey = getMonthKey(transaction.date)
      label = formatMonthLabel(groupKey)
    }

    const existing = grouped.get(groupKey) ?? {
      label,
      count: 0,
      income: 0,
      expenses: 0,
    }

    existing.count += 1

    if (transaction.type === 'income') {
      existing.income += transaction.amount
    } else {
      existing.expenses += transaction.amount
    }

    grouped.set(groupKey, existing)
  })

  const summaries = Array.from(grouped.entries()).map(([groupKey, value]) => ({
    groupKey,
    label: value.label,
    count: value.count,
    income: value.income,
    expenses: value.expenses,
    net: value.income - value.expenses,
  }))

  if (groupBy === 'month') {
    return summaries.sort((a, b) => a.groupKey.localeCompare(b.groupKey))
  }

  return summaries.sort((a, b) => b.net - a.net)
}

export const getUniqueCategories = (transactions: Transaction[]) =>
  Array.from(new Set(transactions.map((transaction) => transaction.category))).sort(
    (a, b) => a.localeCompare(b),
  )

export const getUniqueMonths = (transactions: Transaction[]) =>
  Array.from(new Set(transactions.map((transaction) => getMonthKey(transaction.date)))).sort(
    (a, b) => a.localeCompare(b),
  )
