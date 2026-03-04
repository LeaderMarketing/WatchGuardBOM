import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Package } from '@phosphor-icons/react';
import { productData } from './productData';
import styles from './ComparisonTabs.module.css';
import { getStartingPrice, formatPrice } from '../../data/productPrices.js';

// Get base URL for assets (handles GitHub Pages subdirectory)
const BASE_URL = import.meta.env.BASE_URL;

// Banner images for each category
const categoryBanners = {
  tabletop: {
    image: `${BASE_URL}banners/Tabletop_banner.jpg`,
    alt: 'Firebox Tabletop Series',
  },
  'm-series': {
    image: `${BASE_URL}banners/Rackmount_banner.jpg`,
    alt: 'Firebox M Series',
  },
  wifi6: {
    image: `${BASE_URL}banners/Access-points_banner.jpg`,
    alt: 'Wi-Fi 6 Access Points',
  },
};

function ComparisonTabs({
  activeCategory,
  onCategoryChange,
  wifiOutdoor,
  onWifiOutdoorChange,
  selectedProduct,
  onSelectProduct,
}) {
  const scrollContainerRef = useRef(null);
  const headerRowRef = useRef(null);
  const stickyScrollRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  const tableData = useMemo(() => {
    if (activeCategory === 'wifi6') {
      const wifi = productData.wifi6;
      if (!wifi) return null;
      return wifiOutdoor ? wifi.outdoor : wifi.indoor;
    }
    return productData[activeCategory];
  }, [activeCategory, wifiOutdoor]);

  // Flatten sections into rows for grid rendering
  const allRows = useMemo(() => {
    if (!tableData) return [];
    const rows = [];
    tableData.sections.forEach((section) => {
      rows.push({ type: 'section', title: section.title });
      section.rows.forEach((row) => {
        rows.push({ type: 'row', label: row.label, values: row.values });
      });
    });
    return rows;
  }, [tableData]);

  // Drag to scroll functionality
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e) => {
      if (e.target.closest(`.${styles.productCard}`)) return;
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = 'grabbing';
    };
    const endDrag = () => {
      isDown = false;
      container.style.cursor = 'grab';
    };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseleave', endDrag);
    container.addEventListener('mouseup', endDrag);
    container.addEventListener('mousemove', onMouseMove);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseleave', endDrag);
      container.removeEventListener('mouseup', endDrag);
      container.removeEventListener('mousemove', onMouseMove);
    };
  }, [tableData]);

  // IntersectionObserver: show sticky bar when header row scrolls out of view,
  // hide it when the table wrapper bottom also scrolls out of view (past the table).
  useEffect(() => {
    const headerEl = headerRowRef.current;
    const tableWrapperEl = scrollContainerRef.current;
    if (!headerEl || !tableWrapperEl) return;

    let headerVisible = true;
    let tableVisible = true;

    const updateSticky = () => {
      // Show sticky when header is NOT visible AND table IS still visible
      setIsSticky(!headerVisible && tableVisible);
    };

    // When the header row (product cards) leaves the viewport above, show sticky
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        headerVisible = entry.isIntersecting;
        updateSticky();
      },
      { threshold: 0 }
    );

    // When the table wrapper leaves the viewport (scrolled past it), hide sticky
    const tableObserver = new IntersectionObserver(
      ([entry]) => {
        tableVisible = entry.isIntersecting;
        updateSticky();
      },
      { threshold: 0 }
    );

    headerObserver.observe(headerEl);
    tableObserver.observe(tableWrapperEl);

    return () => {
      headerObserver.disconnect();
      tableObserver.disconnect();
    };
  }, [tableData]);

  // Sync horizontal scroll between main table and sticky bar
  useEffect(() => {
    const container = scrollContainerRef.current;
    const stickyInner = stickyScrollRef.current;
    if (!container || !stickyInner) return;

    const onScroll = () => {
      stickyInner.scrollLeft = container.scrollLeft;
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [tableData]);

  if (!tableData) return null;

  const numProducts = tableData.products.length;

  return (
    <section className={styles.section}>
      <h2>Select Your Device</h2>
      <p className={styles.intro}>
        Choose the WatchGuard appliance that best fits your network requirements.
      </p>

      {/* Category Banner Image */}
      <div className={styles.bannerContainer}>
        <div className={styles.bannerImage}>
          {categoryBanners[activeCategory]?.image ? (
            <img
              src={categoryBanners[activeCategory].image}
              alt={categoryBanners[activeCategory].alt}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={styles.bannerPlaceholder}>
            <span className={styles.bannerIcon}>
              {activeCategory === 'wifi6' ? '📡' : '🔥'}
            </span>
            <span className={styles.bannerText}>
              {activeCategory === 'tabletop' && 'Firebox Tabletop Series'}
              {activeCategory === 'm-series' && 'Firebox M Series'}
              {activeCategory === 'wifi6' && 'Wi-Fi 6 Access Points'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className={styles.controls}>
        <div className={styles.mainTabs}>
          <button
            className={`${styles.tabBtn} ${activeCategory === 'tabletop' ? styles.active : ''}`}
            onClick={() => onCategoryChange('tabletop')}
          >
            Firebox Tabletop
          </button>
          <button
            className={`${styles.tabBtn} ${activeCategory === 'm-series' ? styles.active : ''}`}
            onClick={() => onCategoryChange('m-series')}
          >
            Firebox M Series
          </button>
          <button
            className={`${styles.tabBtn} ${activeCategory === 'wifi6' ? styles.active : ''}`}
            onClick={() => onCategoryChange('wifi6')}
          >
            Wi-Fi 6 Access Points
          </button>
        </div>

        {activeCategory === 'wifi6' && (
          <div className={styles.subTabs}>
            <div className={styles.toggleContainer}>
              <span className={styles.toggleLabel}>Indoor</span>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={wifiOutdoor}
                  onChange={(e) => onWifiOutdoorChange(e.target.checked)}
                />
                <span className={`${styles.slider} ${styles.round}`}></span>
              </label>
              <span className={styles.toggleLabel}>Outdoor/Rugged</span>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Floating Header Bar - rendered via portal to document.body */}
      {createPortal(
        <div className={`${styles.stickyBar} ${isSticky ? styles.stickyVisible : ''}`}>
          <div className={styles.stickyInner} ref={stickyScrollRef}>
            <div
              className={styles.stickyGrid}
              style={{
                gridTemplateColumns: `200px repeat(${numProducts}, 220px)`,
              }}
            >
              <div className={styles.stickyLabelCell}>
                <span>Compare Models</span>
              </div>
              {tableData.products.map((product) => {
                const isSelected = selectedProduct === product.name;
                const isWifi = activeCategory === 'wifi6';
                const price = getStartingPrice(product.name, isWifi);
                return (
                  <button
                    key={`sticky-${product.name}`}
                    type="button"
                    className={`${styles.stickyProductCell} ${isSelected ? styles.stickySelected : ''}`}
                    onClick={() => onSelectProduct && onSelectProduct(product.name)}
                  >
                    <div className={styles.stickyImageWrap}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <div className={styles.stickyImagePlaceholder}>
                          <Package size={16} weight="duotone" />
                        </div>
                      )}
                    </div>
                    <div className={styles.stickyInfo}>
                      <span className={styles.stickyName}>{product.name}</span>
                      <span className={styles.stickyPrice}>
                        {formatPrice(price)}
                        <span className={styles.stickyPriceNote}>ex.GST</span>
                      </span>
                    </div>
                    {isSelected && <span className={styles.stickySelectedBadge}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Comparison Table using CSS Grid */}
      <div className={styles.tableWrapper} ref={scrollContainerRef}>
        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: `200px repeat(${numProducts}, 220px)`,
          }}
        >
          {/* Header Row: Empty cell + Product Cards */}
          <div className={styles.headerLabel} ref={headerRowRef}>
            <span>Compare Models</span>
          </div>
          {tableData.products.map((product) => {
            const isSelected = selectedProduct === product.name;
            return (
              <button
                key={product.name}
                type="button"
                className={`${styles.productCard} ${isSelected ? styles.selected : ''}`}
                onClick={() => onSelectProduct && onSelectProduct(product.name)}
              >
                <div className={styles.productImageWrap}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className={styles.productImage} />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <Package size={24} weight="duotone" />
                    </div>
                  )}
                </div>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDesc}>{product.description}</p>
                {isSelected && <span className={styles.selectedBadge}>✓ Selected</span>}
              </button>
            );
          })}

          {/* Price Row - after product cards, before data rows */}
          <div className={styles.priceLabel}>
            <span>Starting From</span>
          </div>
          {tableData.products.map((product, colIdx) => {
            const isSelected = selectedProduct === product.name;
            const isWifi = activeCategory === 'wifi6';
            const price = getStartingPrice(product.name, isWifi);
            return (
              <div
                key={`price-${colIdx}`}
                className={`${styles.priceCell} ${isSelected ? styles.selectedCell : ''}`}
              >
                <span className={styles.priceValue}>{formatPrice(price)}</span>
                <span className={styles.priceNote}>ex.GST</span>
              </div>
            );
          })}

          {/* Data Rows */}
          {allRows.map((row, rowIdx) => {
            if (row.type === 'section') {
              return (
                <div
                  key={`section-${rowIdx}`}
                  className={styles.sectionHeader}
                  style={{ gridColumn: `1 / -1` }}
                >
                  {row.title}
                </div>
              );
            }

            return (
              <React.Fragment key={`row-${rowIdx}`}>
                <div className={styles.featureLabel}>{row.label}</div>
                {row.values.map((val, colIdx) => {
                  const isSelected = selectedProduct === tableData.products[colIdx]?.name;
                  return (
                    <div
                      key={`val-${rowIdx}-${colIdx}`}
                      className={`${styles.cell} ${isSelected ? styles.selectedCell : ''}`}
                      dangerouslySetInnerHTML={{ __html: val || '—' }}
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ComparisonTabs;
