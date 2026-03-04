import React from 'react';
import { CaretDown } from '@phosphor-icons/react';
import styles from '../ProductCatalog.module.css';
import { SECTION_DEFS, getSpecValue } from '../../../data/featureSpecs.js';

/**
 * SpecsSection
 * ────────────
 * Collapsible comparison specs grid.
 * Uses the same gridCols as the parent so columns stay aligned.
 */
export default function SpecsSection({ activeTab, products, gridCols, specsOpen, setSpecsOpen }) {
  const specSections = SECTION_DEFS[activeTab] || [];

  return (
    <>
      <button className={styles.specsToggle} onClick={() => setSpecsOpen(!specsOpen)}>
        Compare Specs
        <span className={`${styles.chevron} ${specsOpen ? styles.chevronOpen : ''}`}>
          <CaretDown size={14} weight="bold" />
        </span>
      </button>

      <div className={`${styles.collapseWrapper} ${specsOpen ? styles.collapseOpen : ''}`}>
        <div className={styles.collapseInner}>
          <div className={styles.specsGrid} style={{ gridTemplateColumns: gridCols }}>
            {specSections.map((section, sIdx) => (
              <React.Fragment key={`sec-${sIdx}`}>
                <div className={styles.sectionHeader}>{section.title}</div>
                {products.map((product) => (
                  <div
                    key={`sechdr-${sIdx}-${product.slug}`}
                    className={styles.sectionHeaderSpacer}
                  />
                ))}

                {section.rows.map((row, rIdx) => (
                  <React.Fragment key={`row-${sIdx}-${rIdx}`}>
                    <div className={styles.featureLabel}>{row.label}</div>
                    {products.map((product) => (
                      <div key={`${product.slug}-${row.key}`} className={styles.cell}>
                        {getSpecValue(product.slug, row.key)}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
