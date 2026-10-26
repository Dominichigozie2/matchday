"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  UsersRound,
  MessagesSquare,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  ArrowUpRight,
  Link2,
} from "lucide-react";
import { me, getUser } from "@/data/users";
import { myRequests, formatNaira, type IncomingRequest } from "@/data/requests";
import { conversations } from "@/data/chats";
import { getCategory } from "@/data/categories";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SportIcon from "@/components/ui/SportIcon";
import { useToast } from "@/components/ui/Toast";
import styles from "./overview.module.css";

export default function DashboardOverviewPage() {
  const toast = useToast();
  const [reqs, setReqs] = useState<IncomingRequest[]>(myRequests);
  const [dirTab, setDirTab] = useState<"in" | "out">("in");

  const handleAction = (id: string, status: "accepted" | "declined") => {
    setReqs((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const target = reqs.find((r) => r.id === id);
    if (status === "accepted" && target) {
      toast({
        title: `Merged with @${target.from}!`,
        description: "Match Chat is now open until 24 hours after matchday.",
      });
    } else {
      toast({ title: "Request declined", tone: "info" });
    }
  };

  const filteredReqs = reqs.filter((r) => r.direction === dirTab);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <span className="eyebrow">Captain&apos;s Command Centre</span>
          <h1>Welcome back, {me.name}</h1>
          <p>
            Matchday ID: <code>{me.id}</code> · Captain: <strong>{me.manager}</strong> (@{me.managerUsername})
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button href="/dashboard/team" variant="outline" size="sm" icon={<Link2 size={16} />}>
            Share Squad Invite Link
          </Button>
          <Button href="/dashboard/chat" variant="primary" size="sm" icon={<MessagesSquare size={16} />}>
            Open Match Chats (3)
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpis}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiIcon}>
            <Trophy size={20} />
          </span>
          <div>
            <span>Win / Loss Record</span>
            <strong>
              {me.wins}W – {me.losses}L
            </strong>
            <small>77% win rate · ★ {me.rating}</small>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiIcon}>
            <UsersRound size={20} />
          </span>
          <div>
            <span>Registered Squad</span>
            <strong>{me.members} Players</strong>
            <small>
              <Link href="/dashboard/team">2 pending invite approvals →</Link>
            </small>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiIcon}>
            <MessagesSquare size={20} />
          </span>
          <div>
            <span>Merged Matches</span>
            <strong>{conversations.length} Active</strong>
            <small>Next kick-off: Sat, Oct 31 · 4:00 PM</small>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiIconVolt}>
            <ShieldCheck size={20} />
          </span>
          <div>
            <span>Active Escrow Stakes</span>
            <strong>₦60,000 Pots</strong>
            <small>
              <Link href="/dashboard/wallet">₦30,000 your deposit →</Link>
            </small>
          </div>
        </div>
      </div>

      <div className={styles.twoCol}>
        {/* Incoming & Outgoing Match Requests */}
        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2>Match Requests Inbox</h2>
              <p>Accepting a request merges both parties and opens a Match Chat.</p>
            </div>
            <div className={styles.tabs}>
              <button
                type="button"
                className={`${styles.tab} ${dirTab === "in" ? styles.tabOn : ""}`}
                onClick={() => setDirTab("in")}
              >
                Incoming ({reqs.filter((r) => r.direction === "in").length})
              </button>
              <button
                type="button"
                className={`${styles.tab} ${dirTab === "out" ? styles.tabOn : ""}`}
                onClick={() => setDirTab("out")}
              >
                Sent ({reqs.filter((r) => r.direction === "out").length})
              </button>
            </div>
          </div>

          <div className={styles.reqList}>
            {filteredReqs.map((r) => {
              const u = getUser(r.from);
              const cat = getCategory(r.category);
              return (
                <article key={r.id} className={styles.reqItem}>
                  <div className={styles.reqTop}>
                    <Avatar name={u.name} hue={u.hue} size={42} group={u.type === "group"} />
                    <div className={styles.reqWho}>
                      <div className={styles.reqNameRow}>
                        <strong>{u.name}</strong>
                        <span className={styles.idPill}>{u.id}</span>
                        <Badge tone="neutral">
                          <SportIcon slug={r.category} size={12} /> {cat?.name} · {r.format}
                        </Badge>
                      </div>
                      <span>
                        @{u.username} · {u.area} · {r.received}
                      </span>
                    </div>
                    {r.stake ? (
                      <Badge tone="volt">{formatNaira(r.stake * 2)} pot</Badge>
                    ) : (
                      <Badge tone="outline">Friendly</Badge>
                    )}
                  </div>

                  <p className={styles.reqMsg}>“{r.message}”</p>

                  <div className={styles.reqFoot}>
                    <div className={styles.reqMeta}>
                      <span>
                        <Calendar size={13} /> {r.dateLabel} · {r.time}
                      </span>
                      <span>
                        <MapPin size={13} /> {r.venue}
                      </span>
                    </div>

                    {r.status === "pending" && r.direction === "in" ? (
                      <div className={styles.reqBtns}>
                        <button
                          type="button"
                          className={styles.declineBtn}
                          onClick={() => handleAction(r.id, "declined")}
                        >
                          <XCircle size={15} /> Decline
                        </button>
                        <button
                          type="button"
                          className={styles.acceptBtn}
                          onClick={() => handleAction(r.id, "accepted")}
                        >
                          <CheckCircle2 size={15} /> Accept &amp; merge
                        </button>
                      </div>
                    ) : (
                      <Badge
                        tone={
                          r.status === "accepted"
                            ? "primary"
                            : r.status === "declined"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {r.status === "accepted"
                          ? "Merged · Chat open"
                          : r.status === "declined"
                            ? "Declined"
                            : "Awaiting response"}
                      </Badge>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Active Merged Matches & Quick Chat Preview */}
        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2>Merged Upcoming Matches</h2>
              <p>Chat stays active until 24h after matchday.</p>
            </div>
            <Link href="/dashboard/chat" className={styles.viewAll}>
              Full chat <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className={styles.mergedList}>
            {conversations.map((c) => {
              const rival = getUser(c.with);
              const cat = getCategory(c.category);
              return (
                <Link key={c.id} href="/dashboard/chat" className={styles.mergedCard}>
                  <div className={styles.mergedTop}>
                    <span className={styles.sportDot} style={{ background: cat?.tint }}>
                      <SportIcon slug={c.category} size={15} />
                    </span>
                    <div>
                      <strong>
                        {me.name} × {rival.name}
                      </strong>
                      <span>
                        {cat?.name} ({c.format}) · {c.matchDate} at {c.matchTime}
                      </span>
                    </div>
                    {c.unread > 0 && <span className={styles.unread}>{c.unread} new</span>}
                  </div>

                  <div className={styles.mergedVenue}>
                    <MapPin size={14} />
                    <span>
                      {c.venue} ({c.venueArea})
                    </span>
                    <span className={styles.dot}>•</span>
                    <span>
                      {c.stake ? `${formatNaira(c.stake * 2)} escrow pot` : "Friendly (₦0)"}
                    </span>
                  </div>

                  <div className={styles.mergedLast}>
                    <span>“{c.lastMessage}”</span>
                    <small>{c.closesIn}</small>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
