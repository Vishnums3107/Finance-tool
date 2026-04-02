import { formatMonthLabel } from '../lib/format'
import type {
  SortDirection,
  SortField,
  TransactionFilters as TransactionFiltersState,
} from '../types/finance'

interface TransactionFiltersProps {
  filters: TransactionFiltersState
  categories: string[]
  months: string[]
  onUpdateFilters: (nextFilters: Partial<TransactionFiltersState>) => void
  onReset: () => void
}

const sortLabels: Array<{ value: SortField; label: string }> = [
  { value: 'date', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'category', label: 'Category' },
  { value: 'description', label: 'Description' },
  { value: 'type', label: 'Type' },
]

const directionLabels: Array<{ value: SortDirection; label: string }> = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
]

export const TransactionFiltersBar = ({
  filters,
  categories,
  months,
  onUpdateFilters,
  onReset,
}: TransactionFiltersProps) => {
  return (
    <div className="filters-grid">
      <label>
        <span className="control-label">Search</span>
        <input
          type="text"
          placeholder="Search description or category"
          value={filters.search}
          onChange={(event) => onUpdateFilters({ search: event.target.value })}
        />
      </label>

      <label>
        <span className="control-label">Type</span>
        <select
          value={filters.type}
          onChange={(event) =>
            onUpdateFilters({
              type: event.target.value as TransactionFiltersState['type'],
            })
          }
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </label>

      <label>
        <span className="control-label">Category</span>
        <select
          value={filters.category}
          onChange={(event) =>
            onUpdateFilters({
              category: event.target.value,
            })
          }
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="control-label">Month</span>
        <select
          value={filters.month}
          onChange={(event) =>
            onUpdateFilters({
              month: event.target.value,
            })
          }
        >
          <option value="all">All Months</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {formatMonthLabel(month)}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="control-label">Sort By</span>
        <select
          value={filters.sortBy}
          onChange={(event) =>
            onUpdateFilters({
              sortBy: event.target.value as SortField,
            })
          }
        >
          {sortLabels.map((sortLabel) => (
            <option key={sortLabel.value} value={sortLabel.value}>
              {sortLabel.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="control-label">Direction</span>
        <select
          value={filters.sortDir}
          onChange={(event) =>
            onUpdateFilters({
              sortDir: event.target.value as SortDirection,
            })
          }
        >
          {directionLabels.map((direction) => (
            <option key={direction.value} value={direction.value}>
              {direction.label}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className="ghost-button" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  )
}
