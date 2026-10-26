"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  MapPin,
  Navigation,
  ShieldCheck,
  Swords,
  Users,
  UserCheck,
  AtSign,
  Calendar,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { categories, type Category, type MatchMode } from "@/data/categories";
import { venues } from "@/data/venues";
import { users, findUser, me } from "@/data/users";
import { formatNaira } from "@/data/requests";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SportIcon from "@/components/ui/SportIcon";
import { useToast } from "@/components/ui/Toast";
import styles from "./create.module.css";

export default function CreateMatchPage() {
  const router = useRouter();
  const toast = useToast();

  const [catSlug, setCatSlug] = useState("football");
  const category: Category = useMemo(
    () => categories.find((c) => c.slug === catSlug) ?? categories[0]!,
    [catSlug]
  );

  const [mode, setMode] = useState<MatchMode>("group");
  const [targetType, setTargetType] = useState<"open" | "direct">("open");
  const [directInput, setDirectInput] = useState("MD-10442");

  // Dynamic sport settings state keyed by field.id
  const [settingsVal, setSettingsVal] = useState<Record<string, string | number | boolean>>({});

  useEffect(() => {
    const initial: Record<string, string | number | boolean> = {};
    category.settings.forEach((f) => {
      initial[f.id] = f.default;
    });
    setSettingsVal(initial);
    if (!category.modes.includes(mode)) {
      setMode(category.modes[0] ?? "individual");
    }
  }, [category, mode]);

  // Venue state
  const [venueMode, setVenueMode] = useState<"midpoint" | "preferred" | "host">("midpoint");
  const sportVenues = useMemo(
    () => venues.filter((v) => v.categories.includes(category.slug)),
    [category.slug]
  );
  const [preferredVenueId, setPreferredVenueId] = useState<string>("");

  const activePreferredVenue = useMemo(
    () => sportVenues.find((v) => v.id === preferredVenueId) ?? sportVenues[0],
    [sportVenues, preferredVenueId]
  );

  // Schedule & Stake state
  const [dateStr, setDateStr] = useState("Sat, Oct 31");
  const [timeStr, setTimeStr] = useState("4:00 PM");
  const [hasStake, setHasStake] = useState(true);
  const [stakeAmount, setStakeAmount] = useState(15000);
  const [note, setNote] = useState("Come ready on time. Fair play and clean officiating.");

  const resolvedTarget = useMemo(() => {
    if (targetType !== "direct" || !directInput.trim()) return undefined;
    return (
      findUser(directInput) ??
      users.find(
        (u) =>
          u.username.toLowerCase().includes(directInput.toLowerCase()) ||
          u.id.toLowerCase().includes(directInput.toLowerCase())
      )
    );
  }, [targetType, directInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title:
        targetType === "direct" && resolvedTarget
          ? `Direct request sent to @${resolvedTarget.username} (${resolvedTarget.id})!`
          : `${category.name} match request published!`,
      description: `${
        venueMode === "midpoint"
          ? "Smart Midpoint Venue"
          : venueMode === "preferred"
            ? activePreferredVenue?.name
            : "Your Home Ground"
      } · ${hasStake ? `${formatNaira(stakeAmount * 2)} Winner-Takes-All Pot` : "Friendly (₦0)"}`,
      tone: "success",
    });
    router.push("/dashboard");
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <span className="eyebrow">Create Match Request</span>
          <h1 className={styles.title}>
            Set your sport, rules, <span className="hl">venue &amp; stake.</span>
          </h1>
          <p className={styles.sub}>
            Every category adapts to the exact gear, format, and rules needed for the game. Post openly to the Matchday
            board or send directly to a rival&apos;s <strong>@username</strong> or <strong>ID</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.layout}>
          {/* Left Builder Column */}
          <div className={styles.builder}>
            {/* Step 1: Category */}
            <section className={styles.card}>
              <div className={styles.stepTitle}>
                <span className={styles.stepBadge}>01</span>
                <div>
                  <h2>Choose outdoor game category</h2>
                  <p>Selecting a sport loads its dedicated rule sheet and compatible venues.</p>
                </div>
              </div>

              <div className={styles.catGrid}>
                {categories.map((c) => {
                  const active = c.slug === category.slug;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      className={`${styles.catCard} ${active ? styles.catCardActive : ""}`}
                      style={{ "--tint": c.tint } as React.CSSProperties}
                      onClick={() => setCatSlug(c.slug)}
                    >
                      <span className={styles.catIcon}>
                        <SportIcon slug={c.slug} size={18} />
                      </span>
                      <div>
                        <strong>{c.name}</strong>
                        <span>{c.short}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className={styles.twoCol}>
                <div>
                  <span className={styles.fieldLabel}>Match participant type</span>
                  <div className={styles.segRow}>
                    <button
                      type="button"
                      disabled={!category.modes.includes("individual")}
                      className={`${styles.segBtn} ${mode === "individual" ? styles.segBtnOn : ""}`}
                      onClick={() => setMode("individual")}
                    >
                      <UserCheck size={16} /> Individual (1v1)
                    </button>
                    <button
                      type="button"
                      disabled={!category.modes.includes("group")}
                      className={`${styles.segBtn} ${mode === "group" ? styles.segBtnOn : ""}`}
                      onClick={() => setMode("group")}
                    >
                      <Users size={16} /> Group / Squad
                    </button>
                  </div>
                </div>

                <div>
                  <span className={styles.fieldLabel}>Who can accept?</span>
                  <div className={styles.segRow}>
                    <button
                      type="button"
                      className={`${styles.segBtn} ${targetType === "open" ? styles.segBtnOn : ""}`}
                      onClick={() => setTargetType("open")}
                    >
                      <Sparkles size={16} /> Open to board
                    </button>
                    <button
                      type="button"
                      className={`${styles.segBtn} ${targetType === "direct" ? styles.segBtnOn : ""}`}
                      onClick={() => setTargetType("direct")}
                    >
                      <AtSign size={16} /> Direct by @username / ID
                    </button>
                  </div>
                </div>
              </div>

              {targetType === "direct" && (
                <div className={styles.directBlock}>
                  <label className={styles.fieldLabel} htmlFor="direct-id-input">
                    Target opponent @username or Matchday ID
                  </label>
                  <input
                    id="direct-id-input"
                    className={styles.input}
                    value={directInput}
                    onChange={(e) => setDirectInput(e.target.value)}
                    placeholder="e.g. @tundeballer or MD-48213"
                  />
                  <div className={styles.quickPicks}>
                    {users.slice(0, 5).map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        className={styles.quickUser}
                        onClick={() => setDirectInput(u.id)}
                      >
                        @{u.username} ({u.id})
                      </button>
                    ))}
                  </div>
                  {resolvedTarget && (
                    <div className={styles.resolvedPreview}>
                      <Avatar
                        name={resolvedTarget.name}
                        hue={resolvedTarget.hue}
                        size={40}
                        group={resolvedTarget.type === "group"}
                      />
                      <div>
                        <strong>
                          {resolvedTarget.name} (@{resolvedTarget.username} · {resolvedTarget.id})
                        </strong>
                        <span>
                          {resolvedTarget.area} · {resolvedTarget.type} · ★ {resolvedTarget.rating}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Step 2: Dynamic Sport-Specific Settings */}
            <section className={styles.card}>
              <div className={styles.stepTitle}>
                <span className={styles.stepBadge}>02</span>
                <div>
                  <h2>
                    {category.name} Settings &amp; Equipment
                  </h2>
                  <p>Configured specifically for {category.name.toLowerCase()} rules and match requirements.</p>
                </div>
              </div>

              <div className={styles.settingsList}>
                {category.settings.map((field) => {
                  const val = settingsVal[field.id] ?? field.default;
                  return (
                    <div key={field.id} className={styles.settingItem}>
                      <div className={styles.settingHead}>
                        <span className={styles.fieldLabel}>{field.label}</span>
                        {field.hint && <span className={styles.fieldHint}>{field.hint}</span>}
                      </div>

                      {field.type === "segmented" && (
                        <div className={styles.optRow}>
                          {field.options.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`${styles.optBtn} ${val === opt ? styles.optBtnOn : ""}`}
                              onClick={() => setSettingsVal((s) => ({ ...s, [field.id]: opt }))}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {field.type === "select" && (
                        <select
                          className={styles.select}
                          value={String(val)}
                          onChange={(e) => setSettingsVal((s) => ({ ...s, [field.id]: e.target.value }))}
                        >
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.type === "number" && (
                        <div className={styles.stepper}>
                          <button
                            type="button"
                            onClick={() =>
                              setSettingsVal((s) => ({
                                ...s,
                                [field.id]: Math.max(field.min, Number(val) - (field.step ?? 1)),
                              }))
                            }
                          >
                            −
                          </button>
                          <strong>
                            {val} {field.unit ?? ""}
                          </strong>
                          <button
                            type="button"
                            onClick={() =>
                              setSettingsVal((s) => ({
                                ...s,
                                [field.id]: Math.min(field.max, Number(val) + (field.step ?? 1)),
                              }))
                            }
                          >
                            +
                          </button>
                        </div>
                      )}

                      {field.type === "toggle" && (
                        <button
                          type="button"
                          className={`${styles.toggleBtn} ${val ? styles.toggleBtnOn : ""}`}
                          onClick={() => setSettingsVal((s) => ({ ...s, [field.id]: !val }))}
                        >
                          <span className={styles.toggleThumb} />
                          <span>{val ? "Yes — included" : "No — not required"}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Step 3: Venue & Schedule */}
            <section className={styles.card}>
              <div className={styles.stepTitle}>
                <span className={styles.stepBadge}>03</span>
                <div>
                  <h2>Venue &amp; Kick-off Time</h2>
                  <p>
                    Let Matchday calculate a fair midpoint venue between both locations, or choose your preferred venue.
                  </p>
                </div>
              </div>

              <div className={styles.venueModeGrid}>
                <button
                  type="button"
                  className={`${styles.vModeCard} ${venueMode === "midpoint" ? styles.vModeActive : ""}`}
                  onClick={() => setVenueMode("midpoint")}
                >
                  <Navigation size={18} />
                  <strong>Smart Midpoint Venue</strong>
                  <span>Auto-suggests equidistant pitches between {me.area} and your opponent&apos;s location.</span>
                </button>
                <button
                  type="button"
                  className={`${styles.vModeCard} ${venueMode === "preferred" ? styles.vModeActive : ""}`}
                  onClick={() => setVenueMode("preferred")}
                >
                  <MapPin size={18} />
                  <strong>Choose Preferred Venue</strong>
                  <span>Pick a specific verified {category.name.toLowerCase()} venue right now.</span>
                </button>
                <button
                  type="button"
                  className={`${styles.vModeCard} ${venueMode === "host" ? styles.vModeActive : ""}`}
                  onClick={() => setVenueMode("host")}
                >
                  <CheckCircle2 size={18} />
                  <strong>Host at Home Ground</strong>
                  <span>Invite opponent to your regular home turf in {me.area}.</span>
                </button>
              </div>

              {venueMode === "preferred" && (
                <div className={styles.venuePickerList}>
                  {sportVenues.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`${styles.venuePickItem} ${activePreferredVenue?.id === v.id ? styles.venuePickOn : ""}`}
                      onClick={() => setPreferredVenueId(v.id)}
                    >
                      <div>
                        <strong>{v.name}</strong>
                        <span>
                          {v.area} · {v.type} · ★ {v.rating}
                        </span>
                      </div>
                      <span className={styles.venueFee}>
                        {v.pricePerHour ? `${formatNaira(v.pricePerHour)}/hr` : "Free"}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className={styles.twoCol}>
                <div>
                  <label className={styles.fieldLabel} htmlFor="match-date">
                    Match Date
                  </label>
                  <input
                    id="match-date"
                    className={styles.input}
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.fieldLabel} htmlFor="match-time">
                    Kick-off Time
                  </label>
                  <input
                    id="match-time"
                    className={styles.input}
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Step 4: Winner-Takes-All Stake */}
            <section className={styles.card}>
              <div className={styles.stepTitle}>
                <span className={styles.stepBadge}>04</span>
                <div>
                  <h2>Winner-Takes-All Stake (Optional)</h2>
                  <p>
                    Both sides lock equal stakes in Matchday Escrow before the match. Whoever wins takes the entire pot.
                  </p>
                </div>
              </div>

              <div className={styles.segRow}>
                <button
                  type="button"
                  className={`${styles.segBtn} ${!hasStake ? styles.segBtnOn : ""}`}
                  onClick={() => setHasStake(false)}
                >
                  Friendly Match (₦0 Stake)
                </button>
                <button
                  type="button"
                  className={`${styles.segBtn} ${hasStake ? styles.segBtnOn : ""}`}
                  onClick={() => setHasStake(true)}
                >
                  <ShieldCheck size={16} /> Winner-Takes-All Escrow Pot
                </button>
              </div>

              {hasStake && (
                <div className={styles.stakeConfig}>
                  <span className={styles.fieldLabel}>Stake per party (₦)</span>
                  <div className={styles.stakePills}>
                    {[2000, 5000, 10000, 15000, 25000, 50000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className={`${styles.optBtn} ${stakeAmount === amt ? styles.optBtnOn : ""}`}
                        onClick={() => setStakeAmount(amt)}
                      >
                        {formatNaira(amt)}
                      </button>
                    ))}
                  </div>
                  <div className={styles.potCallout}>
                    <ShieldCheck size={20} />
                    <div>
                      <strong>
                        Total Winner-Takes-All Pot: {formatNaira(stakeAmount * 2)}
                      </strong>
                      <span>
                        You deposit {formatNaira(stakeAmount)} + Opponent deposits {formatNaira(stakeAmount)}. Held in
                        escrow until post-match score confirmation.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className={styles.fieldLabel} htmlFor="match-note">
                  Additional Note / Kit Color / House Rules
                </label>
                <input
                  id="match-note"
                  className={styles.input}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </section>
          </div>

          {/* Right Live Sticky Match Sheet Summary */}
          <aside className={styles.summaryCol}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryTop}>
                <Badge tone="volt" icon={<SlidersHorizontal size={12} />}>
                  Live Match Sheet
                </Badge>
                <span className={styles.summaryId}>HOST: {me.id}</span>
              </div>

              <div className={styles.summarySport}>
                <span className={styles.summaryIcon} style={{ background: category.tint }}>
                  <SportIcon slug={category.slug} size={22} />
                </span>
                <div>
                  <h3>{category.name}</h3>
                  <span>
                    {mode === "group" ? "Group / Squad Match" : "1v1 Individual Match"} ·{" "}
                    {targetType === "direct" && resolvedTarget
                      ? `Direct to @${resolvedTarget.username}`
                      : "Open Broadcast"}
                  </span>
                </div>
              </div>

              <div className={styles.summaryRules}>
                <span className={styles.sumLabel}>Configured {category.name} Rules</span>
                <ul>
                  {category.settings.map((f) => (
                    <li key={f.id}>
                      <span>{f.label}</span>
                      <strong>
                        {typeof settingsVal[f.id] === "boolean"
                          ? settingsVal[f.id]
                            ? "Yes"
                            : "No"
                          : `${settingsVal[f.id] ?? f.default}${f.type === "number" && f.unit ? ` ${f.unit}` : ""}`}
                      </strong>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.summaryLogistics}>
                <div>
                  <Calendar size={15} />
                  <span>
                    {dateStr} · {timeStr}
                  </span>
                </div>
                <div>
                  <MapPin size={15} />
                  <span>
                    {venueMode === "midpoint"
                      ? `Smart Midpoint (auto-calculated from ${me.area})`
                      : venueMode === "preferred"
                        ? `${activePreferredVenue?.name} (${activePreferredVenue?.area})`
                        : `Host Home Ground (${me.area})`}
                  </span>
                </div>
              </div>

              <div className={styles.summaryStake}>
                <span>Winner-Takes-All Pot</span>
                <strong>{hasStake ? formatNaira(stakeAmount * 2) : "₦0 (Friendly)"}</strong>
              </div>

              <Button type="submit" variant="primary" size="lg" block icon={<Swords size={18} />}>
                {targetType === "direct" && resolvedTarget
                  ? `Send challenge to @${resolvedTarget.username}`
                  : "Publish match request"}
              </Button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
