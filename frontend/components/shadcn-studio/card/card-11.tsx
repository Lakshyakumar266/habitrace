"use client";

import { useState } from "react";

import {
  BadgeCheckIcon,
  HeartIcon,
  Globe,
  Share2,
  CirclePlus,
} from "lucide-react";

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

interface RaceCardHubProps {
  className?: string;
  title?: string;
  description?: string;
  sDate?: string;
  eDate?: string;
  link?: string;
  frequency?: string;
  createdBy?: string;
}

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
  const [liked, setLiked] = useState<boolean>(true);

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <CardTitle className="flex items-center gap-1 text-sm">
              {String(title).toUpperCase()}{" "}
              <BadgeCheckIcon className="size-4 fill-sky-600 stroke-white dark:fill-sky-400" />
            </CardTitle>
            <span className="text-xs text-muted-foreground/70">
              {convertDate(sDate)} - {convertDate(eDate)}
            </span>{" "}
            <CardDescription>
              @{createdBy?.replaceAll(" ", "_")}
            </CardDescription>
          </div>
        </div>
        <Link href={`/race/${link}`}>
        <Button variant="outline" size="sm">
          <CirclePlus className="size-4" />
          Race
        </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
        <p>
          {description ? (
            description
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
        <Button variant="ghost" size="sm">
          <Share2 className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RaceCardHub;
