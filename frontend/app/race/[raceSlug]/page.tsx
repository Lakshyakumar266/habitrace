"use server";
import { notFound } from "next/navigation";
import axios from "axios";
import { RacePage } from "@/components/racePage/race-component";
import { LeaderboardEntry, RaceSchema } from "@/utils/types";
import { BACKEND_URL } from "@/config";

interface PageProps {
  params: Promise<{
    raceSlug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { raceSlug } = await params;
  try {
    const raceResponse = async () => {
      return await axios.get(`${BACKEND_URL}api/v1/race/${raceSlug}`);
    };

    const leaderboardResponse = async () => {
      return await axios.get(
        `${BACKEND_URL}api/v1/race/${raceSlug}/leaderboard`
      );
    };

    const leaderboardData: LeaderboardEntry[] = (await leaderboardResponse())
      .data.data;

    let raceData: RaceSchema = (await raceResponse()).data.data;
    raceData = {
      ...raceData,
      participantCount: raceData.participants?.length ?? 0,
    };

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
