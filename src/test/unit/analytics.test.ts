import { describe, it, expect } from 'vitest'
import { getFinanceSummary, getNetAmount } from '../../lib/analytics'
import type { Transaction } from '../../types/finance'

describe('analytics utilities', () => {
  const sampleTransactions: Transaction[] = [
    {
      id: 'tx-1',
      date: '2026-01-01',
      description: 'Test Income',
      amount: 1000,
      category: 'Salary',
      type: 'income',
    },
    {
      id: 'tx-2',
      date: '2026-01-02',
      description: 'Test Expense',
      amount: 300,
      category: 'Food',
      type: 'expense',
    },
    {
      id: 'tx-3',
      date: '2026-01-03',
      description: 'Another Expense',
      amount: 200,
      category: 'Transport',
      type: 'expense',
    },
  ]

  it('calculates finance summary correctly', () => {
    const summary = getFinanceSummary(sampleTransactions)

    expect(summary.income).toBe(1000)
    expect(summary.expenses).toBe(500)
    expect(summary.balance).toBe(500)
    expect(summary.transactionCount).toBe(3)
    // savings rate is balance / income * 100 -> 500 / 1000 * 100 = 50
    expect(summary.savingsRate).toBe(50)
  })

  it('calculates zero values for empty transactions array', () => {
    const summary = getFinanceSummary([])

    expect(summary.income).toBe(0)
    expect(summary.expenses).toBe(0)
    expect(summary.balance).toBe(0)
    expect(summary.transactionCount).toBe(0)
    expect(summary.savingsRate).toBe(0)
  })

  describe('getNetAmount', () => {
    it('returns positive value for income', () => {
      const net = getNetAmount(sampleTransactions[0])
      expect(net).toBe(1000)
    })

    it('returns negative value for expense', () => {
      const net = getNetAmount(sampleTransactions[1])
      expect(net).toBe(-300)
    })
  })
})
