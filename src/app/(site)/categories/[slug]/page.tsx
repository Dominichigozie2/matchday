"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus, MapPin, Star, SlidersHorizontal } from "lucide-react";
import { categories, getCategory } from "@/data/categories";
import { requests, formatNaira, type MatchRequest } from "@/data/requests";
import { venues } from "@/data/venues";
import RequestCard from "@/components/matches/RequestCard";
import { AcceptRequestModal } from "@/components/matches/MatchActionModals";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SportIcon from "@/components/ui/SportIcon";
import styles from "./category.module.css";

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = getCategory(slug) ?? categories[0]!;
  const [selectedReq, setSelectedReq] = useState<MatchRequest | null>(null);

  const sportRequests = requests.filter((r) => r.category === category.slug);
  const sportVenues = venues.filter((v) => v.categories.includes(category.slug));

  return (
    <div className={styles.page} style={{ "--tint": category.tint } as React.CSSProperties}>
      <div className="container">
        <Link href="/games" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to all games
        </Link>

        {/* Hero banner */}
        <div className={styles.heroCard}>
          <div className={styles.heroCopy}>
            <Badge tone="primary" icon={<SportIcon slug={category.slug} size={13} />}>
              {category.short} · {category.modes.join(" & ")}
            </Badge>
            <h1>{category.name}</h1>
            <p className={styles.tagline}>{category.tagline}</p>
            <p className={styles.desc}>{category.description}</p>

            <div className={styles.statsRow}>
              <div>
                <strong>{category.openRequests}</strong>
                <span>Open requests</span>
              </div>
              <div>
                <strong>{category.activePlayers.toLocaleString()}</strong>
                <span>Active players</span>
              </div>
              <div>
                <strong>{sportVenues.length}</strong>
                <span>Verified venues</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Button href={`/create?category=${category.slug}`} variant="primary" icon={<Plus />}>
                Create {category.name} request
              </Button>
              <Button href="/explore" variant="outline">
                All sports board
              </Button>
            </div>
          </div>

          <div className={styles.heroMedia}>
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 960px) 100vw, 45vw"
              priority
            />
          </div>
        </div>

        {/* Custom Settings Schema for this sport */}
        <section className={styles.block}>
          <div className={styles.blockHead}>
            <div>
              <span className="eyebrow">Sport-Specific Configuration</span>
              <h2>{category.name} Match Settings</h2>
            </div>
            <Badge tone="neutral" icon={<SlidersHorizontal size={13} />}>
              {category.settings.length} customizable parameters
            </Badge>
          </div>

          <div className={styles.settingsGrid}>
            {category.settings.map((s) => (
              <div key={s.id} className={styles.settingBox}>
                <span className={styles.sLabel}>{s.label}</span>
                <strong>Default: {String(s.default)}</strong>
                {("options" in s && s.options) && (
                  <div className={styles.optPills}>
                    {s.options.map((o) => (
                      <span key={o} className={o === s.default ? styles.optActive : styles.opt}>
                        {o}
                      </span>
                    ))}
                  </div>
                )}
                {s.hint && <p className={styles.sHint}>{s.hint}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Open requests in this category */}
        <section className={styles.block}>
          <div className={styles.blockHead}>
            <div>
              <span className="eyebrow">Live Matches</span>
              <h2>Open {category.name} Requests</h2>
            </div>
          </div>
          <div className={styles.reqGrid}>
            {sportRequests.map((r) => (
              <RequestCard key={r.id} req={r} onSelect={setSelectedReq} />
            ))}
          </div>
        </section>

        {/* Verified Venues */}
        <section className={styles.block}>
          <div className={styles.blockHead}>
            <div>
              <span className="eyebrow">Midpoint &amp; Preferred Venues</span>
              <h2>Verified {category.name} Venues</h2>
            </div>
          </div>
          <div className={styles.venueGrid}>
            {sportVenues.map((v) => (
              <div key={v.id} className={styles.venueCard}>
                <div className={styles.venueTop}>
                  <strong>{v.name}</strong>
                  <span className={styles.rating}>
                    <Star size={13} fill="currentColor" /> {v.rating}
                  </span>
                </div>
                <span className={styles.venueLoc}>
                  <MapPin size={14} /> {v.area} · {v.type}
                </span>
                <div className={styles.amenities}>
                  {v.amenities.map((a) => (
                    <span key={a}>{a}</span>
                  ))}
                </div>
                <div className={styles.venueFoot}>
                  <strong>{v.pricePerHour ? `${formatNaira(v.pricePerHour)}/hr` : "Free public access"}</strong>
                  <Link href={`/create?category=${category.slug}`}>Book for match →</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <AcceptRequestModal req={selectedReq} onClose={() => setSelectedReq(null)} />
    </div>
  );
}
