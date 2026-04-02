const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const numberFormatter = new Intl.NumberFormat('en-US')

const parseDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const formatCurrency = (amount: number) => currencyFormatter.format(amount)

export const formatCompactCurrency = (amount: number) =>
  compactCurrencyFormatter.format(amount)

export const formatSignedCurrency = (amount: number) => {
  if (amount < 0) {
    return `- ${formatCurrency(Math.abs(amount))}`
  }

  return formatCurrency(amount)
}

export const formatDate = (isoDate: string) =>
  parseDate(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export const getMonthKey = (isoDate: string) => isoDate.slice(0, 7)

export const formatMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  })
}

export const normalizeSearch = (value: string) => value.trim().toLowerCase()

export const formatCount = (count: number) => numberFormatter.format(count)
