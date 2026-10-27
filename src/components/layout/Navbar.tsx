"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Plus,
  LayoutDashboard,
  MessagesSquare,
  UsersRound,
  Wallet,
  LocateFixed,
  ChevronDown,
  Check,
  Gamepad2,
} from "lucide-react";
import { useUserLocation, LAGOS_AREAS } from "@/lib/location";
import Logo from "./Logo";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import styles from "./Navbar.module.css";

const links = [
  { href: "/explore", label: "Find a match" },
  { href: "/games", label: "Games" },
  { href: "/#how", label: "How it works" },
  { href: "/#teams", label: "For teams" },
  { href: "/#stakes", label: "Stakes" },
  { href: "/dashboard", label: "Dashboard" },
];

const quickAppLinks = [
  { href: "/games", label: "All Games Directory", icon: Gamepad2 },
  { href: "/dashboard", label: "Captain Overview", icon: LayoutDashboard },
  { href: "/dashboard/team", label: "Player Log & Invite Link", icon: UsersRound },
  { href: "/dashboard/chat", label: "Merged Match Chat", icon: MessagesSquare },
  { href: "/dashboard/wallet", label: "Stakes & Escrow Wallet", icon: Wallet },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const pathname = usePathname();
  const loc = useUserLocation();
  const toast = useToast();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setLocOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleReDetect = async () => {
    await loc.detectLocation();
    toast({
      title: `Location detected: ${loc.area}, ${loc.city}`,
      description: "Nearby venues, midpoint pitches, and open match distances updated.",
      tone: "success",
    });
    setLocOpen(false);
  };

  return (
    <header className={`${styles.nav} ${scrolled || open ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.leftBrand}>
          <Logo />

          {/* User Location Detection Pill */}
          <div className={styles.locWrap}>
            <button
              type="button"
              className={styles.locPill}
              onClick={() => setLocOpen((v) => !v)}
              aria-expanded={locOpen}
              aria-label="Your detected location"
            >
              <span className={`${styles.locDot} ${loc.status === "detecting" ? styles.locPulse : ""}`} />
              <span className={styles.locText}>
                {loc.status === "detecting" ? "Detecting..." : `${loc.area}, ${loc.city}`}
              </span>
              <ChevronDown size={13} />
            </button>

            {locOpen && (
              <div className={styles.locPopover}>
                <div className={styles.locPopHead}>
                  <div>
                    <strong>Your Detected Location</strong>
                    <span>
                      {loc.source === "gps"
                        ? `GPS Verified (±${loc.accuracyMeters ?? 35}m)`
                        : loc.source === "ip"
                          ? "Network Geo-IP Detected"
                          : "Selected Neighborhood"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.detectNowBtn}
                    onClick={handleReDetect}
                    disabled={loc.status === "detecting"}
                  >
                    <LocateFixed size={13} />
                    <span>{loc.status === "detecting" ? "Locating..." : "Detect GPS"}</span>
                  </button>
                </div>

                <div className={styles.areaGrid}>
                  {LAGOS_AREAS.map((a) => {
                    const active = a.area.toLowerCase() === loc.area.toLowerCase();
                    return (
                      <button
                        key={a.area}
                        type="button"
                        className={`${styles.areaBtn} ${active ? styles.areaBtnActive : ""}`}
                        onClick={() => {
                          loc.setManualArea(a.area);
                          setLocOpen(false);
                        }}
                      >
                        <span>{a.area}</span>
                        {active && <Check size={13} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

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
