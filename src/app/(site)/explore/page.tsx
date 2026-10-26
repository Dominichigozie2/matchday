"use client";

import { useState } from "react";
import { Swords, BadgeCheck, Users, UserCheck, Plus } from "lucide-react";
import LiveRequestsSection from "@/components/home/LiveRequestsSection";
import { users, type User } from "@/data/users";
import { getCategory } from "@/data/categories";
import { DirectChallengeModal } from "@/components/matches/MatchActionModals";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SportIcon from "@/components/ui/SportIcon";
import styles from "./explore.module.css";

export default function ExplorePage() {
  const [target, setTarget] = useState<User | null>(null);
  const [typeFilter, setTypeFilter] = useState<"all" | "individual" | "group">("all");

  const directory = users.filter((u) => (typeFilter === "all" ? true : u.type === typeFilter));

  return (
    <div className={styles.page}>
      <div className={styles.topSpacer} />
      <LiveRequestsSection fullPage />

      {/* Player & Squad Directory for Direct Challenges */}
      <section className={`section ${styles.directorySection}`}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Verified Player &amp; Squad Directory</span>
              <h2 className="section-title">
                Send a direct challenge by <span className="hl">@username or ID.</span>
              </h2>
            </div>
            <div className={styles.dirFilters}>
              {(["all", "individual", "group"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`${styles.dirTab} ${typeFilter === t ? styles.dirTabOn : ""}`}
                  onClick={() => setTypeFilter(t)}
                >
                  {t === "all" ? "All accounts (12)" : t === "individual" ? "Individuals" : "Groups / Squads"}
                </button>
              ))}
              <Button href="/create" variant="primary" size="sm" icon={<Plus />}>
                Create open request
              </Button>
            </div>
          </div>

          <div className={styles.dirGrid}>
            {directory.map((u) => (
              <article key={u.id} className={styles.userCard}>
                <div className={styles.userTop}>
                  <Avatar name={u.name} hue={u.hue} size={52} group={u.type === "group"} />
                  <div className={styles.userInfo}>
                    <div className={styles.nameRow}>
                      <h3>{u.name}</h3>
                      {u.verified && <BadgeCheck size={16} className={styles.verified} />}
                    </div>
                    <div className={styles.metaRow}>
                      <span>@{u.username}</span>
                      <span>·</span>
                      <code className={styles.idCode}>{u.id}</code>
                    </div>
                  </div>
                  <Badge tone={u.type === "group" ? "primary" : "neutral"}>
                    {u.type === "group" ? <Users size={12} /> : <UserCheck size={12} />}
                    {u.type === "group" ? `${u.members} players` : "1v1"}
                  </Badge>
                </div>

                <div className={styles.statsBar}>
                  <div>
                    <span>Area</span>
                    <strong>{u.area}</strong>
                  </div>
                  <div>
                    <span>Record</span>
                    <strong>
                      {u.wins}W – {u.losses}L
                    </strong>
                  </div>
                  <div>
                    <span>Rating</span>
                    <strong>★ {u.rating.toFixed(1)}</strong>
                  </div>
                </div>

                <div className={styles.sportTags}>
                  {u.categories.map((slug) => {
                    const c = getCategory(slug);
                    return (
                      <span key={slug} className={styles.sportTag}>
                        <SportIcon slug={slug} size={14} />
                        {c?.name ?? slug}
                      </span>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  block
                  icon={<Swords size={15} />}
                  onClick={() => setTarget(u)}
                >
                  Challenge @{u.username} ({u.id})
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <DirectChallengeModal target={target} onClose={() => setTarget(null)} />
    </div>
  );
}
