"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Users,
  UserCheck,
  MapPin,
  LocateFixed,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Swords,
  Star,
  Filter,
  Compass,
  X,
} from "lucide-react";
import { categories, type Category, type MatchMode } from "@/data/categories";
import { requests, formatNaira, type MatchRequest } from "@/data/requests";
import { venues } from "@/data/venues";
import { useUserLocation, LAGOS_AREAS } from "@/lib/location";
import RequestCard from "@/components/matches/RequestCard";
import { AcceptRequestModal } from "@/components/matches/MatchActionModals";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SportIcon from "@/components/ui/SportIcon";
import { useToast } from "@/components/ui/Toast";
import styles from "./games.module.css";

type CategoryFilterKey = "all" | "team" | "solo" | "pitch" | "court" | "board";
type ProcessStep = 1 | 2 | 3;

const categoryTabs: { id: CategoryFilterKey; label: string }[] = [
  { id: "all", label: "All games (9)" },
  { id: "team", label: "Team & squad" },
  { id: "solo", label: "1v1 & solo" },
  { id: "pitch", label: "Pitch & track" },
  { id: "court", label: "Court & racquet" },
  { id: "board", label: "Board & park" },
];

const stepItems: { id: ProcessStep; badge: string; title: string; sub: string }[] = [
  { id: 1, badge: "Step 01", title: "Choose a Game", sub: "Search & filter categories" },
  { id: 2, badge: "Step 02", title: "Configure Rules", sub: "Mode, format & gear" },
  { id: 3, badge: "Step 03", title: "Match Near You", sub: "Venues & open requests" },
];

export default function GamesPage() {
  const router = useRouter();
  const toast = useToast();
  const loc = useUserLocation();

  // Step-by-step process state
  const [step, setStep] = useState<ProcessStep>(1);

  // Step 1: Search & Category Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [catTab, setCatTab] = useState<CategoryFilterKey>("all");
  const [modeFilter, setModeFilter] = useState<"all" | MatchMode>("all");
  const [sortBy, setSortBy] = useState<"popular" | "requests" | "nearest">("popular");

  // Selected Game & Step 2 Rule Configuration
  const [selectedSlug, setSelectedSlug] = useState<string>("football");
  const activeCategory: Category = useMemo(
    () => categories.find((c) => c.slug === selectedSlug) ?? categories[0]!,
    [selectedSlug]
  );

  const [selectedMode, setSelectedMode] = useState<MatchMode>("group");
  const [ruleValues, setRuleValues] = useState<Record<string, string | number | boolean>>(() => {
    const init: Record<string, string | number | boolean> = {};
    categories[0]!.settings.forEach((f) => {
      init[f.id] = f.default;
    });
    return init;
  });

  // Step 3: Search & Filter open requests / venues for the selected game
  const [matchSearch, setMatchSearch] = useState("");
  const [stakeFilter, setStakeFilter] = useState<"all" | "staked" | "friendly">("all");
  const [activeReqModal, setActiveReqModal] = useState<MatchRequest | null>(null);

  const handleSelectGame = (cat: Category, goNext = true) => {
    setSelectedSlug(cat.slug);
    const nextRules: Record<string, string | number | boolean> = {};
    cat.settings.forEach((f) => {
      nextRules[f.id] = f.default;
    });
    setRuleValues(nextRules);
    if (!cat.modes.includes(selectedMode)) {
      setSelectedMode(cat.modes[0] ?? "individual");
    }
    if (goNext) {
      setStep(2);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Compute nearest venue distance per category from user's detected GPS location
  const nearestVenueDistanceByCat = useMemo(() => {
    const map: Record<string, { km: number; venueName: string; area: string }> = {};
    for (const c of categories) {
      const compat = venues.filter((v) => v.categories.includes(c.slug));
      let bestKm = 99;
      let bestName = "Local Arena";
      let bestArea = loc.area;
      for (const v of compat) {
        const d = loc.distanceFromMeKm(v.lat, v.lng);
        if (d < bestKm) {
          bestKm = d;
          bestName = v.name;
          bestArea = v.area;
        }
      }
      map[c.slug] = { km: bestKm, venueName: bestName, area: bestArea };
    }
    return map;
  }, [loc]);

  // Step 1 Filtered & Sorted Games
  const filteredGames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = categories.filter((c) => {
      if (catTab === "team" && !c.modes.includes("group")) return false;
      if (catTab === "solo" && !c.modes.includes("individual")) return false;
      if (catTab === "pitch" && !["football", "relay-race", "volleyball"].includes(c.slug)) return false;
      if (
        catTab === "court" &&
        !["basketball", "table-tennis", "lawn-tennis", "badminton", "volleyball"].includes(c.slug)
      )
        return false;
      if (catTab === "board" && !["ludo", "chess", "table-tennis"].includes(c.slug)) return false;

      if (modeFilter !== "all" && !c.modes.includes(modeFilter)) return false;

      if (q) {
        const rulesText = c.settings.map((s) => `${s.label} ${String(s.default)}`).join(" ");
        const venuesText = c.venueTypes.join(" ");
        const hay = `${c.name} ${c.short} ${c.tagline} ${c.description} ${rulesText} ${venuesText}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "requests") return b.openRequests - a.openRequests;
      if (sortBy === "nearest") {
        return (nearestVenueDistanceByCat[a.slug]?.km ?? 99) - (nearestVenueDistanceByCat[b.slug]?.km ?? 99);
      }
      return b.activePlayers - a.activePlayers;
    });
  }, [searchQuery, catTab, modeFilter, sortBy, nearestVenueDistanceByCat]);

  // Step 3 Venues & Open Requests for activeCategory sorted by distance from user's detected location
  const sportVenues = useMemo(() => {
    return venues
      .filter((v) => v.categories.includes(activeCategory.slug))
      .map((v) => ({
        ...v,
        distanceKm: loc.distanceFromMeKm(v.lat, v.lng),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [activeCategory.slug, loc]);

  const sportRequests = useMemo(() => {
    const q = matchSearch.trim().toLowerCase();
    return requests
      .filter((r) => {
        if (r.category !== activeCategory.slug) return false;
        if (stakeFilter === "staked" && !r.stake) return false;
        if (stakeFilter === "friendly" && r.stake) return false;
        if (q) {
          const hay = `${r.id} ${r.by} ${r.format} ${r.venue} ${r.area} ${r.rules.join(" ")}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
  }, [activeCategory.slug, matchSearch, stakeFilter]);

  const handleDetectGps = async () => {
    await loc.detectLocation();
    toast({
      title: `Location detected: ${loc.area}, ${loc.city}`,
      description: "Venues and open game requests are now ranked by distance from you.",
      tone: "success",
    });
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Top Header + Location Detection Banner */}
        <div className={styles.topHeader}>
          <div>
            <span className="eyebrow">Matchday Games Directory</span>
            <h1 className={styles.title}>
              Pick your game, <span className="hl">step by step.</span>
            </h1>
            <p className={styles.sub}>
              Browse and filter every outdoor &amp; board game at your own pace. Choose a sport first, customize its
              match sheet second, and connect with nearby players or venues third.
            </p>
          </div>

          {/* Live User Location Detection Card */}
          <div className={styles.locationCard}>
            <div className={styles.locTop}>
              <span className={styles.locDot} />
              <div>
                <span className={styles.locEyebrow}>
                  {loc.source === "gps"
                    ? "Live GPS Location Detected"
                    : loc.source === "ip"
                      ? "Network Location Detected"
                      : "Active Match Location"}
                </span>
                <strong className={styles.locName}>
                  <MapPin size={15} /> {loc.area}, {loc.city}
                </strong>
              </div>
              <button
                type="button"
                className={styles.detectBtn}
                onClick={handleDetectGps}
                disabled={loc.status === "detecting"}
              >
                <LocateFixed size={14} />
                <span>{loc.status === "detecting" ? "Detecting..." : "Detect GPS"}</span>
              </button>
            </div>
            <div className={styles.locSwitchRow}>
              <span>Area:</span>
              <select
                value={loc.area}
                onChange={(e) => loc.setManualArea(e.target.value)}
                aria-label="Select your Lagos neighborhood"
              >
                {LAGOS_AREAS.map((a) => (
                  <option key={a.area} value={a.area}>
                    {a.area}, {a.city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Process-by-Process Stepper Bar */}
        <div className={styles.stepperBar} role="tablist" aria-label="Game selection process">
          {stepItems.map((item) => {
            const isCurrent = step === item.id;
            const isDone = step > item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                className={`${styles.stepPill} ${isCurrent ? styles.stepCurrent : ""} ${isDone ? styles.stepDone : ""}`}
                onClick={() => setStep(item.id)}
              >
                <span className={styles.stepNumBadge}>
                  {isDone ? <CheckCircle2 size={14} /> : item.badge}
                </span>
                <div className={styles.stepText}>
                  <strong>
                    {item.title}
                    {item.id > 1 ? ` · ${activeCategory.name}` : ""}
                  </strong>
                  <span>{item.sub}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* =========================================================
            PROCESS STEP 1: SEARCH, FILTER & SELECT GAME CATEGORY
           ========================================================= */}
        {step === 1 && (
          <section className={styles.stage} aria-label="Step 1: Browse and filter games">
            {/* Search & Filter Panel */}
            <div className={styles.filterPanel}>
              <div className={styles.searchBarRow}>
                <div className={styles.searchInputWrap}>
                  <Search size={19} className={styles.searchIcon} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search games by name, format (5-a-side, 3x3, Singles), rules or surface (turf, court, park)..."
                    aria-label="Search games"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className={styles.clearBtn}
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      <X size={15} /> Clear
                    </button>
                  )}
                </div>

                <div className={styles.quickSearchTags}>
                  <span>Quick search:</span>
                  {["5-a-side", "3x3", "Turf", "Ludo", "Singles", "4×100m"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`${styles.tagChip} ${searchQuery.toLowerCase() === tag.toLowerCase() ? styles.tagChipOn : ""}`}
                      onClick={() =>
                        setSearchQuery((prev) => (prev.toLowerCase() === tag.toLowerCase() ? "" : tag))
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className={styles.categoryTabsRow} role="tablist" aria-label="Game categories">
                {categoryTabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={catTab === t.id}
                    className={`${styles.catTab} ${catTab === t.id ? styles.catTabActive : ""}`}
                    onClick={() => setCatTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Secondary Filters: Participant Mode + Sort By */}
              <div className={styles.subFilterRow}>
                <div className={styles.segGroup} aria-label="Filter by participant mode">
                  <Filter size={14} className={styles.segIcon} />
                  {(["all", "individual", "group"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`${styles.segBtn} ${modeFilter === m ? styles.segBtnOn : ""}`}
                      onClick={() => setModeFilter(m)}
                    >
                      {m === "all" ? "All modes" : m === "individual" ? "1v1 / Solo" : "Group / Squad"}
                    </button>
                  ))}
                </div>

                <div className={styles.segGroup} aria-label="Sort games">
                  <span className={styles.sortLabel}>Sort by:</span>
                  {(
                    [
                      { id: "popular", label: "Most players" },
                      { id: "requests", label: "Most open requests" },
                      { id: "nearest", label: `Closest to ${loc.area}` },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`${styles.segBtn} ${sortBy === s.id ? styles.segBtnOn : ""}`}
                      onClick={() => setSortBy(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Games Grid */}
            {filteredGames.length > 0 ? (
              <div className={styles.gamesGrid}>
                {filteredGames.map((cat, idx) => {
                  const nearest = nearestVenueDistanceByCat[cat.slug];
                  const isCurrent = cat.slug === activeCategory.slug;
                  return (
                    <article
                      key={cat.slug}
                      className={`${styles.gameCard} ${isCurrent ? styles.gameCardSelected : ""}`}
                      style={{ "--tint": cat.tint } as React.CSSProperties}
                    >
                      <div className={styles.media}>
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className={styles.img}
                        />
                        <div className={styles.shade} />

                        <div className={styles.cardTop}>
                          <span className={styles.index}>0{idx + 1}</span>
                          <div className={styles.modeBadges}>
                            {cat.modes.includes("individual") && (
                              <span className={styles.modeChip}>
                                <UserCheck size={12} /> 1v1 / Solo
                              </span>
                            )}
                            {cat.modes.includes("group") && (
                              <span className={styles.modeChip}>
                                <Users size={12} /> Squad / Group
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={styles.mediaBottom}>
                          <span className={styles.sportChip}>
                            <SportIcon slug={cat.slug} size={15} />
                            {cat.short}
                          </span>
                          <h2 className={styles.cardTitle}>{cat.name}</h2>
                          <p className={styles.cardTagline}>{cat.tagline}</p>
                        </div>
                      </div>

                      <div className={styles.cardBody}>
                        <p className={styles.cardDesc}>{cat.description}</p>

                        <div className={styles.statsRow}>
                          <div>
                            <span className={styles.statNum}>{cat.openRequests}</span>
                            <span className={styles.statLabel}>Open requests</span>
                          </div>
                          <div>
                            <span className={styles.statNum}>{(cat.activePlayers / 1000).toFixed(1)}k</span>
                            <span className={styles.statLabel}>Active players</span>
                          </div>
                          <div>
                            <span className={styles.statNum}>{nearest ? `${nearest.km} km` : "2.1 km"}</span>
                            <span className={styles.statLabel}>Nearest venue</span>
                          </div>
                        </div>

                        <div className={styles.surfaceRow}>
                          {cat.venueTypes.map((v) => (
                            <span key={v} className={styles.surfacePill}>
                              <MapPin size={11} /> {v}
                            </span>
                          ))}
                        </div>

                        <div className={styles.cardActions}>
                          <button
                            type="button"
                            className={styles.selectGameBtn}
                            onClick={() => handleSelectGame(cat, true)}
                          >
                            <span>Select &amp; Configure Rules</span>
                            <ArrowRight size={16} />
                          </button>
                          <Link href={`/categories/${cat.slug}`} className={styles.hubLink}>
                            Hub
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyBox}>
                <h3>No games match &ldquo;{searchQuery}&rdquo; with those filters.</h3>
                <p>Reset your category filters or search term to see all 9 Matchday outdoor and board games.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setCatTab("all");
                    setModeFilter("all");
                  }}
                >
                  Reset all filters
                </Button>
              </div>
            )}
          </section>
        )}

        {/* =========================================================
            PROCESS STEP 2: CONFIGURE SPORT RULES & PARTICIPANT MODE
           ========================================================= */}
        {step === 2 && (
          <section
            className={styles.stage}
            style={{ "--tint": activeCategory.tint } as React.CSSProperties}
            aria-label={`Step 2: Configure ${activeCategory.name} rules`}
          >
            <div className={styles.step2Card}>
              <div className={styles.step2Head}>
                <div className={styles.step2SportInfo}>
                  <span className={styles.step2Icon}>
                    <SportIcon slug={activeCategory.slug} size={26} />
                  </span>
                  <div>
                    <Badge tone="primary" icon={<SlidersHorizontal size={12} />}>
                      Step 02 of 03 · Sport Rule Configuration
                    </Badge>
                    <h2>{activeCategory.name} Match Sheet</h2>
                    <p>{activeCategory.description}</p>
                  </div>
                </div>

                {/* Quick switcher if they want another game */}
                <div className={styles.switchGameWrap}>
                  <label htmlFor="quick-switch-game">Switch game:</label>
                  <select
                    id="quick-switch-game"
                    value={activeCategory.slug}
                    onChange={(e) => {
                      const found = categories.find((c) => c.slug === e.target.value);
                      if (found) handleSelectGame(found, false);
                    }}
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.short})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Participant Mode Selection */}
              <div className={styles.modeSection}>
                <span className={styles.fieldLabel}>1. Choose participant format</span>
                <div className={styles.modeCards}>
                  <button
                    type="button"
                    disabled={!activeCategory.modes.includes("individual")}
                    className={`${styles.modeChoiceCard} ${selectedMode === "individual" ? styles.modeChoiceActive : ""}`}
                    onClick={() => setSelectedMode("individual")}
                  >
                    <UserCheck size={20} />
                    <div>
                      <strong>1v1 / Individual Match</strong>
                      <span>Solo head-to-head challenge or singles format.</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    disabled={!activeCategory.modes.includes("group")}
                    className={`${styles.modeChoiceCard} ${selectedMode === "group" ? styles.modeChoiceActive : ""}`}
                    onClick={() => setSelectedMode("group")}
                  >
                    <Users size={20} />
                    <div>
                      <strong>Group / Squad Match</strong>
                      <span>Team vs team showdown using your squad roster.</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Sport-Specific Settings */}
              <div className={styles.rulesSection}>
                <span className={styles.fieldLabel}>
                  2. Customize {activeCategory.name} rules &amp; equipment
                </span>
                <div className={styles.rulesGrid}>
                  {activeCategory.settings.map((field) => {
                    const val = ruleValues[field.id] ?? field.default;
                    return (
                      <div key={field.id} className={styles.ruleControlCard}>
                        <div className={styles.ruleControlHead}>
                          <strong>{field.label}</strong>
                          {field.hint && <span>{field.hint}</span>}
                        </div>

                        {(field.type === "segmented" || field.type === "select") && (
                          <div className={styles.optRow}>
                            {field.options.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                className={`${styles.optBtn} ${val === opt ? styles.optBtnOn : ""}`}
                                onClick={() => setRuleValues((prev) => ({ ...prev, [field.id]: opt }))}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {field.type === "number" && (
                          <div className={styles.numStepper}>
                            <button
                              type="button"
                              onClick={() =>
                                setRuleValues((prev) => ({
                                  ...prev,
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
                                setRuleValues((prev) => ({
                                  ...prev,
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
                            onClick={() => setRuleValues((prev) => ({ ...prev, [field.id]: !val }))}
                          >
                            <span className={styles.toggleDot} />
                            <span>{val ? "Included / Required" : "Optional / Not required"}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 Navigation Footer */}
              <div className={styles.stepFooter}>
                <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={() => setStep(1)}>
                  Back to Step 1: All Games
                </Button>
                <div className={styles.stepFooterRight}>
                  <Button
                    href={`/create?category=${activeCategory.slug}&mode=${selectedMode}`}
                    variant="ghost"
                  >
                    Open in Full Request Builder
                  </Button>
                  <Button
                    variant="primary"
                    iconRight={<ArrowRight size={17} />}
                    onClick={() => {
                      setStep(3);
                      if (typeof window !== "undefined") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                  >
                    Continue to Step 3: Matches &amp; Venues Near {loc.area}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            PROCESS STEP 3: MATCHES & VENUES NEAR USER'S LOCATION
           ========================================================= */}
        {step === 3 && (
          <section
            className={styles.stage}
            style={{ "--tint": activeCategory.tint } as React.CSSProperties}
            aria-label={`Step 3: ${activeCategory.name} matches and venues near ${loc.area}`}
          >
            {/* Configured Match Sheet Banner */}
            <div className={styles.configuredBanner}>
              <div className={styles.configuredLeft}>
                <span className={styles.configuredIcon}>
                  <SportIcon slug={activeCategory.slug} size={22} />
                </span>
                <div>
                  <div className={styles.configuredBadges}>
                    <Badge tone="volt">Step 03 of 03 · Ready to Match</Badge>
                    <Badge tone="neutral">
                      <MapPin size={12} /> Near {loc.area}, {loc.city}
                    </Badge>
                  </div>
                  <h2>
                    {activeCategory.name} ({selectedMode === "group" ? "Group / Squad" : "1v1 Individual"})
                  </h2>
                  <div className={styles.configuredRulesList}>
                    {activeCategory.settings.slice(0, 4).map((f) => (
                      <span key={f.id} className={styles.configuredChip}>
                        {f.label}:{" "}
                        <strong>
                          {typeof ruleValues[f.id] === "boolean"
                            ? ruleValues[f.id]
                              ? "Yes"
                              : "No"
                            : `${ruleValues[f.id] ?? f.default}${f.type === "number" && f.unit ? ` ${f.unit}` : ""}`}
                        </strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.configuredActions}>
                <Button variant="outline" size="sm" icon={<ArrowLeft size={15} />} onClick={() => setStep(2)}>
                  Edit Rules
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Sparkles size={15} />}
                  onClick={() =>
                    router.push(`/create?category=${activeCategory.slug}&mode=${selectedMode}`)
                  }
                >
                  Publish as New {activeCategory.name} Request
                </Button>
              </div>
            </div>

            {/* Search & Filter Open Requests for this Sport */}
            <div className={styles.step3Block}>
              <div className={styles.step3Head}>
                <div>
                  <span className="eyebrow">Live {activeCategory.name} Board</span>
                  <h3>
                    Open {activeCategory.name} requests near {loc.area} ({sportRequests.length})
                  </h3>
                </div>

                <div className={styles.step3SearchRow}>
                  <div className={styles.miniSearch}>
                    <Search size={16} />
                    <input
                      type="text"
                      value={matchSearch}
                      onChange={(e) => setMatchSearch(e.target.value)}
                      placeholder={`Search ${activeCategory.name} requests by area, venue or @host...`}
                      aria-label={`Search ${activeCategory.name} requests`}
                    />
                  </div>
                  <div className={styles.segGroup}>
                    {(["all", "staked", "friendly"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`${styles.segBtn} ${stakeFilter === s ? styles.segBtnOn : ""}`}
                        onClick={() => setStakeFilter(s)}
                      >
                        {s === "all" ? "All pots" : s === "staked" ? "Staked" : "Friendly"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {sportRequests.length > 0 ? (
                <div className={styles.reqGrid}>
                  {sportRequests.map((req) => (
                    <RequestCard key={req.id} req={req} onSelect={setActiveReqModal} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyBox}>
                  <h4>No open {activeCategory.name} requests match that filter right now.</h4>
                  <p>Post your configured {activeCategory.name} match sheet so players near {loc.area} can merge with you.</p>
                  <Button
                    href={`/create?category=${activeCategory.slug}&mode=${selectedMode}`}
                    variant="primary"
                    size="sm"
                    icon={<Swords size={15} />}
                  >
                    Post {activeCategory.name} Request
                  </Button>
                </div>
              )}
            </div>

            {/* Verified Venues for this Sport Ranked by Distance from Detected Location */}
            <div className={styles.step3Block}>
              <div className={styles.step3Head}>
                <div>
                  <span className="eyebrow">GPS Distance Ranked</span>
                  <h3>
                    Verified {activeCategory.name} Venues Closest to {loc.area}
                  </h3>
                </div>
                <Button href="/explore" variant="outline" size="sm" icon={<Compass size={15} />}>
                  Full Match Explorer
                </Button>
              </div>

              <div className={styles.venueGrid}>
                {sportVenues.map((v, i) => (
                  <div key={v.id} className={styles.venueCard}>
                    <div className={styles.venueTop}>
                      <div>
                        <strong>{v.name}</strong>
                        <span className={styles.venueLoc}>
                          <MapPin size={13} /> {v.area} · {v.type}
                        </span>
                      </div>
                      <span className={styles.ratingBadge}>
                        <Star size={13} fill="currentColor" /> {v.rating}
                      </span>
                    </div>

                    <div className={styles.distanceRow}>
                      <Badge tone={i === 0 ? "primary" : "neutral"}>
                        {v.distanceKm} km from {loc.area}
                      </Badge>
                      {i === 0 && <span className={styles.closestTag}>Closest to you</span>}
                    </div>

                    <div className={styles.amenities}>
                      {v.amenities.map((a) => (
                        <span key={a}>{a}</span>
                      ))}
                    </div>

                    <div className={styles.venueFoot}>
                      <strong>{v.pricePerHour ? `${formatNaira(v.pricePerHour)}/hr` : "Free public access"}</strong>
                      <Link href={`/create?category=${activeCategory.slug}&venue=${v.id}`}>
                        Lock venue →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <AcceptRequestModal req={activeReqModal} onClose={() => setActiveReqModal(null)} />
    </div>
  );
}
