import { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { formatMonthLabel } from '../lib/format'
import type {
  SortDirection,
  SortField,
  TransactionGroupBy,
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

const groupingLabels: Array<{ value: TransactionGroupBy; label: string }> = [
  { value: 'none', label: 'No Grouping' },
  { value: 'category', label: 'Group by Category' },
  { value: 'month', label: 'Group by Month' },
  { value: 'type', label: 'Group by Type' },
]

const parseOptionalNumber = (value: string) => {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return null
  }

  const numeric = Number(trimmed)

  if (Number.isNaN(numeric)) {
    return null
  }

  return numeric
}

export const TransactionFiltersBar = ({
  filters,
  categories,
  months,
  onUpdateFilters,
  onReset,
}: TransactionFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(filters.search)

  // Sync external search clears (like Reset) by reacting to prop changes during render 
  // or storing previous prop. A common pattern is keying the component, but we can also
  // manage it safely. Actually, resetting filters.search directly in the input is simplest.
  if (filters.search !== localSearch && filters.search === '') {
    setLocalSearch('')
  }

  const debouncedSearch = useDebounce(localSearch, 300)

  // Fire update to parent when debounced value changes (only if different)
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onUpdateFilters({ search: debouncedSearch })
    }
  }, [debouncedSearch, filters.search, onUpdateFilters])

  const hasRangeNormalization =
    filters.minAmount !== null &&
    filters.maxAmount !== null &&
    filters.minAmount > filters.maxAmount

  return (
    <div className="filters-grid">
      <label>
        <span className="control-label">Search</span>
        <input
          id="filter-search"
          name="search"
          type="text"
          placeholder="Search description or category"
          value={localSearch}
          onChange={(event) => setLocalSearch(event.target.value)}
        />
      </label>

      <label>
        <span className="control-label">Type</span>
        <select
          id="filter-type"
          name="type"
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
          id="filter-category"
          name="category"
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
          id="filter-month"
          name="month"
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
          id="filter-sort-by"
          name="sortBy"
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
          id="filter-sort-direction"
          name="sortDirection"
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

      <label>
        <span className="control-label">Min Amount</span>
        <input
          id="filter-min-amount"
          name="minAmount"
          type="number"
          min={0}
          step={1}
          value={filters.minAmount ?? ''}
          placeholder="No min"
          onChange={(event) =>
            onUpdateFilters({
              minAmount: parseOptionalNumber(event.target.value),
            })
          }
        />
      </label>

      <label>
        <span className="control-label">Max Amount</span>
        <input
          id="filter-max-amount"
          name="maxAmount"
          type="number"
          min={0}
          step={1}
          value={filters.maxAmount ?? ''}
          placeholder="No max"
          onChange={(event) =>
            onUpdateFilters({
              maxAmount: parseOptionalNumber(event.target.value),
            })
          }
        />
      </label>

      <label>
        <span className="control-label">Grouping</span>
        <select
          id="filter-group-by"
          name="groupBy"
          value={filters.groupBy}
          onChange={(event) =>
            onUpdateFilters({
              groupBy: event.target.value as TransactionGroupBy,
            })
          }
        >
          {groupingLabels.map((groupingLabel) => (
            <option key={groupingLabel.value} value={groupingLabel.value}>
              {groupingLabel.label}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className="ghost-button" onClick={onReset}>
        Reset Filters
      </button>

      {hasRangeNormalization && (
        <p className="filters-note">
          Amount range was normalized automatically because minimum was greater than maximum.
        </p>
      )}
    </div>
  )
}
