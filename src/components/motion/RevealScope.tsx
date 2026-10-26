"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Wrap any block; every descendant with [data-reveal] fades/slides in
 * as it enters the viewport. Optional data-reveal="left|right|scale".
 */
export default function RevealScope({
  children,
  as: Tag = "div",
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
      if (prefersReducedMotion()) {
        gsap.set(els, { opacity: 1 });
        return;
      }
      const fromFor = (el: HTMLElement) => {
        const v = el.dataset.reveal;
        if (v === "left") return { x: -40, y: 0 };
        if (v === "right") return { x: 40, y: 0 };
        if (v === "scale") return { scale: 0.94, y: 12 };
        return { y: 36 };
      };
      ScrollTrigger.batch(els, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          batch.forEach((el, i) => {
            gsap.fromTo(
              el,
              { opacity: 0, ...fromFor(el as HTMLElement) },
              { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.9, ease: "power3.out", delay: i * stagger }
            );
          });
        },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
