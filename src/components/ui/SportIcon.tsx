import { Crown, Dices, Volleyball } from "lucide-react";
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const Base = ({ size = 20, children, ...p }: P) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    {children}
  </svg>
);

const Football = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="m12 7.2 4.2 3-1.6 4.9H9.4l-1.6-4.9z" />
    <path d="M12 7.2V2.4M16.2 10.2l4.4-1.5M14.6 15.1l2.8 3.9M9.4 15.1l-2.8 3.9M7.8 10.2 3.4 8.7" />
  </Base>
);

const Basketball = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2v20" />
    <path d="M5.6 4.4C8 6.6 8.9 9.2 8.9 12s-.9 5.4-3.3 7.6M18.4 4.4C16 6.6 15.1 9.2 15.1 12s.9 5.4 3.3 7.6" />
  </Base>
);

const TableTennis = (p: P) => (
  <Base {...p}>
    <circle cx="9.5" cy="10.5" r="6.5" />
    <path d="m14.2 15.2 5.6 5.6" strokeWidth={3} />
    <circle cx="19" cy="4.5" r="2" />
  </Base>
);

const Relay = (p: P) => (
  <Base {...p}>
    <rect x="9" y="2.5" width="6" height="19" rx="3" transform="rotate(45 12 12)" />
    <path d="M2.5 5.5h5M2 9.5h3.5M14.5 22h5M18.5 18.5H22" />
  </Base>
);

const Tennis = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M5.2 4.7A10 10 0 0 1 8 12a10 10 0 0 1-2.8 7.3M18.8 4.7A10 10 0 0 0 16 12a10 10 0 0 0 2.8 7.3" />
  </Base>
);

const Shuttle = (p: P) => (
  <Base {...p}>
    <path d="M9 17.5h6v1.5a3 3 0 0 1-6 0z" />
    <path d="M9 17.5 5 3h14l-4 14.5" />
    <path d="M12 3v14.5M6.8 9.5h10.4" />
  </Base>
);

const map: Record<string, (p: P) => React.ReactElement> = {
  football: Football,
  basketball: Basketball,
  "table-tennis": TableTennis,
  "relay-race": Relay,
  ludo: ({ size = 20, ...p }) => <Dices size={size} {...(p as object)} />,
  "lawn-tennis": Tennis,
  volleyball: ({ size = 20, ...p }) => <Volleyball size={size} {...(p as object)} />,
  badminton: Shuttle,
  chess: ({ size = 20, ...p }) => <Crown size={size} {...(p as object)} />,
};

export default function SportIcon({ slug, ...p }: P & { slug: string }) {
  const Cmp = map[slug] ?? Football;
  return <Cmp {...p} />;
}
