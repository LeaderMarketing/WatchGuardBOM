import React from 'react';
import { createPortal } from 'react-dom';
import styles from '../ProductCatalog.module.css';

/**
 * StickyHeader
 * ────────────
 * Portal-based floating comparison bar that pins product names
 * and SKU links when the user scrolls past the product cards.
 */
export default function StickyHeader({
  products,
  gridCols,
  isSticky,
  stickyScrollRef,
}) {
  return createPortal(
    <div className={`${styles.stickyBar} ${isSticky ? styles.stickyVisible : ''}`}>
      <div className={styles.stickyConstraint}>
        <div className={styles.stickyInner} ref={stickyScrollRef}>
          <div className={styles.stickyGrid} style={{ gridTemplateColumns: gridCols }}>
            <div className={styles.stickyLabelCell} />
            {products.map((product) => (
              <div key={`sticky-${product.slug}`} className={styles.stickyProductCell}>
                <span className={styles.stickyName}>{product.name}</span>
                {product.appliance?.url && (
                  <a
                    href={product.appliance.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.skuLink}
                  >
                    {product.appliance.sku_code}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
