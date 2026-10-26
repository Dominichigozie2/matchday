"use client";

import { useState } from "react";
import Image from "next/image";
import {
  SlidersHorizontal,
  Swords,
  MessagesSquare,
  Trophy,
  Link2,
  UsersRound,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  Lock,
  Sparkles,
} from "lucide-react";
import { formatNaira } from "@/data/requests";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import RevealScope from "@/components/motion/RevealScope";
import styles from "./WorkflowAndFeaturesSection.module.css";

const steps = [
  {
    num: "01",
    icon: SlidersHorizontal,
    title: "Set your game & custom rules",
    desc: "Choose from Football, Basketball, Table Tennis, Relay Race, Ludo and more. Each sport loads its own settings — from 5-a-side half lengths to Ludo capture rules.",
  },
  {
    num: "02",
    icon: Swords,
    title: "Post openly or challenge by ID",
    desc: "Broadcast your request to players near you, or enter an opponent's @username or Matchday ID (e.g. MD-48213) to send a direct head-to-head challenge.",
  },
  {
    num: "03",
    icon: MessagesSquare,
    title: "Merge, lock venue & chat",
    desc: "Once accepted, both parties are merged into a dedicated Match Chat that stays open until 24 hours after matchday to finalize kits, midpoint venue, and timing.",
  },
  {
    num: "04",
    icon: Trophy,
    title: "Play friendly or winner-takes-all",
    desc: "Keep it casual at ₦0 or lock an equal stake in Matchday Escrow before kick-off. When both captains confirm the final score, the winner takes the pot.",
  },
];

export default function WorkflowAndFeaturesSection() {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [stakePerSide, setStakePerSide] = useState(20000);

  const inviteUrl = "https://matchday.ng/join/yaba-warriors-7F2K";

  const copyInvite = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl).catch(() => {});
    }
    setCopied(true);
    toast({
      title: "Team invite link copied!",
      description: "Share on WhatsApp or SMS — teammates create their account and land straight in your squad log.",
    });
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <RevealScope as="div">
      {/* HOW IT WORKS */}
      <section id="how" className={`section ${styles.howSection}`}>
        <div className="container">
          <div className="section-head" data-reveal>
            <div>
              <span className="eyebrow">How Matchday Works</span>
              <h2 className="section-title">
                From challenge to kick-off <span className="hl">in four moves.</span>
              </h2>
            </div>
            <p className="section-sub">
              Designed for both solo competitors and full-squad captains — zero clutter, clear rules before you step
              outside.
            </p>
          </div>

          <div className={styles.stepsGrid} data-reveal>
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <article key={s.num} className={styles.stepCard}>
                  <div className={styles.stepTop}>
                    <span className={styles.stepIcon}>
                      <Icon size={20} />
                    </span>
                    <span className={styles.stepNum}>{s.num}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOR TEAMS & GROUPS + WINNER-TAKES-ALL STAKES */}
      <section id="teams" className={`section ${styles.dualSection}`}>
        <div className="container">
          <div className={styles.bentoGrid}>
            {/* Group / Team Onboarding Showcase */}
            <div className={styles.teamPanel} data-reveal>
              <div className={styles.panelTop}>
                <Badge tone="primary" icon={<UsersRound size={13} />}>
                  For Group &amp; Squad Accounts
                </Badge>
                <h3>Build your roster with one invite link — or log players manually.</h3>
                <p>
                  Registered as a group? Instead of typing every teammate&apos;s details by hand, generate a unique{" "}
                  <strong>Squad Invite Link</strong>. Players click the link, create their verified Matchday account in
                  30 seconds, and automatically appear in your dashboard&apos;s <strong>Player Log</strong> ready for
                  line-up selection.
                </p>
              </div>

              {/* Interactive Invite Link Demo Card */}
              <div className={styles.inviteWidget}>
                <div className={styles.inviteHeader}>
                  <span className={styles.inviteLabel}>
                    <Link2 size={14} /> Active Squad Invite Link · Yaba Warriors (MD-00721)
                  </span>
                  <span className={styles.inviteStatus}>11 / 18 slots filled</span>
                </div>
                <div className={styles.inviteBar}>
                  <code>{inviteUrl}</code>
                  <button type="button" className={styles.copyBtn} onClick={copyInvite}>
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    <span>{copied ? "Copied" : "Copy link"}</span>
                  </button>
                </div>
                <div className={styles.rosterMini}>
                  <div className={styles.rosterRow}>
                    <span className={styles.jersey}>#7</span>
                    <strong>Kelechi Obi</strong>
                    <span className={styles.roleTag}>Winger · Joined via invite link</span>
                    <span className={styles.okPill}>Verified</span>
                  </div>
                  <div className={styles.rosterRow}>
                    <span className={styles.jersey}>#4</span>
                    <strong>Seyi Lawal</strong>
                    <span className={styles.roleTag}>Anchor leg · Logged by captain</span>
                    <span className={styles.okPill}>Verified</span>
                  </div>
                </div>
              </div>

              <div className={styles.panelMedia}>
                <Image
                  src="/images/team-huddle.jpg"
                  alt="Sports team in a pre-match huddle"
                  fill
                  sizes="(max-width: 960px) 100vw, 48vw"
                />
                <div className={styles.mediaOverlay}>
                  <Button href="/dashboard/team" variant="volt" size="sm" iconRight={<ArrowRight />}>
                    Open Captain&apos;s Player Log &amp; Invite Hub
                  </Button>
                  <Button href="/join/yaba-warriors-7F2K" variant="outline" size="sm">
                    Preview Player Invite Page
                  </Button>
                </div>
              </div>
            </div>

            {/* Winner-Takes-All Escrow Stakes Showcase */}
            <div id="stakes" className={styles.stakePanel} data-reveal>
              <div className={styles.panelTop}>
                <Badge tone="volt" icon={<ShieldCheck size={13} />}>
                  Winner-Takes-All Escrow
                </Badge>
                <h3>Back yourself. Winner takes the pot.</h3>
                <p>
                  When two matched individuals or groups want extra spice, both sides lock an equal stake before
                  kick-off. Matchday holds the pot in neutral escrow until the final whistle.
                </p>
              </div>

              {/* Interactive Stake Simulator */}
              <div className={styles.stakeCalc}>
                <div className={styles.calcHeader}>
                  <span>Select stake per side</span>
                  <strong>{formatNaira(stakePerSide)} each</strong>
                </div>
                <div className={styles.stakeButtons}>
                  {[5000, 10000, 20000, 50000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`${styles.stakeOpt} ${stakePerSide === v ? styles.stakeOptOn : ""}`}
                      onClick={() => setStakePerSide(v)}
                    >
                      {formatNaira(v)}
                    </button>
                  ))}
                </div>

                <div className={styles.potBreakdown}>
                  <div>
                    <span>Your deposit</span>
                    <strong>{formatNaira(stakePerSide)}</strong>
                  </div>
                  <div>
                    <span>Opponent deposit</span>
                    <strong>{formatNaira(stakePerSide)}</strong>
                  </div>
                  <div className={styles.totalPot}>
                    <span>
                      <Sparkles size={13} /> Winner takes
                    </span>
                    <strong>{formatNaira(stakePerSide * 2)}</strong>
                  </div>
                </div>

                <ul className={styles.escrowRules}>
                  <li>
                    <Lock size={14} /> Both sides must deposit before kick-off or the stake auto-cancels with 100%
                    refund.
                  </li>
                  <li>
                    <ShieldCheck size={14} /> Dual-captain score confirmation + optional referee/photo verification.
                  </li>
                </ul>
              </div>

              <div className={styles.panelMedia}>
                <Image
                  src="/images/handshake.jpg"
                  alt="Two opposing players shaking hands on the pitch"
                  fill
                  sizes="(max-width: 960px) 100vw, 48vw"
                />
                <div className={styles.mediaOverlay}>
                  <Button href="/dashboard/wallet" variant="volt" size="sm" iconRight={<ArrowRight />}>
                    Explore Escrow Wallet
                  </Button>
                  <Button href="/dashboard/chat" variant="outline" size="sm">
                    See Live Match Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </RevealScope>
  );
}
