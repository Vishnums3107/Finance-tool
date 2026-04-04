import { formatCurrency, formatDate, formatMonthLabel, getMonthKey } from './format'
import type {
  CategoryBreakdownPoint,
  FinanceInsights,
  FinanceSummary,
  MonthlyTrendPoint,
  Transaction,
} from '../types/finance'

const getSignedAmount = (transaction: Transaction) =>
  transaction.type === 'income' ? transaction.amount : -transaction.amount

export const getFinanceSummary = (transactions: Transaction[]): FinanceSummary => {
  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const expenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const balance = income - expenses
  const savingsRate = income > 0 ? (balance / income) * 100 : 0

  return {
    income,
    expenses,
    balance,
    transactionCount: transactions.length,
    savingsRate,
  }
}

export const getMonthlyTrend = (transactions: Transaction[]): MonthlyTrendPoint[] => {
  const monthlyMap = new Map<
    string,
    {
      income: number
      expenses: number
    }
  >()

  transactions.forEach((transaction) => {
    const key = getMonthKey(transaction.date)
    const existing = monthlyMap.get(key) ?? { income: 0, expenses: 0 }

    if (transaction.type === 'income') {
      existing.income += transaction.amount
    } else {
      existing.expenses += transaction.amount
    }

    monthlyMap.set(key, existing)
  })

  let runningBalance = 0

  return Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => {
      const net = values.income - values.expenses
      runningBalance += net

      return {
        month,
        monthLabel: formatMonthLabel(month),
        income: values.income,
        expenses: values.expenses,
        net,
        cumulative: runningBalance,
      }
    })
}

export const getCategoryBreakdown = (
  transactions: Transaction[],
): CategoryBreakdownPoint[] => {
  const expenses = transactions.filter((transaction) => transaction.type === 'expense')
  const totalExpenses = expenses.reduce((sum, transaction) => sum + transaction.amount, 0)

  if (totalExpenses === 0) {
    return []
  }

  const map = new Map<string, number>()

  expenses.forEach((transaction) => {
    const existing = map.get(transaction.category) ?? 0
    map.set(transaction.category, existing + transaction.amount)
  })

  return Array.from(map.entries())
    .map(([name, value]) => ({
      name,
      value,
      share: (value / totalExpenses) * 100,
    }))
    .sort((a, b) => b.value - a.value)
}

export const getInsights = (transactions: Transaction[]): FinanceInsights => {
  const summary = getFinanceSummary(transactions)
  const trend = getMonthlyTrend(transactions)
  const breakdown = getCategoryBreakdown(transactions)

  const highestCategory = breakdown[0]
  const latestMonth = trend[trend.length - 1]
  const previousMonth = trend[trend.length - 2]
  const biggestExpense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .sort((a, b) => b.amount - a.amount)[0]

  const topExpenseCategories = breakdown.slice(0, 3).map((category) => ({
    name: category.name,
    amount: category.value,
    share: category.share,
  }))

  const comparisonPercent =
    latestMonth && previousMonth && previousMonth.expenses > 0
      ? ((latestMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100
      : null

  const comparisonDirection =
    comparisonPercent === null
      ? 'na'
      : comparisonPercent > 0
        ? 'up'
        : comparisonPercent < 0
          ? 'down'
          : 'flat'

  let observation = 'No transactions yet. Add your first transaction to generate insights.'

  if (latestMonth) {
      const topCategoryText = highestCategory
        ? `Top spending category is ${highestCategory.name}, accounting for ${highestCategory.share.toFixed(1)}% of total expenses.`
        : 'No spending categories were recorded.'

    if (latestMonth.net < 0) {
        observation = `${latestMonth.monthLabel} closed negative by ${formatCurrency(Math.abs(latestMonth.net))}. ${topCategoryText}`
    } else if (biggestExpense) {
        observation = `${latestMonth.monthLabel} stayed positive by ${formatCurrency(latestMonth.net)}. ${topCategoryText} The largest single expense was ${biggestExpense.description} in ${biggestExpense.category} at ${formatCurrency(biggestExpense.amount)} on ${formatDate(biggestExpense.date)}.`
    } else {
        observation = `${latestMonth.monthLabel} stayed positive by ${formatCurrency(latestMonth.net)}. ${topCategoryText}`
    }
  }

  return {
      transactionCount: summary.transactionCount,
      income: summary.income,
      expenses: summary.expenses,
      balance: summary.balance,
      savingsRate: summary.savingsRate,
    highestCategoryName: highestCategory?.name ?? 'N/A',
    highestCategoryAmount: highestCategory?.value ?? 0,
      highestCategoryShare: highestCategory?.share ?? 0,
      topExpenseCategories,
    currentMonthLabel: latestMonth?.monthLabel ?? 'N/A',
      currentMonthIncome: latestMonth?.income ?? 0,
    currentMonthExpense: latestMonth?.expenses ?? 0,
      currentMonthNet: latestMonth?.net ?? 0,
    previousMonthLabel: previousMonth?.monthLabel ?? 'N/A',
      previousMonthIncome: previousMonth?.income ?? 0,
    previousMonthExpense: previousMonth?.expenses ?? 0,
      previousMonthNet: previousMonth?.net ?? 0,
    comparisonPercent,
    comparisonDirection,
      largestExpenseDescription: biggestExpense?.description ?? 'N/A',
      largestExpenseCategory: biggestExpense?.category ?? 'N/A',
      largestExpenseAmount: biggestExpense?.amount ?? 0,
      largestExpenseDate: biggestExpense ? formatDate(biggestExpense.date) : 'N/A',
    observation,
  }
}

export const getNetAmount = (transaction: Transaction) => getSignedAmount(transaction)
