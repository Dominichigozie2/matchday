"use client";

import { useState } from "react";
import {
  SendHorizontal,
  MapPin,
  ShieldCheck,
  Clock,
  Trophy,
  Navigation,
  CheckCircle2,
} from "lucide-react";
import { conversations, type Conversation } from "@/data/chats";
import { getUser, me } from "@/data/users";
import { getCategory } from "@/data/categories";
import { formatNaira } from "@/data/requests";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import SportIcon from "@/components/ui/SportIcon";
import { useToast } from "@/components/ui/Toast";
import styles from "./chat.module.css";

export default function MatchChatPage() {
  const toast = useToast();
  const [threads, setThreads] = useState<Conversation[]>(conversations);
  const [activeId, setActiveId] = useState<string>(conversations[0]!.id);
  const [draft, setDraft] = useState("");
  const [scoreModal, setScoreModal] = useState(false);
  const [myScore, setMyScore] = useState("3");
  const [theirScore, setTheirScore] = useState("1");

  const active = threads.find((t) => t.id === activeId) ?? threads[0]!;
  const rival = getUser(active.with);
  const cat = getCategory(active.category);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const text = draft.trim();
    setDraft("");
    setThreads((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              lastMessage: text,
              lastTime: "now",
              messages: [
                ...c.messages,
                {
                  id: `m-${Date.now()}`,
                  from: "me",
                  text,
                  time: "Just now",
                },
              ],
            }
          : c
      )
    );
  };

  const proposeMidpointCard = () => {
    setThreads((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `m-${Date.now()}`,
                  from: "me",
                  kind: "venue",
                  text: "Proposed Smart Midpoint Venue",
                  time: "Just now",
                  meta: {
                    title: `${c.venue} (${c.venueArea})`,
                    subtitle: `Equidistant between ${me.area} and ${rival.area}`,
                    status: "Midpoint verified",
                  },
                },
              ],
            }
          : c
      )
    );
    toast({ title: "Midpoint venue card shared in chat!" });
  };

  const lockStakeInChat = () => {
    const newStake = active.stake ?? 10000;
    setThreads((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              stake: newStake,
              stakeStatus: "both-locked",
              messages: [
                ...c.messages,
                {
                  id: `m-${Date.now()}`,
                  from: "system",
                  kind: "stake",
                  text: "Winner-Takes-All Stake Locked",
                  time: "Just now",
                  meta: {
                    title: `${formatNaira(newStake)} each · ${formatNaira(newStake * 2)} Winner-Takes-All Pot`,
                    subtitle: "Both parties deposited. Held in Matchday Escrow until post-match score verification.",
                    status: "Locked in Escrow",
                  },
                },
              ],
            }
          : c
      )
    );
    toast({
      title: `${formatNaira(newStake * 2)} Escrow Pot Locked!`,
      description: "Winner takes all upon post-match score confirmation.",
    });
  };

  const submitResult = () => {
    setScoreModal(false);
    setThreads((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `m-${Date.now()}`,
                  from: "system",
                  text: `Full-time result submitted: ${me.name} ${myScore} – ${theirScore} ${rival.name}. ${
                    c.stake ? `${formatNaira(c.stake * 2)} pot queued for winner payout.` : "Match recorded."
                  }`,
                  time: "Just now",
                },
              ],
            }
          : c
      )
    );
    toast({
      title: "Match result submitted!",
      description: active.stake
        ? `Once ${rival.name} confirms ${myScore}–${theirScore}, ${formatNaira(active.stake * 2)} releases to the winner.`
        : "Result logged to your Matchday record.",
    });
  };

  return (
    <div className={styles.wrap}>
      {/* Left conversation list */}
      <aside className={styles.threadList}>
        <div className={styles.listHead}>
          <h2>Merged Chats ({threads.length})</h2>
          <span>Open until 24h after matchday</span>
        </div>

        <div className={styles.items}>
          {threads.map((t) => {
            const u = getUser(t.with);
            const c = getCategory(t.category);
            const isSel = t.id === active.id;
            return (
              <button
                key={t.id}
                type="button"
                className={`${styles.threadBtn} ${isSel ? styles.threadActive : ""}`}
                onClick={() => setActiveId(t.id)}
              >
                <Avatar name={u.name} hue={u.hue} size={44} group={u.type === "group"} />
                <div className={styles.threadBody}>
                  <div className={styles.threadTop}>
                    <strong>{u.name}</strong>
                    <small>{t.lastTime}</small>
                  </div>
                  <span className={styles.threadSport}>
                    <SportIcon slug={t.category} size={12} /> {c?.name} · {t.format}
                  </span>
                  <p className={styles.threadPreview}>{t.lastMessage}</p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right active chat room */}
      <section className={styles.room}>
        <header className={styles.roomHead}>
          <div className={styles.roomWho}>
            <Avatar name={rival.name} hue={rival.hue} size={44} group={rival.type === "group"} />
            <div>
              <div className={styles.roomTitleLine}>
                <h3>
                  {me.name} × {rival.name}
                </h3>
                <Badge tone="primary">
                  <SportIcon slug={active.category} size={12} /> {cat?.name} · {active.format}
                </Badge>
              </div>
              <span className={styles.lifecycle}>
                <Clock size={13} /> {active.matchDate} at {active.matchTime} · <strong>{active.closesIn}</strong>
              </span>
            </div>
          </div>

          <div className={styles.roomActions}>
            <button type="button" className={styles.quickAction} onClick={proposeMidpointCard}>
              <Navigation size={14} /> Share Midpoint Venue
            </button>
            <button type="button" className={styles.quickAction} onClick={lockStakeInChat}>
              <ShieldCheck size={14} /> {active.stake ? "Confirm Stake Lock" : "Add ₦20k Stake Pot"}
            </button>
            <Button
              variant="primary"
              size="sm"
              icon={<Trophy size={15} />}
              onClick={() => setScoreModal(true)}
            >
              Report Result
            </Button>
          </div>
        </header>

        {/* Sub-banner showing Venue + Winner-Takes-All Escrow status */}
        <div className={styles.contextStrip}>
          <div className={styles.ctxItem}>
            <MapPin size={15} />
            <span>
              Venue: <strong>{active.venue}</strong> ({active.venueArea})
            </span>
          </div>
          <div className={styles.ctxItem}>
            <ShieldCheck size={15} />
            <span>
              Winner-Takes-All Pot:{" "}
              <strong>
                {active.stake
                  ? `${formatNaira(active.stake * 2)} (${
                      active.stakeStatus === "both-locked" ? "Locked in Escrow" : "Awaiting opponent deposit"
                    })`
                  : "Friendly (₦0)"}
              </strong>
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {active.messages.map((m) => {
            if (m.from === "system") {
              return (
                <div key={m.id} className={styles.sysRow}>
                  {m.kind === "stake" && m.meta ? (
                    <div className={styles.stakeCard}>
                      <ShieldCheck size={20} />
                      <div>
                        <strong>{m.meta.title}</strong>
                        <p>{m.meta.subtitle}</p>
                      </div>
                      <Badge tone="volt">{m.meta.status}</Badge>
                    </div>
                  ) : (
                    <span className={styles.sysPill}>{m.text}</span>
                  )}
                </div>
              );
            }

            const isMe = m.from === "me";
            return (
              <div key={m.id} className={`${styles.msgRow} ${isMe ? styles.msgMe : styles.msgThem}`}>
                <div className={styles.bubble}>
                  {!isMe && m.author && <span className={styles.author}>{m.author}</span>}
                  {m.kind === "venue" && m.meta ? (
                    <div className={styles.venueBubble}>
                      <div className={styles.vbTop}>
                        <MapPin size={16} />
                        <strong>{m.meta.title}</strong>
                      </div>
                      <p>{m.meta.subtitle}</p>
                      <span className={styles.vbStatus}>
                        <CheckCircle2 size={13} /> {m.meta.status}
                      </span>
                    </div>
                  ) : (
                    <p>{m.text}</p>
                  )}
                  <small className={styles.time}>{m.time}</small>
                </div>
              </div>
            );
          })}
        </div>

        {/* Composer */}
        <form onSubmit={sendMessage} className={styles.composer}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${rival.name} about kits, venue, referee or stake...`}
            aria-label="Write a message"
          />
          <button type="submit" className={styles.sendBtn}>
            <SendHorizontal size={18} />
            <span>Send</span>
          </button>
        </form>
      </section>

      {/* Post-Match Result & Escrow Payout Modal */}
      <Modal
        open={scoreModal}
        onClose={() => setScoreModal(false)}
        title="Confirm Match Result & Payout"
        subtitle={`Both captains confirm the final score to release the ${
          active.stake ? formatNaira(active.stake * 2) : ""
        } Winner-Takes-All pot.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setScoreModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={<Trophy size={16} />} onClick={submitResult}>
              Submit Final Score
            </Button>
          </>
        }
      >
        <div className={styles.scoreGrid}>
          <div className={styles.scoreSide}>
            <Avatar name={me.name} hue={me.hue} size={46} group />
            <strong>{me.name}</strong>
            <input
              type="number"
              min={0}
              value={myScore}
              onChange={(e) => setMyScore(e.target.value)}
              className={styles.scoreInput}
            />
          </div>
          <span className={styles.scoreDash}>—</span>
          <div className={styles.scoreSide}>
            <Avatar name={rival.name} hue={rival.hue} size={46} group={rival.type === "group"} />
            <strong>{rival.name}</strong>
            <input
              type="number"
              min={0}
              value={theirScore}
              onChange={(e) => setTheirScore(e.target.value)}
              className={styles.scoreInput}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
