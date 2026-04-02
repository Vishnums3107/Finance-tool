# Finance Pulse Dashboard

Frontend finance dashboard built for internship assessment evaluation.

## What This Project Demonstrates

1. Clean dashboard overview with financial KPIs.
2. Time-based and categorical visualizations.
3. Search/filter/sort transaction workflows.
4. Frontend role simulation (`viewer` vs `admin`).
5. Insights generated from transaction patterns.
6. Stateful architecture using Zustand with local persistence.
7. Responsive UX with empty-state handling.

## Tech Stack

1. React + TypeScript + Vite
2. Zustand for state management
3. Recharts for charts
4. CSS variables and custom responsive styling

## Features

### Dashboard Overview

1. Summary cards: Total Balance, Income, Expenses, Savings Rate.
2. Time-based chart: monthly trend with running balance.
3. Category chart: expense distribution by category.

### Transactions Section

1. Transaction table with date, amount, category, type, description.
2. Real-time search by category/description.
3. Filter by type, category, and month.
4. Sorting controls for date/amount/category/description/type.

### Role-Based UI

1. Viewer role: read-only analytics and table access.
2. Admin role: add and edit transactions.

### Insights Section

1. Highest spending category.
2. Month-over-month expense comparison.
3. Data-driven observation message.

### Optional Enhancements Included

1. Local storage persistence.
2. CSV export for filtered transactions.
3. Motion and staged reveal animations.

## Project Structure

```txt
docs/
src/
  components/
  data/
  lib/
  store/
  types/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Deployment

Deploy to Vercel or Netlify with:

1. Build command: `npm run build`
2. Publish/output directory: `dist`

Detailed instructions are available in [docs/05-deployment-playbook.md](docs/05-deployment-playbook.md).

## Assessment Mapping

Full requirement and evaluation mapping documents:

1. [docs/00-assessment-breakdown.md](docs/00-assessment-breakdown.md)
2. [docs/01-system-architecture.md](docs/01-system-architecture.md)
3. [docs/06-evaluation-mapping.md](docs/06-evaluation-mapping.md)
4. [docs/07-git-progress-tracking.md](docs/07-git-progress-tracking.md)

## Notes

1. This is intentionally frontend-only and uses mock/seed data.
2. State persists in browser local storage for demonstration continuity.
