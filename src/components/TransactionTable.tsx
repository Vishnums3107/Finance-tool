import { formatDate, formatSignedCurrency } from '../lib/format'
import { getNetAmount } from '../lib/analytics'
import type { Transaction, UserRole } from '../types/finance'

interface TransactionTableProps {
  role: UserRole
  transactions: Transaction[]
  onEditTransaction: (transactionId: string) => void
}

export const TransactionTable = ({
  role,
  transactions,
  onEditTransaction,
}: TransactionTableProps) => {
  if (transactions.length === 0) {
    return (
      <div className="empty-table">
        <p>No records match the active filter set.</p>
        <p>Reset filters or add a new record in Admin mode.</p>
      </div>
    )
  }

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

            return (
              <tr key={transaction.id}>
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
                  <td>
                    <button
                      type="button"
                      className="inline-button"
                      onClick={() => onEditTransaction(transaction.id)}
                    >
                      Edit
                    </button>
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
