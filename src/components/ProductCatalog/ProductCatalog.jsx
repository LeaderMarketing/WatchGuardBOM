import React, { useState, useRef, useCallback } from 'react';
import styles from './ProductCatalog.module.css';
import { useQuote } from '../../context/QuoteContext.jsx';

// Hooks
import { useProductData, useSubscriptions, useDragScroll, useStickyHeader } from './hooks/index.js';

// Sub-components
import {
  StickyHeader,
  CategoryBanner,
  CategoryTabs,
  ProductColumns,
  SubscriptionRow,
  SpecsSection,
} from './parts/index.js';

// Sections below the comparison grid
import SecurityBundles from '../SecurityBundles/SecurityBundles.jsx';
import SecuritySuiteTable from '../SecuritySuiteTable/SecuritySuiteTable.jsx';
import WifiSubscriptions from '../WifiSubscriptions/WifiSubscriptions.jsx';
import RenewalsSection from '../RenewalsSection/RenewalsSection.jsx';

// ── Helpers ──
const termLabel = (y) => (y === 1 ? '1 Year' : `${y} Years`);

const getImageSrc = (product) =>
  product.appliance?.full_sku
    ? `https://partner.leadersystems.com.au/Images/${product.appliance.full_sku}.jpg`
    : null;

// ════════════════════════════════════════════════════════════
//  ProductCatalog — orchestrator
// ════════════════════════════════════════════════════════════
export default function ProductCatalog({ onSelectHardware, onSelectSubscription }) {
  const { addItem } = useQuote();
  const scrollRef = useRef(null);

  // ── Data ──
  const { categories, products, productDetails, loading, activeTab, setActiveTab } =
    useProductData();

  // ── Subscriptions ──
  const subs = useSubscriptions(productDetails, activeTab);

  // ── UI state ──
  const [specsOpen, setSpecsOpen] = useState(true);

  // ── Behaviours ──
  useDragScroll(scrollRef, [products]);
  const { headerRowRef, stickyScrollRef, isSticky } = useStickyHeader(scrollRef, [products]);

  // ── Grid columns (shared across all rows) ──
  const gridCols = `200px repeat(${products.length}, 220px)`;

  // ── Cart actions ──
  const handleAddHardware = useCallback(
    (product) => {
      if (!product.appliance) return;
      addItem({
        sku: product.appliance.sku_code,
        name: product.name,
        description: 'Appliance Only',
        unitPrice: product.appliance.msrp,
        image: getImageSrc(product),
        productUrl: product.appliance.url,
      });
      onSelectHardware?.(product);
    },
    [addItem, onSelectHardware],
  );

  const handleAddSubscription = useCallback(
    (product) => {
      const currentSub = subs.getCurrentSub(product.slug);
      if (!currentSub) return;
      addItem({
        sku: currentSub.sku_code,
        name: product.name,
        description: `${currentSub.subscription_type} (${termLabel(currentSub.term_years)})`,
        unitPrice: currentSub.msrp,
        image: getImageSrc(product),
        productUrl: currentSub.url,
      });
      onSelectSubscription?.(product, currentSub);
    },
    [addItem, subs, onSelectSubscription],
  );

  // ── Loading / error states ──
  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading products...</div>
    );
  }
  if (!categories) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>
        Failed to load products.
      </div>
    );
  }

  // ── Render ──
  return (
    <div className={styles.catalog}>
      <StickyHeader
        products={products}
        gridCols={gridCols}
        isSticky={isSticky}
        stickyScrollRef={stickyScrollRef}
      />

      <CategoryBanner activeTab={activeTab} setActiveTab={setActiveTab} />
      <CategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ═══ COMPARISON GRID ═══ */}
      <div className={styles.tableWrapper} ref={scrollRef}>
        <div className={styles.grid} style={{ gridTemplateColumns: gridCols }}>
          <ProductColumns
            products={products}
            headerRowRef={headerRowRef}
            getImageSrc={getImageSrc}
            onAddHardware={handleAddHardware}
          />
          <SubscriptionRow
            products={products}
            {...subs}
            onAddSubscription={handleAddSubscription}
          />
        </div>

        <SpecsSection
          activeTab={activeTab}
          products={products}
          gridCols={gridCols}
          specsOpen={specsOpen}
          setSpecsOpen={setSpecsOpen}
        />
      </div>

      {/* ═══ SECURITY BUNDLES / WIFI LICENSE ═══ */}
      {(activeTab === 'tabletop' || activeTab === 'mseries') && (
        <>
          <SecurityBundles />
          <SecuritySuiteTable />
        </>
      )}

      {activeTab === 'wifi' && <WifiSubscriptions />}

      {/* ═══ RENEWALS & UPGRADES ═══ */}
      <RenewalsSection />
    </div>
  );
}
