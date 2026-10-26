"use client";

import { useMemo, useState } from "react";
import { Navigation, MapPin, LocateFixed, Star, CheckCircle2, Sparkles } from "lucide-react";
import { me, users } from "@/data/users";
import { venues } from "@/data/venues";
import { formatNaira } from "@/data/requests";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import RevealScope from "@/components/motion/RevealScope";
import styles from "./VenueEngineSection.module.css";

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function VenueEngineSection() {
  const rivals = useMemo(
    () => [
      users.find((u) => u.username === "ikejautd")!,
      users.find((u) => u.username === "lekkihoopers")!,
      users.find((u) => u.username === "queenofludo")!,
      users.find((u) => u.username === "festacfalcons")!,
    ],
    []
  );

  const [rival, setRival] = useState(rivals[0]!);
  const [venueOption, setVenueOption] = useState<"midpoint" | "preferred" | "host">("midpoint");
  const [selectedVenueId, setSelectedVenueId] = useState<string>("v1");

  const midLat = (me.lat + rival.lat) / 2;
  const midLng = (me.lng + rival.lng) / 2;

  const rankedVenues = useMemo(() => {
    return venues
      .map((v) => {
        const dMe = haversineKm(me.lat, me.lng, v.lat, v.lng);
        const dThem = haversineKm(rival.lat, rival.lng, v.lat, v.lng);
        const dMid = haversineKm(midLat, midLng, v.lat, v.lng);
        const fairnessScore = Math.max(0, 100 - Math.round(Math.abs(dMe - dThem) * 6 + dMid * 4));
        return { ...v, dMe, dThem, dMid, fairnessScore };
      })
      .sort((a, b) => a.dMid - b.dMid)
      .slice(0, 4);
  }, [rival, midLat, midLng]);

  const activeVenue = rankedVenues.find((v) => v.id === selectedVenueId) ?? rankedVenues[0]!;

  return (
    <RevealScope as="section" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head" data-reveal>
          <div>
            <span className="eyebrow">Smart Venue &amp; Midpoint Engine</span>
            <h2 className="section-title">
              Meet halfway — or pick <span className="hl">your preferred pitch.</span>
            </h2>
          </div>
          <p className="section-sub">
            No more arguing over who travels further. Matchday triangulates the GPS area of both parties to suggest
            verified equidistant venues, or lets you lock in a preferred court or home ground.
          </p>
        </div>

        <div className={styles.layout} data-reveal>
          {/* Left control column */}
          <div className={styles.controls}>
            <div className={styles.block}>
              <span className={styles.blockLabel}>1. Select opponent location to test midpoint</span>
              <div className={styles.rivalList}>
                {rivals.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`${styles.rivalBtn} ${rival.id === r.id ? styles.rivalActive : ""}`}
                    onClick={() => {
                      setRival(r);
                      setSelectedVenueId("");
                    }}
                  >
                    <Avatar name={r.name} hue={r.hue} size={36} group={r.type === "group"} />
                    <div>
                      <strong>{r.name}</strong>
                      <span>{r.area}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.block}>
              <span className={styles.blockLabel}>2. Venue selection mode</span>
              <div className={styles.modeTabs}>
                <button
                  type="button"
                  className={`${styles.modeTab} ${venueOption === "midpoint" ? styles.modeTabOn : ""}`}
                  onClick={() => setVenueOption("midpoint")}
                >
                  <Navigation size={15} />
                  <div>
                    <strong>Fair Midpoint</strong>
                    <span>Auto-balanced by distance</span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`${styles.modeTab} ${venueOption === "preferred" ? styles.modeTabOn : ""}`}
                  onClick={() => setVenueOption("preferred")}
                >
                  <MapPin size={15} />
                  <div>
                    <strong>Preferred Venue</strong>
                    <span>Either party proposes</span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`${styles.modeTab} ${venueOption === "host" ? styles.modeTabOn : ""}`}
                  onClick={() => setVenueOption("host")}
                >
                  <LocateFixed size={15} />
                  <div>
                    <strong>Home Ground</strong>
                    <span>Host at your turf</span>
                  </div>
                </button>
              </div>
            </div>

            <div className={styles.block}>
              <span className={styles.blockLabel}>
                3. Recommended venues between {me.area} &amp; {rival.area}
              </span>
              <div className={styles.venueStack}>
                {rankedVenues.map((v, i) => {
                  const isCurrent = v.id === activeVenue.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      className={`${styles.venueCard} ${isCurrent ? styles.venueCardActive : ""}`}
                      onClick={() => setSelectedVenueId(v.id)}
                    >
                      <div className={styles.venueTop}>
                        <div>
                          <div className={styles.venueTitleLine}>
                            <strong>{v.name}</strong>
                            {i === 0 && venueOption === "midpoint" && (
                              <Badge tone="primary">Best midpoint</Badge>
                            )}
                          </div>
                          <span className={styles.venueSub}>
                            {v.area} · {v.type} · ★ {v.rating}
                          </span>
                        </div>
                        <span className={styles.priceTag}>
                          {v.pricePerHour ? `${formatNaira(v.pricePerHour)}/hr` : "Free entry"}
                        </span>
                      </div>
                      <div className={styles.distanceSplit}>
                        <span>
                          You ({me.area}): <strong>{v.dMe.toFixed(1)} km</strong>
                        </span>
                        <span>•</span>
                        <span>
                          {rival.name} ({rival.area}): <strong>{v.dThem.toFixed(1)} km</strong>
                        </span>
                        <span className={styles.fairScore}>{v.fairnessScore}% fair travel</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right interactive tactical map visualization */}
          <div className={styles.mapStage}>
            <div className={styles.mapHeader}>
              <Badge tone="volt" icon={<Sparkles size={13} />}>
                Live Triangulation Canvas
              </Badge>
              <span className={styles.coords}>
                Midpoint: {midLat.toFixed(3)}°N, {midLng.toFixed(3)}°E
              </span>
            </div>

            <div className={styles.mapCanvas}>
              <svg viewBox="0 0 600 360" className={styles.svg} aria-label="Interactive midpoint venue map">
                <defs>
                  <radialGradient id="midGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(11, 122, 75, 0.28)" />
                    <stop offset="100%" stopColor="rgba(11, 122, 75, 0)" />
                  </radialGradient>
                </defs>

                {/* Stylized water & road arteries */}
                <path
                  d="M0 290 Q 210 250 380 285 T 600 265 L 600 360 L 0 360 Z"
                  fill="rgba(47, 107, 255, 0.10)"
                />
                <path
                  d="M60 40 Q 260 150 530 300"
                  stroke="rgba(13,27,30,0.12)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M90 310 Q 300 190 520 75"
                  stroke="rgba(13,27,30,0.09)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Dashed route lines connecting Party A -> Venue -> Party B */}
                <line
                  x1="130"
                  y1="190"
                  x2="300"
                  y2="165"
                  stroke="var(--primary)"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                <line
                  x1="475"
                  y1="145"
                  x2="300"
                  y2="165"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />

                {/* Midpoint fairness aura */}
                <circle cx="300" cy="165" r="78" fill="url(#midGlow)" />
                <circle
                  cx="300"
                  cy="165"
                  r="48"
                  fill="none"
                  stroke="var(--primary)"
                  strokeOpacity="0.35"
                  strokeDasharray="4 4"
                />

                {/* Party A Node (You) */}
                <g transform="translate(130, 190)">
                  <circle r="22" fill="#0d1b1e" />
                  <circle r="8" fill="#c9f26b" />
                </g>

                {/* Midpoint Venue Node */}
                <g transform="translate(300, 165)">
                  <circle r="28" fill="var(--primary)" />
                  <circle r="11" fill="#ffffff" />
                </g>

                {/* Party B Node (Rival) */}
                <g transform="translate(475, 145)">
                  <circle r="22" fill="var(--accent)" />
                  <circle r="8" fill="#ffffff" />
                </g>
              </svg>

              {/* Floating Pin Labels */}
              <div className={`${styles.pinCard} ${styles.pinMe}`}>
                <span className={styles.pinTag}>Party A · You</span>
                <strong>{me.name}</strong>
                <span>
                  {me.area} · {activeVenue.dMe.toFixed(1)} km
                </span>
              </div>

              <div className={`${styles.pinCard} ${styles.pinVenue}`}>
                <span className={styles.pinTagMid}>Selected Match Venue</span>
                <strong>{activeVenue.name}</strong>
                <span>
                  {activeVenue.area} · {activeVenue.type}
                </span>
              </div>

              <div className={`${styles.pinCard} ${styles.pinRival}`}>
                <span className={styles.pinTagRival}>Party B · Opponent</span>
                <strong>{rival.name}</strong>
                <span>
                  {rival.area} · {activeVenue.dThem.toFixed(1)} km
                </span>
              </div>
            </div>

            {/* Active venue detail bar */}
            <div className={styles.venueDetailBar}>
              <div>
                <div className={styles.venueAmenities}>
                  <span className={styles.ratingBadge}>
                    <Star size={13} fill="currentColor" /> {activeVenue.rating}
                  </span>
                  {activeVenue.amenities.map((a) => (
                    <span key={a} className={styles.amenity}>
                      <CheckCircle2 size={12} /> {a}
                    </span>
                  ))}
                </div>
                <p className={styles.splitHint}>
                  Pitch fee:{" "}
                  <strong>
                    {activeVenue.pricePerHour
                      ? `${formatNaira(activeVenue.pricePerHour)}/hr (${formatNaira(activeVenue.pricePerHour / 2)} per side)`
                      : "Free public venue"}
                  </strong>
                </p>
              </div>
              <Button href={`/create?venue=${activeVenue.id}`} variant="primary" size="sm">
                Lock this venue in a request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RevealScope>
  );
}
