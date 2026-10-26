"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { UsersRound, CheckCircle2, ShieldCheck } from "lucide-react";
import { me } from "@/data/users";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import styles from "../../auth/auth.module.css";

export default function JoinSquadInvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const toast = useToast();

  const [fullName, setFullName] = useState("Chukwudi Nnaji");
  const [username, setUsername] = useState("chukwudi99");
  const [jersey, setJersey] = useState("11");
  const [position, setPosition] = useState("Midfielder / Sprinter");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: `Account created & linked to ${me.name}!`,
      description: `You've been added to the ${me.name} Player Log (#${jersey} · @${username}).`,
      tone: "success",
    });
    router.push("/dashboard/team");
  };

  return (
    <div className={styles.page}>
      <div className="container" style={{ display: "grid", placeItems: "center" }}>
        <div className={styles.card}>
          <div className={styles.head}>
            <Badge tone="primary" icon={<UsersRound size={13} />}>
              Squad Invite Link · {code}
            </Badge>
            <h1>Join {me.name} on Matchday</h1>
            <p>
              Captain <strong>{me.manager}</strong> invited you to register your player profile and join their official
              squad roster.
            </p>
          </div>

          <div className={styles.squadBanner}>
            <Avatar name={me.name} hue={me.hue} size={48} group />
            <div>
              <strong>
                {me.name} ({me.id})
              </strong>
              <span>
                {me.area} · {me.members} active players · {me.wins}W–{me.losses}L record
              </span>
            </div>
          </div>

          <form onSubmit={handleJoin} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="j-name">Your Full Name</label>
              <input id="j-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className={styles.twoCol}>
              <div className={styles.field}>
                <label htmlFor="j-user">Choose @username</label>
                <input id="j-user" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label htmlFor="j-num">Jersey / Bib Number</label>
                <input id="j-num" value={jersey} onChange={(e) => setJersey(e.target.value)} required />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="j-pos">Primary Role / Position</label>
              <input id="j-pos" value={position} onChange={(e) => setPosition(e.target.value)} required />
            </div>

            <Button type="submit" variant="primary" size="lg" block icon={<CheckCircle2 size={18} />}>
              Create account &amp; join {me.name}
            </Button>
          </form>

          <div className={styles.foot}>
            <ShieldCheck size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
            Your personal Matchday ID will be generated automatically and linked to {me.name}.
          </div>
        </div>
      </div>
    </div>
  );
}
