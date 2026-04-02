import { useState } from 'react'
import type { Transaction, TransactionDraft, UserRole } from '../types/finance'

interface TransactionFormProps {
  role: UserRole
  categories: string[]
  editingTransaction: Transaction | null
  onSubmit: (draft: TransactionDraft) => void
  onCancelEdit: () => void
}

const initialDraft: TransactionDraft = {
  date: new Date().toISOString().slice(0, 10),
  description: '',
  amount: 0,
  category: '',
  type: 'expense',
}

const getInitialDraft = (
  editingTransaction: Transaction | null,
  categories: string[],
): TransactionDraft => {
  if (!editingTransaction) {
    return {
      ...initialDraft,
      category: categories[0] ?? '',
    }
  }

  return {
    date: editingTransaction.date,
    description: editingTransaction.description,
    amount: editingTransaction.amount,
    category: editingTransaction.category,
    type: editingTransaction.type,
  }
}

export const TransactionForm = ({
  role,
  categories,
  editingTransaction,
  onSubmit,
  onCancelEdit,
}: TransactionFormProps) => {
  const [draft, setDraft] = useState<TransactionDraft>(() =>
    getInitialDraft(editingTransaction, categories),
  )

  const mode = editingTransaction ? 'edit' : 'create'

  if (role === 'viewer') {
    return (
      <div className="viewer-lock-message">
        <h3>Read-Only Access</h3>
        <p>You can review analytics and transactions, but record updates are disabled.</p>
        <p>Switch to Admin role to create or edit financial records.</p>
      </div>
    )
  }

  const submitLabel = mode === 'edit' ? 'Save Transaction' : 'Add Transaction'

  return (
    <form
      className="transaction-form"
      onSubmit={(event) => {
        event.preventDefault()

        const amount = Number(draft.amount)

        if (!draft.description.trim() || !draft.category.trim() || Number.isNaN(amount) || amount <= 0) {
          return
        }

        onSubmit({
          ...draft,
          amount,
        })
      }}
    >
      <h3>{mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}</h3>

      <label>
        <span className="control-label">Date</span>
        <input
          type="date"
          value={draft.date}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              date: event.target.value,
            }))
          }
          required
        />
      </label>

      <label>
        <span className="control-label">Description</span>
        <input
          type="text"
          value={draft.description}
          placeholder="Example: Grocery run"
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          required
        />
      </label>

      <label>
        <span className="control-label">Amount (USD)</span>
        <input
          type="number"
          value={draft.amount}
          min={1}
          step={1}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              amount: Number(event.target.value),
            }))
          }
          required
        />
      </label>

      <label>
        <span className="control-label">Category</span>
        <input
          type="text"
          value={draft.category}
          list="category-options"
          placeholder="Example: Food"
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              category: event.target.value,
            }))
          }
          required
        />
        <datalist id="category-options">
          {categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
      </label>

      <label>
        <span className="control-label">Type</span>
        <select
          value={draft.type}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              type: event.target.value as TransactionDraft['type'],
            }))
          }
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>

      <div className="form-actions">
        <button type="submit" className="primary-button">
          {submitLabel}
        </button>
        {mode === 'edit' && (
          <button type="button" className="ghost-button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
