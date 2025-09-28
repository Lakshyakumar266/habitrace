"use client";

import RaceCardHub from "@/components/shadcn-studio/card/card-11";
import axios from "axios";
import { useEffect, useState } from "react";

type Card = {
  id: number;
  name: string;
  description: string;
  raceSlug: string;
  startDate: string;
  endDate: string;
  frequency: string;
  createdBy: string;
};

export default function Page() {
  const [cards, setCards] = useState<Card[]>([]);
  useEffect(() => {
    axios.get("http://localhost:3001/api/v1/race/").then((response) => {
      console.log(response.data.data);

      setCards(response.data.data);
    });
  }, []);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="">
        {cards.length === 0 ? (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Welcome to Habit Race</h1>
            <p className="text-muted-foreground/70">
              A place to track your habits and progress
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2  gap-4 justify-items-center">
            {cards.map((card) => (
              <RaceCardHub
                key={card.id}
                className="w-80"
                title={card.name}
                description={card.description}
                sDate={card.startDate}
                eDate={card.endDate}
                link={card.raceSlug}
                frequency={card.frequency}
                createdBy={card.createdBy}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
