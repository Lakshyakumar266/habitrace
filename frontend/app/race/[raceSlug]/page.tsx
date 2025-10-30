"use server";
import { notFound } from "next/navigation";
import axios from "axios";
import { RacePage } from "@/components/racePage/race-component";
import { LeaderboardEntry, RaceSchema } from "@/utils/types";
import { BACKEND_URL } from "@/config";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface PageProps {
  params: Promise<{
    raceSlug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { raceSlug } = await params;
  const cookieStore = await cookies();

  try {
    const raceResponse = async () => {
      if (cookieStore.get("token")) {
        const cookie = cookieStore.get("token")?.value;
        if (cookie) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const uuid = (jwt.decode(cookie) as any)?.uuid;
          return await axios.get(`${BACKEND_URL}api/v1/race/${raceSlug}?uuid=${uuid}`);
        }
      }
      return await axios.get(`${BACKEND_URL}api/v1/race/${raceSlug}`);
    };

    const leaderboardResponse = async () => {
      return await axios.get(
        `${BACKEND_URL}api/v1/race/leaderboard?race=${raceSlug}`
      );
    };

    const leaderboardData: LeaderboardEntry[] = (await leaderboardResponse())
      .data.data;

    const raceData: RaceSchema = (await raceResponse()).data.data;

    return <RacePage raceData={raceData} leaderboardData={leaderboardData} />;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 404) {
      notFound();
    }
    // Handle other errors or re-throw
    throw error;
  }
}
