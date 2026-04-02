import { getMonthKey, normalizeSearch } from './format'
import type { Transaction, TransactionFilters } from '../types/finance'

const asSignedAmount = (transaction: Transaction) =>
  transaction.type === 'income' ? transaction.amount : -transaction.amount

export const filterAndSortTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters,
) => {
  const search = normalizeSearch(filters.search)

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

    return searchMatch && typeMatch && categoryMatch && monthMatch
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

export const getUniqueCategories = (transactions: Transaction[]) =>
  Array.from(new Set(transactions.map((transaction) => transaction.category))).sort(
    (a, b) => a.localeCompare(b),
  )

export const getUniqueMonths = (transactions: Transaction[]) =>
  Array.from(new Set(transactions.map((transaction) => getMonthKey(transaction.date)))).sort(
    (a, b) => a.localeCompare(b),
  )
