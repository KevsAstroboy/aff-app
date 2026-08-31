export type CommunityId =
  | "art"
  | "musique"
  | "cinema"
  | "mode"
  | "danse"
  | "litterature"
  | "gastronomie";

export type CountryCode =
  | "CI"
  | "NG"
  | "GH"
  | "SN"
  | "KE"
  | "ZA"
  | "MA"
  | "EG"
  | "ET"
  | "TZ"
  | "CM"
  | "CD"
  | "FR"
  | "US"
  | "GB"
  | "CA";

export type UserStatus = "active" | "waiting" | "suspended";

export type User = {
  id: string;
  name: string;
  initials: string;
  email: string;
  community: CommunityId;
  role: string;
  country: CountryCode;
  status: UserStatus;
  createdAt: string;
  avatarColor?: string;
};

export type Masterclass = {
  id: string;
  title: string;
  expert: string;
  community: CommunityId;
  date: string;
  durationMin: number;
  participants: number;
  capacity: number;
  status: "live" | "pending" | "terminated" | "cancelled";
  mode?: string;
  lieu?: string;
  description?: string;
  meetingUrl?: string;
  isInscrit?: boolean;
  evenement_id?: number | null;
};

export type Communaute = {
  id: CommunityId;
  name: string;
  description: string;
  members: number;
  publications: number;
  status: "active" | "inactive";
  createdAt: string;
};

export type Publication = {
  id: string;
  authorId: string;
  authorName: string;
  community: CommunityId;
  body: string;
  status: "published" | "pending" | "rejected";
  reactions: number;
  comments: number;
  createdAt: string;
};

export type FeedPost = {
  id: string;
  authorId: string;
  authorName: string;
  initials: string;
  authorAvatar?: string | null;
  community: CommunityId;
  body: string;
  flags: CountryCode[];
  createdAt: string;
  reactions: { emoji: string; count: number }[];
  comments: number;
  shares: number;
};

export type ProgrammeEvent = {
  id: string;
  day?: string;
  dayLabel?: string;
  startTime: string;
  endTime: string;
  title: string;
  expert?: string;
  venue: string;
  description?: string;
  lieu_id?: number;
  communaute_id?: number;
  isHot?: boolean;
  category?: string;
  jour?: "samedi" | "dimanche" | string;
  libelle?: string;
  start_time?: string;
  end_time?: string;
  is_favori?: boolean;
  isFavori?: boolean;
};

export type AwardCategory = {
  id: string;
  name: string;
  section: string;
  isGrandPrix?: boolean;
};

export type Signalement = {
  id: string;
  type: "publication" | "commentaire" | "utilisateur";
  severity: "low" | "medium" | "high";
  status: "open" | "resolved" | "closed";
  subject: string;
  reportedBy: string;
  reason: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  name: string;
  initials: string;
  avatar?: string | null;
  isGroup: boolean;
  memberCount: number;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
};

export type Message = {
  id: string;
  conversationId: string;
  authorId: string;
  authorName: string;
  body: string;
  sentAt: string;
  isMine: boolean;
};

export type CommentStatus = "approved" | "pending" | "hidden";

export type Comment = {
  id: string;
  authorId: string;
  authorName: string;
  initials: string;
  authorAvatar?: string | null;
  body: string;
  parentPublicationId: string;
  parentPublicationTitle: string;
  status: CommentStatus;
  country: CountryCode;
  createdAt: string;
  replies?: Comment[];
};

export type KPIDelta = {
  value: number;
  isPositive: boolean;
  suffix?: string;
};

export type DashboardKPI = {
  label: string;
  value: number;
  delta?: KPIDelta;
  icon: "users" | "masterclass" | "publication" | "report";
};

export type ActivityItem = {
  id: string;
  icon: "user" | "masterclass" | "report" | "publication" | "resolve" | "community";
  message: string;
  createdAt: string;
};

export type CurrentUser = {
  id: string;
  name: string;
  initials: string;
  role: string;
  country: CountryCode;
  isAdmin: boolean;
};
