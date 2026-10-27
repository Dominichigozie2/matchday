"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  SendHorizontal,
  MapPin,
  ShieldCheck,
  Clock,
  Trophy,
  Navigation,
  CheckCircle2,
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  BadgeCheck,
  SlidersHorizontal,
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
  // Controls whether mobile is showing the chat list ("list") or the opened conversation ("room")
  const [mobileView, setMobileView] = useState<"list" | "room">("list");
  // Controls the collapsible match details drawer inside the mobile chat room header
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const [listFilter, setListFilter] = useState<"all" | "unread" | "staked">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [draft, setDraft] = useState("");
  const [scoreModal, setScoreModal] = useState(false);
  const [myScore, setMyScore] = useState("3");
  const [theirScore, setTheirScore] = useState("1");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const active = threads.find((t) => t.id === activeId) ?? threads[0]!;
  const rival = getUser(active.with);
  const cat = getCategory(active.category);

  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      if (listFilter === "unread" && t.unread === 0) return false;
      if (listFilter === "staked" && !t.stake) return false;
      if (searchQuery.trim()) {
        const u = getUser(t.with);
        const c = getCategory(t.category);
        const hay = `${u.name} ${u.username} ${u.id} ${c?.name ?? ""} ${t.venue} ${t.lastMessage}`.toLowerCase();
        if (!hay.includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    });
  }, [threads, listFilter, searchQuery]);

  const openThread = (id: string) => {
    setActiveId(id);
    setMobileView("room");
    setDetailsOpen(false);
    // Clear unread badge when opening a conversation
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [active.messages.length, activeId, mobileView]);

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
              lastMessage: `Proposed venue: ${c.venue}`,
              lastTime: "now",
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
    setDetailsOpen(false);
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
              lastMessage: `Escrow locked: ${formatNaira(newStake * 2)} pot`,
              lastTime: "now",
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
    setDetailsOpen(false);
    toast({
      title: `${formatNaira(newStake * 2)} Escrow Pot Locked!`,
      description: "Winner takes all upon post-match score confirmation.",
    });
  };

  const submitResult = () => {
    setScoreModal(false);
    setDetailsOpen(false);
    setThreads((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              lastMessage: `Final score: ${myScore}–${theirScore}`,
              lastTime: "now",
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
    <div className={`${styles.wrap} ${mobileView === "room" ? styles.mobileRoomActive : styles.mobileListActive}`}>
      {/* =========================================================
          PANE 1: CONVERSATION LIST (Full screen on mobile until clicked)
          ========================================================= */}
      <aside className={styles.threadList} aria-label="Merged match conversations">
        <div className={styles.listHead}>
          <div>
            <span className="eyebrow">Merged Matches</span>
            <h2>Match Chats ({threads.length})</h2>
            <p>Tap any merged match to open the chat, finalize venue, or lock stakes.</p>
          </div>
        </div>

        {/* Search + Filter Pills */}
        <div className={styles.listControls}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opponent, @username, ID or sport..."
              aria-label="Search chats"
            />
          </div>

          <div className={styles.filterPills}>
            {(["all", "unread", "staked"] as const).map((f) => (
              <button
                key={f}
                type="button"
                className={`${styles.filterPill} ${listFilter === f ? styles.filterPillOn : ""}`}
                onClick={() => setListFilter(f)}
              >
                {f === "all"
                  ? `All (${threads.length})`
                  : f === "unread"
                    ? `Unread (${threads.filter((t) => t.unread > 0).length})`
                    : `Staked Pot (${threads.filter((t) => !!t.stake).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Cards */}
        <div className={styles.items}>
          {filteredThreads.map((t) => {
            const u = getUser(t.with);
            const c = getCategory(t.category);
            const isSel = t.id === active.id;
            return (
              <button
                key={t.id}
                type="button"
                className={`${styles.threadBtn} ${isSel ? styles.threadActive : ""}`}
                onClick={() => openThread(t.id)}
              >
                <div className={styles.avatarCol}>
                  <Avatar name={u.name} hue={u.hue} size={48} group={u.type === "group"} />
                  <span className={styles.sportMini} style={{ background: c?.tint }}>
                    <SportIcon slug={t.category} size={11} />
                  </span>
                </div>

                <div className={styles.threadBody}>
                  <div className={styles.threadTop}>
                    <div className={styles.threadNameRow}>
                      <strong>{u.name}</strong>
                      {u.verified && <BadgeCheck size={14} className={styles.verified} />}
                      <code className={styles.idTag}>{u.id}</code>
                    </div>
                    <small className={styles.timeTag}>{t.lastTime}</small>
                  </div>

                  <div className={styles.threadMetaRow}>
                    <span className={styles.threadSport}>
                      {c?.name} · {t.format}
                    </span>
                    <span>•</span>
                    <span>{t.matchDate}</span>
                    {t.stake ? (
                      <span className={styles.stakeMini}>{formatNaira(t.stake * 2)} pot</span>
                    ) : (
                      <span className={styles.friendlyMini}>Friendly</span>
                    )}
                  </div>

                  <div className={styles.previewRow}>
                    <p className={styles.threadPreview}>{t.lastMessage}</p>
                    {t.unread > 0 ? (
                      <span className={styles.unreadBadge}>{t.unread}</span>
                    ) : (
                      <ChevronRight size={16} className={styles.chevron} />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* =========================================================
          PANE 2: ACTIVE CHAT ROOM (Opens when a chat is clicked on mobile)
          ========================================================= */}
      <section className={styles.room} aria-label={`Chat with ${rival.name}`}>
        {/* Top bar with Back button on mobile */}
        <header className={styles.roomHead}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => setMobileView("list")}
            aria-label="Back to chat list"
          >
            <ArrowLeft size={20} />
            <span>Chats</span>
          </button>

          <div className={styles.roomWho} onClick={() => setDetailsOpen((o) => !o)}>
            <Avatar name={rival.name} hue={rival.hue} size={42} group={rival.type === "group"} />
            <div className={styles.roomWhoText}>
              <div className={styles.roomTitleLine}>
                <h3>{rival.name}</h3>
                <code className={styles.idTag}>{rival.id}</code>
              </div>
              <span className={styles.subLine}>
                {cat?.name} ({active.format}) · {active.matchDate}, {active.matchTime}
              </span>
            </div>
          </div>

          {/* Desktop Quick Actions */}
          <div className={styles.desktopActions}>
            <button type="button" className={styles.quickAction} onClick={proposeMidpointCard}>
              <Navigation size={14} /> Midpoint Venue
            </button>
            <button type="button" className={styles.quickAction} onClick={lockStakeInChat}>
              <ShieldCheck size={14} /> {active.stake ? "Confirm Stake" : "Add ₦20k Pot"}
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

          {/* Mobile Match Info & Actions Drawer Toggle */}
          <button
            type="button"
            className={styles.detailsToggle}
            onClick={() => setDetailsOpen((o) => !o)}
            aria-expanded={detailsOpen}
          >
            <SlidersHorizontal size={15} />
            <span>Match Info</span>
            {detailsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </header>

        {/* Compact 1-line summary strip (always visible) */}
        <div className={styles.summaryStrip} onClick={() => setDetailsOpen((o) => !o)}>
          <span className={styles.stripItem}>
            <MapPin size={13} />
            <strong>{active.venue}</strong> ({active.venueArea})
          </span>
          <span className={styles.stripItem}>
            <ShieldCheck size={13} />
            <strong>
              {active.stake ? `${formatNaira(active.stake * 2)} Pot` : "Friendly (₦0)"}
            </strong>
          </span>
          <span className={styles.stripClose}>
            <Clock size={12} /> {active.closesIn}
          </span>
        </div>

        {/* Expandable Match Sheet & Quick Actions Drawer (especially handy on mobile) */}
        {detailsOpen && (
          <div className={styles.detailsDrawer}>
            <div className={styles.drawerGrid}>
              <div>
                <span>Match &amp; Format</span>
                <strong>
                  {cat?.name} · {active.format}
                </strong>
              </div>
              <div>
                <span>Agreed Venue</span>
                <strong>
                  {active.venue} ({active.venueArea})
                </strong>
              </div>
              <div>
                <span>Winner-Takes-All Escrow</span>
                <strong>
                  {active.stake
                    ? `${formatNaira(active.stake * 2)} (${
                        active.stakeStatus === "both-locked" ? "Both Locked" : "1/2 Deposited"
                      })`
                    : "Friendly · No stake"}
                </strong>
              </div>
              <div>
                <span>Chat Lifecycle</span>
                <strong>{active.closesIn}</strong>
              </div>
            </div>

            <div className={styles.drawerBtns}>
              <button type="button" className={styles.drawerActionBtn} onClick={proposeMidpointCard}>
                <Navigation size={15} /> Share Midpoint Venue
              </button>
              <button type="button" className={styles.drawerActionBtn} onClick={lockStakeInChat}>
                <ShieldCheck size={15} /> {active.stake ? "Confirm Stake Lock" : "Lock ₦20k Stake Pot"}
              </button>
              <button
                type="button"
                className={`${styles.drawerActionBtn} ${styles.drawerPrimaryBtn}`}
                onClick={() => setScoreModal(true)}
              >
                <Trophy size={15} /> Report Final Result &amp; Payout
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Message Stream */}
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
          <div ref={messagesEndRef} />
        </div>

        {/* Sticky Bottom Composer */}
        <form onSubmit={sendMessage} className={styles.composer}>
          <button
            type="button"
            className={styles.venueQuickIcon}
            onClick={proposeMidpointCard}
            title="Share Midpoint Venue"
            aria-label="Share Midpoint Venue"
          >
            <MapPin size={18} />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${rival.name}...`}
            aria-label="Write a message"
          />
          <button type="submit" className={styles.sendBtn} aria-label="Send message">
            <SendHorizontal size={18} />
            <span className={styles.sendLabel}>Send</span>
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
