# Git Progress Tracking

## Why this exists

This project is structured so evaluators can review progress through Git history, not only final code.

## Commit Strategy

Use small milestone commits at the end of each requirement block.

Recommended commit format:

1. `feat(req-1): dashboard overview cards and charts`
2. `feat(req-2): transactions table with filter sort search`
3. `feat(req-3): frontend role-based access simulation`
4. `feat(req-4): insights section and monthly comparison`
5. `feat(req-5): state management hardening with zustand`
6. `style(req-6): responsive and print UX polish`
7. `docs: update requirement mapping and deployment notes`

## Current Baseline

A repository baseline commit is created after implementing and validating requirements in the working project.

## Daily Workflow

1. Check status: `git status`
2. Review changes: `git diff`
3. Stage milestone files: `git add <files>`
4. Commit with requirement tag:
   - `git commit -m "feat(req-x): short milestone summary"`
5. Push branch:
   - `git push origin main`

## Reviewer-Friendly Practices

1. Keep one requirement focus per commit where possible.
2. Avoid mixing unrelated refactors with feature work.
3. Ensure `npm run lint` and `npm run build` pass before each milestone commit.
4. Update docs and README links when behavior changes.
