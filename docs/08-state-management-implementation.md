# State Management Implementation

## Requirement Coverage

This project satisfies Requirement 5 by managing core application state in a centralized Zustand store:

1. Transactions data
2. Filters
3. Selected role

## State Model

Managed in [src/store/useFinanceStore.ts](../src/store/useFinanceStore.ts):

1. `role`: `viewer | admin`
2. `transactions`: transaction list source of truth
3. `filters`: search, type, category, month, sort field, sort direction
4. `editingTransactionId`: currently edited transaction

## Why This Is Well Managed

1. Single source of truth in one store.
2. Role-based mutation guards enforced at store action level.
3. Filter updates handled through controlled partial updates.
4. Reset action for filters keeps analysis workflows predictable.
5. Derived dashboard state centralized via [src/store/useFinanceDashboardState.ts](../src/store/useFinanceDashboardState.ts).

## Persistence Behavior

1. Persisted: `role`, `transactions`
2. Session-local: `filters`, `editingTransactionId`

This balance keeps demonstration continuity while ensuring each review session starts with clean filters.

## UI Demonstration

A dedicated state management section is shown in the dashboard for evaluator clarity:

- [src/components/StateManagementSection.tsx](../src/components/StateManagementSection.tsx)
