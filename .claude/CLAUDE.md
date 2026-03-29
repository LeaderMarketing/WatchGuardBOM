# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WatchGuard Product Configurator — a React+Vite product catalog and quote builder for WatchGuard hardware, subscriptions, and cloud/virtual products sold through the Leader Systems partner channel. Live at https://leadermarketing.github.io/WatchGuard/.

## Commands

```bash
npm run dev              # Start Vite (port 5173) + Express API (port 3001) concurrently
npm run dev:frontend     # Vite only
npm run dev:backend      # Express only
npm run seed             # Force full database re-seed from CSVs
npm run export-data      # Export DB to static JSON (REQUIRED before deploy)
npm run build            # Vite production build
npm run deploy           # export-data + build + push to gh-pages
```

There are no tests or linting configured. Verification is manual (run dev server, check tabs).

After any data change (CSV edits, seed.js changes), always run `npm run export-data` to regenerate `public/static-data/`.

## Data Architecture (Critical)

Two CSV files seed the SQLite database — understand this or you'll break things:

| File | Purpose | Location |
|------|---------|----------|
| `server/data/product-catalog.csv` | **Structure**: 1,262 SKUs — names, families, groups, delivery method, dealer URLs | 6 columns, no prices |
| `src/data/WGdata_*.csv` | **Pricing**: RRP for every SKU from Leader Systems datafeed | Column 1 = SKU, Column 8 = RRP |

`server/seed.js` merges both into `server/products.db` (SQLite). The Express API serves it; on GitHub Pages, pre-exported static JSON files are used instead. The database auto-reseeds when source files are newer than `products.db`.

**product-catalog.csv columns**: `SKU, Name, Method of Delivery, Product Family, Product Group, url in dealershop`

**DB schema** (3 tables): `product_groups` (75 rows) → `skus` (1,262 rows) → `product_features` (337 rows). `sku_type` values: `appliance`, `subscription`, `trade_up`, `high_availability`, `activation_bundle`.

## Architecture — Two Hook Families

All catalog tabs fetch data through `src/hooks/useCatalogApi.js` which tries the Express API first, then falls back to `public/static-data/category-{slug}.json`. Two shared hooks sit on top:

### `useApplianceCatalog(category)` — for Virtual, Cloud, Renewals
Builds lookups keyed by `model → serviceType → term → { sku, price, url }`. Used by tabs where products are hardware models with subscription tiers (Basic Security, Total Security, etc.) and term lengths (1/3/5 Year).

### `usePerUserCatalog(category, productConfig)` — for Endpoint, Identity, Email, MDR/NDR
Builds lookups keyed by `product → licenseTier → term → { sku, price, url }`. Used by tabs where products have per-user pricing across license tiers (1-50, 51-100, etc.). The `productConfig` array is defined in each component's `hooks/use*Data.js` file and defines product metadata (label, description, section grouping). **Important**: this hook returns `products` (lowercase) — components must destructure the lowercase name.

### ProductCatalog (Security Appliances) — special case
The `/` route uses `src/components/ProductCatalog/hooks/useProductData.js` which fetches individual product data via `/api/products/:slug`. It also uses `src/data/productSkus/` (T-Series, M-Series, Wi-Fi) and `src/data/productPrices.js` for the client-side SKU→price mapping. This is the only tab that still uses the legacy client-side SKU system.

### ApplianceRenewals — merges multiple categories
`useApplianceRenewals` and `useRenewalsData` each fetch from multiple API categories (renewals + tabletop + mseries) and merge the lookups, because renewal SKUs for a given model may live in different database categories.

## Dual Deployment

The app runs in two modes with identical UX:
- **Local dev**: Express API on port 3001, Vite proxies `/api` requests
- **GitHub Pages**: No backend. `useCatalogApi` falls back to `public/static-data/*.json`

Static JSON must be committed before pushing. GitHub Actions runs `npm ci` + `npm run build` but does NOT run `export-data`.

## Key Patterns

- **Vite base path**: `/WatchGuardBOM/` (configured in `vite.config.mjs`). All routes are relative to this.
- **Quote cart**: `QuoteContext.jsx` (React Context + useReducer). Persists across tabs. `addItem({ sku, name, description, unitPrice })` is the standard interface. PDF export via jsPDF.
- **`formatPrice(null)` returns `'TBC'`** — when data is loading, all lookups return null. Always guard with a loading check before rendering prices, or users see a flash of "TBC" on every price.
- **seed.js parses CSV from both ends** — `fields[0]` and `fields[1]` from the left, `fields[-1]`, `fields[-2]`, etc. from the right. This handles unquoted prices with commas (e.g. `$2,300.00`) that split into extra fields. If you change CSV columns, understand this parser.
- **CSS Modules**: Every component uses `*.module.css` for scoped styling.
- **Icons**: Phosphor Icons (`@phosphor-icons/react`). Import individual icons, not the full set.
- **Dealer URLs**: Encrypted permanent links in product-catalog.csv. Each SKU maps to a unique URL on the Leader Systems partner site.

## Adding Products

**Appliances**: Add rows to `product-catalog.csv` + specs to `src/data/featureSpecs.shared.cjs` + image mapping in `server/seed.js` (`IMAGE_MAP` and `DESCRIPTIONS`).

**Everything else** (Virtual, Cloud, Endpoint, etc.): Add rows to `product-catalog.csv` with correct Product Family and Product Group. Re-seed and export.

## Gotchas

- `server/products.db` is auto-generated — never edit it directly.
- `public/static-data/` JSON files are auto-generated — never edit directly. Always regenerate via `npm run export-data`.
- The `dist/` directory is gitignored. Don't try to commit build artifacts.
- Backend files use CommonJS (`require`/`module.exports`). Frontend files use ESM (`import`/`export`). `featureSpecs.shared.cjs` is CJS because it's shared by both.
- When creating git worktrees, use `.worktrees/` directory (already in `.gitignore`).
