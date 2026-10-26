/* ---------------------------------------------------------
   Category catalogue + per-sport match settings schema.
   Every sport defines the fields a match request needs.
   The Create flow renders these dynamically.
   --------------------------------------------------------- */

export type SettingField =
  | {
      id: string;
      label: string;
      type: "segmented";
      options: string[];
      default: string;
      hint?: string;
    }
  | {
      id: string;
      label: string;
      type: "select";
      options: string[];
      default: string;
      hint?: string;
    }
  | {
      id: string;
      label: string;
      type: "number";
      min: number;
      max: number;
      step?: number;
      unit?: string;
      default: number;
      hint?: string;
    }
  | {
      id: string;
      label: string;
      type: "toggle";
      default: boolean;
      hint?: string;
    };

export type MatchMode = "individual" | "group";

export type Category = {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  image: string;
  tint: string; // CSS var name
  modes: MatchMode[];
  venueTypes: string[];
  activePlayers: number;
  openRequests: number;
  settings: SettingField[];
};

const skill: SettingField = {
  id: "skill",
  label: "Skill level",
  type: "segmented",
  options: ["Casual", "Intermediate", "Competitive", "Pro"],
  default: "Intermediate",
  hint: "Helps us show your request to the right opponents.",
};

export const categories: Category[] = [
  {
    slug: "football",
    name: "Football",
    short: "Soccer",
    tagline: "Five-a-side to full pitch. Bring your squad.",
    description:
      "Street ballers, Sunday leagues and serious squads. Set your format, pick a pitch and settle it on the grass.",
    image: "/images/football.jpg",
    tint: "var(--c-football)",
    modes: ["group", "individual"],
    venueTypes: ["Turf pitch", "Grass pitch", "Street court"],
    activePlayers: 12480,
    openRequests: 342,
    settings: [
      { id: "format", label: "Format", type: "segmented", options: ["1v1", "5-a-side", "7-a-side", "11-a-side"], default: "5-a-side" },
      { id: "duration", label: "Match length", type: "number", min: 10, max: 90, step: 5, unit: "min", default: 40 },
      { id: "halves", label: "Halves", type: "segmented", options: ["1", "2"], default: "2" },
      { id: "subs", label: "Substitutes per side", type: "number", min: 0, max: 7, default: 2 },
      { id: "ball", label: "I'll bring the ball", type: "toggle", default: true },
      { id: "referee", label: "Neutral referee", type: "toggle", default: false, hint: "We'll suggest a verified ref near the venue." },
      skill,
    ],
  },
  {
    slug: "basketball",
    name: "Basketball",
    short: "Hoops",
    tagline: "Run it back. 1v1 or full court.",
    description: "Pick-up games, 3x3 battles and full-court showdowns on the best outdoor courts near you.",
    image: "/images/basketball.jpg",
    tint: "var(--c-basketball)",
    modes: ["individual", "group"],
    venueTypes: ["Outdoor court", "Indoor court"],
    activePlayers: 6320,
    openRequests: 188,
    settings: [
      { id: "format", label: "Format", type: "segmented", options: ["1v1", "3x3", "5v5"], default: "3x3" },
      { id: "scoring", label: "Play to", type: "segmented", options: ["11", "21", "Timed"], default: "21" },
      { id: "court", label: "Court", type: "segmented", options: ["Half court", "Full court"], default: "Half court" },
      { id: "shotclock", label: "Shot clock", type: "toggle", default: false },
      skill,
    ],
  },
  {
    slug: "table-tennis",
    name: "Table Tennis",
    short: "Ping pong",
    tagline: "Quick hands. Quicker decisions.",
    description: "Singles and doubles rallies at parks, clubs and community centres. Best-of formats, your rules.",
    image: "/images/table-tennis.jpg",
    tint: "var(--c-table-tennis)",
    modes: ["individual", "group"],
    venueTypes: ["Park table", "Club table"],
    activePlayers: 4210,
    openRequests: 97,
    settings: [
      { id: "format", label: "Format", type: "segmented", options: ["Singles", "Doubles"], default: "Singles" },
      { id: "bestOf", label: "Best of", type: "segmented", options: ["3", "5", "7"], default: "5" },
      { id: "points", label: "Points per game", type: "segmented", options: ["11", "21"], default: "11" },
      { id: "bats", label: "I'll bring bats & balls", type: "toggle", default: true },
      skill,
    ],
  },
  {
    slug: "relay-race",
    name: "Relay Race",
    short: "Track",
    tagline: "Four legs. One baton. Zero excuses.",
    description: "Team relay challenges and sprint duels. Choose the distance, the lanes and the stopwatch.",
    image: "/images/relay-race.jpg",
    tint: "var(--c-relay-race)",
    modes: ["group"],
    venueTypes: ["Running track", "Open field"],
    activePlayers: 1840,
    openRequests: 41,
    settings: [
      { id: "distance", label: "Event", type: "segmented", options: ["4×100m", "4×200m", "4×400m"], default: "4×100m" },
      { id: "runners", label: "Runners per team", type: "number", min: 2, max: 6, default: 4 },
      { id: "heats", label: "Number of heats", type: "number", min: 1, max: 5, default: 1 },
      { id: "timing", label: "Electronic timing", type: "toggle", default: false, hint: "Use the Matchday stopwatch on both phones." },
      skill,
    ],
  },
  {
    slug: "ludo",
    name: "Ludo",
    short: "Board",
    tagline: "Roll it, race it, rule the board.",
    description: "The classic under-the-tree showdown. Two or four players, house rules agreed before the first roll.",
    image: "/images/ludo.jpg",
    tint: "var(--c-ludo)",
    modes: ["individual", "group"],
    venueTypes: ["Lounge", "Park", "Home"],
    activePlayers: 9150,
    openRequests: 276,
    settings: [
      { id: "players", label: "Players", type: "segmented", options: ["2 players", "4 players", "2v2 teams"], default: "2 players" },
      { id: "games", label: "Number of games", type: "number", min: 1, max: 9, step: 2, default: 3 },
      { id: "six", label: "Need a 6 to start", type: "toggle", default: true },
      { id: "capture", label: "Extra roll on capture", type: "toggle", default: true },
      { id: "board", label: "I'll bring the board", type: "toggle", default: false },
      skill,
    ],
  },
  {
    slug: "lawn-tennis",
    name: "Lawn Tennis",
    short: "Tennis",
    tagline: "Serve first. Ask questions later.",
    description: "Singles or doubles on hard, clay or grass. Set your scoring and book a court in one flow.",
    image: "/images/lawn-tennis.jpg",
    tint: "var(--c-lawn-tennis)",
    modes: ["individual", "group"],
    venueTypes: ["Hard court", "Clay court", "Grass court"],
    activePlayers: 3480,
    openRequests: 83,
    settings: [
      { id: "format", label: "Format", type: "segmented", options: ["Singles", "Doubles"], default: "Singles" },
      { id: "sets", label: "Sets", type: "segmented", options: ["Best of 1", "Best of 3", "Best of 5"], default: "Best of 3" },
      { id: "tiebreak", label: "Tie-break at 6–6", type: "toggle", default: true },
      { id: "surface", label: "Preferred surface", type: "select", options: ["Any", "Hard", "Clay", "Grass"], default: "Any" },
      skill,
    ],
  },
  {
    slug: "volleyball",
    name: "Volleyball",
    short: "Beach & court",
    tagline: "Bump. Set. Settle it.",
    description: "Beach doubles and six-a-side court matches. Rally scoring, your set count.",
    image: "/images/volleyball.jpg",
    tint: "var(--c-volleyball)",
    modes: ["group"],
    venueTypes: ["Beach court", "Outdoor court"],
    activePlayers: 2760,
    openRequests: 64,
    settings: [
      { id: "format", label: "Format", type: "segmented", options: ["Beach 2v2", "4v4", "6v6"], default: "Beach 2v2" },
      { id: "sets", label: "Best of", type: "segmented", options: ["3", "5"], default: "3" },
      { id: "points", label: "Points per set", type: "segmented", options: ["15", "21", "25"], default: "21" },
      skill,
    ],
  },
  {
    slug: "badminton",
    name: "Badminton",
    short: "Shuttle",
    tagline: "Fast feet, faster smashes.",
    description: "Garden games and club-level rallies. Singles, doubles or mixed — you call it.",
    image: "/images/badminton.jpg",
    tint: "var(--c-badminton)",
    modes: ["individual", "group"],
    venueTypes: ["Outdoor court", "Hall"],
    activePlayers: 2190,
    openRequests: 52,
    settings: [
      { id: "format", label: "Format", type: "segmented", options: ["Singles", "Doubles", "Mixed"], default: "Singles" },
      { id: "games", label: "Best of", type: "segmented", options: ["1", "3"], default: "3" },
      { id: "shuttle", label: "Shuttle type", type: "select", options: ["Feather", "Nylon"], default: "Nylon" },
      skill,
    ],
  },
  {
    slug: "chess",
    name: "Chess",
    short: "Park chess",
    tagline: "Every move in the open air.",
    description: "Blitz in the park or a slow classical battle. Set the clock and meet over the board.",
    image: "/images/chess.jpg",
    tint: "var(--c-chess)",
    modes: ["individual", "group"],
    venueTypes: ["Park table", "Café", "Club"],
    activePlayers: 5030,
    openRequests: 119,
    settings: [
      { id: "control", label: "Time control", type: "segmented", options: ["Bullet 1+0", "Blitz 5+3", "Rapid 15+10", "Classical"], default: "Blitz 5+3" },
      { id: "games", label: "Number of games", type: "number", min: 1, max: 10, default: 3 },
      { id: "colors", label: "Alternate colours", type: "toggle", default: true },
      skill,
    ],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
