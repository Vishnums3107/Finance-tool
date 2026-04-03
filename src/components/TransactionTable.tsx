import { useState } from 'react'
import { formatDate, formatSignedCurrency } from '../lib/format'
import { getNetAmount } from '../lib/analytics'
import type { Transaction, UserRole } from '../types/finance'

interface TransactionTableProps {
  role: UserRole
  transactions: Transaction[]
  onEditTransaction: (transactionId: string) => void
  onDeleteTransaction: (transactionId: string) => void
}

export const TransactionTable = ({
  role,
  transactions,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionTableProps) => {
  // Track which row is in "confirm delete" state
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  if (transactions.length === 0) {
    return (
      <div className="empty-table">
        <p>No records match the active filter set.</p>
        <p>Reset filters or add a new record in Admin mode.</p>
      </div>
    )
  }

  const handleDeleteClick = (id: string) => {
    if (pendingDeleteId === id) {
      // Second click = confirmed
      onDeleteTransaction(id)
      setPendingDeleteId(null)
    } else {
      // First click = ask for confirmation
      setPendingDeleteId(id)
    }
  }

  const handleCancelDelete = () => setPendingDeleteId(null)

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const netAmount = getNetAmount(transaction)
            const isPendingDelete = pendingDeleteId === transaction.id

            return (
              <tr
                key={transaction.id}
                className={isPendingDelete ? 'row-pending-delete' : ''}
              >
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td>
                  <span className={`pill pill-${transaction.type}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className={transaction.type === 'income' ? 'value-positive' : 'value-negative'}>
                  {formatSignedCurrency(netAmount)}
                </td>
                {role === 'admin' && (
                  <td className="action-cell">
                    {isPendingDelete ? (
                      // Confirmation state
                      <span className="delete-confirm-group">
                        <button
                          type="button"
                          className="inline-button delete-confirm-btn"
                          onClick={() => handleDeleteClick(transaction.id)}
                          title="Confirm delete"
                          aria-label={`Confirm deletion of ${transaction.description}`}
                        >
                          ✓ Confirm
                        </button>
                        <button
                          type="button"
                          className="inline-button"
                          onClick={handleCancelDelete}
                          title="Cancel"
                          aria-label="Cancel delete"
                        >
                          ✕
                        </button>
                      </span>
                    ) : (
                      // Normal state
                      <span className="action-btn-group">
                        <button
                          type="button"
                          className="inline-button"
                          onClick={() => onEditTransaction(transaction.id)}
                          aria-label={`Edit ${transaction.description}`}
                        >
                          ✎ Edit
                        </button>
                        <button
                          type="button"
                          className="inline-button delete-btn"
                          onClick={() => handleDeleteClick(transaction.id)}
                          aria-label={`Delete ${transaction.description}`}
                          title="Delete this transaction"
                        >
                          🗑
                        </button>
                      </span>
                    )}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={role === 'admin' ? 6 : 5}>
              Showing {transactions.length} transaction{transactions.length === 1 ? '' : 's'}
            </td>
          </tr>
        </tfoot>
      </table>
      <p className="table-note">Income values are positive and expenses are negative in this ledger view.</p>
    </div>
  )
}
