"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  ShieldCheck,
  MessagesSquare,
  Navigation,
  Swords,
  CheckCircle2,
  Calendar,
  BadgeCheck,
  Users,
  UserCheck,
} from "lucide-react";
import { categories, getCategory } from "@/data/categories";
import { getUser, me, type User } from "@/data/users";
import { venues } from "@/data/venues";
import { formatNaira, type MatchRequest } from "@/data/requests";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import SportIcon from "@/components/ui/SportIcon";
import { useToast } from "@/components/ui/Toast";
import styles from "./MatchActionModals.module.css";

/* ---------------------------------------------------------
   1. Accept & Merge Request Modal
   --------------------------------------------------------- */
export function AcceptRequestModal({
  req,
  onClose,
}: {
  req: MatchRequest | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const [venueChoice, setVenueChoice] = useState<"accept" | "midpoint" | "counter">("accept");
  const [counterVenue, setCounterVenue] = useState("Teslim Balogun Annex");
  const [note, setNote] = useState("We're ready! See you on the pitch.");

  if (!req) return null;

  const cat = getCategory(req.category);
  const host = getUser(req.by);
  const sportVenues = venues.filter((v) => v.categories.includes(req.category));

  const handleConfirm = () => {
    toast({
      title: `Merged with ${host.name}!`,
      description: req.stake
        ? `Match chat unlocked. ${formatNaira(req.stake * 2)} escrow pot initialized.`
        : "Match chat unlocked until 24h after matchday.",
      tone: "success",
    });
    onClose();
    router.push("/dashboard/chat");
  };

  return (
    <Modal
      open={!!req}
      onClose={onClose}
      width={620}
      title={`Merge with ${host.name}`}
      subtitle={`Accepting ${req.id} · ${cat?.name ?? req.category} (${req.format})`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={<MessagesSquare size={17} />} onClick={handleConfirm}>
            Confirm merge &amp; open Match Chat
          </Button>
        </>
      }
    >
      <div className={styles.vsBanner}>
        <div className={styles.party}>
          <Avatar name={me.name} hue={me.hue} size={44} group />
          <div>
            <strong>{me.name}</strong>
            <span>
              @{me.username} · {me.area}
            </span>
          </div>
        </div>
        <span className={styles.vsBadge}>VS</span>
        <div className={styles.party}>
          <Avatar name={host.name} hue={host.hue} size={44} group={host.type === "group"} />
          <div>
            <strong>{host.name}</strong>
            <span>
              @{host.username} · {host.area}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.label}>Sport &amp; agreed match sheet</span>
        <div className={styles.ruleBox}>
          <div className={styles.ruleHead}>
            <span className={styles.sportBadge}>
              <SportIcon slug={req.category} size={16} />
              {cat?.name} · {req.format}
            </span>
            <Badge tone="primary">{req.skill}</Badge>
          </div>
          <div className={styles.chips}>
            {req.rules.map((r) => (
              <span key={r} className={styles.chip}>
                <CheckCircle2 size={13} /> {r}
              </span>
            ))}
          </div>
          <div className={styles.dateRow}>
            <Calendar size={15} />
            <span>
              Scheduled for <strong>{req.dateLabel}</strong> at <strong>{req.time}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.label}>Venue resolution ({me.area} ↔ {host.area})</span>
        <div className={styles.venueOptions}>
          <button
            type="button"
            className={`${styles.venueOpt} ${venueChoice === "accept" ? styles.venueOptActive : ""}`}
            onClick={() => setVenueChoice("accept")}
          >
            <MapPin size={16} />
            <div>
              <strong>Accept {req.venue}</strong>
              <span>{req.area} · {req.distanceKm} km from you</span>
            </div>
          </button>
          <button
            type="button"
            className={`${styles.venueOpt} ${venueChoice === "midpoint" ? styles.venueOptActive : ""}`}
            onClick={() => setVenueChoice("midpoint")}
          >
            <Navigation size={16} />
            <div>
              <strong>Use Smart Midpoint Venue</strong>
              <span>Equidistant between {me.area} &amp; {host.area}</span>
            </div>
          </button>
          <button
            type="button"
            className={`${styles.venueOpt} ${venueChoice === "counter" ? styles.venueOptActive : ""}`}
            onClick={() => setVenueChoice("counter")}
          >
            <MapPin size={16} />
            <div>
              <strong>Propose another venue</strong>
              <span>Discuss in Match Chat</span>
            </div>
          </button>
        </div>

        {venueChoice === "counter" && (
          <select
            className={styles.select}
            value={counterVenue}
            onChange={(e) => setCounterVenue(e.target.value)}
          >
            {sportVenues.map((v) => (
              <option key={v.id} value={v.name}>
                {v.name} — {v.area} ({v.pricePerHour ? `${formatNaira(v.pricePerHour)}/hr` : "Free"})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.section}>
        <span className={styles.label}>Winner-Takes-All Stake</span>
        {req.stake ? (
          <div className={styles.stakeBanner}>
            <ShieldCheck size={22} />
            <div>
              <strong>
                {formatNaira(req.stake)} each · {formatNaira(req.stake * 2)} Winner-Takes-All Pot
              </strong>
              <p>
                Held safely in Matchday Escrow. Released automatically once both sides confirm the post-match score.
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.friendlyBanner}>
            <strong>Friendly match (₦0 stake)</strong>
            <span>You can still propose a stake inside Match Chat before kick-off if both parties agree.</span>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <label className={styles.label} htmlFor="merge-note">
          Opening message for Match Chat
        </label>
        <input
          id="merge-note"
          className={styles.input}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------
   2. Direct Challenge Modal (by @username or MD-XXXXX ID)
   --------------------------------------------------------- */
export function DirectChallengeModal({
  target,
  onClose,
}: {
  target: User | null;
  onClose: () => void;
}) {
  const toast = useToast();
  const [catSlug, setCatSlug] = useState<string>(target?.categories[0] ?? "football");
  const [venueMode, setVenueMode] = useState<"midpoint" | "preferred">("midpoint");
  const [stake, setStake] = useState<number>(10000);
  const [staked, setStaked] = useState<boolean>(true);
  const [whenDate, setWhenDate] = useState("Sat, Oct 31 · 4:30 PM");
  const [msg, setMsg] = useState("Seen your record on Matchday — let's run a proper match this weekend.");

  const currentCat = useMemo(
    () => getCategory(catSlug) ?? categories[0]!,
    [catSlug]
  );

  const matchingVenues = useMemo(
    () => venues.filter((v) => v.categories.includes(currentCat.slug)),
    [currentCat.slug]
  );

  if (!target) return null;

  const sendDirect = () => {
    toast({
      title: `Direct challenge sent to @${target.username} (${target.id})`,
      description: `${currentCat.name} · ${venueMode === "midpoint" ? "Smart Midpoint Venue" : matchingVenues[0]?.name ?? "Preferred Venue"}${
        staked ? ` · ${formatNaira(stake * 2)} pot` : " · Friendly"
      }`,
      tone: "success",
    });
    onClose();
  };

  return (
    <Modal
      open={!!target}
      onClose={onClose}
      width={600}
      title={`Challenge ${target.name}`}
      subtitle={`Direct request via ID ${target.id} (@${target.username})`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="accent" icon={<Swords size={17} />} onClick={sendDirect}>
            Send direct match request
          </Button>
        </>
      }
    >
      <div className={styles.targetCard}>
        <Avatar name={target.name} hue={target.hue} size={52} group={target.type === "group"} />
        <div className={styles.targetInfo}>
          <div className={styles.targetNameRow}>
            <h4>{target.name}</h4>
            {target.verified && <BadgeCheck size={16} className={styles.verified} />}
            <Badge tone="neutral">
              {target.type === "group" ? <Users size={12} /> : <UserCheck size={12} />}
              {target.type === "group" ? `Group (${target.members} players)` : "Individual"}
            </Badge>
          </div>
          <p>
            @{target.username} · <strong>{target.id}</strong> · {target.area} · ★ {target.rating.toFixed(1)} (
            {target.wins}W–{target.losses}L)
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.label}>1. Choose game category</span>
        <div className={styles.catGrid}>
          {categories.map((c) => {
            const preferred = target.categories.includes(c.slug);
            return (
              <button
                key={c.slug}
                type="button"
                className={`${styles.catBtn} ${catSlug === c.slug ? styles.catBtnActive : ""}`}
                onClick={() => setCatSlug(c.slug)}
              >
                <SportIcon slug={c.slug} size={16} />
                <span>{c.name}</span>
                {preferred && <span className={styles.favDot} title="Plays this sport" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.label}>2. {currentCat.name} settings preset</span>
        <div className={styles.chips}>
          {currentCat.settings.slice(0, 4).map((s) => (
            <span key={s.id} className={styles.chip}>
              {s.label}: <strong>{String(s.default)}</strong>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <label className={styles.label} htmlFor="dc-when">
            3. Date &amp; kick-off time
          </label>
          <input
            id="dc-when"
            className={styles.input}
            value={whenDate}
            onChange={(e) => setWhenDate(e.target.value)}
          />
        </div>

        <div className={styles.section}>
          <span className={styles.label}>4. Venue mode</span>
          <div className={styles.segRow}>
            <button
              type="button"
              className={`${styles.segBtn} ${venueMode === "midpoint" ? styles.segActive : ""}`}
              onClick={() => setVenueMode("midpoint")}
            >
              Fair Midpoint ({me.area} ↔ {target.area})
            </button>
            <button
              type="button"
              className={`${styles.segBtn} ${venueMode === "preferred" ? styles.segActive : ""}`}
              onClick={() => setVenueMode("preferred")}
            >
              Pick Venue
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.stakeHeader}>
          <span className={styles.label}>5. Winner-Takes-All Stake (Optional)</span>
          <button
            type="button"
            className={`${styles.stakeSwitch} ${staked ? styles.stakeSwitchOn : ""}`}
            onClick={() => setStaked((s) => !s)}
          >
            {staked ? "Staked Pot Enabled" : "Friendly (₦0)"}
          </button>
        </div>
        {staked && (
          <div className={styles.stakePills}>
            {[2000, 5000, 10000, 20000, 50000].map((amt) => (
              <button
                key={amt}
                type="button"
                className={`${styles.stakePill} ${stake === amt ? styles.stakePillActive : ""}`}
                onClick={() => setStake(amt)}
              >
                {formatNaira(amt)} each → <strong>{formatNaira(amt * 2)} pot</strong>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <label className={styles.label} htmlFor="dc-msg">
          Challenge note
        </label>
        <input
          id="dc-msg"
          className={styles.input}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
      </div>
    </Modal>
  );
}
