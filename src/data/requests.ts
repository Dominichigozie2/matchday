import type { MatchMode } from "./categories";

export type When = "today" | "week" | "weekend" | "later";

export type MatchRequest = {
  id: string;
  category: string;
  by: string; // username
  mode: MatchMode;
  format: string;
  skill: "Casual" | "Intermediate" | "Competitive" | "Pro";
  dateLabel: string;
  time: string;
  when: When;
  venueMode: "halfway" | "preferred" | "host";
  venue: string;
  area: string;
  distanceKm: number;
  stake: number | null; // ₦ per side
  rules: string[];
  note?: string;
  posted: string;
  interested: number;
};

export const requests: MatchRequest[] = [
  { id: "RQ-1042", category: "football", by: "ikejautd", mode: "group", format: "7-a-side", skill: "Competitive", dateLabel: "Sat, Oct 31", time: "4:00 PM", when: "weekend", venueMode: "preferred", venue: "Teslim Balogun Annex", area: "Surulere", distanceKm: 6.4, stake: 20000, rules: ["2 × 25 min", "3 subs", "Neutral ref"], note: "We want a proper game. Come with full kits, no rough tackles.", posted: "12 min ago", interested: 4 },
  { id: "RQ-1041", category: "basketball", by: "lekkihoopers", mode: "group", format: "3x3", skill: "Intermediate", dateLabel: "Today", time: "6:30 PM", when: "today", venueMode: "halfway", venue: "Meet halfway", area: "Suggested near Ikoyi", distanceKm: 4.1, stake: 10000, rules: ["Play to 21", "Half court", "Win by 2"], posted: "28 min ago", interested: 7 },
  { id: "RQ-1040", category: "table-tennis", by: "adaspins", mode: "individual", format: "Singles", skill: "Pro", dateLabel: "Wed, Oct 28", time: "5:00 PM", when: "week", venueMode: "preferred", venue: "Yaba Tech Sports Centre", area: "Yaba", distanceKm: 1.2, stake: null, rules: ["Best of 5", "11 points", "Bats provided"], note: "Looking for a strong sparring partner before the state open.", posted: "1 hr ago", interested: 12 },
  { id: "RQ-1039", category: "ludo", by: "queenofludo", mode: "individual", format: "2 players", skill: "Competitive", dateLabel: "Thu, Oct 29", time: "3:00 PM", when: "week", venueMode: "preferred", venue: "Freedom Park", area: "Lagos Island", distanceKm: 7.8, stake: 5000, rules: ["Best of 3", "Six to start", "Extra roll on capture"], note: "Undefeated in 22. Bring your luck.", posted: "2 hr ago", interested: 19 },
  { id: "RQ-1038", category: "relay-race", by: "ajahsprint", mode: "group", format: "4×100m", skill: "Intermediate", dateLabel: "Sun, Nov 1", time: "7:30 AM", when: "weekend", venueMode: "preferred", venue: "UNILAG Sports Centre", area: "Akoka", distanceKm: 2.3, stake: 15000, rules: ["1 heat", "Matchday stopwatch", "4 runners"], posted: "3 hr ago", interested: 3 },
  { id: "RQ-1037", category: "lawn-tennis", by: "bolu.serves", mode: "individual", format: "Singles", skill: "Intermediate", dateLabel: "Fri, Oct 30", time: "7:00 AM", when: "week", venueMode: "preferred", venue: "Ikoyi Club Courts", area: "Ikoyi", distanceKm: 8.9, stake: null, rules: ["Best of 3", "Tie-break at 6–6", "Hard court"], posted: "4 hr ago", interested: 5 },
  { id: "RQ-1036", category: "football", by: "tundeballer", mode: "individual", format: "1v1", skill: "Competitive", dateLabel: "Today", time: "5:00 PM", when: "today", venueMode: "halfway", venue: "Meet halfway", area: "Suggested near Yaba", distanceKm: 3.0, stake: 5000, rules: ["10 min", "Small goals", "Ball provided"], note: "Street rules. First to 5 or 10 minutes.", posted: "5 hr ago", interested: 9 },
  { id: "RQ-1035", category: "volleyball", by: "beachblockers", mode: "group", format: "Beach 2v2", skill: "Casual", dateLabel: "Sat, Oct 31", time: "10:00 AM", when: "weekend", venueMode: "preferred", venue: "Elegushi Beach Courts", area: "Lekki", distanceKm: 12.6, stake: null, rules: ["Best of 3", "21 points"], note: "Chill beach morning, loser buys the coconuts 🥥", posted: "6 hr ago", interested: 6 },
  { id: "RQ-1034", category: "chess", by: "chidimate", mode: "individual", format: "Blitz 5+3", skill: "Pro", dateLabel: "Tue, Oct 27", time: "6:00 PM", when: "week", venueMode: "preferred", venue: "Freedom Park", area: "Lagos Island", distanceKm: 7.8, stake: 3000, rules: ["5 games", "Alternate colours"], posted: "8 hr ago", interested: 4 },
  { id: "RQ-1033", category: "badminton", by: "shuttlesade", mode: "individual", format: "Singles", skill: "Competitive", dateLabel: "Thu, Oct 29", time: "6:00 PM", when: "week", venueMode: "halfway", venue: "Meet halfway", area: "Suggested near Akoka", distanceKm: 4.4, stake: null, rules: ["Best of 3", "Nylon shuttle"], posted: "10 hr ago", interested: 2 },
  { id: "RQ-1032", category: "football", by: "festacfalcons", mode: "group", format: "11-a-side", skill: "Competitive", dateLabel: "Sun, Nov 8", time: "3:30 PM", when: "later", venueMode: "host", venue: "Our home ground", area: "Festac Town", distanceKm: 14.2, stake: 50000, rules: ["2 × 45 min", "5 subs", "Neutral ref"], note: "Full 90. We'll cover pitch fees if you cover the ref.", posted: "1 day ago", interested: 8 },
  { id: "RQ-1031", category: "ludo", by: "ifeplays", mode: "individual", format: "4 players", skill: "Casual", dateLabel: "Today", time: "8:00 PM", when: "today", venueMode: "preferred", venue: "Ikeja City Park Hub", area: "Ikeja", distanceKm: 10.3, stake: 2000, rules: ["Best of 3", "Six to start"], posted: "1 day ago", interested: 11 },
];

export type IncomingRequest = {
  id: string;
  from: string;
  category: string;
  format: string;
  dateLabel: string;
  time: string;
  venue: string;
  stake: number | null;
  message: string;
  received: string;
  status: "pending" | "accepted" | "declined";
  direction: "in" | "out";
};

export const myRequests: IncomingRequest[] = [
  { id: "MR-311", from: "festacfalcons", category: "football", format: "11-a-side", dateLabel: "Sun, Nov 8", time: "3:30 PM", venue: "Meet halfway", stake: 50000, message: "Saw your win against Ikeja. Let's see if you can handle the Falcons.", received: "8 min ago", status: "pending", direction: "in" },
  { id: "MR-310", from: "lekkihoopers", category: "basketball", format: "3x3", dateLabel: "Fri, Oct 30", time: "6:00 PM", venue: "Admiralty Courts", stake: 10000, message: "Run it back? Same court, same time.", received: "1 hr ago", status: "pending", direction: "in" },
  { id: "MR-309", from: "ajahsprint", category: "relay-race", format: "4×100m", dateLabel: "Sun, Nov 1", time: "7:30 AM", venue: "UNILAG Sports Centre", stake: 15000, message: "Your 4×100 squad vs ours. Stopwatch on both phones.", received: "3 hr ago", status: "pending", direction: "in" },
  { id: "MR-308", from: "ikejautd", category: "football", format: "7-a-side", dateLabel: "Sat, Oct 31", time: "4:00 PM", venue: "Teslim Balogun Annex", stake: 20000, message: "We're in. See you Saturday.", received: "Yesterday", status: "accepted", direction: "out" },
  { id: "MR-307", from: "tundeballer", category: "football", format: "1v1", dateLabel: "Thu, Oct 29", time: "5:00 PM", venue: "Meet halfway", stake: null, message: "Friendly warm-up before the weekend?", received: "2 days ago", status: "pending", direction: "out" },
  { id: "MR-306", from: "festacfalcons", category: "football", format: "5-a-side", dateLabel: "Sat, Oct 24", time: "4:00 PM", venue: "Campos Mini Stadium", stake: 10000, message: "Can't make it this week, sorry.", received: "4 days ago", status: "declined", direction: "out" },
];

export const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
