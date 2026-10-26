import Link from "next/link";
import Logo from "./Logo";
import { categories } from "@/data/categories";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo light />
            <p>
              The easiest way to find a worthy opponent for the games you love — and settle it on the pitch, the court
              or the board.
            </p>
          </div>

          <div className={styles.cols}>
            <div>
              <h4>Games</h4>
              <ul>
                {categories.slice(0, 6).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/categories/${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Product</h4>
              <ul>
                <li><Link href="/explore">Find a match</Link></li>
                <li><Link href="/create">Create a request</Link></li>
                <li><Link href="/dashboard/team">Team management</Link></li>
                <li><Link href="/dashboard/wallet">Stakes &amp; wallet</Link></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Safety centre</Link></li>
                <li><Link href="#">Responsible play</Link></li>
                <li><Link href="#">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.giant} aria-hidden="true">
          matchday
        </div>

        <div className={styles.bottom}>
          <span>© 2026 Matchday Technologies. v0.1 preview.</span>
          <span>Stakes are for verified users aged 18+. Play responsibly.</span>
          <div className={styles.legal}>
            <Link href="#">Terms</Link>
            <Link href="#">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
