import { useState, useCallback, useEffect } from 'react';

/**
 * useSubscriptions
 * ────────────────
 * Manages per-product subscription state (selected type, term) and
 * exposes helpers to derive available options and the currently-selected SKU.
 *
 * @param {Object} productDetails – { [slug]: { subscriptions: [...], ... } }
 * @param {string} activeTab – triggers a reset when the tab changes
 */
export default function useSubscriptions(productDetails, activeTab) {
  // { [slug]: { subType: string, termYears: number } }
  const [selections, setSelections] = useState({});

  // Reset when tab changes
  useEffect(() => {
    setSelections({});
  }, [activeTab]);

  // Initialise defaults whenever productDetails arrives for a slug
  useEffect(() => {
    if (!productDetails) return;
    setSelections((prev) => {
      const next = { ...prev };
      Object.entries(productDetails).forEach(([slug, data]) => {
        if (next[slug]) return; // already initialised
        const types = [...new Set((data.subscriptions || []).map((s) => s.subscription_type))];
        next[slug] = { subType: types[0] || '', termYears: 1 };
      });
      return next;
    });
  }, [productDetails]);

  const getSelection = useCallback(
    (slug) => selections[slug] || { subType: '', termYears: 1 },
    [selections],
  );

  const setSubType = useCallback((slug, subType) => {
    setSelections((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], subType, termYears: 1 },
    }));
  }, []);

  const setTermYears = useCallback((slug, termYears) => {
    setSelections((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], termYears },
    }));
  }, []);

  const getSubscriptionTypes = useCallback(
    (slug) => {
      const d = productDetails[slug];
      if (!d?.subscriptions) return [];
      return [...new Set(d.subscriptions.map((s) => s.subscription_type))];
    },
    [productDetails],
  );

  const getAvailableTerms = useCallback(
    (slug) => {
      const sel = getSelection(slug);
      const d = productDetails[slug];
      if (!d?.subscriptions) return [];
      return [
        ...new Set(
          d.subscriptions
            .filter((s) => s.subscription_type === sel.subType)
            .map((s) => s.term_years)
            .filter((t) => t > 0),
        ),
      ].sort((a, b) => a - b);
    },
    [productDetails, getSelection],
  );

  const getCurrentSub = useCallback(
    (slug) => {
      const sel = getSelection(slug);
      const d = productDetails[slug];
      if (!d?.subscriptions) return null;
      return (
        d.subscriptions.find(
          (s) => s.subscription_type === sel.subType && s.term_years === sel.termYears,
        ) || null
      );
    },
    [productDetails, getSelection],
  );

  return {
    getSelection,
    setSubType,
    setTermYears,
    getSubscriptionTypes,
    getAvailableTerms,
    getCurrentSub,
  };
}
