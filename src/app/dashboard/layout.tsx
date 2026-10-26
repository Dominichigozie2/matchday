"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UsersRound,
  MessagesSquare,
  Wallet,
  Plus,
  Compass,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { me } from "@/data/users";
import Logo from "@/components/layout/Logo";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import styles from "./dashboard.module.css";

const navItems = [
  { href: "/dashboard", label: "Overview & Requests", icon: LayoutDashboard },
  { href: "/dashboard/team", label: "Player Log & Invite Links", icon: UsersRound, badge: "Group" },
  { href: "/dashboard/chat", label: "Merged Match Chat", icon: MessagesSquare, badge: "3 active" },
  { href: "/dashboard/wallet", label: "Stakes & Escrow", icon: Wallet },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brandRow}>
          <Logo />
          <Badge tone="primary">v0.1</Badge>
        </div>

        <div className={styles.accountCard}>
          <div className={styles.accountTop}>
            <Avatar name={me.name} hue={me.hue} size={46} group />
            <div className={styles.accountInfo}>
              <div className={styles.nameLine}>
                <strong>{me.name}</strong>
                <BadgeCheck size={15} className={styles.verified} />
              </div>
              <span>@{me.username}</span>
            </div>
          </div>
          <div className={styles.idRow}>
            <span>Matchday ID</span>
            <code>{me.id}</code>
          </div>
          <div className={styles.metaStrip}>
            <span>Group · {me.members} players</span>
            <span>•</span>
            <span>★ {me.rating}</span>
            <span>•</span>
            <span>
              {me.wins}W–{me.losses}L
            </span>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Dashboard">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navActive : ""}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sideFoot}>
          <Button href="/create" variant="primary" size="sm" block icon={<Plus />}>
            New match request
          </Button>
          <Button href="/explore" variant="outline" size="sm" block icon={<Compass />}>
            Explore match board
          </Button>
          <div className={styles.escrowNote}>
            <ShieldCheck size={15} />
            <span>₦30,000 currently locked in active match escrows.</span>
          </div>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topBar}>
          <div className={styles.mobileBrand}>
            <Logo />
          </div>
          <div className={styles.topLinks}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.topPill} ${pathname === item.href ? styles.topPillActive : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className={styles.topRight}>
            <span className={styles.areaBadge}>{me.area}, Lagos</span>
            <Button href="/create" variant="dark" size="sm" icon={<Plus />}>
              New request
            </Button>
          </div>
        </header>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
