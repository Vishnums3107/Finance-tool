import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { seedTransactions } from '../data/seedTransactions'
import { fetchMockTransactions } from '../api/mockFinanceApi'
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

const createDefaultFilters = (): TransactionFilters => ({
  search: '',
  type: 'all',
  category: 'all',
  month: 'all',
  minAmount: null,
  maxAmount: null,
  groupBy: 'none',
  sortBy: 'date',
  sortDir: 'desc',
})

export const defaultFilters: TransactionFilters = createDefaultFilters()

interface FinanceStore {
  role: UserRole
  transactions: Transaction[]
  filters: TransactionFilters
  editingTransactionId: string | null
  isMockApiLoading: boolean
  mockApiError: string | null
  setRole: (role: UserRole) => void
  setFilters: (partialFilters: Partial<TransactionFilters>) => void
  resetFilters: () => void
  setEditingTransactionId: (transactionId: string | null) => void
  clearEditingTransaction: () => void
  addTransaction: (draft: TransactionDraft) => void
  updateTransaction: (id: string, draft: TransactionDraft) => void
  deleteTransaction: (id: string) => void
  restoreDemoData: () => void
  loadTransactionsFromMockApi: () => Promise<boolean>
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      role: 'viewer',
      transactions: [],
      filters: createDefaultFilters(),
      editingTransactionId: null,
      isMockApiLoading: false,
      mockApiError: null,
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
        set(() => ({ filters: createDefaultFilters() }))
      },
      setEditingTransactionId: (editingTransactionId) => {
        set((state) => {
          if (state.role !== 'admin') {
            return { editingTransactionId: null }
          }

          return { editingTransactionId }
        })
      },
      clearEditingTransaction: () => {
        set(() => ({ editingTransactionId: null }))
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
      deleteTransaction: (id) => {
        set((state) => {
          if (state.role !== 'admin') {
            return state
          }

          return {
            transactions: state.transactions.filter(
              (transaction) => transaction.id !== id,
            ),
            // Clear editing state if the deleted tx was being edited
            editingTransactionId:
              state.editingTransactionId === id ? null : state.editingTransactionId,
          }
        })
      },
      restoreDemoData: () => {
        set(() => ({
          transactions: seedTransactions.map((transaction) => ({ ...transaction })),
          filters: createDefaultFilters(),
          editingTransactionId: null,
          isMockApiLoading: false,
          mockApiError: null,
        }))
      },
      loadTransactionsFromMockApi: async () => {
        set(() => ({
          isMockApiLoading: true,
          mockApiError: null,
        }))

        try {
          const transactions = await fetchMockTransactions()

          set(() => ({
            transactions,
            isMockApiLoading: false,
            mockApiError: null,
            editingTransactionId: null,
          }))

          return true
        } catch (error) {
          set(() => ({
            isMockApiLoading: false,
            mockApiError:
              error instanceof Error
                ? error.message
                : 'Mock API request failed.',
          }))

          return false
        }
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
        filters: createDefaultFilters(),
        editingTransactionId: null,
        isMockApiLoading: false,
        mockApiError: null,
      }),
    },
  ),
)
