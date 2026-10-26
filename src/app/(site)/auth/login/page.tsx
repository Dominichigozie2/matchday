"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import styles from "../auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [identifier, setIdentifier] = useState("@yabawarriors");
  const [password, setPassword] = useState("••••••••••••");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Welcome back, Yaba Warriors (MD-00721)",
      description: "Loaded your group dashboard, active chats, and player log.",
    });
    router.push("/dashboard");
  };

  return (
    <div className={styles.page}>
      <div className="container" style={{ display: "grid", placeItems: "center" }}>
        <div className={styles.card}>
          <div className={styles.head}>
            <Badge tone="primary">Matchday Account</Badge>
            <h1>Log in to Matchday</h1>
            <p>Sign in with your email, @username, or 5-digit Matchday ID.</p>
          </div>

          <form onSubmit={submit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="l-id">Email, @username or Matchday ID</label>
              <input id="l-id" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="l-pw">Password</label>
              <input
                id="l-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="primary" size="lg" block iconRight={<ArrowRight size={18} />}>
              Continue to Dashboard
            </Button>
          </form>

          <div className={styles.foot}>
            New to Matchday? <Link href="/auth/signup">Create an Individual or Group account →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
