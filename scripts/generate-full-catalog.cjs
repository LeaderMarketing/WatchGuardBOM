#!/usr/bin/env node
/**
 * generate-full-catalog.cjs
 *
 * Consolidates all SKU data from productSkus/*.js files, JSX SKU_URLS maps,
 * and WGdata CSV into a single product-catalog.csv.
 *
 * Sources:
 *   - productSkus/*.js      → SKU codes organized by product/service/term
 *   - JSX SKU_URLS maps     → SKU code → partner portal URL
 *   - skuUrls.js            → SKU code → URL (appliance renewals)
 *   - WGdata_*.csv          → Names and prices (DBP) for each SKU
 *   - product-catalog.csv   → Existing 339 appliance/wifi SKUs (preserved)
 *
 * Output: Appends new rows to server/data/product-catalog.csv
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const SERVER_DATA = path.join(ROOT, 'server', 'data');

// ── Helpers ──────────────────────────────────────────────────────

/** Parse a simple CSV line respecting quoted fields */
function parseCSVLine(line) {
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

/** Escape a CSV field (wrap in quotes if it contains commas or quotes) */
function csvField(val) {
  if (val == null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

/** Format a number as $X.XX */
function formatPrice(num) {
  if (num == null || isNaN(num)) return '';
  return ` $${Number(num).toFixed(2)} `;
}

// ── Load WGdata pricing ─────────────────────────────────────────

function loadWGdata() {
  const files = fs.readdirSync(path.join(SRC, 'data'))
    .filter(f => f.startsWith('WGdata_') && f.endsWith('.csv'))
    .sort();
  if (!files.length) throw new Error('No WGdata_*.csv found in src/data/');
  const latest = files[files.length - 1];
  console.log(`  Loading prices from ${latest}`);

  const lines = fs.readFileSync(path.join(SRC, 'data', latest), 'utf8')
    .split('\n').filter(l => l.trim());
  // Columns: STOCK CODE, SUBCATEGORY NAME, SHORT DESCRIPTION, IMAGE, MANUFACTURER, MANUFACTURER SKU, DBP, RRP
  const priceMap = {}; // stockCode → { name, dbp }
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    const stockCode = fields[0];
    const name = fields[2];
    const dbp = parseFloat(fields[6]);
    if (stockCode) {
      priceMap[stockCode] = { name, dbp };
    }
  }
  console.log(`  Loaded ${Object.keys(priceMap).length} prices`);
  return priceMap;
}

// ── Extract SKU codes from productSkus JS files ─────────────────

/**
 * Parses a productSkus JS file and returns:
 * { productName: { serviceName: { term: skuCode } } }
 */
function parseProductSkusFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const result = {};

  // Match top-level product keys: 'ProductName': {
  const productRegex = /['"]([^'"]+)['"]\s*:\s*\{/g;
  let productMatch;
  let depth = 0;
  let currentProduct = null;
  let currentService = null;

  // Simple state machine parsing
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || !trimmed) continue;
    if (trimmed.startsWith('export const') || trimmed.startsWith('export default')) continue;
    if (trimmed === '};') continue;

    // Count braces to track depth
    const openBraces = (trimmed.match(/\{/g) || []).length;
    const closeBraces = (trimmed.match(/\}/g) || []).length;

    // Detect key-value with nested object on same line: 'Key': { '1 Year': 'SKU', ... }
    const inlineMatch = trimmed.match(/^['"]([^'"]+)['"]\s*:\s*\{(.+)\}/);
    if (inlineMatch && depth === 1) {
      // This is a service line within a product
      currentService = inlineMatch[1];
      if (currentProduct) {
        if (!result[currentProduct]) result[currentProduct] = {};
        if (!result[currentProduct][currentService]) result[currentProduct][currentService] = {};
        // Parse inline SKU entries
        const inner = inlineMatch[2];
        const skuRegex = /['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g;
        let m;
        while ((m = skuRegex.exec(inner)) !== null) {
          result[currentProduct][currentService][m[1]] = m[2];
        }
      }
      // Don't change depth — braces are balanced on this line
      continue;
    }

    // Detect product/service key opening: 'Name': {
    const keyOpen = trimmed.match(/^['"]([^'"]+)['"]\s*:\s*\{/);
    if (keyOpen) {
      if (depth === 0) {
        currentProduct = keyOpen[1];
        if (!result[currentProduct]) result[currentProduct] = {};
        depth = 1;
      } else if (depth === 1) {
        currentService = keyOpen[1];
        if (!result[currentProduct][currentService]) result[currentProduct][currentService] = {};
        depth = 2;
      }
      continue;
    }

    // Detect SKU entry at depth 2: 'Term': 'SKU_CODE'
    if (depth === 2 && currentProduct && currentService) {
      const skuMatch = trimmed.match(/['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/);
      if (skuMatch) {
        result[currentProduct][currentService][skuMatch[1]] = skuMatch[2];
      }
    }

    // Track depth changes from closing braces
    if (trimmed === '},' || trimmed === '}') {
      if (depth === 2) {
        depth = 1;
        currentService = null;
      } else if (depth === 1) {
        depth = 0;
        currentProduct = null;
      }
    }
  }

  return result;
}

// ── Extract SKU_URLS from JSX/JS files ──────────────────────────

function extractSkuUrls(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const urls = {};

  // Match: 'SKU_CODE': 'URL'
  const regex = /['"]([A-Z0-9-]+)['"]\s*:\s*['"]([^'"]+)['"]/g;
  let match;

  // Only capture lines within SKU_URLS block
  const skuUrlsStart = content.indexOf('SKU_URLS');
  if (skuUrlsStart === -1) return urls;

  const block = content.substring(skuUrlsStart);
  // Find the closing of the object
  let braceCount = 0;
  let started = false;
  let end = block.length;
  for (let i = 0; i < block.length; i++) {
    if (block[i] === '{') { braceCount++; started = true; }
    if (block[i] === '}') { braceCount--; }
    if (started && braceCount === 0) { end = i + 1; break; }
  }

  const urlBlock = block.substring(0, end);
  while ((match = regex.exec(urlBlock)) !== null) {
    if (match[1].startsWith('NWG-')) {
      urls[match[1]] = match[2];
    }
  }

  return urls;
}

// ── Load existing product-catalog.csv SKUs ──────────────────────

function loadExistingSkus() {
  const csvPath = path.join(SERVER_DATA, 'product-catalog.csv');
  const lines = fs.readFileSync(csvPath, 'utf8').split('\n').filter(l => l.trim());
  const existing = new Set();
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    if (fields[0]) existing.add(fields[0]);
  }
  return existing;
}

// ── Build name for a SKU from its context ───────────────────────

function buildName(productName, serviceName, term, familyType) {
  if (familyType === 'per_user') {
    // e.g., "WatchGuard EPP 1-50 users - 1 Year"
    // serviceName is the tier like "1-50", "51-100", etc.
    return `${productName} ${serviceName} users - ${term}`;
  }
  // Appliance-style (Virtual, Cloud, Renewals)
  // e.g., "Basic Security Suite 1-yr for FireboxV Small"
  const termShort = term === '1 Year' ? '1-yr' : term === '3 Year' ? '3-yr' : term;
  return `${serviceName} ${termShort} for ${productName}`;
}

// ── Main ────────────────────────────────────────────────────────

function main() {
  console.log('=== Generating full product catalog ===\n');

  // 1. Load pricing from WGdata
  const priceMap = loadWGdata();

  // 2. Load existing SKUs to avoid duplicates
  const existingSkus = loadExistingSkus();
  console.log(`  Existing catalog has ${existingSkus.size} SKUs\n`);

  // 3. Load all URL maps
  console.log('Loading URL maps...');
  const allUrls = {};

  const urlSources = [
    { file: 'src/components/VirtualCatalog/VirtualCatalog.jsx', label: 'Virtual' },
    { file: 'src/components/CloudCatalog/CloudCatalog.jsx', label: 'Cloud' },
    { file: 'src/components/MdrNdrCatalog/MdrNdrCatalog.jsx', label: 'MDR/NDR' },
    { file: 'src/components/EndpointCatalog/EndpointCatalog.jsx', label: 'Endpoint' },
    { file: 'src/components/IdentityCatalog/IdentityCatalog.jsx', label: 'Identity' },
    { file: 'src/components/EmailCatalog/EmailCatalog.jsx', label: 'Email' },
    { file: 'src/components/ApplianceRenewals/skuUrls.js', label: 'Renewals' },
  ];

  for (const { file, label } of urlSources) {
    const urls = extractSkuUrls(path.join(ROOT, file));
    const count = Object.keys(urls).length;
    console.log(`  ${label}: ${count} URLs`);
    Object.assign(allUrls, urls);
  }
  console.log(`  Total URLs loaded: ${Object.keys(allUrls).length}\n`);

  // 4. Parse productSkus files and generate new CSV rows
  console.log('Parsing product SKU files...');

  const newRows = []; // { sku, name, dbp, delivery, family, group, url }

  // ── Virtual ──
  const virtualSkus = parseProductSkusFile(path.join(SRC, 'data/productSkus/fireboxV.js'));
  for (const [product, services] of Object.entries(virtualSkus)) {
    for (const [service, terms] of Object.entries(services)) {
      for (const [term, sku] of Object.entries(terms)) {
        if (existingSkus.has(sku)) continue;
        const price = priceMap[sku];
        const name = price?.name || buildName(product, service, term, 'appliance_style');
        newRows.push({
          sku, name, dbp: price?.dbp,
          delivery: 'Electronic', family: 'Virtual',
          group: product, url: allUrls[sku] || '',
        });
      }
    }
  }
  console.log(`  Virtual: ${newRows.length} new SKUs`);

  // ── Cloud ──
  const prevCount1 = newRows.length;
  const cloudSkus = parseProductSkusFile(path.join(SRC, 'data/productSkus/fireboxCloud.js'));
  for (const [product, services] of Object.entries(cloudSkus)) {
    for (const [service, terms] of Object.entries(services)) {
      for (const [term, sku] of Object.entries(terms)) {
        if (existingSkus.has(sku)) continue;
        const price = priceMap[sku];
        const name = price?.name || buildName(product, service, term, 'appliance_style');
        newRows.push({
          sku, name, dbp: price?.dbp,
          delivery: 'Electronic', family: 'Cloud',
          group: product, url: allUrls[sku] || '',
        });
      }
    }
  }
  console.log(`  Cloud: ${newRows.length - prevCount1} new SKUs`);

  // ── MDR & NDR ──
  const prevCount2 = newRows.length;
  const mdrSkus = parseProductSkusFile(path.join(SRC, 'data/productSkus/mdrNdr.js'));
  for (const [product, services] of Object.entries(mdrSkus)) {
    for (const [tier, terms] of Object.entries(services)) {
      for (const [term, sku] of Object.entries(terms)) {
        if (existingSkus.has(sku)) continue;
        const price = priceMap[sku];
        const name = price?.name || buildName(product, tier, term, 'per_user');
        newRows.push({
          sku, name, dbp: price?.dbp,
          delivery: 'Electronic', family: 'MDR & NDR',
          group: product, url: allUrls[sku] || '',
        });
      }
    }
  }
  console.log(`  MDR & NDR: ${newRows.length - prevCount2} new SKUs`);

  // ── Endpoint & Mobile ──
  const prevCount3 = newRows.length;
  const endpointSkus = parseProductSkusFile(path.join(SRC, 'data/productSkus/endpoint.js'));
  for (const [product, services] of Object.entries(endpointSkus)) {
    for (const [tier, terms] of Object.entries(services)) {
      for (const [term, sku] of Object.entries(terms)) {
        if (existingSkus.has(sku)) continue;
        const price = priceMap[sku];
        const name = price?.name || buildName(product, tier, term, 'per_user');
        newRows.push({
          sku, name, dbp: price?.dbp,
          delivery: 'Electronic', family: 'Endpoint & Mobile',
          group: product, url: allUrls[sku] || '',
        });
      }
    }
  }
  console.log(`  Endpoint & Mobile: ${newRows.length - prevCount3} new SKUs`);

  // ── Identity & Access ──
  const prevCount4 = newRows.length;
  const identitySkus = parseProductSkusFile(path.join(SRC, 'data/productSkus/identity.js'));
  for (const [product, services] of Object.entries(identitySkus)) {
    for (const [tier, terms] of Object.entries(services)) {
      for (const [term, sku] of Object.entries(terms)) {
        if (existingSkus.has(sku)) continue;
        const price = priceMap[sku];
        const name = price?.name || buildName(product, tier, term, 'per_user');
        newRows.push({
          sku, name, dbp: price?.dbp,
          delivery: 'Electronic', family: 'Identity & Access',
          group: product, url: allUrls[sku] || '',
        });
      }
    }
  }
  console.log(`  Identity & Access: ${newRows.length - prevCount4} new SKUs`);

  // ── Email Security ──
  const prevCount5 = newRows.length;
  const emailSkus = parseProductSkusFile(path.join(SRC, 'data/productSkus/email.js'));
  for (const [product, services] of Object.entries(emailSkus)) {
    for (const [tier, terms] of Object.entries(services)) {
      for (const [term, sku] of Object.entries(terms)) {
        if (existingSkus.has(sku)) continue;
        const price = priceMap[sku];
        const name = price?.name || buildName(product, tier, term, 'per_user');
        newRows.push({
          sku, name, dbp: price?.dbp,
          delivery: 'Electronic', family: 'Email Security',
          group: product, url: allUrls[sku] || '',
        });
      }
    }
  }
  console.log(`  Email Security: ${newRows.length - prevCount5} new SKUs`);

  // ── Renewals (Appliance renewals) ──
  const prevCount6 = newRows.length;
  const renewalSkus = parseProductSkusFile(path.join(SRC, 'data/productSkus/fireboxAppliances.js'));
  for (const [model, services] of Object.entries(renewalSkus)) {
    for (const [service, terms] of Object.entries(services)) {
      for (const [term, sku] of Object.entries(terms)) {
        if (existingSkus.has(sku)) continue;
        const price = priceMap[sku];
        const name = price?.name || buildName(model, service, term, 'appliance_style');
        newRows.push({
          sku, name, dbp: price?.dbp,
          delivery: 'Electronic', family: 'Renewals',
          group: model, url: allUrls[sku] || '',
        });
      }
    }
  }
  console.log(`  Renewals: ${newRows.length - prevCount6} new SKUs`);

  // 5. Append to product-catalog.csv
  console.log(`\n  Total new SKUs to add: ${newRows.length}`);

  // Check for missing prices and URLs
  const missingPrices = newRows.filter(r => r.dbp == null || isNaN(r.dbp));
  const missingUrls = newRows.filter(r => !r.url);
  if (missingPrices.length) {
    console.log(`  ⚠ ${missingPrices.length} SKUs missing prices (will have empty DBP)`);
    // Show first 5
    for (const r of missingPrices.slice(0, 5)) {
      console.log(`    ${r.sku} — ${r.name}`);
    }
    if (missingPrices.length > 5) console.log(`    ... and ${missingPrices.length - 5} more`);
  }
  if (missingUrls.length) {
    console.log(`  ⚠ ${missingUrls.length} SKUs missing URLs (will have empty URL)`);
    for (const r of missingUrls.slice(0, 5)) {
      console.log(`    ${r.sku} — ${r.name}`);
    }
    if (missingUrls.length > 5) console.log(`    ... and ${missingUrls.length - 5} more`);
  }

  // Generate CSV lines
  const csvLines = newRows.map(r =>
    [
      r.sku,
      csvField(r.name),
      r.delivery,
      r.family,
      r.group,
      r.url,
    ].join(',')
  );

  // Append to existing CSV
  const csvPath = path.join(SERVER_DATA, 'product-catalog.csv');
  const existing = fs.readFileSync(csvPath, 'utf8').trimEnd();
  fs.writeFileSync(csvPath, existing + '\n' + csvLines.join('\n') + '\n');

  const finalLineCount = fs.readFileSync(csvPath, 'utf8').split('\n').filter(l => l.trim()).length;
  console.log(`\n✓ product-catalog.csv now has ${finalLineCount} rows (1 header + ${finalLineCount - 1} SKUs)`);
}

main();
