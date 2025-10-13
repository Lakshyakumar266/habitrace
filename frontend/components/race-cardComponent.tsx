"use client";

import { useState } from "react";

import { HeartIcon, Globe, CirclePlus, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import Link from "next/link";

import { RaceCardHubProps } from "@/utils/types";
import { handleShare } from "@/hooks/share-link";

const convertDate = (dateString: string | undefined) => {
  if (dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  }
  return "";
};

const RaceCardHub: React.FC<RaceCardHubProps> = ({
  className,
  title,
  description,
  sDate,
  eDate,
  link,
  frequency,
  createdBy,
}) => {
  const [liked, setLiked] = useState<boolean>(false);
  // const username =

  const shareData = {
    title: `🏁 ${title} | HabitRace`,
    text: `🔥 I'm joining the  ${title.toUpperCase()} race on HabitRace! \n🚀 Let’s build the habit, stay consistent 💪 and climb the leaderboard together 🏆\n Join me here 👉 ${
      window.location.origin
    }/race/${link}`,
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <CardTitle className="flex items-center gap-1 text-lg text-gray-950 text-shadow-amber-300 dark:text-[#FAB12F] dark:text-shadow-yellow-600 ">
              {String(title).toUpperCase()}{" "}
              {/* <BadgeCheckIcon className="size-4 fill-sky-600 stroke-white dark:fill-sky-400" /> */}
            </CardTitle>
            <span className="text-sm text-muted-foreground/70">
              {convertDate(sDate)} - {convertDate(eDate)}
            </span>{" "}
            <CardDescription className="text-md dark:text-[#BDE3C3]">
              @{createdBy?.replaceAll(" ", "_")}
            </CardDescription>
          </div>
        </div>
        <Link href={`/race/${link}`}>
          <Button variant="outline" size="sm" className="cursor-pointer">
            <CirclePlus className="size-4" />
            Race
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-6 text-md dark:text-gray-200">
        <p>
          {description ? (
            description.slice(0,250) + "..."
          ) : (
            <>
              its an race.{" "}
              <a href="#" className="text-sky-600 dark:text-sky-400">
                #race
              </a>{" "}
              <a href="#" className="text-sky-600 dark:text-sky-400">
                #{link}
              </a>{" "}
              <a href="#" className="text-sky-600 dark:text-sky-400">
                #{frequency}
              </a>{" "}
              <a href="#" className="text-sky-600 dark:text-sky-400">
                #{title}
              </a>
            </>
          )}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => setLiked(!liked)}>
          <HeartIcon
            className={cn(
              "size-4",
            liked && "fill-destructive stroke-destructive"
            )}
          />
        </Button>

        <Button variant="ghost" size="sm">
          <Globe className="size-4" />
          1.1K
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer"
          onClick={() => handleShare(shareData)}
        >
          <Share2 className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RaceCardHub;
