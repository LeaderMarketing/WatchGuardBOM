// Seed the database from WG Hardware SKUS_full.csv
// Run: node server/seed.js

const fs = require('fs');
const path = require('path');
const { initDb } = require('./db');

const CSV_PATH = path.join(__dirname, '..', 'WG Hardware SKUS_full.csv');

// ── Parse CSV (handles quoted fields with commas) ─────────
function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseMsrp(raw) {
  if (!raw) return 0;
  const cleaned = raw.replace(/[$,\s]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

// ── Classify SKU type from name ───────────────────────────
function classifySku(name, deliveryMethod) {
  if (deliveryMethod === 'Physical') return { type: 'appliance', subType: null };
  const lower = name.toLowerCase();
  if (lower.includes('points activation bundle')) return { type: 'activation_bundle', subType: null };
  if (lower.includes('trade up')) {
    // Detect the underlying subscription type  
    if (lower.includes('total security'))       return { type: 'trade_up', subType: 'Total Security Suite' };
    if (lower.includes('basic security'))       return { type: 'trade_up', subType: 'Basic Security Suite' };
    return { type: 'trade_up', subType: null };
  }
  if (lower.includes('high availability'))      return { type: 'high_availability', subType: 'High Availability' };
  if (lower.includes('total security'))         return { type: 'subscription', subType: 'Total Security Suite' };
  if (lower.includes('basic security'))         return { type: 'subscription', subType: 'Basic Security Suite' };
  if (lower.includes('standard support'))       return { type: 'subscription', subType: 'Standard Support' };
  if (lower.includes('usp wi-fi'))              return { type: 'subscription', subType: 'USP Wi-Fi' };
  if (lower.includes('standard wi-fi'))         return { type: 'subscription', subType: 'Standard Wi-Fi' };
  return { type: 'other', subType: null };
}

// ── Extract term years from name ──────────────────────────
function extractTerm(name) {
  const m = name.match(/(\d+)[- ](?:year|yr)/i);
  if (m) return parseInt(m[1], 10);
  if (/1-month/i.test(name)) return 0; // Monthly subscription
  return null;
}

// ── Map Product Group to category ─────────────────────────
function familyToCategory(family) {
  if (family === 'Access Points') return 'wifi';
  if (family === 'M-Series')      return 'mseries';
  if (family === 'T-Series')      return 'tabletop';
  return 'other';
}

// ── Map product group slug to image file ──────────────────
const IMAGE_MAP = {
  'AP130':   'AP130.jpg',
  'AP230W':  'AP230W.jpg',
  'AP330':   'AP330.jpg',
  'AP332CR': 'AP332CER.jpg',
  'AP430CR': 'AP430CR.jpg',
  'AP432':   'AP432.jpg',
  'M290':    'm295.jpg',     // share image with M295 for now
  'M295':    'm295.jpg',
  'M390':    'm395.jpg',     // share image with M395 for now  
  'M395':    'm395.jpg',
  'M4800':   'm4800.jpg',
  'M495':    'm495.jpg',
  'M5800':   'm5800.jpg',
  'M590':    'm595.jpg',     // share image with M595 for now
  'M595':    'm595.jpg',
  'M690':    'm695.jpg',     // share image with M695 for now
  'M695':    'm695.jpg',
  'T115-W':  'T115-W.jpg',
  'T125':    'T125.jpg',
  'T125-W':  'T125-W.jpg',
  'T145':    'T145.jpg',
  'T145-W':  'T145.jpg',    // share image with T145 for now
  'T185':    'T185.jpg',
  'T25-W':   'T115-W.jpg',  // share image for now
  'T45-CW':  'T145.jpg',    // share image for now
  'T45-PoE': 'T145.jpg',    // share image for now
  'T45-W-PoE': 'T145.jpg',  // share image for now
};

// ── Map Product Group to friendly display name ────────────
function groupToDisplayName(slug, family) {
  if (family === 'Access Points') return `WatchGuard ${slug}`;
  if (family === 'M-Series')      return `Firebox ${slug}`;
  if (family === 'T-Series')      return `Firebox ${slug}`;
  return slug;
}

// ── Short descriptions (from existing productData.js) ─────
const DESCRIPTIONS = {
  'AP130':   'Entry-level Wi-Fi 6 for small offices and remote workers',
  'AP230W':  'Wall-plate AP with built-in switch for hospitality',
  'AP330':   'Medium-density AP for retail and K-12 schools',
  'AP332CR': 'Rugged outdoor AP for retail and manufacturing',
  'AP430CR': 'High-density outdoor AP for stadiums and campuses',
  'AP432':   'High-density 4x4 AP for large campuses',
  'M290':    'Rackmount UTM for small-medium businesses',
  'M295':    'Rackmount UTM for medium-sized businesses',
  'M390':    'Mid-range rackmount firewall for growing networks',
  'M395':    'High-throughput firewall for demanding networks',
  'M4800':   'Data center firewall with 40Gb fiber options',
  'M495':    'Enterprise-grade security with modular expansion',
  'M5800':   'Enterprise flagship with unrestricted VPN tunnels',
  'M590':    'High-performance rackmount for large organizations',
  'M595':    'Advanced threat protection for large organizations',
  'M690':    'High-capacity firewall for enterprise campuses',
  'M695':    'Maximum performance rackmount appliance',
  'T115-W':  'Entry-level firewall with built-in Wi-Fi 7 for small offices',
  'T125':    'Compact UTM appliance for small business networks',
  'T125-W':  'Compact UTM appliance with built-in Wi-Fi 7 antennas',
  'T145':    'Mid-range tabletop firewall with SFP+ connectivity',
  'T145-W':  'Mid-range tabletop firewall with Wi-Fi 7',
  'T185':    'High-performance tabletop for growing businesses',
  'T25-W':   'Entry-level firewall with Wi-Fi for home offices',
  'T45-CW':  'Cellular WAN tabletop firewall with 5G/LTE',
  'T45-PoE': 'Tabletop firewall with Power over Ethernet ports',
  'T45-W-PoE': 'Tabletop firewall with Wi-Fi and PoE ports',
};

// ── Seed dummy feature data ───────────────────────────────
function seedFeatures(db, groupId, slug, family) {
  const insert = db.prepare(`
    INSERT INTO product_features (product_group_id, feature_category, feature_name, feature_value, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  if (family === 'T-Series') {
    insert.run(groupId, 'Overview', 'Ideal For', 'Small to mid-size businesses', 1);
    insert.run(groupId, 'Performance', 'UTM (Full Scan)', 'See datasheet', 1);
    insert.run(groupId, 'Performance', 'Firewall (UDP 1518)', 'See datasheet', 2);
    insert.run(groupId, 'Performance', 'VPN (UDP 1518)', 'See datasheet', 3);
    insert.run(groupId, 'Performance', 'IPS (Full Scan)', 'See datasheet', 4);
    insert.run(groupId, 'VPN Tunnels', 'Branch Office VPN', 'See datasheet', 1);
    insert.run(groupId, 'VPN Tunnels', 'Mobile VPN', 'See datasheet', 2);
    insert.run(groupId, 'Hardware', 'Interfaces', 'See datasheet', 1);
  } else if (family === 'M-Series') {
    insert.run(groupId, 'Overview', 'Ideal For', 'Medium to large enterprises', 1);
    insert.run(groupId, 'Performance', 'UTM (Full Scan)', 'See datasheet', 1);
    insert.run(groupId, 'Performance', 'Firewall (UDP 1518)', 'See datasheet', 2);
    insert.run(groupId, 'Performance', 'VPN (UDP 1518)', 'See datasheet', 3);
    insert.run(groupId, 'Performance', 'IPS (Full Scan)', 'See datasheet', 4);
    insert.run(groupId, 'VPN Tunnels', 'Branch Office VPN', 'See datasheet', 1);
    insert.run(groupId, 'VPN Tunnels', 'Mobile VPN', 'See datasheet', 2);
    insert.run(groupId, 'Hardware', 'Interfaces', 'See datasheet', 1);
  } else if (family === 'Access Points') {
    insert.run(groupId, 'Overview', 'Recommended Use Cases', DESCRIPTIONS[slug] || 'See datasheet', 1);
    insert.run(groupId, 'Technical Specs', 'Radios & Streams', 'See datasheet', 1);
    insert.run(groupId, 'Technical Specs', 'Maximum Data Rate', 'See datasheet', 2);
    insert.run(groupId, 'Technical Specs', 'Ports', 'See datasheet', 3);
    insert.run(groupId, 'Technical Specs', 'Power Consumption', 'See datasheet', 4);
  }
}

// ── MAIN ──────────────────────────────────────────────────
function seed() {
  const raw = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = raw.split(/\r?\n/).filter(l => l.trim());
  const header = lines[0]; // skip header
  const rows = lines.slice(1);

  const db = initDb();

  // Clear existing data
  db.exec('DELETE FROM product_features');
  db.exec('DELETE FROM skus');
  db.exec('DELETE FROM product_groups');

  // Collect unique product groups
  const groupSet = new Map();
  const parsedRows = [];

  for (const line of rows) {
    const fields = parseCsvLine(line);
    if (fields.length < 7) continue;

    const [fullSku, name, msrpRaw, deliveryMethod, family, group, url] = fields;
    const msrp = parseMsrp(msrpRaw);
    const skuCode = fullSku.replace(/^NWG-/, '');
    const { type, subType } = classifySku(name, deliveryMethod);
    const term = extractTerm(name);

    if (!groupSet.has(group)) {
      groupSet.set(group, { family, category: familyToCategory(family) });
    }

    parsedRows.push({ fullSku, skuCode, name, msrp, deliveryMethod, family, group, url, type, subType, term });
  }

  // Insert product groups
  const insertGroup = db.prepare(`
    INSERT INTO product_groups (slug, name, family, category, description, image_file)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const groupIdMap = {};

  for (const [slug, info] of groupSet.entries()) {
    const displayName = groupToDisplayName(slug, info.family);
    const desc = DESCRIPTIONS[slug] || '';
    const img = IMAGE_MAP[slug] || null;
    const result = insertGroup.run(slug, displayName, info.family, info.category, desc, img);
    groupIdMap[slug] = result.lastInsertRowid;
    seedFeatures(db, result.lastInsertRowid, slug, info.family);
  }

  // Insert SKUs
  const insertSku = db.prepare(`
    INSERT INTO skus (sku_code, full_sku, name, msrp, delivery_method, product_group_id, url, sku_type, subscription_type, term_years)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((rows) => {
    for (const r of rows) {
      insertSku.run(
        r.skuCode, r.fullSku, r.name, r.msrp, r.deliveryMethod,
        groupIdMap[r.group], r.url, r.type, r.subType, r.term
      );
    }
  });

  insertMany(parsedRows);

  // Summary
  const groupCount = db.prepare('SELECT COUNT(*) as c FROM product_groups').get().c;
  const skuCount = db.prepare('SELECT COUNT(*) as c FROM skus').get().c;
  const featureCount = db.prepare('SELECT COUNT(*) as c FROM product_features').get().c;

  console.log(`Seeded successfully:`);
  console.log(`  ${groupCount} product groups`);
  console.log(`  ${skuCount} SKUs`);
  console.log(`  ${featureCount} feature entries`);

  db.close();
}

seed();
