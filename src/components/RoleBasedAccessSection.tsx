import type { Transaction, TransactionDraft, UserRole } from '../types/finance'
import { TransactionForm } from './TransactionForm'

interface RoleBasedAccessSectionProps {
  role: UserRole
  categories: string[]
  editingTransaction: Transaction | null
  onSubmitTransaction: (draft: TransactionDraft) => void
  onCancelEdit: () => void
}

export const RoleBasedAccessSection = ({
  role,
  categories,
  editingTransaction,
  onSubmitTransaction,
  onCancelEdit,
}: RoleBasedAccessSectionProps) => {
  const canManageTransactions = role === 'admin'

  return (
    <section className="panel reveal delay-4 role-actions-panel">
      <div className="panel-heading">
        <h2>Basic Role-Based UI</h2>
        <p>Switch role to simulate frontend permissions for demonstration.</p>
      </div>

      <div className="role-access-grid">
        <article className="role-capability-card">

          <p className={`role-status ${canManageTransactions ? 'role-admin' : 'role-viewer'}`}>
            Current mode: {canManageTransactions ? 'Admin' : 'Viewer'}
          </p>

          <ul className="permission-list" aria-label="Role permissions">
            <li className="allowed">Can view dashboard and transactions</li>
            <li className={canManageTransactions ? 'allowed' : 'blocked'}>
              Can add transactions
            </li>
            <li className={canManageTransactions ? 'allowed' : 'blocked'}>
              Can edit existing transactions
            </li>
          </ul>

          {!canManageTransactions && (
            <p className="role-note">
              Viewer mode is read-only. Switch to Admin to add or edit records.
            </p>
          )}
        </article>

        <TransactionForm
          key={`${role}-${editingTransaction?.id ?? 'create'}`}
          role={role}
          categories={categories}
          editingTransaction={editingTransaction}
          onSubmit={onSubmitTransaction}
          onCancelEdit={onCancelEdit}
        />
      </div>
    </section>
  )
}
