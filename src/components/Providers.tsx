"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { LocationProvider } from "@/lib/location";

/* ---------------------------------------------------------
   Theme context. v0.1 ships light only; the toggle UI will
   call setTheme("dark") once dark tokens are defined.
   --------------------------------------------------------- */
type Theme = "light" | "dark";
const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: "light",
  setTheme: () => {},
});
export const useTheme = () => useContext(ThemeCtx);

export default function Providers({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      <LocationProvider>
        <ToastProvider>{children}</ToastProvider>
      </LocationProvider>
    </ThemeCtx.Provider>
  );
}
