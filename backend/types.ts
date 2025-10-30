import z from "zod";


export const CreateUser = z.object({
    username: z.string(),
    email: z.email(),
    fullname: z.string(),
    password: z.string(),
    pic: z.string().optional(),
    banner: z.string().optional(),
    locatin: z.string().optional(),

})

export interface UserSchema {
    uuid: string,
    username: string,
    email: string,
    fullname: string,
}

export const CreateRace = z.object({
    name: z.string(),
    description: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
})

export interface Leaderboard {
    username:string,
    streak:number,
}

export interface ProfileRace {
  id: string;
  name: string;
  date: string;
  position: number;
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
  email: string;
  joinedDate: Date;
  currentStreak: number;
  joinedRaces: ProfileRace[];
  completedRaces: ProfileRace[];
  badges: ProfileBadge[];
  location?: string;
  socialLinks: SocialLink[];
}