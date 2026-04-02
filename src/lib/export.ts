import type { Transaction } from '../types/finance'

const escapeCsvValue = (value: string | number) => {
  const asText = String(value)

  if (asText.includes(',') || asText.includes('"') || asText.includes('\n')) {
    return `"${asText.replaceAll('"', '""')}"`
  }

  return asText
}

export const exportTransactionsCsv = (transactions: Transaction[]) => {
  if (transactions.length === 0) {
    return false
  }

  const header = ['Date', 'Description', 'Category', 'Type', 'Amount']

  const rows = transactions.map((transaction) => [
    transaction.date,
    transaction.description,
    transaction.category,
    transaction.type,
    transaction.type === 'income' ? transaction.amount : transaction.amount * -1,
  ])

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => escapeCsvValue(cell)).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const timestamp = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = `transactions-${timestamp}.csv`
  link.click()

  URL.revokeObjectURL(url)

  return true
}
