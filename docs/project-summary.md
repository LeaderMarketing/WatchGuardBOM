# WatchGuard Product Configurator — Executive Summary

**Prepared:** March 2026
**Status:** Production (live at [leadermarketing.github.io/WatchGuard](https://leadermarketing.github.io/WatchGuard/))

---

## What This Tool Does and Why It Matters

The WatchGuard Product Configurator is a custom-built web application that gives the Leader Systems sales team a single place to browse, compare, configure, and quote the entire WatchGuard product line.

Before this tool existed, building a quote meant manually looking up SKUs across spreadsheets, cross-referencing prices from a separate datafeed, and copying product details into documents by hand. A single quote could take 15-30 minutes and was prone to errors — wrong SKU codes, outdated prices, missing subscription options.

**Now, a sales rep can:**

- Browse every WatchGuard product across 8 organized tabs
- Compare hardware models side-by-side with real specifications
- Select subscription tiers, license counts, and term lengths with instant pricing
- Build a multi-line quote and export it to PDF in under two minutes
- Click any product to go directly to the Leader Systems dealer shop to place an order

This is not a generic quoting tool. It is purpose-built for the WatchGuard product line, with every SKU, every subscription tier, and every renewal option mapped and priced.

---

## By the Numbers

| Metric | Count |
|--------|-------|
| **Total SKUs managed** | 1,262 |
| **Product categories** | 10 (T-Series, M-Series, Wi-Fi, Virtual, Cloud, Renewals, MDR/XDR, Endpoint, Identity, Email) |
| **Product groups** | 75 (individual product models and services) |
| **Application tabs** | 8 (each with its own interface tailored to the product type) |
| **React components** | 29 UI components |
| **JavaScript/CSS source files** | 87 files |
| **Lines of handwritten code** | ~16,900 |
| **Static data files generated** | 86 JSON files (1 master catalog + 10 categories + 75 individual products) |
| **Git commits (development history)** | 25 tracked iterations |
| **Backend data pipeline files** | 1,366 lines across 5 core files |
| **Product specification entries** | 337 feature data points for hardware comparison |
| **Every SKU links to dealer shop** | Yes — 1,262 unique encrypted ordering URLs |

---

## How It Works (In Plain English)

Think of this application as having three layers, similar to how a retail store operates:

### 1. The Warehouse (Data Pipeline)

Two source files feed the system — like two delivery trucks arriving at a warehouse:

- **The product catalog** defines *what exists*: 1,262 products, their names, families, groupings, and ordering links. Think of this as the inventory manifest.
- **The price feed** from Leader Systems provides current pricing for every SKU. Think of this as the price tag sheet.

When the application starts, an automated process (the "seeder") reads both files, cross-references every product with its price, classifies each SKU by type (hardware, subscription, renewal, trade-up, etc.), and organizes everything into a structured database. If someone drops in a new price file, the system detects the change and rebuilds automatically — no manual intervention required.

### 2. The Stockroom (Database and API)

A local database stores all 1,262 products in an organized structure with three tables: product groups, individual SKUs, and product specifications. An API layer (think of it as a stockroom clerk) responds to requests from the storefront, fetching exactly the data needed for each page.

### 3. The Storefront (User Interface)

The web application presents products across 8 specialized tabs, each designed for its product type:

- **Hardware tabs** (Appliances, Virtual, Cloud) show side-by-side comparison grids with technical specifications, subscription options at multiple term lengths, and one-click ordering
- **Subscription tabs** (Endpoint, Identity, Email, MDR/XDR) present per-user pricing across license tiers (1-50 users, 51-100 users, etc.)
- **Renewals tab** consolidates all renewal and upgrade options for every appliance family

A quote cart follows the user across all tabs, accumulating selected products. When ready, the sales rep exports a professional PDF quote document.

---

## Engineering Challenges Solved

This project required solving several problems that are not obvious from the surface:

### Real-Time Quote Builder with PDF Export

The application maintains a persistent shopping cart (using a pattern called React Context) that works across all 8 tabs. Users can add hardware from one tab, subscriptions from another, and renewals from a third — then export everything as a formatted PDF document. This required building a custom PDF generation pipeline using jsPDF.

### Dual Deployment Architecture

The application runs in two completely different environments:

- **Locally** with a live backend server and database (for development and internal use)
- **On GitHub Pages** as a static website with no server at all (for public/field access)

Every data-fetching component automatically detects which environment it's running in. If the backend server is available, it uses the live API. If not (GitHub Pages), it seamlessly falls back to pre-exported JSON files. The user experience is identical in both modes.

### Automatic Price Synchronization

When the Leader Systems datafeed is updated, a sales administrator simply drops the new CSV file into the project. The system:

1. Detects that the price file is newer than the database
2. Re-reads all 1,262 SKUs
3. Cross-references each SKU code with the new pricing
4. Rebuilds the entire database automatically
5. No code changes required

### Intelligent SKU Classification

Each of the 1,262 SKUs must be automatically classified by type (appliance, subscription, renewal, trade-up, high-availability, activation bundle) and by subtype (Basic Security, Total Security, Standard Support, etc.). The seed process uses pattern matching against product names to make these classifications, then extracts term lengths (1-year, 3-year) and license tiers (1-50 users, 51-100 users). This classification drives how each product is displayed in the interface.

### Cross-Source Data Merging

Product structure (names, families, groupings, ordering URLs) comes from one source. Pricing comes from a completely separate source. Technical specifications come from a third source. The data pipeline merges all three into a unified database, matching on SKU codes. If a SKU exists in the catalog but not in the price feed, it gracefully displays "TBC" (to be confirmed) rather than breaking.

### Interactive Comparison Tables

The Security Appliances tab displays products in a horizontal comparison grid — similar to what you see on consumer electronics review sites — where users can scroll through models and compare firewall throughput, VPN capacity, interface counts, and other specifications side by side. This grid includes sticky headers (the product names stay visible as you scroll down) and drag-to-scroll navigation.

### Consolidated Data Architecture

A recent major engineering effort migrated product data from scattered, hardcoded files across the codebase into a single unified database pipeline. Previously, each product tab maintained its own data — making price updates a multi-file operation. Now, all 10 product categories flow through the same two source files, the same seed process, and the same API layer. This reduced the maintenance surface dramatically and eliminated an entire class of "price mismatch" bugs.

---

## Comparison to Commercial Alternatives

The functionality delivered by this configurator overlaps significantly with commercial CPQ (Configure, Price, Quote) platforms. For context:

| Solution | Cost | Implementation Timeline | Customization |
|----------|------|------------------------|---------------|
| **Salesforce CPQ** | $75-150/user/month | 3-6 months typical | Requires Salesforce ecosystem |
| **DealHub CPQ** | $50-100/user/month | 2-4 months | SaaS platform, limited to their UI |
| **Vendavo / PROS** | Enterprise pricing (6 figures/year) | 6-12 months | Heavy consulting engagement |
| **This configurator** | $0/user/month | Already built and live | 100% tailored to WatchGuard products |

Commercial CPQ tools are designed to be general-purpose. They handle many industries but require extensive configuration to match a specific product line. This tool was built from the ground up for one purpose: making it fast and easy to quote WatchGuard products through the Leader Systems channel. Every screen, every dropdown, every comparison table is designed specifically for this product catalog.

The ongoing cost is zero licensing fees. Updates to pricing require dropping a single file. Updates to the product catalog require editing a single CSV.

---

## This Is a Production-Grade Application

It is worth emphasizing the scope and maturity of this project:

- **Real database** — SQLite with a defined schema (3 tables, 10+ columns, foreign key relationships), not just spreadsheets or flat files
- **API layer** — 4 RESTful endpoints serving structured JSON data, with proper error handling
- **Automated data pipeline** — CSV parsing, cross-source merging, intelligent classification, auto-reseed on file changes
- **Automated deployment** — GitHub Actions CI/CD pipeline that builds and publishes on every push to the main branch
- **Static data export** — a build step that pre-generates 86 JSON files for serverless deployment
- **Component architecture** — 29 React components organized into logical modules with shared hooks, context providers, and reusable parts
- **PDF generation** — client-side document creation with formatted tables and line items
- **Responsive design** — 34 CSS modules providing consistent styling across the application
- **Dual-mode operation** — works identically as a local application with a live backend or as a static website

This is a professionally engineered internal tool — not a prototype, not a weekend project, and not a simple spreadsheet replacement. It represents a meaningful investment in sales efficiency, built to be maintained and extended as the WatchGuard product line evolves.

---

*For technical documentation, see the project [README.md](../README.md).*
