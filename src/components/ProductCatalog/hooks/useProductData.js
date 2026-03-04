import { useState, useEffect, useMemo } from 'react';

/**
 * useProductData
 * ──────────────
 * Handles all API data fetching for the comparison grid.
 * - Fetches the category tree on mount
 * - When the active tab changes, fetches full details for each product
 * - Returns { categories, products, productDetails, loading, activeTab, setActiveTab }
 */
export default function useProductData() {
  const [categories, setCategories] = useState(null);
  const [activeTab, setActiveTab] = useState('tabletop');
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState({});

  // Fetch category tree once on mount
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Products for the active tab
  const products = useMemo(
    () => categories?.[activeTab]?.products || [],
    [categories, activeTab],
  );

  // Fetch full details for each product in the active category
  useEffect(() => {
    if (products.length === 0) return;
    products.forEach((p) => {
      if (productDetails[p.slug]) return;
      fetch(`/api/products/${p.slug}`)
        .then((r) => r.json())
        .then((data) => {
          setProductDetails((prev) => ({ ...prev, [p.slug]: data }));
        })
        .catch(console.error);
    });
  }, [products]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset details cache when tab changes
  useEffect(() => {
    setProductDetails({});
  }, [activeTab]);

  return { categories, products, productDetails, loading, activeTab, setActiveTab };
}
