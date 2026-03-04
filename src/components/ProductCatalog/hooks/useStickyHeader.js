import { useState, useEffect, useRef } from 'react';

/**
 * useStickyHeader
 * ───────────────
 * Manages the "show / hide" state of the floating sticky bar using
 * two IntersectionObservers:
 *   • headerRef – the top product-card row (when it leaves the viewport → show sticky)
 *   • tableRef  – the whole scroll container (when it leaves the viewport → hide sticky)
 *
 * Also syncs horizontal scroll between the main container and the sticky bar.
 *
 * @param {Array} deps – re-setup when these change (e.g. products array)
 * @returns {{ headerRowRef, stickyScrollRef, isSticky }}
 */
export default function useStickyHeader(scrollRef, deps = []) {
  const headerRowRef = useRef(null);
  const stickyScrollRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  // IntersectionObserver – show / hide
  useEffect(() => {
    const headerEl = headerRowRef.current;
    const tableEl = scrollRef.current;
    if (!headerEl || !tableEl) return;

    let headerVisible = true;
    let tableVisible = true;

    const update = () => setIsSticky(!headerVisible && tableVisible);

    const headerObs = new IntersectionObserver(
      ([e]) => {
        headerVisible = e.isIntersecting;
        update();
      },
      { threshold: 0 },
    );

    const tableObs = new IntersectionObserver(
      ([e]) => {
        tableVisible = e.isIntersecting;
        update();
      },
      { threshold: 0 },
    );

    headerObs.observe(headerEl);
    tableObs.observe(tableEl);

    return () => {
      headerObs.disconnect();
      tableObs.disconnect();
    };
  }, [scrollRef, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bidirectional horizontal scroll sync
  useEffect(() => {
    const container = scrollRef.current;
    const stickyInner = stickyScrollRef.current;
    if (!container || !stickyInner) return;

    let ticking = false;

    const syncStickyToContainer = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        stickyInner.scrollLeft = container.scrollLeft;
        ticking = false;
      });
    };

    const syncContainerToSticky = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        container.scrollLeft = stickyInner.scrollLeft;
        ticking = false;
      });
    };

    container.addEventListener('scroll', syncStickyToContainer, { passive: true });
    stickyInner.addEventListener('scroll', syncContainerToSticky, { passive: true });

    return () => {
      container.removeEventListener('scroll', syncStickyToContainer);
      stickyInner.removeEventListener('scroll', syncContainerToSticky);
    };
  }, [scrollRef, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  return { headerRowRef, stickyScrollRef, isSticky };
}
