export type ChatMessage = {
  id: string;
  from: "me" | "them" | "system";
  author?: string;
  text: string;
  time: string;
  kind?: "text" | "venue" | "stake";
  meta?: { title: string; subtitle: string; status?: string };
};

export type Conversation = {
  id: string;
  with: string; // username
  category: string;
  format: string;
  matchDate: string;
  matchTime: string;
  venue: string;
  venueArea: string;
  stake: number | null;
  stakeStatus: "both-locked" | "waiting-them" | "waiting-me" | "none";
  closesIn: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  messages: ChatMessage[];
};

export const conversations: Conversation[] = [
  {
    id: "c1",
    with: "ikejautd",
    category: "football",
    format: "7-a-side",
    matchDate: "Sat, Oct 31",
    matchTime: "4:00 PM",
    venue: "Teslim Balogun Annex",
    venueArea: "Surulere",
    stake: 20000,
    stakeStatus: "both-locked",
    closesIn: "Closes Sun, Nov 1 · 11:59 PM",
    unread: 2,
    lastMessage: "Bring the white kits, we're in green.",
    lastTime: "2m",
    messages: [
      { id: "m1", from: "system", text: "You're matched! Ikeja United accepted your 7-a-side request.", time: "Mon 10:02" },
      { id: "m2", from: "them", author: "Femi (Captain)", text: "Yaba Warriors 👋🏾 Saw your last game. Ready for Saturday?", time: "10:05" },
      { id: "m3", from: "me", text: "Always ready. Halfway venue is Surulere — Teslim Balogun Annex works for us.", time: "10:07" },
      { id: "m4", from: "them", author: "Femi (Captain)", kind: "venue", text: "Proposed a venue", time: "10:09", meta: { title: "Teslim Balogun Annex", subtitle: "Surulere · Turf pitch · ₦25,000/hr split", status: "Accepted by both" } },
      { id: "m5", from: "system", kind: "stake", text: "Stake locked", time: "10:15", meta: { title: "₦20,000 each · ₦40,000 pot", subtitle: "Held in Matchday escrow until both captains confirm the result", status: "Both deposited" } },
      { id: "m6", from: "me", text: "Referee is confirmed too. 2 × 25 mins, 3 subs.", time: "10:20" },
      { id: "m7", from: "them", author: "Femi (Captain)", text: "Perfect. We'll be there 3:30 to warm up.", time: "10:22" },
      { id: "m8", from: "them", author: "Femi (Captain)", text: "Bring the white kits, we're in green.", time: "10:23" },
    ],
  },
  {
    id: "c2",
    with: "lekkihoopers",
    category: "basketball",
    format: "3x3",
    matchDate: "Fri, Oct 30",
    matchTime: "6:00 PM",
    venue: "Admiralty Courts",
    venueArea: "Lekki Phase 1",
    stake: 10000,
    stakeStatus: "waiting-them",
    closesIn: "Closes Sat, Oct 31 · 11:59 PM",
    unread: 0,
    lastMessage: "Depositing tonight 🙏🏾",
    lastTime: "1h",
    messages: [
      { id: "m1", from: "system", text: "You're matched! Lekki Hoopers accepted your 3x3 request.", time: "Sun 18:40" },
      { id: "m2", from: "them", author: "Dayo", text: "Let's go! Admiralty has lights so 6pm is fine.", time: "18:44" },
      { id: "m3", from: "system", kind: "stake", text: "Stake pending", time: "18:50", meta: { title: "₦10,000 each · ₦20,000 pot", subtitle: "You've deposited. Waiting for Lekki Hoopers.", status: "1 of 2 deposited" } },
      { id: "m4", from: "them", author: "Dayo", text: "Depositing tonight 🙏🏾", time: "19:02" },
    ],
  },
  {
    id: "c3",
    with: "ajahsprint",
    category: "relay-race",
    format: "4×100m",
    matchDate: "Sun, Nov 1",
    matchTime: "7:30 AM",
    venue: "UNILAG Sports Centre",
    venueArea: "Akoka",
    stake: null,
    stakeStatus: "none",
    closesIn: "Closes Mon, Nov 2 · 11:59 PM",
    unread: 1,
    lastMessage: "Can we push to 8am?",
    lastTime: "3h",
    messages: [
      { id: "m1", from: "system", text: "You're matched! This is a friendly — no stake.", time: "Sat 09:12" },
      { id: "m2", from: "them", author: "Ngozi", text: "Hi! Our anchor leg has a lecture till 7. Can we push to 8am?", time: "09:30" },
    ],
  },
];
