"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Wallet,
  Trophy,
  ArrowDownLeft,
  ArrowUpRight,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { formatNaira } from "@/data/requests";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import styles from "./wallet.module.css";

const initialHistory = [
  { id: "TX-904", title: "Winner-Takes-All Payout · vs Surulere Stars (Football 5-a-side)", date: "Oct 24, 2026", amount: 40000, dir: "in", status: "Released to winner" },
  { id: "TX-903", title: "Escrow Stake Deposit · vs Ikeja United (Football 7-a-side)", date: "Oct 26, 2026", amount: 20000, dir: "lock", status: "Locked in Escrow" },
  { id: "TX-902", title: "Escrow Stake Deposit · vs Lekki Hoopers (Basketball 3x3)", date: "Oct 26, 2026", amount: 10000, dir: "lock", status: "Waiting opponent" },
  { id: "TX-901", title: "Winner-Takes-All Payout · vs Akoka Pacers (Relay 4×100m)", date: "Oct 18, 2026", amount: 30000, dir: "in", status: "Released to winner" },
];

export default function StakesAndWalletPage() {
  const toast = useToast();
  const [balance, setBalance] = useState(85000);

  const handleTopUp = () => {
    setBalance((b) => b + 20000);
    toast({
      title: "₦20,000 added to Matchday Wallet",
      description: "Ready to back your squad in upcoming Winner-Takes-All matches.",
    });
  };

  const handleWithdraw = () => {
    if (balance < 20000) return;
    setBalance((b) => b - 20000);
    toast({
      title: "₦20,000 withdrawal initiated",
      description: "Sent to your verified team bank account.",
      tone: "info",
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <span className="eyebrow">Winner-Takes-All Escrow</span>
          <h1>Stakes &amp; Matchday Wallet</h1>
          <p>
            When two merged users or groups place a bet on their match, both sides deposit equal stakes into Matchday
            Escrow. Whoever wins takes the pot.
          </p>
        </div>
        <div className={styles.actions}>
          <Button variant="outline" size="sm" icon={<ArrowUpRight size={15} />} onClick={handleWithdraw}>
            Withdraw ₦20,000
          </Button>
          <Button variant="primary" size="sm" icon={<ArrowDownLeft size={15} />} onClick={handleTopUp}>
            Top up +₦20,000
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className={styles.cards}>
        <div className={styles.mainBalance}>
          <div className={styles.balTop}>
            <span>Available Wallet Balance</span>
            <Wallet size={20} />
          </div>
          <strong>{formatNaira(balance)}</strong>
          <small>Instant stake lock &amp; zero-delay winner payouts</small>
        </div>

        <div className={styles.statCard}>
          <div className={styles.balTop}>
            <span>Locked in Active Escrows</span>
            <Lock size={18} />
          </div>
          <strong>₦30,000</strong>
          <small>Across 2 upcoming merged matches (₦60,000 combined pots)</small>
        </div>

        <div className={styles.statCard}>
          <div className={styles.balTop}>
            <span>Total Matchday Winnings</span>
            <Trophy size={18} />
          </div>
          <strong>₦240,000</strong>
          <small>14 staked matches won · 0 disputes</small>
        </div>
      </div>

      {/* Active Escrow Pots */}
      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <h2>Active Match Escrow Pots</h2>
            <p>Funds are held neutrally until both captains confirm the final match score.</p>
          </div>
          <Badge tone="primary" icon={<ShieldCheck size={13} />}>
            100% Escrow Protected
          </Badge>
        </div>

        <div className={styles.escrowGrid}>
          <div className={styles.escrowCard}>
            <div className={styles.escrowTop}>
              <strong>Yaba Warriors × Ikeja United</strong>
              <Badge tone="volt">₦40,000 Pot Locked</Badge>
            </div>
            <p className={styles.escrowMeta}>
              Football (7-a-side) · Sat, Oct 31 at 4:00 PM · Teslim Balogun Annex
            </p>
            <div className={styles.depositBar}>
              <span className={styles.depDone}>
                <CheckCircle2 size={14} /> You deposited ₦20,000
              </span>
              <span className={styles.depDone}>
                <CheckCircle2 size={14} /> Ikeja United deposited ₦20,000
              </span>
            </div>
          </div>

          <div className={styles.escrowCard}>
            <div className={styles.escrowTop}>
              <strong>Yaba Warriors × Lekki Hoopers</strong>
              <Badge tone="warning">₦20,000 Pot · 1 of 2 Locked</Badge>
            </div>
            <p className={styles.escrowMeta}>
              Basketball (3x3) · Fri, Oct 30 at 6:00 PM · Admiralty Courts
            </p>
            <div className={styles.depositBar}>
              <span className={styles.depDone}>
                <CheckCircle2 size={14} /> You deposited ₦10,000
              </span>
              <span className={styles.depWait}>Awaiting Lekki Hoopers (₦10,000)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ledger */}
      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <h2>Escrow &amp; Payout Ledger</h2>
            <p>Complete history of your staked matches and winner payouts.</p>
          </div>
        </div>

        <div className={styles.ledger}>
          {initialHistory.map((item) => (
            <div key={item.id} className={styles.ledgerRow}>
              <div>
                <strong>{item.title}</strong>
                <span>
                  {item.id} · {item.date}
                </span>
              </div>
              <div className={styles.ledgerRight}>
                <Badge tone={item.dir === "in" ? "primary" : "neutral"}>{item.status}</Badge>
                <strong className={item.dir === "in" ? styles.amtIn : styles.amtLock}>
                  {item.dir === "in" ? `+${formatNaira(item.amount)}` : formatNaira(item.amount)}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
