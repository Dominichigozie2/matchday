"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Users, UserCheck, Sparkles, SlidersHorizontal } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { categories, type Category } from "@/data/categories";
import SportIcon from "@/components/ui/SportIcon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import styles from "./CategoryShowroom.module.css";

type FilterKey = "all" | "team" | "solo" | "court" | "board";

const filters: { id: FilterKey; label: string }[] = [
  { id: "all", label: "All games (9)" },
  { id: "team", label: "Team & squad" },
  { id: "solo", label: "1v1 & solo" },
  { id: "court", label: "Court & track" },
  { id: "board", label: "Board & park" },
];

export default function CategoryShowroom() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [activeSlug, setActiveSlug] = useState<string>("football");
  const [progress, setProgress] = useState(0);

  const visible = useMemo(() => {
    return categories.filter((c) => {
      if (filter === "all") return true;
      if (filter === "team") return c.modes.includes("group");
      if (filter === "solo") return c.modes.includes("individual");
      if (filter === "court")
        return ["basketball", "table-tennis", "lawn-tennis", "badminton", "volleyball", "relay-race"].includes(c.slug);
      if (filter === "board") return ["ludo", "chess", "table-tennis"].includes(c.slug);
      return true;
    });
  }, [filter]);

  const activeCategory: Category = useMemo(
    () => categories.find((c) => c.slug === activeSlug) ?? categories[0]!,
    [activeSlug]
  );

  useGSAP(
    () => {
      if (prefersReducedMotion() || !track.current) return;
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`, track.current);
      gsap.fromTo(
        cards,
        { opacity: 0, y: 28, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.06, ease: "power3.out" }
      );
    },
    { dependencies: [filter], scope: root }
  );

  const scrollByCards = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    const step = Math.min(420, el.clientWidth * 0.8);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0);
  };

  return (
    <section id="categories" ref={root} className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">The Matchday Showroom</span>
            <h2 className="section-title">
              Every outdoor game, <span className="hl">tuned to its rules.</span>
            </h2>
          </div>
          <div className={styles.headRight}>
            <p className="section-sub">
              From five-a-side turf battles and 4×100m relays to high-stakes Ludo under the shade — each sport unlocks its
              own custom match sheet, equipment checklist, and venue finder.
            </p>
            <div className={styles.headCtaRow}>
              <Button href="/games" variant="primary" size="sm" iconRight={<ArrowUpRight size={16} />}>
                Open Full Games Page
              </Button>
            </div>
          </div>
        </div>

        {/* Filter bar + slider arrows */}
        <div className={styles.toolbar}>
          <div className={styles.filterPills} role="tablist" aria-label="Filter game categories">
            {filters.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                className={`${styles.pill} ${filter === f.id ? styles.pillActive : ""}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className={styles.controls}>
            <div className={styles.progressTrack} aria-hidden="true">
              <div className={styles.progressFill} style={{ transform: `scaleX(${0.2 + progress * 0.8})` }} />
            </div>
            <button className={styles.arrow} onClick={() => scrollByCards(-1)} aria-label="Scroll left">
              <ArrowLeft size={18} />
            </button>
            <button className={styles.arrow} onClick={() => scrollByCards(1)} aria-label="Scroll right">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal showroom slider */}
      <div
        ref={track}
        onScroll={handleScroll}
        className={`no-scrollbar ${styles.slider}`}
        aria-label="Game categories showroom"
      >
        {visible.map((cat, idx) => {
          const isSelected = cat.slug === activeCategory.slug;
          return (
            <article
              key={cat.slug}
              className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
              style={{ "--tint": cat.tint } as React.CSSProperties}
              onMouseEnter={() => setActiveSlug(cat.slug)}
              onClick={() => setActiveSlug(cat.slug)}
            >
              <div className={styles.media}>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 84vw, 360px"
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
                    <SportIcon slug={cat.slug} size={16} />
                    {cat.short}
                  </span>
                  <h3 className={styles.cardTitle}>{cat.name}</h3>
                  <p className={styles.cardTagline}>{cat.tagline}</p>
                </div>
              </div>

              <div className={styles.cardBody}>
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
                    <span className={styles.statNum}>{cat.settings.length}</span>
                    <span className={styles.statLabel}>Rule presets</span>
                  </div>
                </div>

                <div className={styles.ruleChips}>
                  {cat.settings.slice(0, 3).map((s) => (
                    <span key={s.id} className={styles.ruleChip}>
                      {s.label}: <strong>{String(s.default)}</strong>
                    </span>
                  ))}
                </div>

                <div className={styles.cardActions}>
                  <Link href={`/explore?category=${cat.slug}`} className={styles.exploreLink}>
                    Find {cat.name} matches <ArrowUpRight size={16} />
                  </Link>
                  <Link href={`/create?category=${cat.slug}`} className={styles.createBtn} aria-label={`Create ${cat.name} request`}>
                    Match now
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Live Sport Settings Inspector Drawer below showroom */}
      <div className="container">
        <div className={styles.inspector} style={{ "--tint": activeCategory.tint } as React.CSSProperties}>
          <div className={styles.inspectorLeft}>
            <div className={styles.inspectorHeader}>
              <span className={styles.inspectorIcon}>
                <SportIcon slug={activeCategory.slug} size={22} />
              </span>
              <div>
                <Badge tone="primary" icon={<SlidersHorizontal size={12} />}>
                  Sport-Specific Settings Preview
                </Badge>
                <h3 className={styles.inspectorTitle}>{activeCategory.name} Match Sheet</h3>
              </div>
            </div>
            <p className={styles.inspectorDesc}>{activeCategory.description}</p>
            <div className={styles.venueRow}>
              <span className={styles.venueLabel}>Supported venues:</span>
              {activeCategory.venueTypes.map((v) => (
                <span key={v} className={styles.venuePill}>
                  {v}
                </span>
              ))}
            </div>
            <div className={styles.inspectorCtas}>
              <Button href={`/create?category=${activeCategory.slug}`} variant="primary" size="sm" icon={<Sparkles />}>
                Configure a {activeCategory.name} match
              </Button>
              <Button href={`/categories/${activeCategory.slug}`} variant="outline" size="sm">
                View {activeCategory.name} hub
              </Button>
              <Button href="/games" variant="ghost" size="sm" iconRight={<ArrowUpRight size={15} />}>
                All games page
              </Button>
            </div>
          </div>

          <div className={styles.inspectorRight}>
            <div className={styles.settingsGrid}>
              {activeCategory.settings.map((field) => (
                <div key={field.id} className={styles.settingCard}>
                  <span className={styles.settingName}>{field.label}</span>
                  {field.type === "segmented" || field.type === "select" ? (
                    <div className={styles.optionRow}>
                      {field.options.map((opt) => (
                        <span
                          key={opt}
                          className={`${styles.optPill} ${opt === field.default ? styles.optActive : ""}`}
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  ) : field.type === "number" ? (
                    <div className={styles.numPreview}>
                      <strong>
                        {field.default} {field.unit ?? ""}
                      </strong>
                      <span>
                        Range {field.min}–{field.max} {field.unit ?? ""}
                      </span>
                    </div>
                  ) : (
                    <div className={styles.togglePreview}>
                      <span className={`${styles.toggleDot} ${field.default ? styles.toggleOn : ""}`} />
                      <strong>{field.default ? "Included by default" : "Optional toggle"}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
