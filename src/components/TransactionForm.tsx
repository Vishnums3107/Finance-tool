import { useMemo, useState } from 'react'
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
  const categoryOptions = useMemo(
    () => Array.from(new Set(categories)).sort((a, b) => a.localeCompare(b)),
    [categories],
  )

  const [draft, setDraft] = useState<TransactionDraft>(() =>
    getInitialDraft(editingTransaction, categories),
  )

  const [customCategoryEnabled, setCustomCategoryEnabled] = useState(() => {
    if (!editingTransaction) {
      return categoryOptions.length === 0
    }

    return !categoryOptions.includes(editingTransaction.category)
  })

  const [formError, setFormError] = useState<string | null>(null)

  const mode = editingTransaction ? 'edit' : 'create'

  const updateDraft = (updater: (current: TransactionDraft) => TransactionDraft) => {
    setFormError(null)
    setDraft(updater)
  }

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
          setFormError('Enter a valid description, category, and amount greater than 0.')
          return
        }

        setFormError(null)

        onSubmit({
          ...draft,
          amount,
        })

        if (mode === 'create') {
          setDraft(getInitialDraft(null, categoryOptions))
          setCustomCategoryEnabled(categoryOptions.length === 0)
        }
      }}
    >
      <h3>{mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}</h3>

      <label>
        <span className="control-label">Date</span>
        <input
          id="transaction-date"
          name="date"
          type="date"
          value={draft.date}
          onChange={(event) =>
            updateDraft((current) => ({
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
          id="transaction-description"
          name="description"
          type="text"
          value={draft.description}
          placeholder="Example: Grocery run"
          onChange={(event) =>
            updateDraft((current) => ({
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
          id="transaction-amount"
          name="amount"
          type="number"
          value={draft.amount}
          min={1}
          step={1}
          onChange={(event) =>
            updateDraft((current) => ({
              ...current,
              amount: Number(event.target.value),
            }))
          }
          required
        />
      </label>

      <label>
        <span className="control-label">Category</span>
        <select
          id="transaction-category"
          name="category"
          value={customCategoryEnabled ? '__custom__' : draft.category}
          onChange={(event) => {
            const selectedValue = event.target.value
            setFormError(null)

            if (selectedValue === '__custom__') {
              setCustomCategoryEnabled(true)

              if (categoryOptions.includes(draft.category)) {
                setDraft((current) => ({
                  ...current,
                  category: '',
                }))
              }

              return
            }

            setCustomCategoryEnabled(false)
            setDraft((current) => ({
              ...current,
              category: selectedValue,
            }))
          }}
          required
        >
          {categoryOptions.length === 0 && (
            <option value="" disabled>
              No categories available yet
            </option>
          )}
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          <option value="__custom__">Custom category...</option>
        </select>

        {customCategoryEnabled && (
          <input
            id="transaction-category-custom"
            name="customCategory"
            type="text"
            value={draft.category}
            placeholder="Enter custom category"
            onChange={(event) =>
              updateDraft((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
            required
          />
        )}
      </label>

      <label>
        <span className="control-label">Type</span>
        <select
          id="transaction-type"
          name="type"
          value={draft.type}
          onChange={(event) =>
            updateDraft((current) => ({
              ...current,
              type: event.target.value as TransactionDraft['type'],
            }))
          }
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>

      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}

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
