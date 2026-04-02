import type { TransactionFilters, UserRole } from '../types/finance'

interface StateManagementSectionProps {
  role: UserRole
  transactionCount: number
  activeFilterCount: number
  filters: TransactionFilters
}

export const StateManagementSection = ({
  role,
  transactionCount,
  activeFilterCount,
  filters,
}: StateManagementSectionProps) => {
  return (
    <section className="panel reveal delay-5 state-management-section">
      <div className="panel-heading">
        <h2>State Management</h2>
        <p>Zustand store controlling transactions, filters, and selected role.</p>
      </div>

      <div className="state-summary-grid">
        <article>
          <h3>Selected Role</h3>
          <p>{role === 'admin' ? 'Admin' : 'Viewer'}</p>
        </article>

        <article>
          <h3>Transactions Data</h3>
          <p>{transactionCount} records in store</p>
        </article>

        <article>
          <h3>Filters</h3>
          <p>{activeFilterCount} active filter{activeFilterCount === 1 ? '' : 's'}</p>
          <small>
            Type: {filters.type} | Category: {filters.category} | Month: {filters.month}
          </small>
        </article>
      </div>

      <p className="state-note">Role and transactions persist in local storage; filters are session-local for cleaner review cycles.</p>
    </section>
  )
}
