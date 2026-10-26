"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Modal.module.css";

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 560,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useGSAP(
    () => {
      if (!open || !ref.current) return;
      gsap.fromTo(`.${styles.backdrop}`, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        `.${styles.panel}`,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power4.out" }
      );
    },
    { dependencies: [open], scope: ref }
  );

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div ref={ref} className={styles.root} role="dialog" aria-modal="true">
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.panel} style={{ maxWidth: width }}>
        {(title || subtitle) && (
          <header className={styles.head}>
            <div>
              {title && <h3 className={styles.title}>{title}</h3>}
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            <button className={styles.close} onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </header>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.foot}>{footer}</footer>}
      </div>
    </div>,
    document.body
  );
}
