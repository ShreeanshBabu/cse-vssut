import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * @param {object} [opts]
 * @param {string} [opts.selector='[data-reveal]']
 */
export function useScrollReveal(opts = {}) {
  const rootRef = useRef(null);
  const selector = opts.selector ?? '[data-reveal]';

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      root.querySelectorAll(selector).forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return undefined;
    }

    const elements = root.querySelectorAll(selector);
    const ctx = gsap.context(() => {
      elements.forEach((el) => {
        const delay = Number(el.dataset.revealDelay || 0);
        gsap.fromTo(
          el,
          { opacity: 0, y: 48, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.85,
            ease: 'power3.out',
            delay,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [selector]);

  return rootRef;
}

/**
 * @param {unknown[]} [deps] When deps change, scroll-trigger animations are rebuilt (e.g. after async lists load).
 */
export function useStaggerSectionReveal(deps = []) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      root.querySelectorAll('[data-stagger-child]').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return undefined;
    }

    const children = root.querySelectorAll('[data-stagger-child]');
    if (!children.length) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps passed explicitly for animation refresh
  }, deps);

  return rootRef;
}
