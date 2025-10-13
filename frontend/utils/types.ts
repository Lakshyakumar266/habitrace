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