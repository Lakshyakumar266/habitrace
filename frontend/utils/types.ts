interface Participant {
  id: string;
  userId: string;
  raceId: string;
  joined: boolean;
  joinedAt: string;
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
}

export interface LeaderboardEntry {
  position: number;
  name: string;
  streak: number;
}

