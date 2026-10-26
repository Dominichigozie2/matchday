import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Matchday — Find your match. Play it today.",
    template: "%s · Matchday",
  },
  description:
    "Challenge players and teams near you across football, basketball, table tennis, relay, ludo and more. Pick a venue, chat, stake, play.",
};

export const viewport: Viewport = {
  themeColor: "#f6f5f0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Flag JS early so reveal animations don't flash */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
