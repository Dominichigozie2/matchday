"use client";

import { useMemo, useState } from "react";
import {
  Search,
  AtSign,
  Hash,
  Swords,
  Plus,
  Filter,
  BadgeCheck,
  ArrowUpRight,
} from "lucide-react";
import { categories } from "@/data/categories";
import { requests, type MatchRequest, type When } from "@/data/requests";
import { users, findUser, type User } from "@/data/users";
import RequestCard from "@/components/matches/RequestCard";
import { AcceptRequestModal, DirectChallengeModal } from "@/components/matches/MatchActionModals";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import SportIcon from "@/components/ui/SportIcon";
import RevealScope from "@/components/motion/RevealScope";
import styles from "./LiveRequestsSection.module.css";

export default function LiveRequestsSection({ fullPage = false }: { fullPage?: boolean }) {
  const [catFilter, setCatFilter] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<"all" | "individual" | "group">("all");
  const [whenFilter, setWhenFilter] = useState<"all" | When>("all");
  const [stakeFilter, setStakeFilter] = useState<"all" | "staked" | "friendly">("all");
  const [query, setQuery] = useState("");

  // Direct lookup by @username or MD-XXXXX ID
  const [directQuery, setDirectQuery] = useState("");
  const [selectedReq, setSelectedReq] = useState<MatchRequest | null>(null);
  const [directTarget, setDirectTarget] = useState<User | null>(null);

  const matchedDirectUser = useMemo(() => {
    if (!directQuery.trim()) return null;
    const exact = findUser(directQuery);
    if (exact) return exact;
    const q = directQuery.trim().replace(/^@/, "").toLowerCase();
    return users.find(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q)
    );
  }, [directQuery]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (catFilter !== "all" && r.category !== catFilter) return false;
      if (modeFilter !== "all" && r.mode !== modeFilter) return false;
      if (whenFilter !== "all" && r.when !== whenFilter) return false;
      if (stakeFilter === "staked" && !r.stake) return false;
      if (stakeFilter === "friendly" && r.stake) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const host = users.find((u) => u.username === r.by);
        const hay = `${r.id} ${r.category} ${r.format} ${r.venue} ${r.area} ${r.by} ${host?.name ?? ""} ${host?.id ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [catFilter, modeFilter, whenFilter, stakeFilter, query]);

  const displayedRequests = fullPage ? filteredRequests : filteredRequests.slice(0, 6);

  return (
    <RevealScope as="section" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head" data-reveal>
          <div>
            <span className="eyebrow">Live Match Board &amp; Direct Challenge</span>
            <h2 className="section-title">
              Browse open requests or <span className="hl">call out a rival.</span>
            </h2>
          </div>
          <div className={styles.headRight}>
            <p className="section-sub">
              Filter open challenges by game, format, schedule, or pot — or enter any player or team&apos;s{" "}
              <strong>@username</strong> or <strong>Matchday ID</strong> to send a direct invite.
            </p>
            <div className={styles.headActions}>
              <Button href="/create" variant="primary" size="sm" icon={<Plus />}>
                Post a match request
              </Button>
              {!fullPage && (
                <Button href="/explore" variant="outline" size="sm" iconRight={<ArrowUpRight />}>
                  Full match explorer
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Direct Challenge by @username or ID Number Bar */}
        <div className={styles.directBox} data-reveal>
          <div className={styles.directCopy}>
            <div className={styles.directBadge}>
              <AtSign size={14} /> <Hash size={14} /> Direct Challenge
            </div>
            <h3>Know who you want to play?</h3>
            <p>
              Send a private match request straight to an individual or group using their <strong>@username</strong> or{" "}
              <strong>Matchday ID</strong> (e.g. <code>MD-48213</code>).
            </p>
            <div className={styles.quickTargets}>
              <span>Try quick lookup:</span>
              {users.slice(0, 5).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  className={styles.quickChip}
                  onClick={() => setDirectQuery(u.id)}
                >
                  @{u.username} <span>{u.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.directSearchCol}>
            <div className={styles.directInputWrap}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                value={directQuery}
                onChange={(e) => setDirectQuery(e.target.value)}
                placeholder="Enter @username (e.g. @queenofludo) or ID (e.g. MD-48213)..."
                aria-label="Search player or group by username or ID"
              />
              {directQuery && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => setDirectQuery("")}
                >
                  Clear
                </button>
              )}
            </div>

            {matchedDirectUser ? (
              <div className={styles.foundUser}>
                <Avatar
                  name={matchedDirectUser.name}
                  hue={matchedDirectUser.hue}
                  size={46}
                  group={matchedDirectUser.type === "group"}
                />
                <div className={styles.foundMeta}>
                  <div className={styles.foundTitle}>
                    <strong>{matchedDirectUser.name}</strong>
                    {matchedDirectUser.verified && <BadgeCheck size={15} className={styles.verified} />}
                    <span className={styles.idTag}>{matchedDirectUser.id}</span>
                  </div>
                  <span>
                    @{matchedDirectUser.username} · {matchedDirectUser.type === "group" ? `Group (${matchedDirectUser.members} members)` : "Individual"} · {matchedDirectUser.area} · ★ {matchedDirectUser.rating.toFixed(1)}
                  </span>
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  icon={<Swords size={15} />}
                  onClick={() => setDirectTarget(matchedDirectUser)}
                >
                  Send request
                </Button>
              </div>
            ) : (
              <div className={styles.directHint}>
                Type a username or 5-digit Matchday ID above, or click a quick tag to preview instant lookup.
              </div>
            )}
          </div>
        </div>

        {/* Multi-axis filter bar */}
        <div className={styles.filterPanel} data-reveal>
          <div className={`no-scrollbar ${styles.catScroll}`} role="tablist" aria-label="Filter by sport">
            <button
              type="button"
              className={`${styles.catPill} ${catFilter === "all" ? styles.catPillActive : ""}`}
              onClick={() => setCatFilter("all")}
            >
              All sports ({requests.length})
            </button>
            {categories.map((c) => {
              const count = requests.filter((r) => r.category === c.slug).length;
              return (
                <button
                  key={c.slug}
                  type="button"
                  className={`${styles.catPill} ${catFilter === c.slug ? styles.catPillActive : ""}`}
                  onClick={() => setCatFilter(c.slug)}
                >
                  <SportIcon slug={c.slug} size={15} />
                  <span>{c.name}</span>
                  <span className={styles.catCount}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.subFilters}>
            <div className={styles.searchField}>
              <Search size={16} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by venue, area (Yaba, Lekki, Surulere), format or @host..."
                aria-label="Filter requests by keyword"
              />
            </div>

            <div className={styles.segGroup} aria-label="Match mode">
              <Filter size={14} className={styles.segIcon} />
              {(["all", "individual", "group"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`${styles.seg} ${modeFilter === m ? styles.segOn : ""}`}
                  onClick={() => setModeFilter(m)}
                >
                  {m === "all" ? "Any mode" : m === "individual" ? "1v1 / Individual" : "Group / Team"}
                </button>
              ))}
            </div>

            <div className={styles.segGroup} aria-label="When">
              {(["all", "today", "week", "weekend"] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  className={`${styles.seg} ${whenFilter === w ? styles.segOn : ""}`}
                  onClick={() => setWhenFilter(w)}
                >
                  {w === "all" ? "Any time" : w === "today" ? "Today" : w === "week" ? "This week" : "Weekend"}
                </button>
              ))}
            </div>

            <div className={styles.segGroup} aria-label="Stake type">
              {(["all", "staked", "friendly"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`${styles.seg} ${stakeFilter === s ? styles.segOn : ""}`}
                  onClick={() => setStakeFilter(s)}
                >
                  {s === "all" ? "All pots" : s === "staked" ? "Staked pot" : "Friendly (₦0)"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Request Grid */}
        {displayedRequests.length > 0 ? (
          <div className={styles.grid}>
            {displayedRequests.map((req) => (
              <RequestCard key={req.id} req={req} onSelect={setSelectedReq} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <h3>No open match requests match those exact filters.</h3>
            <p>Reset your filters or post a new request so nearby players can merge with you.</p>
            <div className={styles.emptyActions}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCatFilter("all");
                  setModeFilter("all");
                  setWhenFilter("all");
                  setStakeFilter("all");
                  setQuery("");
                }}
              >
                Reset filters
              </Button>
              <Button href="/create" variant="primary" size="sm" icon={<Plus />}>
                Create this request
              </Button>
            </div>
          </div>
        )}
      </div>

      <AcceptRequestModal req={selectedReq} onClose={() => setSelectedReq(null)} />
      <DirectChallengeModal target={directTarget} onClose={() => setDirectTarget(null)} />
    </RevealScope>
  );
}
