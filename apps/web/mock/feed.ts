import type { FeedPost } from "@/types";

export const FEED_POSTS: FeedPost[] = [
  {
    id: "f-001",
    authorId: "u-001",
    authorName: "Kemi Onabanjo",
    initials: "KO",
    community: "art",
    body: 'Mon exposition "Ancestral Futures" ouvre ses portes demain à l\'AFF 2026. Six toiles numériques qui dialoguent entre mémoire collective africaine et imaginaire futuriste. C\'est le résultat de 3 ans de recherche et de création. Je suis impatient de vous y retrouver. 🖤✨',
    flags: ["NG"],
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    reactions: [
      { emoji: "❤️", count: 47 },
      { emoji: "👏", count: 23 },
      { emoji: "🔥", count: 18 },
      { emoji: "🎉", count: 9 },
    ],
    comments: 14,
    shares: 7,
  },
  {
    id: "f-002",
    authorId: "u-002",
    authorName: "Tolani Adeyemi",
    initials: "TA",
    community: "musique",
    body: 'Nouveau son disponible ! "Lagos Nights" — une fusion afrobeats / jazz qui raconte la vie nocturne de Lagos. Produit entièrement avec des instruments traditionnels réenregistrés. Stream en écoute libre pendant le festival. 🎵',
    flags: ["NG"],
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    reactions: [
      { emoji: "❤️", count: 89 },
      { emoji: "🔥", count: 62 },
      { emoji: "👏", count: 45 },
    ],
    comments: 28,
    shares: 19,
  },
  {
    id: "f-003",
    authorId: "u-003",
    authorName: "Maïmouna Doucouré",
    initials: "MD",
    community: "cinema",
    body: 'Notre court-métrage "Bintou" a remporté le Prix Spécial du Jury à Cannes cette semaine. Cette reconnaissance internationale renforce ma conviction : les histoires africaines méritent d\'être racontées par nous, avec notre sensibilité. Merci à toute l\'équipe. 🎬',
    flags: ["CI"],
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    reactions: [
      { emoji: "❤️", count: 215 },
      { emoji: "🔥", count: 87 },
    ],
    comments: 34,
    shares: 28,
  },
];

export const TRENDING: { tag: string; count: number }[] = [
  { tag: "#AFF2026", count: 312 },
  { tag: "#CinémaAfricain", count: 247 },
  { tag: "#AfroBeats", count: 189 },
  { tag: "#Abidjan2026", count: 143 },
  { tag: "#ModeAfricaine", count: 98 },
  { tag: "#UbuntuDance", count: 76 },
];

export const ACTIVE_MEMBERS: { id: string; name: string; initials: string; community: string }[] = [
  { id: "u-001", name: "Kemi O.", initials: "KO", community: "Art" },
  { id: "u-002", name: "Tolani A.", initials: "TA", community: "Musique" },
  { id: "u-003", name: "Maïmouna D.", initials: "MD", community: "Cinéma" },
  { id: "u-004", name: "Imane A.", initials: "IA", community: "Mode" },
];
