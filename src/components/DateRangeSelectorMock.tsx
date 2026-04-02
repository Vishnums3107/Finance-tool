import { dateRangePresetLabels, type DateRangePreset } from '../lib/dateRange'

interface DateRangeSelectorMockProps {
  value: DateRangePreset
  onChange: (value: DateRangePreset) => void
}

const options: Array<{ value: DateRangePreset; label: string }> = [
  { value: 'last30', label: dateRangePresetLabels.last30 },
  { value: 'month', label: dateRangePresetLabels.month },
  { value: 'qtd', label: dateRangePresetLabels.qtd },
  { value: 'ytd', label: dateRangePresetLabels.ytd },
]

export const DateRangeSelectorMock = ({
  value,
  onChange,
}: DateRangeSelectorMockProps) => {
  return (
    <label className="date-range-switcher" title="UI mock control only">
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