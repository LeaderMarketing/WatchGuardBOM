// Database initialization and schema for WatchGuard BOM Configurator
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'products.db');

function initDb() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // ── product_groups ──────────────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_groups (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      slug        TEXT    UNIQUE NOT NULL,
      name        TEXT    NOT NULL,
      family      TEXT    NOT NULL,
      category    TEXT    NOT NULL,
      description TEXT,
      image_file  TEXT
    );
  `);

  // ── skus ────────────────────────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS skus (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      sku_code          TEXT    NOT NULL,
      full_sku          TEXT    UNIQUE NOT NULL,
      name              TEXT    NOT NULL,
      msrp              REAL    NOT NULL DEFAULT 0,
      delivery_method   TEXT    NOT NULL,
      product_group_id  INTEGER NOT NULL,
      url               TEXT,
      sku_type          TEXT    NOT NULL,
      subscription_type TEXT,
      term_years        INTEGER,
      FOREIGN KEY (product_group_id) REFERENCES product_groups(id)
    );
  `);

  // ── product_features (for collapsible specs table) ─────
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_features (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      product_group_id  INTEGER NOT NULL,
      feature_category  TEXT    NOT NULL,
      feature_name      TEXT    NOT NULL,
      feature_value     TEXT    NOT NULL,
      sort_order        INTEGER DEFAULT 0,
      FOREIGN KEY (product_group_id) REFERENCES product_groups(id)
    );
  `);

  // Indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_skus_group     ON skus(product_group_id);
    CREATE INDEX IF NOT EXISTS idx_skus_type      ON skus(sku_type);
    CREATE INDEX IF NOT EXISTS idx_features_group ON product_features(product_group_id);
  `);

  return db;
}

module.exports = { initDb, DB_PATH };
