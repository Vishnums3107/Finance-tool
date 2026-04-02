import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { seedTransactions } from '../data/seedTransactions'
import type {
  Transaction,
  TransactionDraft,
  TransactionFilters,
  UserRole,
} from '../types/finance'

const createTransactionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `tx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const defaultFilters: TransactionFilters = {
  search: '',
  type: 'all',
  category: 'all',
  month: 'all',
  sortBy: 'date',
  sortDir: 'desc',
}

interface FinanceStore {
  role: UserRole
  transactions: Transaction[]
  filters: TransactionFilters
  editingTransactionId: string | null
  setRole: (role: UserRole) => void
  setFilters: (partialFilters: Partial<TransactionFilters>) => void
  resetFilters: () => void
  setEditingTransactionId: (transactionId: string | null) => void
  addTransaction: (draft: TransactionDraft) => void
  updateTransaction: (id: string, draft: TransactionDraft) => void
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      role: 'viewer',
      transactions: seedTransactions,
      filters: defaultFilters,
      editingTransactionId: null,
      setRole: (role) => {
        set(() => ({ role, editingTransactionId: null }))
      },
      setFilters: (partialFilters) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...partialFilters,
          },
        }))
      },
      resetFilters: () => {
        set(() => ({ filters: defaultFilters }))
      },
      setEditingTransactionId: (editingTransactionId) => {
        set(() => ({ editingTransactionId }))
      },
      addTransaction: (draft) => {
        set((state) => {
          if (state.role !== 'admin') {
            return state
          }

          return {
            transactions: [
              {
                ...draft,
                id: createTransactionId(),
                description: draft.description.trim(),
                category: draft.category.trim(),
              },
              ...state.transactions,
            ],
          }
        })
      },
      updateTransaction: (id, draft) => {
        set((state) => {
          if (state.role !== 'admin') {
            return state
          }

          return {
            transactions: state.transactions.map((transaction) => {
              if (transaction.id !== id) {
                return transaction
              }

              return {
                ...transaction,
                ...draft,
                description: draft.description.trim(),
                category: draft.category.trim(),
              }
            }),
          }
        })
      },
    }),
    {
      name: 'finance-dashboard-store-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        role: state.role,
        transactions: state.transactions,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<FinanceStore>),
        filters: defaultFilters,
        editingTransactionId: null,
      }),
    },
  ),
)
