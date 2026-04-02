import type { Transaction } from '../types/finance'

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.click()

  URL.revokeObjectURL(url)
}

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

  const timestamp = new Date().toISOString().slice(0, 10)

  downloadBlob(
    new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
    `transactions-${timestamp}.csv`,
  )

  return true
}

export const exportTransactionsJson = (transactions: Transaction[]) => {
  if (transactions.length === 0) {
    return false
  }

  const timestamp = new Date().toISOString().slice(0, 10)
  const payload = {
    exportedAt: new Date().toISOString(),
    count: transactions.length,
    transactions,
  }

  downloadBlob(
    new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8;',
    }),
    `transactions-${timestamp}.json`,
  )

  return true
}
