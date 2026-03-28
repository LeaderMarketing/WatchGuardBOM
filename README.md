# WatchGuard Product Configurator

A React + Vite product catalogue and quote-building tool for WatchGuard hardware, subscriptions, and cloud/virtual products. Sold through the Leader Systems partner channel.

Live site: **https://leadermarketing.github.io/WatchGuard/**

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Data Architecture](#data-architecture)
- [Updating Prices](#updating-prices)
- [Updating Product Specs](#updating-product-specs)
- [Adding New Products](#adding-new-products)
- [Deploying to GitHub Pages](#deploying-to-github-pages)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v7, Vite |
| Backend | Node.js, Express 5 |
| Database | SQLite via `better-sqlite3` |
| Icons | Phosphor Icons |
| PDF export | jsPDF + jsPDF-AutoTable |
| Deployment | GitHub Pages via `gh-pages` |

---

## Getting Started

```bash
npm install
npm run dev
```

This starts both the Vite dev server (frontend, port 5173) and the Express API (backend, port 3001). On first run — or whenever a source data file changes — the database is automatically re-seeded.

**All commands:**

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start frontend + backend concurrently |
| `npm run dev:frontend` | Start Vite only (no backend) |
| `npm run dev:backend` | Start Express only |
| `npm run seed` | Force a full database re-seed |
| `npm run export-data` | Export database to static JSON (required before deploy) |
| `npm run build` | Vite production build |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | export-data + build + push to `gh-pages` branch |

---

## Project Structure

```
├── src/
│   ├── App.jsx                            # Root component + routing
│   ├── components/
│   │   ├── ProductCatalog/                # Security Appliances tab
│   │   │   ├── ProductCatalog.jsx
│   │   │   ├── hooks/                     # useProductData, useSubscriptions, etc.
│   │   │   └── parts/                     # ProductColumns, SubscriptionRow, SpecsSection
│   │   ├── VirtualCatalog/                # Virtual tab (FireboxV)
│   │   ├── CloudCatalog/                  # Cloud tab (Firebox Cloud)
│   │   ├── TopLevelNav/                   # Navigation bar
│   │   ├── QuoteCartPanel/                # Quote cart + PDF export
│   │   └── ...
│   ├── context/
│   │   └── QuoteContext.jsx               # Quote cart state (React Context)
│   └── data/
│       ├── WGdata_YYYYMMDD_HHMMSS.csv     # ★ SINGLE PRICING SOURCE — drop new file here
│       ├── featureSpecs.shared.cjs        # Product specs (shared by frontend + backend)
│       ├── featureSpecs.js                # ESM wrapper for the above
│       ├── productPrices.js               # Price lookups (reads WGdata CSV)
│       ├── productSkus.js                 # SKU code mapping entry point
│       └── productSkus/
│           ├── tabletop.js                # T-Series SKU codes
│           ├── mSeries.js                 # M-Series SKU codes
│           ├── wifi.js                    # Wi-Fi AP SKU codes
│           └── fireboxV.js               # FireboxV SKU codes
│
├── server/
│   ├── index.js                           # Express API (3 endpoints)
│   ├── seed.js                            # Builds SQLite DB from CSV sources
│   ├── db.js                              # SQLite schema
│   ├── products.db                        # Auto-generated database (do not edit)
│   └── data/
│       └── product-catalog.csv            # Product structure (groups, URLs, delivery method)
│
├── scripts/
│   └── export-static-data.cjs            # DB → static JSON for GitHub Pages
│
├── public/
│   └── static-data/                       # Pre-exported JSON (GitHub Pages fallback)
│       ├── categories.json
│       └── product-{slug}.json
│
└── dist/                                  # Vite build output
```

---

## Data Architecture

### Single source of truth for pricing

All pricing across every tab comes from one file:

```
src/data/WGdata_YYYYMMDD_HHMMSS.csv
```

This is the CSV export from the Leader Systems datafeed. It contains every WatchGuard SKU with current DBP and RRP values. The app uses the **RRP column** (column 8).

There are no other price files. If you see prices that are wrong, you need a fresh WGdata export.

### Two files, two responsibilities

| File | Lives in | Purpose | How often it changes |
|------|----------|---------|---------------------|
| `WGdata_*.csv` | `src/data/` | **Pricing** — RRP for every SKU | Whenever prices change |
| `product-catalog.csv` | `server/data/` | **Product structure** — which SKUs exist, their grouping, and partner order URLs | Only when adding/removing products |

The product catalog CSV defines *what products exist* (names, product families, groups like "M290", delivery method, partner ordering URLs). It does **not** contain prices — those come exclusively from the WGdata CSV.

### How data flows to the frontend

```
                    ┌──────────────────────┐
                    │  WGdata_*.csv        │
                    │  (pricing — RRP)     │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                 │
              ▼                ▼                 ▼
   ┌──────────────────┐  ┌──────────┐   ┌──────────────┐
   │  seed.js          │  │ product  │   │ productPrices│
   │  + product-       │  │ Prices.js│   │ .js (Vite    │
   │  catalog.csv      │  │ (browser │   │  glob import)│
   │                   │  │  import) │   │              │
   └────────┬──────────┘  └────┬─────┘   └──────┬───────┘
            │                  │                  │
            ▼                  ▼                  ▼
   ┌─────────────────┐  ┌──────────┐   ┌──────────────┐
   │  SQLite DB       │  │ Virtual  │   │ Cloud        │
   │  → Express API   │  │ Catalog  │   │ Catalog      │
   │  → static JSON   │  │ tab      │   │ tab          │
   └────────┬─────────┘  └──────────┘   └──────────────┘
            │
            ▼
   ┌─────────────────┐
   │ Security        │
   │ Appliances tab  │
   │ (+ Wi-Fi APs)   │
   └─────────────────┘
```

**Security Appliances tab:** The backend `seed.js` combines `product-catalog.csv` (structure) with `WGdata_*.csv` (prices) to populate the SQLite database. The Express API serves this data. On GitHub Pages, pre-exported static JSON files are used instead.

**Virtual / Cloud tabs:** `productPrices.js` reads the same `WGdata_*.csv` directly in the browser via Vite glob import. SKU codes come from `src/data/productSkus/*.js`.

Both paths read pricing from the same WGdata CSV — the difference is only in *when* it's read (server startup vs browser load).

### How the backend serves data

**API endpoints (Express, port 3001):**

| Endpoint | Returns |
|----------|---------|
| `GET /api/categories` | Product groups with appliance SKU for all tabs |
| `GET /api/products/:slug` | Full product detail — all SKUs, specs, prices |
| `GET /api/products/:slug/subscriptions` | Subscriptions only (grouped by type) |

**Frontend fallback:** The `useProductData` hook calls `fetchWithFallback()` which tries the API first. If unreachable (GitHub Pages), it loads `public/static-data/{file}.json` instead.

### Auto-reseed trigger

`seedIfNeeded()` runs every time the Express server starts. It compares the modification time of `server/products.db` against:

- `server/data/product-catalog.csv`
- `src/data/WGdata_*.csv` (latest)
- `src/data/featureSpecs.shared.cjs`

If **any** file is newer than the database, a full re-seed runs automatically.

### Database schema

```
product_groups   id, slug, name, family, category, description, image_file
skus             id, sku_code, full_sku, name, msrp, delivery_method,
                 product_group_id, url, sku_type, subscription_type, term_years
product_features id, product_group_id, feature_category, feature_name,
                 feature_value, sort_order
```

`sku_type` values: `appliance` | `subscription` | `trade_up` | `high_availability` | `activation_bundle`

---

## Updating Prices

### Step by step

1. Export a fresh CSV from the Leader Systems datafeed
2. Save it as `WGdata_YYYYMMDD_HHMMSS.csv` in `src/data/`
3. Delete the old `WGdata_*.csv` to keep the repo clean
4. Restart the dev server — the database re-seeds automatically

The console will confirm:
```
Seeded successfully:
  29 product groups
  339 SKUs (331 with prices, 8 showing TBC)
  337 feature entries
  pricing source: WGdata_20260325_101329.csv
```

### WGdata CSV format

The datafeed CSV must have these 8 columns:

```
STOCK CODE | SUBCATEGORY NAME | SHORT DESCRIPTION | IMAGE | MANUFACTURER | MFR SKU | DBP | RRP
```

The app uses **column 1** (`STOCK CODE`, e.g. `NWG-WGM290000`) as the SKU lookup key and **column 8** (`RRP`) as the price. All other columns are ignored by the price system.

### Before deploying

After updating prices locally, regenerate the static JSON for GitHub Pages:

```bash
npm run export-data
```

This must be committed before pushing. The GitHub Actions workflow does **not** run this step.

---

## Updating Product Specs

The comparison specs (UTM throughput, firewall throughput, VPN tunnels, etc.) have a single source of truth:

```
src/data/featureSpecs.shared.cjs
```

This file is shared between the frontend UI and the backend seed. After editing:

1. Restart the dev server (auto-reseeds)
2. Run `npm run export-data` before deploying

---

## Adding New Products

### To the Security Appliances tab

1. **Add SKUs to `server/data/product-catalog.csv`** — one row per SKU (appliance + subscriptions + HA). The `Product Group` column becomes the product slug.

2. **Add specs to `src/data/featureSpecs.shared.cjs`** — performance figures, interfaces, etc.

3. **Add an image** — place in `public/images/` and add the slug-to-filename mapping in the `IMAGE_MAP` object in `server/seed.js`. Also add the product description to `DESCRIPTIONS` in the same file.

4. **Ensure the WGdata CSV has prices** for the new SKUs — the datafeed should include them automatically.

5. **Re-seed and export:**
   ```bash
   node server/seed.js
   npm run export-data
   ```

### To the Virtual / Cloud tabs

1. Add SKU code mappings to the relevant file in `src/data/productSkus/`
2. Prices are resolved automatically from the WGdata CSV

---

## Deploying to GitHub Pages

The site deploys to the `gh-pages` branch. GitHub Actions builds automatically on every push to `main`.

### Workflow

```bash
# 1. Make changes (code, data, prices)
# 2. Re-export static data from the updated database
npm run export-data

# 3. Commit and push
git add -A
git commit -m "your message"
git push
```

GitHub Actions runs `npm ci` + `npm run build` and publishes `dist/`. The static JSON in `public/static-data/` must be up to date in the commit.

### After deploy

Hard refresh the site (**Ctrl+F5**) — GitHub Pages can serve cached assets.

### Optional: preview before pushing

```bash
npm run export-data
npm run build
npm run preview
```

---

## Application Tabs

| Tab | Route | Status | Component | Data source |
|-----|-------|--------|-----------|-------------|
| Security Appliances | `/` | Live | `ProductCatalog` | SQLite DB / static JSON |
| Virtual | `/virtual` | Live | `VirtualCatalog` | WGdata CSV (browser) |
| Cloud | `/cloud` | Live | `CloudCatalog` | WGdata CSV (browser) |
| Renewals/Upgrades | `/renewals` | Coming soon | — | — |
| MDR & XDR | `/mdr-xdr` | Coming soon | — | — |
| Endpoint & Mobile | `/endpoint` | Coming soon | — | — |
| Identity & Access | `/identity` | Coming soon | — | — |
| Email Security | `/email` | Coming soon | — | — |

### Security Appliances sub-tabs

| Sub-tab | Products |
|---------|---------|
| Firebox Tabletop (T-Series) | T25-W, T45-PoE, T45-W-PoE, T45-CW, T115-W, T125, T125-W, T145, T145-W, T185 |
| Firebox Rackmount (M-Series) | M290, M295, M390, M395, M495, M590, M595, M690, M695, M4800, M5800 |
| Wi-Fi 6 Access Points | AP130, AP230W, AP330, AP332CR, AP430CR, AP432 |
