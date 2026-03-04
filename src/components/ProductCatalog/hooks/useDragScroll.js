import { useEffect } from 'react';

/**
 * useDragScroll
 * ─────────────
 * Adds click-and-drag horizontal scrolling to a ref'd container.
 * Skips interactive elements (buttons, selects, anchors, inputs).
 *
 * @param {React.RefObject} scrollRef – the container element
 * @param {Array} deps – extra dependencies to re-attach listeners
 */
export default function useDragScroll(scrollRef, deps = []) {
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const down = (e) => {
      if (e.target.closest('button, select, a, input')) return;
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };

    const end = () => {
      isDown = false;
      el.style.cursor = 'grab';
    };

    const move = (e) => {
      if (!isDown) return;
      e.preventDefault();
      el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.5;
    };

    el.addEventListener('mousedown', down);
    el.addEventListener('mouseleave', end);
    el.addEventListener('mouseup', end);
    el.addEventListener('mousemove', move);

    return () => {
      el.removeEventListener('mousedown', down);
      el.removeEventListener('mouseleave', end);
      el.removeEventListener('mouseup', end);
      el.removeEventListener('mousemove', move);
    };
  }, [scrollRef, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
}
