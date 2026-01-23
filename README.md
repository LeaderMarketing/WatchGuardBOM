# WatchGuard Product Comparison (React + Vite)

This project is a React + Vite version of the WatchGuard Product Comparison page, using CSS Modules (no Tailwind) and a component-based structure.

## Local development

```bash
npm install
npm run dev
```

## Publish updates (GitHub Pages)

This repo is deployed to GitHub Pages at https://leadermarketing.github.io/WatchGuard/.

Publishing is intentionally simple:

1. Make your code/data changes.
2. Commit and push to the `main` branch.
3. GitHub Actions automatically builds and deploys to `gh-pages`.

Typical update flow:

```bash
git pull
npm ci
npm run dev

git add -A
git commit -m "Update configurator"
git push
```

Then:

- Open GitHub → Actions tab and wait for the “Deploy to GitHub Pages” workflow to finish.
- Hard refresh the site (Ctrl+F5) if your browser caches old assets.

### Optional: build locally (sanity check)

```bash
npm run build
npm run preview
```
