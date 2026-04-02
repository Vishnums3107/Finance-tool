# System Architecture

## Tech Stack

1. React + TypeScript (Vite)
2. Zustand for global state
3. Recharts for visualizations
4. CSS variables + component-first styles

## Application Layers

1. Data layer
   - Mock seed transactions
   - Serialization/deserialization for local storage persistence
2. State layer
   - Role state: `viewer | admin`
   - Transactions state: source of truth list
   - UI filters: search, type, category, sort
3. Derived analytics layer
   - Summary totals
   - Monthly balance trend
   - Category spend distribution
   - Insights metrics
4. Presentation layer
   - Dashboard cards
   - Charts
   - Transactions table + filters
   - Role-aware admin form
   - Insights section

## State Model

```ts
role: "viewer" | "admin"
transactions: Transaction[]
filters: {
  search: string
  type: "all" | "income" | "expense"
  category: "all" | Category
  sortBy: "date" | "amount" | "category" | "type"
  sortDir: "asc" | "desc"
}
selectedTransactionId: string | null
```

## File Structure (Target)

```txt
src/
  components/
  data/
  lib/
  store/
  types/
  App.tsx
  index.css
```

## Design Decisions

1. Keep domain logic in `lib` utilities, not embedded in JSX.
2. Keep state mutations centralized in store actions.
3. Use role checks in UI controls and submit handlers for safe frontend simulation.
4. Make charts resilient to empty datasets.

## Extensibility

1. Replace seed data with API fetch layer.
2. Add pagination for large transaction sets.
3. Introduce unit tests around selectors and formatters.
