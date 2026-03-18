/**
 * export-static-data.cjs
 * ──────────────────────
 * Reads the seeded SQLite database and exports all API responses
 * as static JSON files into public/static-data/.
 * These files are used as a fallback when the Express backend is unavailable
 * (e.g. on GitHub Pages).
 *
 * Run: node scripts/export-static-data.cjs
 */

const fs = require('fs');
const path = require('path');
const { initDb, DB_PATH } = require('../server/db');
const { seedIfNeeded } = require('../server/seed');
const { SECTION_DEFS } = require('../src/data/featureSpecs.shared.cjs');

const OUT_DIR = path.join(__dirname, '..', 'public', 'static-data');

// Ensure DB is up to date
seedIfNeeded();
const db = initDb();

// Create output directory
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Export /api/categories ────────────────────────────────
function exportCategories() {
  const groups = db.prepare(`
    SELECT id, slug, name, family, category, description, image_file
    FROM product_groups
    ORDER BY family, name
  `).all();

  const categories = {
    tabletop: { label: 'Firebox Tabletop (T-Series)', products: [] },
    mseries:  { label: 'Firebox Rackmount (M-Series)', products: [] },
    wifi:     { label: 'Wi-Fi 6 Access Points', products: [] },
  };

  for (const g of groups) {
    const appliance = db.prepare(`
      SELECT sku_code, full_sku, name, msrp, url
      FROM skus
      WHERE product_group_id = ? AND sku_type = 'appliance'
      LIMIT 1
    `).get(g.id);

    const cat = categories[g.category];
    if (cat) {
      cat.products.push({ ...g, appliance: appliance || null });
    }
  }

  fs.writeFileSync(
    path.join(OUT_DIR, 'categories.json'),
    JSON.stringify(categories, null, 2),
  );
  console.log('  ✓ categories.json');
  return categories;
}

// ── Export /api/products/:slug ────────────────────────────
function exportProduct(slug) {
  const group = db.prepare(`
    SELECT id, slug, name, family, category, description, image_file
    FROM product_groups WHERE slug = ?
  `).get(slug);

  if (!group) return null;

  const allSkus = db.prepare(`
    SELECT id, sku_code, full_sku, name, msrp, delivery_method, url, sku_type, subscription_type, term_years
    FROM skus WHERE product_group_id = ?
    ORDER BY sku_type, subscription_type, term_years
  `).all(group.id);

  const features = db.prepare(`
    SELECT feature_category, feature_name, feature_value, sort_order
    FROM product_features WHERE product_group_id = ?
    ORDER BY id
  `).all(group.id);

  const featureGroups = {};
  for (const f of features) {
    if (!featureGroups[f.feature_category]) featureGroups[f.feature_category] = [];
    featureGroups[f.feature_category].push({ name: f.feature_name, value: f.feature_value });
  }

  const appliance     = allSkus.find(s => s.sku_type === 'appliance') || null;
  const subscriptions = allSkus.filter(s => s.sku_type === 'subscription');
  const tradeUps      = allSkus.filter(s => s.sku_type === 'trade_up');
  const ha            = allSkus.filter(s => s.sku_type === 'high_availability');
  const bundles       = allSkus.filter(s => s.sku_type === 'activation_bundle');

  const product = {
    ...group,
    appliance,
    subscriptions,
    tradeUps,
    highAvailability: ha,
    activationBundles: bundles,
    specSections: SECTION_DEFS[group.category] || [],
    features: featureGroups,
  };

  fs.writeFileSync(
    path.join(OUT_DIR, `product-${slug}.json`),
    JSON.stringify(product, null, 2),
  );
  console.log(`  ✓ product-${slug}.json`);
  return product;
}

// ── Run ───────────────────────────────────────────────────
console.log('Exporting static data...');
const categories = exportCategories();

let productCount = 0;
for (const cat of Object.values(categories)) {
  for (const p of cat.products) {
    exportProduct(p.slug);
    productCount++;
  }
}

db.close();
console.log(`\nDone! Exported ${productCount} products to ${OUT_DIR}`);
