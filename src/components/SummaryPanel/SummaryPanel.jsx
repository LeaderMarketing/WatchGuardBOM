import React, { useState, useEffect, useMemo } from 'react';
import { ClipboardText, GearSix, Package, ShoppingCartSimple, Storefront, X } from '@phosphor-icons/react';
import styles from './SummaryPanel.module.css';
import { getSkuCode, getAvailableServiceTypes, hasApplianceOnly } from '../../data/productSkus.js';
import { getUrlBySku } from '../../data/productUrls.js';
import { useQuote } from '../../context/QuoteContext.jsx';
import { getProductPrice, getAppliancePrice, getSubscriptionPrice, formatPrice } from '../../data/productPrices.js';
import { addConfigurationToCart, canAddConfigurationToCart } from '../../data/cartUtils.js';

// Base URL for the partner website
const PARTNER_BASE_URL = 'https://partner.leadersystems.com.au';

function SummaryPanel({
  selectedProductData,
  selectedService,
  selectedTerm,
  applianceOnly,
  onClearProduct,
  onSelectService,
  onSelectTerm,
  onToggleApplianceOnly,
  isWifiProduct,
  selectedWifiLicense,
  onSelectWifiLicense,
  onOpenCart,
  isCartOpen,
}) {
  const { addItem, state: quoteState } = useQuote();
  const [open, setOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (isCartOpen && open) {
      setOpen(false);
    }
  }, [isCartOpen, open]);

  const fireboxServices = useMemo(() => {
    if (!selectedProductData || isWifiProduct) return ['Standard Support', 'Basic Security', 'Total Security'];
    const available = getAvailableServiceTypes(selectedProductData.name);
    return available.length > 0 ? available : ['Standard Support', 'Basic Security', 'Total Security'];
  }, [selectedProductData, isWifiProduct]);

  const applianceOnlySupported = useMemo(() => {
    if (!selectedProductData || isWifiProduct) return false;
    return hasApplianceOnly(selectedProductData.name);
  }, [selectedProductData, isWifiProduct]);

  const wifiLicenses = ['Standard Wi-Fi', 'USP Wi-Fi'];
  const terms = ['1 Year', '3 Year', '5 Year'];

  // Get SKU code based on current configuration
  const currentSku = useMemo(() => {
    if (!selectedProductData) return null;

    const productName = selectedProductData.name;
    const serviceType = applianceOnly
      ? 'Appliance Only'
      : isWifiProduct
      ? selectedWifiLicense
      : selectedService;
    const term = applianceOnly ? null : selectedTerm;

    return getSkuCode(productName, serviceType, term);
  }, [selectedProductData, selectedService, selectedTerm, selectedWifiLicense, applianceOnly, isWifiProduct]);

  const productUrl = useMemo(() => {
    return currentSku ? getUrlBySku(currentSku) : null;
  }, [currentSku]);

  // Calculate current configuration price
  const currentPrice = useMemo(() => {
    if (!selectedProductData) return null;

    const productName = selectedProductData.name;
    const serviceType = applianceOnly
      ? 'Appliance Only'
      : isWifiProduct
      ? selectedWifiLicense
      : selectedService;
    const term = applianceOnly ? null : selectedTerm;

    return getProductPrice(productName, serviceType, term);
  }, [selectedProductData, selectedService, selectedTerm, selectedWifiLicense, applianceOnly, isWifiProduct]);

  // Determine if this is a High Availability product (device+subscription bundled)
  const isHighAvailability = useMemo(() => {
    return selectedProductData?.name?.includes('High Availability') || false;
  }, [selectedProductData]);

  // Trigger highlight and notification when configuration changes
  useEffect(() => {
    if (selectedProductData) {
      setIsHighlighted(true);
      setNotificationMessage('Configuration added');
      setShowNotification(true);
      
      const highlightTimer = setTimeout(() => setIsHighlighted(false), 3000);
      const notificationTimer = setTimeout(() => setShowNotification(false), 3000);
      
      return () => {
        clearTimeout(highlightTimer);
        clearTimeout(notificationTimer);
      };
    }
  }, [selectedProductData, selectedService, selectedTerm, selectedWifiLicense, applianceOnly]);

  // Build dynamic CTA text based on selections
  const getCtaText = () => {
    if (!selectedProductData) {
      return 'Select a Product to Continue';
    }
    return 'View Product Page';
  };

  const isCtaDisabled = !selectedProductData;

  // Handle View Product Page button click
  // Prefer exact product URL when available; fallback to SKU search when missing.
  const handleViewProduct = () => {
    if (!currentSku) return;

    // If we have the direct product URL for this SKU, go there.
    if (productUrl) {
      const isEmbedded = window.self !== window.top;
      if (isEmbedded) {
        window.parent.location.href = productUrl;
      } else {
        window.open(productUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    // Store the SKU in localStorage for the partner site to pick up
    // This works because the configurator will be embedded in the partner website (same domain)
    try {
      localStorage.setItem('watchguard_configurator_sku', currentSku);
      localStorage.setItem('watchguard_configurator_search', 'true');
    } catch (e) {
      console.warn('localStorage not available');
    }

    // Copy SKU to clipboard as backup
    navigator.clipboard?.writeText(currentSku).catch(() => {});

    // Fallback: redirect to the partner website so user can search SKU
    const searchUrl = `${PARTNER_BASE_URL}/index.html`;
    
    // Check if we're in an iframe (embedded in partner site) or standalone
    const isEmbedded = window.self !== window.top;
    
    if (isEmbedded) {
      // If embedded, navigate the parent window
      window.parent.location.href = searchUrl;
    } else {
      // If standalone (dev mode), open in new tab with instructions
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
      
      // Show notification that SKU was copied
      setNotificationMessage(`SKU "${currentSku}" copied! Paste in search bar.`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  // Handle Add to Quote button click - adds items to local cart
  const handleAddToQuote = () => {
    if (!selectedProductData) return;

    const productName = selectedProductData.name;
    const serviceType = applianceOnly
      ? 'Appliance Only'
      : isWifiProduct
      ? selectedWifiLicense
      : selectedService;
    const term = applianceOnly ? null : selectedTerm;

    // For HA or appliance-only, we add a single item
    if (isHighAvailability || applianceOnly) {
      const sku = getSkuCode(productName, serviceType, term);
      const url = sku ? getUrlBySku(sku) : null;
      const price = getAppliancePrice(productName) || 0;

      addItem({
        sku: sku || 'UNKNOWN',
        name: productName,
        description: applianceOnly ? 'Appliance Only' : `${serviceType} (${term})`,
        unitPrice: price,
        image: selectedProductData.image || null,
        productUrl: url,
      });

      setNotificationMessage(`Added ${productName} to quote!`);
    } else {
      // Device + Subscription (two items)
      const deviceSku = getSkuCode(productName, 'Appliance Only', null);
      const subSku = getSkuCode(productName, serviceType, term);
      const deviceUrl = deviceSku ? getUrlBySku(deviceSku) : null;
      const subUrl = subSku ? getUrlBySku(subSku) : null;
      const devicePrice = getAppliancePrice(productName) || 0;
      const subPrice = getSubscriptionPrice(productName, serviceType, term) || 0;

      // Add device
      addItem({
        sku: deviceSku || 'UNKNOWN',
        name: productName,
        description: 'Appliance Only',
        unitPrice: devicePrice,
        image: selectedProductData.image || null,
        productUrl: deviceUrl,
      });

      // Add subscription
      addItem({
        sku: subSku || 'UNKNOWN',
        name: productName,
        description: `${serviceType} (${term})`,
        unitPrice: subPrice,
        image: selectedProductData.image || null,
        productUrl: subUrl,
      });

      setNotificationMessage(`Added ${productName} + ${serviceType} to quote!`);
    }

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Handle Add to Leader Systems Cart button click
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedProductData || addingToCart) return;

    const productName = selectedProductData.name;
    const serviceType = applianceOnly
      ? 'Appliance Only'
      : isWifiProduct
      ? selectedWifiLicense
      : selectedService;
    const term = applianceOnly ? null : selectedTerm;

    setAddingToCart(true);
    setNotificationMessage('Adding to Leader Cart...');
    setShowNotification(true);

    try {
      const result = await addConfigurationToCart({
        productName,
        serviceType,
        term,
        isHighAvailability,
      });

      setNotificationMessage(result.message);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } catch {
      setNotificationMessage('Failed to add to cart — unexpected error.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } finally {
      setAddingToCart(false);
    }
  };

  // Check if current configuration can be added to the real cart
  const cartAvailable = useMemo(() => {
    if (!selectedProductData) return false;

    const productName = selectedProductData.name;
    const serviceType = applianceOnly
      ? 'Appliance Only'
      : isWifiProduct
      ? selectedWifiLicense
      : selectedService;
    const term = applianceOnly ? null : selectedTerm;

    const { canAdd } = canAddConfigurationToCart({
      productName,
      serviceType,
      term,
      isHighAvailability,
    });
    return canAdd;
  }, [selectedProductData, selectedService, selectedTerm, selectedWifiLicense, applianceOnly, isWifiProduct, isHighAvailability]);

  return (
    <>
      {/* Overlay when panel is open */}
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      {/* Fixed toggle button on the right edge */}
      <button
        type="button"
        className={`${styles.floatingToggle} ${isHighlighted ? styles.highlighted : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Toggle configuration summary"
      >
        <span className={styles.gearIcon}>
          <GearSix size={22} weight="fill" />
        </span>
        {selectedProductData && <span className={styles.badge}>1</span>}
      </button>

      {/* Notification tooltip */}
      {showNotification && (
        <div className={styles.notification}>
          {notificationMessage}
        </div>
      )}

      {/* Slide-out panel */}
      <aside className={`${styles.drawer} ${open ? styles.open : ''}`}>
        <div className={styles.drawerHeader}>
          <h2>Your Configuration</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setOpen(false)}
            aria-label="Close panel"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className={styles.drawerContent}>
          {/* Product Card */}
          {selectedProductData ? (
            <div className={styles.productCard}>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={onClearProduct}
                aria-label="Remove product"
              >
                <X size={14} weight="bold" />
              </button>
              <div className={styles.productImageWrap}>
                {selectedProductData.image ? (
                  <img
                    src={selectedProductData.image}
                    alt={selectedProductData.name}
                    className={styles.productImage}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <Package size={28} weight="duotone" />
                  </div>
                )}
              </div>
              <h3 className={styles.productName}>{selectedProductData.name}</h3>
              <p className={styles.productDesc}>{selectedProductData.description}</p>
            </div>
          ) : (
            <div className={styles.emptyProduct}>
              <div className={styles.emptyIcon}>
                <Package size={32} weight="duotone" />
              </div>
              <p>No product selected</p>
              <span>Select a device from the comparison table</span>
            </div>
          )}

          {/* Appliance Only Toggle */}
          <div className={styles.optionSection}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={applianceOnly}
                onChange={(e) => onToggleApplianceOnly(e.target.checked)}
                disabled={!selectedProductData || !applianceOnlySupported}
              />
              <span className={styles.checkboxText}>
                <strong>Buying appliance only</strong>
                <small>Purchase device without security subscription</small>
              </span>
            </label>
          </div>

          {/* Security Service Subscription / Wi-Fi License */}
          <div className={`${styles.optionSection} ${applianceOnly ? styles.disabled : ''}`}>
            <h4>{isWifiProduct ? 'Access Point Management License' : 'Security Service Subscription'}</h4>
            <div className={styles.pillGroup}>
              {isWifiProduct ? (
                wifiLicenses.map((license) => (
                  <button
                    key={license}
                    type="button"
                    className={`${styles.pill} ${selectedWifiLicense === license ? styles.active : ''}`}
                    onClick={() => !applianceOnly && onSelectWifiLicense(license)}
                    disabled={applianceOnly}
                  >
                    {license === 'Standard Wi-Fi' ? 'Standard' : 'USP'}
                  </button>
                ))
              ) : (
                fireboxServices.map((service) => (
                  <button
                    key={service}
                    type="button"
                    className={`${styles.pill} ${selectedService === service ? styles.active : ''}`}
                    onClick={() => !applianceOnly && onSelectService(service)}
                    disabled={applianceOnly}
                  >
                    {service === 'Standard Support' ? 'Standard' : service === 'Basic Security' ? 'Basic' : 'Total Security'}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* License Terms */}
          <div className={`${styles.optionSection} ${applianceOnly ? styles.disabled : ''}`}>
            <h4>License Term</h4>
            <div className={styles.pillGroup}>
              {terms.map((term) => (
                <button
                  key={term}
                  type="button"
                  className={`${styles.pill} ${selectedTerm === term ? styles.active : ''}`}
                  onClick={() => !applianceOnly && onSelectTerm(term)}
                  disabled={applianceOnly}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.drawerFooter}>
          {/* Price Display */}
          {selectedProductData && (
            <div className={styles.priceDisplay}>
              <span className={styles.priceLabel}>Price (ex GST):</span>
              <span className={styles.priceValue}>{formatPrice(currentPrice)}</span>
            </div>
          )}

          {/* Show SKU code for reference */}
          {currentSku && (
            <div className={styles.skuDisplay}>
              <span className={styles.skuLabel}>SKU:</span>
              <code className={styles.skuCode}>{currentSku}</code>
            </div>
          )}

          {/* Add to Leader Systems Cart — primary action */}
          {selectedProductData && cartAvailable && (
            <button
              type="button"
              className={styles.addToCartCta}
              onClick={handleAddToCart}
              disabled={addingToCart}
              title="Add this configuration directly to the Leader Systems shopping cart"
            >
              <Storefront size={18} weight="bold" />
              {addingToCart ? 'Adding...' : 'Add to Leader Cart'}
            </button>
          )}

          <button
            type="button"
            className={`${styles.primaryCta} ${isCtaDisabled ? styles.disabled : ''}`}
            disabled={isCtaDisabled}
            onClick={handleViewProduct}
          >
            {getCtaText()}
          </button>

          {/* Add to Quote button */}
          {selectedProductData && (
            <button
              type="button"
              className={styles.secondaryCta}
              onClick={handleAddToQuote}
              title="Add this configuration to your quote cart"
            >
              <ShoppingCartSimple size={18} weight="bold" />
              Add to Quote
            </button>
          )}

          {/* View Quote Cart button */}
          <button
            type="button"
            className={`${styles.viewCartBtn} ${quoteState.itemCount > 0 ? styles.hasItems : ''}`}
            onClick={onOpenCart}
          >
            <ClipboardText size={18} weight="bold" />
            View Quote Cart {quoteState.itemCount > 0 && `(${quoteState.itemCount})`}
          </button>

          {selectedProductData && (
            <p className={styles.ctaNote}>
              {applianceOnly
                ? 'Appliance only - no subscription included.'
                : isHighAvailability
                ? 'HA bundle includes device pair + subscription.'
                : `Configuration includes: Device + ${isWifiProduct ? selectedWifiLicense : selectedService} (${selectedTerm})`}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}

export default SummaryPanel;
