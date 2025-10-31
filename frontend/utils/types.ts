interface Participant {
  id: string;
  userId: string;
  raceId: string;
  joined: boolean;
  joinedAt: string;
}

export enum Frequency {
  DAILY ="DAILY",
  WEEKLY="WEEKLY",
  MONTHLY="MONTHLY",
}

export interface CreateRaceSchema {
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  frequency: Frequency;
}

export interface RaceSchema {
  id: string;
  raceSlug: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  frequency: string;
  participantCount: number;
  createdBy: {username: string};
  participants?: Participant[];
  isJoined: boolean;
}

export interface LeaderboardEntry {
  position: number;
  name: string;
  streak: number;
}

export interface RaceCardHubProps {
  className?: string;
  title: string;
  description?: string;
  sDate: string;
  eDate: string;
  link: string;
  frequency: string;
  createdBy?: string;
}


interface ProfileRace {
  id: string;
  name: string;
  date: string;
  position: number;
  time: string;
}

export interface ProfileBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedDate: string;
}


export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}


export interface UserProfile {
  username: string;
  fullName: string;
  profileImage: string;
  bannerImage: string;
  bannerUrl: string;
  profilePicUrl: string;
  email: string;
  joinedDate: string;
  currentStreak: number;
  joinedRaces: ProfileRace[];
  completedRaces: ProfileRace[];
  badges: ProfileBadge[];
  location: string;
  socialLinks: SocialLink[];
  isOwner: boolean;
}