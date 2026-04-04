import { dateRangePresetLabels, type DateRangePreset } from '../lib/dateRange'

interface DateRangeSelectorMockProps {
  value: DateRangePreset
  onChange: (value: DateRangePreset) => void
}

const options: Array<{ value: DateRangePreset; label: string }> = [
  { value: 'last30', label: dateRangePresetLabels.last30 },
  { value: 'last90', label: dateRangePresetLabels.last90 },
  { value: 'last6m', label: dateRangePresetLabels.last6m },
  { value: 'month', label: dateRangePresetLabels.month },
  { value: 'qtd', label: dateRangePresetLabels.qtd },
  { value: 'ytd', label: dateRangePresetLabels.ytd },
  { value: 'all', label: dateRangePresetLabels.all },
]

export const DateRangeSelectorMock = ({
  value,
  onChange,
}: DateRangeSelectorMockProps) => {
  return (
    <label className="date-range-switcher" title="Filter dashboard data by date range">
      <span className="control-label">Date Range</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as DateRangePreset)}
        aria-label="Select date range (UI mock)"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}