"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Link2,
  Copy,
  Check,
  RefreshCw,
  UserPlus,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ExternalLink,
  QrCode,
  Sparkles,
} from "lucide-react";
import { me } from "@/data/users";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import styles from "./team.module.css";

type RosterPlayer = {
  id: string;
  name: string;
  username: string;
  jersey: number;
  position: string;
  sport: string;
  source: "Invite link" | "Captain log";
  status: "Verified" | "Invite pending";
  hue: number;
};

const initialRoster: RosterPlayer[] = [
  { id: "MD-00721", name: "Diego Okoro (Captain)", username: "diego", jersey: 10, position: "Attacking Mid / Captain", sport: "Football", source: "Captain log", status: "Verified", hue: 152 },
  { id: "MD-41209", name: "Kelechi Obi", username: "kelechi7", jersey: 7, position: "Right Winger", sport: "Football", source: "Invite link", status: "Verified", hue: 210 },
  { id: "MD-88310", name: "Seyi Lawal", username: "seyifast", jersey: 4, position: "Anchor Leg (4×100m)", sport: "Relay Race", source: "Invite link", status: "Verified", hue: 34 },
  { id: "MD-19384", name: "Damilola Ajayi", username: "damiblocks", jersey: 1, position: "Goalkeeper", sport: "Football", source: "Invite link", status: "Verified", hue: 280 },
  { id: "MD-62901", name: "Uche Nnamdi", username: "uchehoops", jersey: 23, position: "Point Guard (3x3)", sport: "Basketball", source: "Invite link", status: "Verified", hue: 16 },
  { id: "MD-50412", name: "Tobi Adewale", username: "tobi_cb", jersey: 5, position: "Centre Back", sport: "Football", source: "Captain log", status: "Verified", hue: 120 },
  { id: "MD-73819", name: "Mayowa Peters", username: "mayowap", jersey: 9, position: "Striker", sport: "Football", source: "Invite link", status: "Invite pending", hue: 190 },
];

type PendingApplicant = {
  id: string;
  name: string;
  username: string;
  jersey: number;
  position: string;
  sport: string;
  joinedAgo: string;
  hue: number;
};

const initialPending: PendingApplicant[] = [
  { id: "MD-94102", name: "Ebuka Okafor", username: "ebuka_wing", jersey: 11, position: "Left Winger / Sprinter", sport: "Football", joinedAgo: "14 mins ago via invite link", hue: 145 },
  { id: "MD-94108", name: "Zainab Bello", username: "zainab_track", jersey: 2, position: "Lead-off Leg (4×100m)", sport: "Relay Race", joinedAgo: "42 mins ago via invite link", hue: 310 },
];

export default function TeamRosterAndInvitePage() {
  const toast = useToast();
  const [inviteCode, setInviteCode] = useState("yaba-warriors-7F2K");
  const [copied, setCopied] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);
  const [roster, setRoster] = useState<RosterPlayer[]>(initialRoster);
  const [pending, setPending] = useState<PendingApplicant[]>(initialPending);
  const [sportFilter, setSportFilter] = useState<string>("All");

  // Manual log player modal
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newJersey, setNewJersey] = useState("14");
  const [newPos, setNewPos] = useState("Central Midfielder");
  const [newSport, setNewSport] = useState("Football");

  const inviteUrl = `https://matchday.ng/join/${inviteCode}`;

  const copyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl).catch(() => {});
    }
    setCopied(true);
    toast({
      title: "Group invite link copied!",
      description: "Send this link to your players — they'll create their Matchday account and join your squad log.",
    });
    setTimeout(() => setCopied(false), 2400);
  };

  const regenerateLink = () => {
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    setInviteCode(`yaba-warriors-${suffix}`);
    toast({
      title: "Invite link rotated",
      description: `Previous link expired. New code: yaba-warriors-${suffix}`,
      tone: "info",
    });
  };

  const approveApplicant = (app: PendingApplicant) => {
    setPending((p) => p.filter((x) => x.id !== app.id));
    setRoster((r) => [
      {
        id: app.id,
        name: app.name,
        username: app.username,
        jersey: app.jersey,
        position: app.position,
        sport: app.sport,
        source: "Invite link",
        status: "Verified",
        hue: app.hue,
      },
      ...r,
    ]);
    toast({
      title: `${app.name} approved into ${me.name}!`,
      description: `@${app.username} (${app.id}) is now verified on your official Player Log.`,
    });
  };

  const rejectApplicant = (id: string) => {
    setPending((p) => p.filter((x) => x.id !== id));
    toast({ title: "Join request removed", tone: "info" });
  };

  const handleLogPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const generatedId = `MD-${Math.floor(10000 + Math.random() * 89999)}`;
    const cleanUser = (newUsername.trim() || newName.toLowerCase().replace(/\s+/g, "")).replace(/^@/, "");
    setRoster((r) => [
      {
        id: generatedId,
        name: newName.trim(),
        username: cleanUser,
        jersey: Number(newJersey) || 99,
        position: newPos,
        sport: newSport,
        source: "Captain log",
        status: "Invite pending",
        hue: 165,
      },
      ...r,
    ]);
    setLogModalOpen(false);
    setNewName("");
    setNewUsername("");
    toast({
      title: `${newName} logged & invite sent!`,
      description: `Once ${newName} completes account signup via the link, their status switches to Verified.`,
    });
  };

  const filteredRoster = roster.filter((p) => (sportFilter === "All" ? true : p.sport === sportFilter));

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <span className="eyebrow">Group Account · Squad Management</span>
          <h1>Player Log &amp; Squad Invite Hub</h1>
          <p>
            Share your unique invite link so teammates create their own verified Matchday accounts and auto-join{" "}
            <strong>{me.name}</strong> — or log players directly below.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            href={`/join/${inviteCode}`}
            variant="outline"
            size="sm"
            icon={<ExternalLink size={15} />}
          >
            Test Player Invite Link Page
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<UserPlus size={16} />}
            onClick={() => setLogModalOpen(true)}
          >
            Log / Invite Player
          </Button>
        </div>
      </div>

      {/* Invite Link Control Card */}
      <section className={styles.inviteHero}>
        <div className={styles.inviteLeft}>
          <div className={styles.badgeRow}>
            <Badge tone="volt" icon={<Sparkles size={12} />}>
              Recommended Onboarding Flow
            </Badge>
            <span className={styles.squadCap}>{roster.length} / 18 Squad Slots</span>
          </div>
          <h2>Invite players with a single link</h2>
          <p>
            When a teammate opens your link, they are prompted to create a free Matchday account (or sign in) and pick
            their jersey number &amp; position. Their verified profile links straight to <strong>{me.name}</strong>.
          </p>

          <div className={styles.linkBox}>
            <Link2 size={18} className={styles.linkIcon} />
            <code>{inviteUrl}</code>
            <button type="button" className={styles.copyBtn} onClick={copyLink}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? "Copied!" : "Copy invite link"}</span>
            </button>
            <button
              type="button"
              className={styles.rotateBtn}
              onClick={regenerateLink}
              title="Rotate invite code"
            >
              <RefreshCw size={15} />
            </button>
          </div>

          <div className={styles.guardRow}>
            <label className={styles.switchLabel}>
              <input
                type="checkbox"
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
              />
              <span>Require Captain approval before new signups appear on active match line-ups</span>
            </label>
          </div>
        </div>

        <div className={styles.qrCard}>
          <div className={styles.qrGraphic}>
            <QrCode size={68} />
          </div>
          <strong>Pitch-side QR Pass</strong>
          <span>Players can scan at training to create their account and join {me.name}.</span>
          <Link href={`/join/${inviteCode}`} className={styles.previewLink}>
            Preview landing page →
          </Link>
        </div>
      </section>

      {/* Pending Join Requests from Invite Link */}
      {pending.length > 0 && (
        <section className={styles.pendingSection}>
          <div className={styles.secHead}>
            <div>
              <h2>Pending Invite Link Signups ({pending.length})</h2>
              <p>These players clicked your invite link, created their Matchday account, and await your approval.</p>
            </div>
          </div>

          <div className={styles.pendingGrid}>
            {pending.map((app) => (
              <div key={app.id} className={styles.pendingCard}>
                <Avatar name={app.name} hue={app.hue} size={46} />
                <div className={styles.pendingInfo}>
                  <div className={styles.pNameLine}>
                    <strong>{app.name}</strong>
                    <span className={styles.jerseyBadge}>#{app.jersey}</span>
                    <code>{app.id}</code>
                  </div>
                  <span>
                    @{app.username} · {app.position} ({app.sport})
                  </span>
                  <small>{app.joinedAgo}</small>
                </div>
                <div className={styles.pendingBtns}>
                  <button
                    type="button"
                    className={styles.rejectBtn}
                    onClick={() => rejectApplicant(app.id)}
                  >
                    <XCircle size={15} /> Remove
                  </button>
                  <button
                    type="button"
                    className={styles.approveBtn}
                    onClick={() => approveApplicant(app)}
                  >
                    <CheckCircle2 size={15} /> Approve to log
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Official Squad Player Log Table */}
      <section className={styles.rosterSection}>
        <div className={styles.secHead}>
          <div>
            <h2>Official Squad Player Log ({filteredRoster.length})</h2>
            <p>Verified roster eligible for group match requests and staked tournaments.</p>
          </div>

          <div className={styles.sportTabs}>
            {["All", "Football", "Basketball", "Relay Race"].map((s) => (
              <button
                key={s}
                type="button"
                className={`${styles.sportTab} ${sportFilter === s ? styles.sportTabOn : ""}`}
                onClick={() => setSportFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Jersey</th>
                <th>Player</th>
                <th>Matchday ID</th>
                <th>Sport &amp; Role</th>
                <th>Onboarding</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoster.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className={styles.jerseyCell}>#{p.jersey}</span>
                  </td>
                  <td>
                    <div className={styles.playerCell}>
                      <Avatar name={p.name} hue={p.hue} size={36} />
                      <div>
                        <strong>{p.name}</strong>
                        <span>@{p.username}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code className={styles.idCode}>{p.id}</code>
                  </td>
                  <td>
                    <strong>{p.sport}</strong>
                    <span className={styles.subCell}>{p.position}</span>
                  </td>
                  <td>
                    <Badge tone={p.source === "Invite link" ? "info" : "neutral"}>{p.source}</Badge>
                  </td>
                  <td>
                    {p.status === "Verified" ? (
                      <Badge tone="primary" icon={<ShieldCheck size={12} />}>
                        Verified account
                      </Badge>
                    ) : (
                      <Badge tone="warning">Awaiting signup via link</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Manual Log / Invite Player Modal */}
      <Modal
        open={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        title="Log Player & Send Invite Link"
        subtitle="Pre-register a teammate's jersey and role — we'll send them your group invite link to finish creating their account."
        footer={
          <>
            <Button variant="ghost" onClick={() => setLogModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleLogPlayer}>
              Add to Player Log &amp; Send Link
            </Button>
          </>
        }
      >
        <form onSubmit={handleLogPlayer} className={styles.modalForm}>
          <div>
            <label className={styles.mLabel} htmlFor="mp-name">
              Player Full Name
            </label>
            <input
              id="mp-name"
              className={styles.mInput}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Kunle Afolabi"
              required
            />
          </div>

          <div className={styles.mTwo}>
            <div>
              <label className={styles.mLabel} htmlFor="mp-user">
                Expected @username (optional)
              </label>
              <input
                id="mp-user"
                className={styles.mInput}
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="e.g. kunle_af"
              />
            </div>
            <div>
              <label className={styles.mLabel} htmlFor="mp-jersey">
                Jersey / Bib Number
              </label>
              <input
                id="mp-jersey"
                className={styles.mInput}
                value={newJersey}
                onChange={(e) => setNewJersey(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.mTwo}>
            <div>
              <label className={styles.mLabel} htmlFor="mp-sport">
                Primary Sport Squad
              </label>
              <select
                id="mp-sport"
                className={styles.mInput}
                value={newSport}
                onChange={(e) => setNewSport(e.target.value)}
              >
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Relay Race">Relay Race</option>
              </select>
            </div>
            <div>
              <label className={styles.mLabel} htmlFor="mp-pos">
                Position / Leg
              </label>
              <input
                id="mp-pos"
                className={styles.mInput}
                value={newPos}
                onChange={(e) => setNewPos(e.target.value)}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
