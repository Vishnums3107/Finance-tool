# Deployment Playbook

## Build Commands

1. Install dependencies: `npm install`
2. Production build: `npm run build`
3. Local production preview: `npm run preview`

## Recommended Hosting Options

### Option A: Vercel

1. Import repository in Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy.

### Option B: Netlify

1. Create new site from repository.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy.

### Option C: GitHub Pages (Static)

1. Add a deploy workflow using `vite build`.
2. Publish `dist` contents to Pages.
3. Configure base path in Vite if deploying under subpath.

## Runtime Configuration

Current version uses static/mock data with local storage persistence.
No secrets or server environment variables are required.

## Pre-Deploy Checklist

1. `npm run build` succeeds.
2. Verify role-based controls in production preview.
3. Verify responsive layout on small and large screens.
4. Confirm docs and README are updated.

## Post-Deploy Checklist

1. Open deployed URL in desktop and mobile.
2. Validate charts and table rendering.
3. Validate add/edit flow as Admin.
4. Validate Viewer restrictions.
