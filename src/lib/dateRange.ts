export type DateRangePreset =
  | 'last30'
  | 'last90'
  | 'last6m'
  | 'month'
  | 'qtd'
  | 'ytd'
  | 'all'

export const dateRangePresetLabels: Record<DateRangePreset, string> = {
  last30: 'Last 30 Days',
  last90: 'Last 90 Days',
  last6m: 'Last 6 Months',
  month: 'Current Month',
  qtd: 'Quarter to Date',
  ytd: 'Year to Date',
  all: 'All Time',
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

const shiftUtcDays = (date: Date, days: number) => {
  const shifted = new Date(date)
  shifted.setUTCDate(shifted.getUTCDate() + days)
  return shifted
}

const getUtcMonthStart = (referenceDate: Date, monthsBackInclusive: number) =>
  new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth() - (monthsBackInclusive - 1),
      1,
    ),
  )

const getPresetBounds = (
  preset: DateRangePreset,
  referenceDate: Date,
): DateRangeBounds => {
  const end = new Date(referenceDate)

  if (preset === 'last30') {
    const start = shiftUtcDays(referenceDate, -29)
    return { start, end }
  }

  if (preset === 'last90') {
    const start = shiftUtcDays(referenceDate, -89)
    return { start, end }
  }

  if (preset === 'last6m') {
    const start = getUtcMonthStart(referenceDate, 6)
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

  if (preset === 'all') {
    return {
      start: new Date(Date.UTC(1970, 0, 1)),
      end,
    }
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