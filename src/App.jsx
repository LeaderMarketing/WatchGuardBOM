import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCartSimple } from '@phosphor-icons/react';
import styles from './App.module.css';
import TopLevelNav from './components/TopLevelNav/TopLevelNav.jsx';
import ComparisonTabs from './components/ComparisonTabs/ComparisonTabs.jsx';
import SecurityBundles from './components/SecurityBundles/SecurityBundles.jsx';
import LicenseTerms from './components/LicenseTerms/LicenseTerms.jsx';
import SecuritySuiteTable from './components/SecuritySuiteTable/SecuritySuiteTable.jsx';
import WifiSubscriptions from './components/WifiSubscriptions/WifiSubscriptions.jsx';
import RenewalsSection from './components/RenewalsSection/RenewalsSection.jsx';
import SummaryPanel from './components/SummaryPanel/SummaryPanel.jsx';
import MDRSection from './components/MDRSection/MDRSection.jsx';
import NDRSection from './components/NDRSection/NDRSection.jsx';
import FireCloudSection from './components/FireCloudSection/FireCloudSection.jsx';
import QuoteCartPanel from './components/QuoteCartPanel/QuoteCartPanel.jsx';
import { productData } from './components/ComparisonTabs/productData.js';
import { getSectionById, DEFAULT_SECTION } from './data/navigationConfig.js';
import { getAvailableServiceTypes, hasApplianceOnly } from './data/productSkus.js';
import { useQuote } from './context/QuoteContext.jsx';

// Helper to get section from URL hash
const getSectionFromHash = () => {
  const hash = window.location.hash.replace('#', '');
  return hash || DEFAULT_SECTION;
};

function App() {
  // Quote context for cart item count
  const { state: quoteState } = useQuote();

  // Quote Cart modal state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Top-level section navigation
  const [activeSection, setActiveSection] = useState(getSectionFromHash);

  const [activeCategory, setActiveCategory] = useState('tabletop');
  const [wifiOutdoor, setWifiOutdoor] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState('Standard Support');
  const [selectedTerm, setSelectedTerm] = useState('1 Year');
  const [applianceOnly, setApplianceOnly] = useState(false);
  // Wi-Fi specific states
  const [selectedWifiLicense, setSelectedWifiLicense] = useState('Standard Wi-Fi');

  const handleToggleApplianceOnly = (checked) => {
    setApplianceOnly(checked);

    if (checked) {
      setSelectedService(null);
      setSelectedTerm(null);
      setSelectedWifiLicense(null);
      return;
    }

    // Restore sensible defaults when leaving appliance-only mode.
    setSelectedService((prev) => prev || 'Standard Support');
    setSelectedWifiLicense((prev) => prev || 'Standard Wi-Fi');
    setSelectedTerm((prev) => prev || '1 Year');
  };

  const handleSelectService = (service) => {
    if (applianceOnly) {
      setApplianceOnly(false);
      setSelectedWifiLicense((prev) => prev || 'Standard Wi-Fi');
      setSelectedTerm((prev) => prev || '1 Year');
    }
    setSelectedService(service);
  };

  const handleSelectWifiLicense = (license) => {
    if (applianceOnly) {
      setApplianceOnly(false);
      setSelectedService((prev) => prev || 'Standard Support');
      setSelectedTerm((prev) => prev || '1 Year');
    }
    setSelectedWifiLicense(license);
  };

  const handleSelectTerm = (term) => {
    if (applianceOnly) {
      setApplianceOnly(false);
      setSelectedService((prev) => prev || 'Standard Support');
      setSelectedWifiLicense((prev) => prev || 'Standard Wi-Fi');
    }
    setSelectedTerm(term);
  };

  // Listen for hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const newSection = getSectionFromHash();
      setActiveSection(newSection);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Set initial hash if not present
    if (!window.location.hash) {
      window.location.hash = DEFAULT_SECTION;
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Reset all Firebox states when changing sections
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // Reset Firebox-specific states
    setActiveCategory('tabletop');
    setWifiOutdoor(false);
    setSelectedProduct(null);
    setSelectedService('Standard Support');
    setSelectedTerm('1 Year');
    setApplianceOnly(false);
    setSelectedWifiLicense('Standard Wi-Fi');
  };

  // Get current section config for dynamic title
  const currentSection = getSectionById(activeSection);

  // Determine if current category is Wi-Fi
  const isWifiCategory = activeCategory === 'wifi6';

  // Find the full product object (with image and description) based on selected product name
  const selectedProductData = useMemo(() => {
    if (!selectedProduct) return null;

    // Search through all categories
    const categories = ['tabletop', 'm-series'];
    for (const cat of categories) {
      const found = productData[cat]?.products.find((p) => p.name === selectedProduct);
      if (found) return found;
    }
    // Check wifi6 indoor/outdoor
    const wifiIndoor = productData.wifi6?.indoor?.products.find((p) => p.name === selectedProduct);
    if (wifiIndoor) return wifiIndoor;
    const wifiOutdoorProd = productData.wifi6?.outdoor?.products.find((p) => p.name === selectedProduct);
    if (wifiOutdoorProd) return wifiOutdoorProd;

    return null;
  }, [selectedProduct]);

  // Determine if selected product is a Wi-Fi product
  const isWifiProduct = useMemo(() => {
    if (!selectedProduct) return false;
    const wifiIndoor = productData.wifi6?.indoor?.products.find((p) => p.name === selectedProduct);
    const wifiOutdoorProd = productData.wifi6?.outdoor?.products.find((p) => p.name === selectedProduct);
    return !!(wifiIndoor || wifiOutdoorProd);
  }, [selectedProduct]);

  const availableServiceTypes = useMemo(() => {
    if (!selectedProductData) return null;
    if (isWifiProduct) return null;
    return getAvailableServiceTypes(selectedProductData.name);
  }, [selectedProductData, isWifiProduct]);

  const applianceOnlyAvailable = useMemo(() => {
    if (!selectedProductData) return false;
    if (isWifiProduct) return false;
    return hasApplianceOnly(selectedProductData.name);
  }, [selectedProductData, isWifiProduct]);

  // When switching products, keep the current selections valid for that product.
  useEffect(() => {
    if (!selectedProductData) return;
    if (isWifiProduct) return;

    const productName = selectedProductData.name;
    const services = getAvailableServiceTypes(productName);
    const supportsApplianceOnly = hasApplianceOnly(productName);

    if (applianceOnly && !supportsApplianceOnly) {
      setApplianceOnly(false);
      setSelectedService('Standard Support');
      setSelectedTerm('1 Year');
      return;
    }

    if (!applianceOnly && selectedService && services.length > 0 && !services.includes(selectedService)) {
      setSelectedService(services[0]);
    }
  }, [selectedProductData, isWifiProduct, applianceOnly, selectedService]);

  // Handler to clear product selection
  const handleClearProduct = () => {
    setSelectedProduct(null);
  };

  // Reset selections when category changes
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSelectedProduct(null);
    // Reset to default values for the new category
    if (category === 'wifi6') {
      setSelectedWifiLicense('Standard Wi-Fi');
    } else {
      setSelectedService('Standard Support');
    }
    setSelectedTerm('1 Year');
    setApplianceOnly(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <TopLevelNav
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        <header className={styles.header}>
          <h1>{currentSection.title}</h1>
        </header>

        {/* Firebox Configurator Section */}
        {activeSection === 'firebox' && (
          <>
            <div className={styles.mainLayout}>
              <ComparisonTabs
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                wifiOutdoor={wifiOutdoor}
                onWifiOutdoorChange={setWifiOutdoor}
                selectedProduct={selectedProduct}
                onSelectProduct={setSelectedProduct}
              />

              {/* Show different sections based on category */}
              {isWifiCategory ? (
                <>
                  <WifiSubscriptions
                    selectedWifiLicense={selectedWifiLicense}
                    onSelectWifiLicense={handleSelectWifiLicense}
                  />
                  <LicenseTerms
                    selectedTerm={selectedTerm}
                    onSelectTerm={handleSelectTerm}
                  />
                </>
              ) : (
                <>
                  <SecurityBundles
                    selectedService={selectedService}
                    onSelectService={handleSelectService}
                    applianceOnly={applianceOnly}
                    onToggleApplianceOnly={handleToggleApplianceOnly}
                    availableServices={availableServiceTypes || undefined}
                    applianceOnlyAvailable={applianceOnlyAvailable}
                  />
                  <SecuritySuiteTable />
                  <LicenseTerms
                    selectedTerm={selectedTerm}
                    onSelectTerm={handleSelectTerm}
                  />
                </>
              )}

              <RenewalsSection />
            </div>

            <SummaryPanel
              selectedProductData={selectedProductData}
              selectedService={selectedService}
              selectedTerm={selectedTerm}
              applianceOnly={applianceOnly}
              onClearProduct={handleClearProduct}
              onSelectService={handleSelectService}
              onSelectTerm={handleSelectTerm}
              onToggleApplianceOnly={handleToggleApplianceOnly}
              isWifiProduct={isWifiProduct}
              selectedWifiLicense={selectedWifiLicense}
              onSelectWifiLicense={handleSelectWifiLicense}
              onOpenCart={() => setIsCartOpen(true)}
              isCartOpen={isCartOpen}
            />
          </>
        )}

        {/* MDR Section */}
        {activeSection === 'mdr' && (
          <div className={styles.mainLayout}>
            <MDRSection />
          </div>
        )}

        {/* NDR Section */}
        {activeSection === 'ndr' && (
          <div className={styles.mainLayout}>
            <NDRSection />
          </div>
        )}

        {/* FireCloud Section */}
        {activeSection === 'firecloud' && (
          <div className={styles.mainLayout}>
            <FireCloudSection />
          </div>
        )}
      </div>

      {/* Quote Cart Panel - Modal overlay available on all sections */}
      <QuoteCartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Floating Cart Button - below config toggle, same style */}
      <button
        type="button"
        className={`${styles.floatingCartBtn} ${quoteState.itemCount > 0 ? styles.hasItems : ''}`}
        onClick={() => setIsCartOpen(true)}
        aria-label="Open quote cart"
      >
        <span className={styles.cartIcon}>
          <ShoppingCartSimple size={20} weight="fill" />
        </span>
        {quoteState.itemCount > 0 && <span className={styles.cartBadge}>{quoteState.itemCount}</span>}
      </button>
    </div>
  );
}

export default App;
