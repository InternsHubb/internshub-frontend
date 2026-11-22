import { useEffect } from 'react';

interface ScrollRevealOptions {
  selector?: string;
  revealedClass?: string;
  threshold?: number;
  rootMargin?: string;
  dependencies?: unknown[];
}

export function useScrollReveal({
  selector = '.reveal-on-scroll',
  revealedClass = 'is-revealed',
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  dependencies = [],
}: ScrollRevealOptions = {}) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add(revealedClass);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(revealedClass);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (el.classList.contains(revealedClass)) return;
      observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, revealedClass, threshold, rootMargin, ...dependencies]);
}
