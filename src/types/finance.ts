export type TransactionType = 'income' | 'expense'

export type UserRole = 'viewer' | 'admin'

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: TransactionType
}

export interface TransactionDraft {
  date: string
  description: string
  amount: number
  category: string
  type: TransactionType
}

export type SortField = 'date' | 'amount' | 'category' | 'description' | 'type'

export type SortDirection = 'asc' | 'desc'

export type TransactionGroupBy = 'none' | 'category' | 'month' | 'type'

export interface TransactionFilters {
  search: string
  type: 'all' | TransactionType
  category: 'all' | string
  month: 'all' | string
  minAmount: number | null
  maxAmount: number | null
  groupBy: TransactionGroupBy
  sortBy: SortField
  sortDir: SortDirection
}

export interface TransactionGroupSummary {
  groupKey: string
  label: string
  count: number
  income: number
  expenses: number
  net: number
}

export interface MonthlyTrendPoint {
  month: string
  monthLabel: string
  income: number
  expenses: number
  net: number
  cumulative: number
}

export interface CategoryBreakdownPoint {
  name: string
  value: number
  share: number
}

export interface InsightCategoryDetail {
  name: string
  amount: number
  share: number
}

export interface FinanceSummary {
  income: number
  expenses: number
  balance: number
  transactionCount: number
  savingsRate: number
}

export interface FinanceInsights {
  transactionCount: number
  income: number
  expenses: number
  balance: number
  savingsRate: number
  highestCategoryName: string
  highestCategoryAmount: number
  highestCategoryShare: number
  topExpenseCategories: InsightCategoryDetail[]
  currentMonthLabel: string
  currentMonthIncome: number
  currentMonthExpense: number
  currentMonthNet: number
  previousMonthLabel: string
  previousMonthIncome: number
  previousMonthExpense: number
  previousMonthNet: number
  comparisonPercent: number | null
  comparisonDirection: 'up' | 'down' | 'flat' | 'na'
  largestExpenseDescription: string
  largestExpenseCategory: string
  largestExpenseAmount: number
  largestExpenseDate: string
  observation: string
}
