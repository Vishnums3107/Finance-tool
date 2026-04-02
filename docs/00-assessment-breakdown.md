# Finance Dashboard Assessment Breakdown

## Objective
Build a frontend-only finance dashboard that is clean, interactive, responsive, and easy to evaluate during internship selection.

## Mandatory Requirements and Implementation Targets

| Requirement | Implementation Target | Acceptance Signal |
| --- | --- | --- |
| Dashboard overview | Summary cards for total balance, income, expenses | Cards update when data changes |
| Time-based visualization | Balance trend line chart by month | Chart reflects monthly cumulative balance |
| Categorical visualization | Expense breakdown by category chart | Chart percentages and labels are visible |
| Transactions section | Table with date, amount, category, type | Complete list is displayed |
| Filtering + sorting/search | Search text, type/category filter, sortable columns | Results change instantly and correctly |
| Basic role-based UI | Role switch (Viewer/Admin) | Viewer cannot edit/add, Admin can |
| Insights section | Highest spend category, month-over-month, notable observation | Insights update from live data |
| State management | Central state for transactions, role, and filters | One source of truth; no prop-drilling chaos |
| UI/UX expectations | Responsive, readable, empty-state handling | Works on desktop and mobile, no-data message shown |

## Extra Value (To Impress Reviewers)

1. Persistent state with local storage.
2. Inline add/edit transaction workflow for Admin.
3. CSV export for filtered dataset.
4. Subtle but intentional animations and visual hierarchy.
5. Requirement mapping in README for easy evaluation.

## Non-Goals

1. No backend integration.
2. No authentication service.
3. No full RBAC enforcement beyond frontend simulation.

## Success Criteria

1. Production build passes with no TypeScript errors.
2. All mandatory requirements are demonstrably implemented.
3. Codebase is modular enough to extend with APIs later.
4. README and docs enable a reviewer to run and evaluate in under 5 minutes.
