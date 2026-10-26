"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Plus, LayoutDashboard, MessagesSquare, UsersRound, Wallet } from "lucide-react";
import Logo from "./Logo";
import Button from "@/components/ui/Button";
import styles from "./Navbar.module.css";

const links = [
  { href: "/explore", label: "Find a match" },
  { href: "/#categories", label: "Games" },
  { href: "/#how", label: "How it works" },
  { href: "/#teams", label: "For teams" },
  { href: "/#stakes", label: "Stakes" },
  { href: "/dashboard", label: "Dashboard" },
];

const quickAppLinks = [
  { href: "/dashboard", label: "Captain Overview", icon: LayoutDashboard },
  { href: "/dashboard/team", label: "Player Log & Invite Link", icon: UsersRound },
  { href: "/dashboard/chat", label: "Merged Match Chat", icon: MessagesSquare },
  { href: "/dashboard/wallet", label: "Stakes & Escrow Wallet", icon: Wallet },
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

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
          <Button href="/create" variant="dark" size="sm" icon={<Plus />} className={styles.createQuick}>
            <span className={styles.createLabelFull}>Create request</span>
            <span className={styles.createLabelShort}>Match</span>
          </Button>
          <button
            className={styles.burger}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true" />}

      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}>
        <div className={`container ${styles.drawerInner}`}>
          <div className={styles.drawerSection}>
            <span className={styles.drawerHeading}>Explore Matchday</span>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={styles.drawerLink} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className={styles.drawerSection}>
            <span className={styles.drawerHeading}>Quick App Hubs</span>
            <div className={styles.quickGrid}>
              {quickAppLinks.map((q) => {
                const Icon = q.icon;
                return (
                  <Link
                    key={q.href}
                    href={q.href}
                    className={styles.quickCard}
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{q.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className={styles.drawerActions}>
            <Button href="/create" variant="primary" block icon={<Plus />} onClick={() => setOpen(false)}>
              Create a match request
            </Button>
            <div className={styles.drawerAuthRow}>
              <Button href="/auth/login" variant="outline" block onClick={() => setOpen(false)}>
                Log in
              </Button>
              <Button href="/auth/signup" variant="dark" block onClick={() => setOpen(false)}>
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
