"use server";
import { notFound } from "next/navigation";
import axios from "axios";

type Race = {
  id: number;
  name: string;
  description: string;
  raceSlug: string;
  startDate: string;
  endDate: string;
  frequency: string;
  createdBy: {
    username: string;
  };
};

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

    const raceData: Race = response.data.data;
    return (
      <div>
        <h1>{raceData.name}</h1>
        {/* Your page content */}
      </div>
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 404) {
      notFound();
    }
    // Handle other errors or re-throw
    throw error;
  }
}
