import { seedTransactions } from '../data/seedTransactions'
import type { Transaction } from '../types/finance'

const NETWORK_LATENCY_MS = 700

const cloneTransactions = (transactions: Transaction[]) =>
  transactions.map((transaction) => ({ ...transaction }))

export const fetchMockTransactions = async (): Promise<Transaction[]> => {
  const shouldForceError = localStorage.getItem('finance-tool-force-api-error') === '1'

  await new Promise((resolve) => {
    window.setTimeout(resolve, NETWORK_LATENCY_MS)
  })

  if (shouldForceError) {
    throw new Error('Mock API failed. Clear finance-tool-force-api-error to recover.')
  }

  return cloneTransactions(seedTransactions)
}
