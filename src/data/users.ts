export type AccountType = "individual" | "group";

export type User = {
  id: string; // Matchday ID
  username: string;
  name: string;
  type: AccountType;
  area: string;
  lat: number;
  lng: number;
  rating: number;
  wins: number;
  losses: number;
  members?: number;
  categories: string[];
  verified?: boolean;
  hue: number; // avatar colour
};

export const users: User[] = [
  { id: "MD-48213", username: "tundeballer", name: "Tunde Bakare", type: "individual", area: "Surulere", lat: 6.5005, lng: 3.3541, rating: 4.8, wins: 38, losses: 9, categories: ["football", "basketball"], verified: true, hue: 152 },
  { id: "MD-20577", username: "adaspins", name: "Ada Nwosu", type: "individual", area: "Yaba", lat: 6.5095, lng: 3.3711, rating: 4.9, wins: 52, losses: 6, categories: ["table-tennis", "badminton"], verified: true, hue: 222 },
  { id: "MD-77310", username: "lekkihoopers", name: "Lekki Hoopers", type: "group", area: "Lekki Phase 1", lat: 6.4478, lng: 3.4723, rating: 4.7, wins: 24, losses: 7, members: 8, categories: ["basketball"], verified: true, hue: 22 },
  { id: "MD-10442", username: "ikejautd", name: "Ikeja United", type: "group", area: "Ikeja GRA", lat: 6.5833, lng: 3.3584, rating: 4.6, wins: 31, losses: 12, members: 14, categories: ["football"], hue: 140 },
  { id: "MD-55901", username: "queenofludo", name: "Kemi Adeyemi", type: "individual", area: "Ikoyi", lat: 6.4541, lng: 3.4339, rating: 5.0, wins: 87, losses: 11, categories: ["ludo", "chess"], verified: true, hue: 270 },
  { id: "MD-31208", username: "bolu.serves", name: "Bolu Akinola", type: "individual", area: "Victoria Island", lat: 6.4281, lng: 3.4219, rating: 4.5, wins: 19, losses: 8, categories: ["lawn-tennis"], hue: 78 },
  { id: "MD-66120", username: "ajahsprint", name: "Ajah Sprinters", type: "group", area: "Ajah", lat: 6.4698, lng: 3.5852, rating: 4.4, wins: 11, losses: 5, members: 6, categories: ["relay-race"], hue: 358 },
  { id: "MD-90015", username: "chidimate", name: "Chidi Eze", type: "individual", area: "Lagos Island", lat: 6.4549, lng: 3.3944, rating: 4.7, wins: 64, losses: 21, categories: ["chess"], hue: 200 },
  { id: "MD-44780", username: "beachblockers", name: "Beach Blockers", type: "group", area: "Lekki", lat: 6.4352, lng: 3.4901, rating: 4.6, wins: 17, losses: 6, members: 4, categories: ["volleyball"], hue: 42 },
  { id: "MD-23356", username: "shuttlesade", name: "Sade Ogunleye", type: "individual", area: "Gbagada", lat: 6.5546, lng: 3.3891, rating: 4.8, wins: 29, losses: 7, categories: ["badminton"], hue: 180 },
  { id: "MD-38842", username: "festacfalcons", name: "Festac Falcons", type: "group", area: "Festac Town", lat: 6.4664, lng: 3.2837, rating: 4.5, wins: 22, losses: 10, members: 12, categories: ["football"], hue: 110 },
  { id: "MD-71123", username: "ifeplays", name: "Ife Martins", type: "individual", area: "Ikeja", lat: 6.6018, lng: 3.3515, rating: 4.3, wins: 14, losses: 9, categories: ["ludo", "table-tennis"], hue: 320 },
];

/** The signed-in demo account (group captain). */
export const me = {
  id: "MD-00721",
  username: "yabawarriors",
  name: "Yaba Warriors",
  manager: "Diego Okoro",
  managerUsername: "diego",
  type: "group" as AccountType,
  area: "Yaba",
  lat: 6.5158,
  lng: 3.3849,
  rating: 4.7,
  wins: 27,
  losses: 8,
  members: 11,
  hue: 152,
  categories: ["football", "basketball", "relay-race"],
};

export const findUser = (q: string) => {
  const s = q.trim().replace(/^@/, "").toLowerCase();
  if (!s) return undefined;
  return users.find((u) => u.username.toLowerCase() === s || u.id.toLowerCase() === s || u.id.toLowerCase() === `md-${s}`);
};

export const getUser = (username: string) => users.find((u) => u.username === username)!;
