export type DateRangePreset = 'last30' | 'month' | 'qtd' | 'ytd'

export const dateRangePresetLabels: Record<DateRangePreset, string> = {
  last30: 'Last 30 Days',
  month: 'Current Month',
  qtd: 'Quarter to Date',
  ytd: 'Year to Date',
}

interface DateRangeBounds {
  start: Date
  end: Date
}

interface DatedRecord {
  date: string
}

const toUtcDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

const getPresetBounds = (
  preset: DateRangePreset,
  referenceDate: Date,
): DateRangeBounds => {
  const end = new Date(referenceDate)

  if (preset === 'last30') {
    const start = new Date(referenceDate)
    start.setUTCDate(start.getUTCDate() - 29)
    return { start, end }
  }

  if (preset === 'month') {
    const start = new Date(
      Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), 1),
    )

    return { start, end }
  }

  if (preset === 'qtd') {
    const quarterStartMonth = Math.floor(referenceDate.getUTCMonth() / 3) * 3
    const start = new Date(
      Date.UTC(referenceDate.getUTCFullYear(), quarterStartMonth, 1),
    )

    return { start, end }
  }

  return {
    start: new Date(Date.UTC(referenceDate.getUTCFullYear(), 0, 1)),
    end,
  }
}

export const getLatestTransactionDate = (records: DatedRecord[]): Date | null => {
  if (records.length === 0) {
    return null
  }

  const latestTimestamp = records.reduce((maxTimestamp, record) => {
    const timestamp = toUtcDate(record.date).getTime()
    return Math.max(maxTimestamp, timestamp)
  }, Number.NEGATIVE_INFINITY)

  return new Date(latestTimestamp)
}

export const filterByDateRangePreset = <T extends DatedRecord>(
  records: T[],
  preset: DateRangePreset,
  referenceDate: Date | null,
) => {
  if (!referenceDate) {
    return records
  }

  const { start, end } = getPresetBounds(preset, referenceDate)
  const startTimestamp = start.getTime()
  const endTimestamp = end.getTime()

  return records.filter((record) => {
    const timestamp = toUtcDate(record.date).getTime()
    return timestamp >= startTimestamp && timestamp <= endTimestamp
  })
}