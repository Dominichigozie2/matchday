import Link from "next/link";
import styles from "./Logo.module.css";

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true" className={styles.mark}>
      <rect width="36" height="36" rx="11" fill="var(--inverse)" />
      <path d="M16.6 10.2a7.8 7.8 0 0 0 0 15.6z" fill="var(--volt)" />
      <path d="M19.4 10.2a7.8 7.8 0 0 1 0 15.6z" fill="var(--accent)" />
    </svg>
  );
}

export default function Logo({ href = "/", light = false }: { href?: string; light?: boolean }) {
  return (
    <Link href={href} className={`${styles.logo} ${light ? styles.light : ""}`} aria-label="Matchday home">
      <LogoMark />
      <span className={styles.word}>
        matchday<span className={styles.dot}>.</span>
      </span>
    </Link>
  );
}
