"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Plus } from "lucide-react";
import Logo from "./Logo";
import Button from "@/components/ui/Button";
import styles from "./Navbar.module.css";

const links = [
  { href: "/explore", label: "Find a match" },
  { href: "/#categories", label: "Games" },
  { href: "/#how", label: "How it works" },
  { href: "/#teams", label: "For teams" },
  { href: "/#stakes", label: "Stakes" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`${styles.nav} ${scrolled || open ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Logo />

        <nav className={styles.links} aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? styles.active : ""}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Button href="/auth/login" variant="ghost" size="sm" className={styles.hideSm}>
            Log in
          </Button>
          <Button href="/create" variant="dark" size="sm" icon={<Plus />} className={styles.hideSm}>
            Create request
          </Button>
          <button className={styles.burger} onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}>
        <div className="container">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={styles.drawerLink} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className={styles.drawerActions}>
            <Button href="/auth/login" variant="outline" block>
              Log in
            </Button>
            <Button href="/auth/signup" variant="primary" block>
              Create free account
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
