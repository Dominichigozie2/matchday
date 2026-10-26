"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import styles from "./Toast.module.css";

type Tone = "success" | "info" | "warning";
type Toast = { id: number; title: string; description?: string; tone: Tone };

const ToastCtx = createContext<(t: Omit<Toast, "id" | "tone"> & { tone?: Tone }) => void>(() => {});

export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id" | "tone"> & { tone?: Tone }) => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, tone: "success", ...t }]);
  }, []);

  const remove = (id: number) => setItems((s) => s.filter((x) => x.id !== id));

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className={styles.stack} aria-live="polite">
        {items.map((t) => (
          <ToastItem key={t.id} toast={t} onDone={() => remove(t.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastItem({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 4200);
    return () => clearTimeout(id);
  }, [onDone]);

  const Icon = toast.tone === "success" ? CheckCircle2 : toast.tone === "warning" ? AlertTriangle : Info;

  return (
    <div className={`${styles.toast} ${styles[toast.tone]}`} role="status">
      <span className={styles.icon}>
        <Icon size={20} />
      </span>
      <div className={styles.text}>
        <strong>{toast.title}</strong>
        {toast.description && <p>{toast.description}</p>}
      </div>
      <button className={styles.close} onClick={onDone} aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}
