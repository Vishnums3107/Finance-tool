import type { Transaction, TransactionDraft, UserRole } from '../types/finance'
import { TransactionForm } from './TransactionForm'

interface TransactionFormPanelProps {
  role: UserRole
  categories: string[]
  editingTransaction: Transaction | null
  onSubmitTransaction: (draft: TransactionDraft) => void
  onCancelEdit: () => void
}

export const TransactionFormPanel = ({
  role,
  categories,
  editingTransaction,
  onSubmitTransaction,
  onCancelEdit,
}: TransactionFormPanelProps) => {
  return (
    <section className="panel reveal delay-4 transaction-form-panel">
      <div className="panel-heading">
        <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
        <p>
          {editingTransaction
            ? 'Update the fields below and save your changes.'
            : 'Fill in the details below to record a new transaction.'}
        </p>
      </div>

      <TransactionForm
        key={`${role}-${editingTransaction?.id ?? 'create'}`}
        role={role}
        categories={categories}
        editingTransaction={editingTransaction}
        onSubmit={onSubmitTransaction}
        onCancelEdit={onCancelEdit}
      />
    </section>
  )
}
