"use client";

import { MapPin, Calendar, Clock, ShieldCheck, Users, UserCheck, Flame, BadgeCheck, Swords } from "lucide-react";
import { getCategory } from "@/data/categories";
import { getUser } from "@/data/users";
import { formatNaira, type MatchRequest } from "@/data/requests";
import { useUserLocation } from "@/lib/location";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SportIcon from "@/components/ui/SportIcon";
import styles from "./RequestCard.module.css";

export default function RequestCard({
  req,
  onSelect,
}: {
  req: MatchRequest;
  onSelect: (req: MatchRequest) => void;
}) {
  const cat = getCategory(req.category);
  const host = getUser(req.by);
  const loc = useUserLocation();
  const liveDistKm = loc.distanceFromMeKm(host.lat, host.lng);

  return (
    <article
      className={styles.card}
      style={{ "--tint": cat?.tint ?? "var(--primary)" } as React.CSSProperties}
    >
      <div className={styles.head}>
        <div className={styles.sportTag}>
          <span className={styles.sportIcon}>
            <SportIcon slug={req.category} size={16} />
          </span>
          <span>{cat?.name ?? req.category}</span>
          <span className={styles.dot}>·</span>
          <strong>{req.format}</strong>
        </div>

        {req.stake ? (
          <Badge tone="volt" icon={<ShieldCheck size={13} />}>
            {formatNaira(req.stake * 2)} pot
          </Badge>
        ) : (
          <Badge tone="neutral">Friendly · No stake</Badge>
        )}
      </div>

      <div className={styles.hostRow}>
        <Avatar name={host.name} hue={host.hue} size={46} group={host.type === "group"} />
        <div className={styles.hostInfo}>
          <div className={styles.hostNameLine}>
            <h4>{host.name}</h4>
            {host.verified && <BadgeCheck size={16} className={styles.verified} />}
            <span className={styles.modeTag}>
              {req.mode === "group" ? <Users size={12} /> : <UserCheck size={12} />}
              {req.mode === "group" ? "Group" : "1v1"}
            </span>
          </div>
          <div className={styles.hostMeta}>
            <span>@{host.username}</span>
            <span>·</span>
            <span className={styles.idChip}>{host.id}</span>
            <span>·</span>
            <span>
              ★ {host.rating.toFixed(1)} ({host.wins}W–{host.losses}L)
            </span>
          </div>
        </div>
      </div>

      {req.note && <p className={styles.note}>“{req.note}”</p>}

      <div className={styles.rulesRow}>
        <span className={styles.skillChip}>{req.skill}</span>
        {req.rules.map((r) => (
          <span key={r} className={styles.rulePill}>
            {r}
          </span>
        ))}
      </div>

      <div className={styles.logistics}>
        <div className={styles.logItem}>
          <Calendar size={15} />
          <span>
            <strong>{req.dateLabel}</strong> · {req.time}
          </span>
        </div>
        <div className={styles.logItem}>
          <MapPin size={15} />
          <span>
            <strong>{req.venue}</strong> ({req.area} · {liveDistKm} km from {loc.area})
          </span>
        </div>
      </div>

      <div className={styles.foot}>
        <div className={styles.footMeta}>
          <Clock size={13} />
          <span>{req.posted}</span>
          <span>·</span>
          <Flame size={13} className={styles.flame} />
          <span>{req.interested} interested</span>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Swords size={15} />}
          onClick={() => onSelect(req)}
        >
          Accept &amp; merge
        </Button>
      </div>
    </article>
  );
}
