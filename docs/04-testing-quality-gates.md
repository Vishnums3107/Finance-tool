# Testing and Quality Gates

## Manual Test Checklist

### 1. Dashboard Calculations

1. Verify total balance = total income - total expenses.
2. Verify summary cards react to transaction changes.
3. Verify chart values match computed aggregates.

### 2. Transactions Behavior

1. Search by description/category returns expected rows.
2. Type and category filters combine correctly.
3. Sorting toggles asc/desc without breaking filters.
4. No-data state appears when filters remove all matches.

### 3. Role-Based UI

1. Viewer role cannot access add/edit actions.
2. Admin role can create transaction.
3. Admin role can edit existing transaction.

### 4. Persistence

1. Add/edit a transaction and refresh page.
2. Confirm role and transactions remain persisted.

### 5. Responsiveness

1. Desktop: cards and charts align without overlap.
2. Tablet/mobile: content stacks cleanly and remains readable.
3. Table is usable with horizontal scrolling on small screens.

### 6. Build Gate

1. Run `npm run build` successfully.
2. Run `npm run preview` and sanity check key flows.

## Optional Future Automation

1. Add unit tests for analytics selectors.
2. Add component tests for role-aware controls.
3. Add end-to-end smoke tests for core user journeys.
