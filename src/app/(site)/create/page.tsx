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
  ArrowLeft,
  ArrowRight,
  LocateFixed,
} from "lucide-react";
import { categories, type Category, type MatchMode } from "@/data/categories";
import { venues } from "@/data/venues";
import { users, findUser, me } from "@/data/users";
import { formatNaira } from "@/data/requests";
import { useUserLocation, haversineKm } from "@/lib/location";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SportIcon from "@/components/ui/SportIcon";
import { useToast } from "@/components/ui/Toast";
import styles from "./create.module.css";

type StepId = 1 | 2 | 3 | 4;

const wizardSteps: { id: StepId; badge: string; label: string }[] = [
  { id: 1, badge: "01", label: "Game & Mode" },
  { id: 2, badge: "02", label: "Rules & Gear" },
  { id: 3, badge: "03", label: "Venue & Time" },
  { id: 4, badge: "04", label: "Stake & Publish" },
];

export default function CreateMatchPage() {
  const router = useRouter();
  const toast = useToast();
  const loc = useUserLocation();

  const [step, setStep] = useState<StepId>(1);
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

  // Venue state
  const [venueMode, setVenueMode] = useState<"midpoint" | "preferred" | "host">("midpoint");
  const sportVenues = useMemo(
    () => venues.filter((v) => v.categories.includes(category.slug)),
    [category.slug]
  );
  const [preferredVenueId, setPreferredVenueId] = useState<string>("");

  // Read URL params on mount (?category=football&venue=v1&mode=group)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const cParam = params.get("category");
    const vParam = params.get("venue");
    const mParam = params.get("mode");
    if (cParam && categories.some((c) => c.slug === cParam)) {
      setCatSlug(cParam);
    }
    if (mParam === "individual" || mParam === "group") {
      setMode(mParam);
    }
    if (vParam && venues.some((v) => v.id === vParam)) {
      setVenueMode("preferred");
      setPreferredVenueId(vParam);
    }
  }, []);

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

  // Calculate best midpoint venue between user's detected GPS location and target opponent (or default hub)
  const suggestedMidpointVenue = useMemo(() => {
    const oppLat = resolvedTarget?.lat ?? 6.5833;
    const oppLng = resolvedTarget?.lng ?? 3.3584;
    const midLat = (loc.lat + oppLat) / 2;
    const midLng = (loc.lng + oppLng) / 2;
    const pool = sportVenues.length > 0 ? sportVenues : venues;
    return [...pool].sort(
      (a, b) => haversineKm(midLat, midLng, a.lat, a.lng) - haversineKm(midLat, midLng, b.lat, b.lng)
    )[0];
  }, [loc.lat, loc.lng, resolvedTarget, sportVenues]);

  const goStep = (next: StepId) => {
    setStep(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      goStep((step + 1) as StepId);
      return;
    }
    toast({
      title:
        targetType === "direct" && resolvedTarget
          ? `Direct request sent to @${resolvedTarget.username} (${resolvedTarget.id})!`
          : `${category.name} match request published!`,
      description: `${
        venueMode === "midpoint"
          ? `Smart Midpoint (${suggestedMidpointVenue?.name ?? loc.area})`
          : venueMode === "preferred"
            ? activePreferredVenue?.name
            : `Home Ground (${loc.area})`
      } · ${hasStake ? `${formatNaira(stakeAmount * 2)} Winner-Takes-All Pot` : "Friendly (₦0)"}`,
      tone: "success",
    });
    router.push("/dashboard");
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.topRow}>
          <div className={styles.header}>
            <span className="eyebrow">Create Match Request · Step {step} of 4</span>
            <h1 className={styles.title}>
              Set your sport, rules, <span className="hl">venue &amp; stake.</span>
            </h1>
            <p className={styles.sub}>
              Guided step by step so nothing is pushed in your face at once. Complete each stage and watch your Live
              Match Sheet update on the right.
            </p>
          </div>

          {/* Step-by-step Wizard Bar */}
          <div className={styles.wizardBar} role="tablist" aria-label="Create match steps">
            {wizardSteps.map((w) => {
              const current = step === w.id;
              const done = step > w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  role="tab"
                  aria-selected={current}
                  className={`${styles.wizStep} ${current ? styles.wizCurrent : ""} ${done ? styles.wizDone : ""}`}
                  onClick={() => goStep(w.id)}
                >
                  <span className={styles.wizBadge}>{done ? "✓" : w.badge}</span>
                  <span>{w.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.layout}>
          {/* Left Builder Column — One Process Step at a Time */}
          <div className={styles.builder}>
            {/* Step 1: Category & Mode */}
            {step === 1 && (
              <section className={styles.card}>
                <div className={styles.stepTitle}>
                  <span className={styles.stepBadge}>01</span>
                  <div>
                    <h2>Choose outdoor game category &amp; mode</h2>
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
                            Detected in {resolvedTarget.area} ({loc.distanceFromMeKm(resolvedTarget.lat, resolvedTarget.lng)} km from you) · ★{" "}
                            {resolvedTarget.rating}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.stepNavFooter}>
                  <span className={styles.fieldHint}>Step 1 of 4 · Next: Configure {category.name} rules</span>
                  <Button
                    type="button"
                    variant="primary"
                    iconRight={<ArrowRight size={16} />}
                    onClick={() => goStep(2)}
                  >
                    Continue to {category.name} Rules
                  </Button>
                </div>
              </section>
            )}

            {/* Step 2: Dynamic Sport-Specific Settings */}
            {step === 2 && (
              <section className={styles.card}>
                <div className={styles.stepTitle}>
                  <span className={styles.stepBadge}>02</span>
                  <div>
                    <h2>{category.name} Settings &amp; Equipment</h2>
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

                <div className={styles.stepNavFooter}>
                  <Button type="button" variant="outline" icon={<ArrowLeft size={16} />} onClick={() => goStep(1)}>
                    Back to Game Selection
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    iconRight={<ArrowRight size={16} />}
                    onClick={() => goStep(3)}
                  >
                    Continue to Location &amp; Venue
                  </Button>
                </div>
              </section>
            )}

            {/* Step 3: Location Detection, Venue & Schedule */}
            {step === 3 && (
              <section className={styles.card}>
                <div className={styles.stepTitle}>
                  <span className={styles.stepBadge}>03</span>
                  <div>
                    <h2>Detected Location, Venue &amp; Kick-off Time</h2>
                    <p>
                      Matchday detects your location ({loc.area}, {loc.city}) to calculate fair midpoint pitches or
                      nearby venues.
                    </p>
                  </div>
                </div>

                {/* Live Location Detection Bar inside Step 3 */}
                <div className={styles.locDetectBanner}>
                  <div>
                    <span className={styles.fieldLabel} style={{ marginBottom: 2 }}>
                      Your Detected GPS Location
                    </span>
                    <strong>
                      <MapPin size={15} /> {loc.area}, {loc.city}{" "}
                      <span className={styles.fieldHint}>
                        ({loc.source === "gps" ? "GPS Verified" : "Active Location"})
                      </span>
                    </strong>
                  </div>
                  <button
                    type="button"
                    className={styles.gpsInlineBtn}
                    onClick={() => void loc.detectLocation()}
                  >
                    <LocateFixed size={14} />
                    <span>{loc.status === "detecting" ? "Detecting..." : "Re-detect GPS"}</span>
                  </button>
                </div>

                <div className={styles.venueModeGrid}>
                  <button
                    type="button"
                    className={`${styles.vModeCard} ${venueMode === "midpoint" ? styles.vModeActive : ""}`}
                    onClick={() => setVenueMode("midpoint")}
                  >
                    <Navigation size={18} />
                    <strong>Smart Midpoint Venue</strong>
                    <span>
                      Auto-suggests equidistant pitches between {loc.area} and your opponent (e.g.{" "}
                      {suggestedMidpointVenue?.name}).
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.vModeCard} ${venueMode === "preferred" ? styles.vModeActive : ""}`}
                    onClick={() => setVenueMode("preferred")}
                  >
                    <MapPin size={18} />
                    <strong>Choose Preferred Venue</strong>
                    <span>Pick a specific verified {category.name.toLowerCase()} venue near {loc.area}.</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.vModeCard} ${venueMode === "host" ? styles.vModeActive : ""}`}
                    onClick={() => setVenueMode("host")}
                  >
                    <CheckCircle2 size={18} />
                    <strong>Host at Home Ground</strong>
                    <span>Invite opponent to your regular home turf in {loc.area}.</span>
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
                            {v.area} · {loc.distanceFromMeKm(v.lat, v.lng)} km from {loc.area} · {v.type} · ★{" "}
                            {v.rating}
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

                <div className={styles.stepNavFooter}>
                  <Button type="button" variant="outline" icon={<ArrowLeft size={16} />} onClick={() => goStep(2)}>
                    Back to Rules
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    iconRight={<ArrowRight size={16} />}
                    onClick={() => goStep(4)}
                  >
                    Continue to Stake &amp; Publish
                  </Button>
                </div>
              </section>
            )}

            {/* Step 4: Winner-Takes-All Stake & Publish */}
            {step === 4 && (
              <section className={styles.card}>
                <div className={styles.stepTitle}>
                  <span className={styles.stepBadge}>04</span>
                  <div>
                    <h2>Winner-Takes-All Stake &amp; Final Note</h2>
                    <p>
                      Both sides lock equal stakes in Matchday Escrow before the match. Whoever wins takes the entire
                      pot.
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
                        <strong>Total Winner-Takes-All Pot: {formatNaira(stakeAmount * 2)}</strong>
                        <span>
                          You deposit {formatNaira(stakeAmount)} + Opponent deposits {formatNaira(stakeAmount)}. Held
                          in escrow until post-match score confirmation.
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

                <div className={styles.stepNavFooter}>
                  <Button type="button" variant="outline" icon={<ArrowLeft size={16} />} onClick={() => goStep(3)}>
                    Back to Venue &amp; Time
                  </Button>
                  <Button type="submit" variant="primary" icon={<Swords size={18} />}>
                    {targetType === "direct" && resolvedTarget
                      ? `Send challenge to @${resolvedTarget.username}`
                      : "Publish match request"}
                  </Button>
                </div>
              </section>
            )}
          </div>

          {/* Right Live Sticky Match Sheet Summary */}
          <aside className={styles.summaryCol}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryTop}>
                <Badge tone="volt" icon={<SlidersHorizontal size={12} />}>
                  Live Match Sheet · Step {step}/4
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
                      ? `Smart Midpoint (${suggestedMidpointVenue?.name ?? loc.area})`
                      : venueMode === "preferred"
                        ? `${activePreferredVenue?.name} (${activePreferredVenue?.area})`
                        : `Host Home Ground (${loc.area})`}
                  </span>
                </div>
              </div>

              <div className={styles.summaryStake}>
                <span>Winner-Takes-All Pot</span>
                <strong>{hasStake ? formatNaira(stakeAmount * 2) : "₦0 (Friendly)"}</strong>
              </div>

              <Button type="submit" variant="primary" size="lg" block icon={<Swords size={18} />}>
                {step < 4
                  ? `Next: ${wizardSteps[step]?.label} →`
                  : targetType === "direct" && resolvedTarget
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
