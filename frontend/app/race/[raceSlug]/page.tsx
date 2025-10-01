"use server";
import { notFound } from "next/navigation";
import axios from "axios";
import { RacePage } from "@/components/racePage/race-component";
import { RaceSchema } from "@/utils/types";

interface PageProps {
  params: Promise<{
    raceSlug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { raceSlug } = await params;
  try {
    const raceUrl = await `http://localhost:3001/api/v1/race/${raceSlug}`;
    const response = await axios.get(raceUrl);

    let raceData: RaceSchema = response.data.data;

    raceData = {
      ...raceData,
      participantCount: raceData.participants?.length ?? 0,
    };

    return <RacePage raceData={raceData} />;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 404) {
      notFound();
    }
    // Handle other errors or re-throw
    throw error;
  }
}
