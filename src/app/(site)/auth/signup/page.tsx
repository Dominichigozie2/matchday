"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, UserCheck, Sparkles } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import styles from "../auth.module.css";

export default function SignupPage() {
  const router = useRouter();
  const toast = useToast();
  const [accountType, setAccountType] = useState<"individual" | "group">("group");
  const [name, setName] = useState("Surulere Titans");
  const [username, setUsername] = useState("suruleretitans");
  const [area, setArea] = useState("Surulere, Lagos");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: `${accountType === "group" ? "Group" : "Individual"} account created!`,
      description:
        accountType === "group"
          ? "Your Squad Invite Link and Player Log are ready in the dashboard."
          : "Your Matchday ID is active. Start challenging players near you!",
    });
    router.push(accountType === "group" ? "/dashboard/team" : "/dashboard");
  };

  return (
    <div className={styles.page}>
      <div className="container" style={{ display: "grid", placeItems: "center" }}>
        <div className={styles.card}>
          <div className={styles.head}>
            <Badge tone="volt" icon={<Sparkles size={13} />}>
              Free v0.1 Registration
            </Badge>
            <h1>Create your Matchday account</h1>
            <p>Compete solo in 1v1 games or register a group to manage your squad roster and invite links.</p>
          </div>

          <div className={styles.modeTabs}>
            <button
              type="button"
              className={`${styles.modeTab} ${accountType === "individual" ? styles.modeTabOn : ""}`}
              onClick={() => {
                setAccountType("individual");
                setName("Adebayo Cole");
                setUsername("bayocole");
              }}
            >
              <UserCheck size={16} /> Individual Player
            </button>
            <button
              type="button"
              className={`${styles.modeTab} ${accountType === "group" ? styles.modeTabOn : ""}`}
              onClick={() => {
                setAccountType("group");
                setName("Surulere Titans");
                setUsername("suruleretitans");
              }}
            >
              <Users size={16} /> Group / Team
            </button>
          </div>

          <form onSubmit={handleSignup} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="s-name">
                {accountType === "group" ? "Team / Group Name" : "Your Full Name"}
              </label>
              <input id="s-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className={styles.twoCol}>
              <div className={styles.field}>
                <label htmlFor="s-user">Public @username</label>
                <input id="s-user" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label htmlFor="s-area">Home Location (for midpoint venues)</label>
                <input id="s-area" value={area} onChange={(e) => setArea(e.target.value)} required />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" block>
              {accountType === "group"
                ? "Create Group & get Squad Invite Link"
                : "Create Individual Account"}
            </Button>
          </form>

          <div className={styles.foot}>
            Already have an account? <Link href="/auth/login">Log in →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
