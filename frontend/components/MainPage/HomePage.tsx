import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Link from "next/link";
import React from "react";

const Hero01 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-3xl">
        <Badge
          variant="secondary"
          className="rounded-full py-1 border-border"
          asChild
        >
          <Link href="#">
            Just released v1.0.0 <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Badge>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter">
          Compete. Build Habits. Win the Race.
        </h1>
        <p className="mt-6 md:text-lg dark:text-muted-foreground/90">
          Join global habit races, track streaks, and challenge friends to stay
          consistent. Check in daily, weekly, or monthly.{" "}
          <span className="text-[#FAB12F]">
            your streak decides your rank. 🚀
          </span>
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Link href={"/hub"}>
            <Button size="lg" className="rounded-full text-base">
              Start Racing <ArrowUpRight className="size-5" />
            </Button>
          </Link>
          <Link href={"/hub"}>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
            >
              <CirclePlay className="size-5" /> View Leaderboards
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero01;
