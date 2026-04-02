# Development Roadmap

## Phase 1: Foundation

1. Initialize React + TypeScript project.
2. Add dependencies (`zustand`, `recharts`).
3. Establish folder structure and shared types.

Definition of done:
- App boots and builds.
- Linting baseline is clean.

## Phase 2: Core Data + State

1. Create mock transaction dataset.
2. Implement Zustand store with persistence.
3. Add filter and role actions.

Definition of done:
- Transactions and role are globally managed.
- Reload retains user data.

## Phase 3: Dashboard Experience

1. Build summary cards and key KPIs.
2. Add line chart (time-based trend).
3. Add pie/bar chart (category spend).

Definition of done:
- Charts render correctly for normal and empty states.

## Phase 4: Transactions + Admin Workflow

1. Implement searchable, sortable, filterable transaction table.
2. Build admin-only add/edit panel.
3. Add role switch and UI restrictions.

Definition of done:
- Viewer cannot mutate data.
- Admin can add and edit entries.

## Phase 5: Insights + Polish

1. Add insights cards with computed observations.
2. Improve responsive layout and animation.
3. Add export capability for filtered results.

Definition of done:
- Works smoothly on mobile and desktop.
- Visual hierarchy and micro-interactions are polished.

## Phase 6: Delivery

1. Write README with feature map and setup steps.
2. Validate production build.
3. Add deployment playbook.

Definition of done:
- Reviewer can run and deploy quickly.
