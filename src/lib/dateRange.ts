export type DateRangePreset = 'last30' | 'month' | 'qtd' | 'ytd'

export const dateRangePresetLabels: Record<DateRangePreset, string> = {
  last30: 'Last 30 Days',
  month: 'Current Month',
  qtd: 'Quarter to Date',
  ytd: 'Year to Date',
}