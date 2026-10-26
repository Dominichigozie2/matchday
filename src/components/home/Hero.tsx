"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Search, ShieldCheck, Navigation, Star, ArrowRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { categories } from "@/data/categories";
import Avatar from "@/components/ui/Avatar";
import SportIcon from "@/components/ui/SportIcon";
import styles from "./Hero.module.css";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  const [cat, setCat] = useState("football");
  const [where, setWhere] = useState("Yaba, Lagos");

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set("[data-h]", { opacity: 1 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(`.${styles.word}`, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.06 })
        .fromTo("[data-h='fade']", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, "-=0.7")
        .fromTo(
          `.${styles.frame}`,
          { clipPath: "inset(18% 12% 18% 12% round 40px)", opacity: 0 },
          { clipPath: "inset(0% 0% 0% 0% round 40px)", opacity: 1, duration: 1.4 },
          0.15
        )
        .fromTo(`.${styles.frame} img`, { scale: 1.25 }, { scale: 1, duration: 1.8 }, 0.15)
        .fromTo(
          "[data-h='card']",
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.6)" },
          "-=1"
        );

      gsap.utils.toArray<HTMLElement>("[data-h='card']").forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 10 : -10, duration: 2.6 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });
      });

      // Parallax on scroll
      gsap.to(`.${styles.frame} img`, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  const title = [["Find", "your"], ["match."], ["Play", "it", "today."]];

  return (
    <section ref={root} className={styles.hero}>
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={styles.kicker} data-h="fade">
            <span className={styles.live} /> 1,262 open match requests in Lagos right now
          </span>

          <h1 className={styles.title}>
            {title.map((line, li) => (
              <span key={li} className={styles.line}>
                {line.map((w, wi) => (
                  <span key={wi} className={styles.mask}>
                    <span className={`${styles.word} ${li === 1 ? styles.accentWord : ""}`}>{w}</span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className={styles.lead} data-h="fade">
            Challenge players and teams near you in football, basketball, table tennis, ludo and more. We find the
            fairest venue, open the chat, and hold the stakes — you just show up and play.
          </p>

          <form
            className={styles.search}
            data-h="fade"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/explore?category=${cat}`);
            }}
          >
            <label className={styles.field}>
              <span className={styles.fieldIcon}>
                <SportIcon slug={cat} size={20} />
              </span>
              <span className={styles.fieldBody}>
                <span className={styles.fieldLabel}>Game</span>
                <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Choose a game">
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </span>
            </label>
            <span className={styles.divider} />
            <label className={styles.field}>
              <span className={styles.fieldIcon}>
                <MapPin size={20} />
              </span>
              <span className={styles.fieldBody}>
                <span className={styles.fieldLabel}>Near</span>
                <input value={where} onChange={(e) => setWhere(e.target.value)} aria-label="Location" />
              </span>
            </label>
            <button type="submit" className={styles.go}>
              <Search size={18} />
              <span>Find matches</span>
            </button>
          </form>

          <div className={styles.proof} data-h="fade">
            <div className={styles.stack}>
              {[
                ["Tunde B", 152],
                ["Ada N", 222],
                ["Kemi A", 270],
                ["Chidi E", 22],
              ].map(([n, h]) => (
                <Avatar key={n as string} name={n as string} hue={h as number} size={38} />
              ))}
            </div>
            <div>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
                <strong>4.9</strong>
              </div>
              <span>48,000+ players &amp; 2,100 teams</span>
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.frame}>
            <Image
              src="/images/hero.jpg"
              alt="Friends playing street football on a turf pitch at golden hour"
              fill
              priority
              sizes="(max-width: 960px) 100vw, 46vw"
            />
            <div className={styles.frameShade} />
          </div>

          <div className={`${styles.card} ${styles.cardMatch}`} data-h="card">
            <span className={styles.cardEyebrow}>
              <span className={styles.okDot} /> Match confirmed
            </span>
            <div className={styles.vs}>
              <Avatar name="Yaba Warriors" hue={152} size={40} group />
              <span className={styles.vsText}>VS</span>
              <Avatar name="Ikeja United" hue={140} size={40} group />
            </div>
            <strong>Yaba Warriors × Ikeja United</strong>
            <span className={styles.cardMeta}>Sat, Oct 31 · 4:00 PM · 7-a-side</span>
          </div>

          <div className={`${styles.card} ${styles.cardVenue}`} data-h="card">
            <span className={styles.venueIcon}>
              <Navigation size={18} />
            </span>
            <div>
              <strong>Fair venue found</strong>
              <span className={styles.cardMeta}>Teslim Balogun Annex · 3.2 km each</span>
            </div>
          </div>

          <div className={`${styles.card} ${styles.cardStake}`} data-h="card">
            <ShieldCheck size={18} />
            <span>
              <strong>₦40,000</strong> pot in escrow
            </span>
          </div>

          <a href="#categories" className={styles.scrollCue} data-h="card" aria-label="Browse games">
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
