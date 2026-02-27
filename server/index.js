// Express API server for WatchGuard BOM Configurator
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = initDb();

// ── GET /api/categories ───────────────────────────────────
// Returns the 3 product families with their product groups
app.get('/api/categories', (_req, res) => {
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
    // Attach the appliance SKU info
    const appliance = db.prepare(`
      SELECT sku_code, full_sku, name, msrp, url
      FROM skus
      WHERE product_group_id = ? AND sku_type = 'appliance'
      LIMIT 1
    `).get(g.id);

    const cat = categories[g.category];
    if (cat) {
      cat.products.push({
        ...g,
        appliance: appliance || null,
      });
    }
  }

  res.json(categories);
});

// ── GET /api/products/:slug ───────────────────────────────
// Returns a single product group with all its SKUs and features
app.get('/api/products/:slug', (req, res) => {
  const group = db.prepare(`
    SELECT id, slug, name, family, category, description, image_file
    FROM product_groups WHERE slug = ?
  `).get(req.params.slug);

  if (!group) return res.status(404).json({ error: 'Product not found' });

  const allSkus = db.prepare(`
    SELECT id, sku_code, full_sku, name, msrp, delivery_method, url, sku_type, subscription_type, term_years
    FROM skus WHERE product_group_id = ?
    ORDER BY sku_type, subscription_type, term_years
  `).all(group.id);

  const features = db.prepare(`
    SELECT feature_category, feature_name, feature_value, sort_order
    FROM product_features WHERE product_group_id = ?
    ORDER BY feature_category, sort_order
  `).all(group.id);

  // Group features by category
  const featureGroups = {};
  for (const f of features) {
    if (!featureGroups[f.feature_category]) featureGroups[f.feature_category] = [];
    featureGroups[f.feature_category].push({ name: f.feature_name, value: f.feature_value });
  }

  // Separate SKU types
  const appliance     = allSkus.find(s => s.sku_type === 'appliance') || null;
  const subscriptions = allSkus.filter(s => s.sku_type === 'subscription');
  const tradeUps      = allSkus.filter(s => s.sku_type === 'trade_up');
  const ha            = allSkus.filter(s => s.sku_type === 'high_availability');
  const bundles       = allSkus.filter(s => s.sku_type === 'activation_bundle');

  res.json({
    ...group,
    appliance,
    subscriptions,
    tradeUps,
    highAvailability: ha,
    activationBundles: bundles,
    features: featureGroups,
  });
});

// ── GET /api/products/:slug/subscriptions ─────────────────
// Returns just the subscriptions for a product group (for dropdown)
app.get('/api/products/:slug/subscriptions', (req, res) => {
  const group = db.prepare(`SELECT id FROM product_groups WHERE slug = ?`).get(req.params.slug);
  if (!group) return res.status(404).json({ error: 'Product not found' });

  const subs = db.prepare(`
    SELECT sku_code, full_sku, name, msrp, url, subscription_type, term_years
    FROM skus
    WHERE product_group_id = ? AND sku_type = 'subscription'
    ORDER BY subscription_type, term_years
  `).all(group.id);

  // Group by subscription_type
  const grouped = {};
  for (const s of subs) {
    if (!grouped[s.subscription_type]) grouped[s.subscription_type] = [];
    grouped[s.subscription_type].push(s);
  }

  res.json(grouped);
});

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`WatchGuard API running on http://localhost:${PORT}`);
});
