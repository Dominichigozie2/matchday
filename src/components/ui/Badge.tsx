import type { ReactNode } from "react";
import styles from "./Badge.module.css";

type Tone = "neutral" | "primary" | "accent" | "volt" | "info" | "warning" | "danger" | "outline" | "glass";

export default function Badge({
  tone = "neutral",
  icon,
  children,
  dot,
  className,
}: {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={`${styles.badge} ${styles[tone]} ${className ?? ""}`}>
      {dot && <span className={styles.dot} />}
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
}
