import { useEffect, useRef } from "react";

/**
 * RentReserve-style scroll reveal.
 * Elements with [data-reveal] are observed; when they enter the viewport
 * the animation class in data-reveal is applied (e.g. "rr-fade-up").
 */
export function useScrollReveal(rootMargin = "-60px 0px") {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const selector = "[data-reveal]";
    const targets = containerRef.current
      ? containerRef.current.querySelectorAll<HTMLElement>(selector)
      : document.querySelectorAll<HTMLElement>(selector);

    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const cls = el.dataset.reveal ?? "rr-fade-up";
            const delay = el.dataset.delay ?? "";
            el.classList.remove("rr-hidden");
            if (delay) el.classList.add(delay);
            el.classList.add(cls);
            io.unobserve(el);
          }
        });
      },
      { rootMargin, threshold: 0.1 }
    );

    targets.forEach((el) => {
      el.classList.add("rr-hidden");
      io.observe(el);
    });

    return () => io.disconnect();
  }, [rootMargin]);

  return containerRef;
}
