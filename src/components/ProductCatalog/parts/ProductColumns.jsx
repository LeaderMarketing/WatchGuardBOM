import React from 'react';
import { ShoppingCartSimple, Package } from '@phosphor-icons/react';
import styles from '../ProductCatalog.module.css';

const formatPrice = (p) => {
  if (!p || p === 0) return '$0';
  return '$' + Math.round(p).toLocaleString('en-AU');
};

/**
 * ProductColumns
 * ──────────────
 * Renders the product-card row, price row, and hardware action row
 * as flat grid items sharing the parent's CSS Grid columns.
 */
export default function ProductColumns({ products, headerRowRef, getImageSrc, onAddHardware }) {
  return (
    <>
      {/* Row: Product cards */}
      <div className={styles.headerLabel} ref={headerRowRef} />
      {products.map((product) => {
        const imgSrc = getImageSrc(product);
        return (
          <div key={product.slug} className={styles.productCard}>
            <div className={styles.productImageWrap}>
              {imgSrc ? (
                <img src={imgSrc} alt={product.name} className={styles.productImage} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <Package size={24} weight="duotone" />
                </div>
              )}
            </div>
            {product.appliance?.url ? (
              <a
                href={product.appliance.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.productName}
              >
                {product.name}
              </a>
            ) : (
              <h3 className={styles.productName}>{product.name}</h3>
            )}
            <p className={styles.productDesc}>{product.description}</p>
          </div>
        );
      })}

      {/* Row: Price */}
      <div className={styles.priceLabel} />
      {products.map((product) => (
        <div key={`price-${product.slug}`} className={styles.priceCell}>
          <span className={styles.priceValue}>{formatPrice(product.appliance?.msrp)}</span>
          <span className={styles.priceNote}>ex.GST</span>
          <span className={styles.priceInfo}>
            i
            <span className={styles.priceTooltip}>
              Pricing is for appliance only. License not included and requires separate purchase.
            </span>
          </span>
        </div>
      ))}

      {/* Row: Appliance add-to-cart + SKU */}
      <div className={styles.actionLabel} />
      {products.map((product) => (
        <div key={`hw-${product.slug}`} className={styles.actionCell}>
          <button
            className={styles.addHwBtn}
            onClick={() => onAddHardware(product)}
            title="Add appliance to quote cart"
          >
            <ShoppingCartSimple size={14} weight="bold" />
            Add to Cart
          </button>
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
    </>
  );
}
