import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Suspense } from "react";
import GradientText from "../GradientText";
import ForceDarkMode from "./forceDarkMode";

const Hyperspeed = dynamic(() => import("../Hyperspeed"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
});

const Hero01 = () => {
  return (
    <ForceDarkMode>
      <div
        className="relative min-h-screen"
        style={{ background: "url(./grid-2.png)" }}
      >
        {/* Hyperspeed Background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="w-full h-full bg-black" />}>
            <Hyperspeed
              effectOptions={{
                onSpeedUp: () => {},
                onSlowDown: () => {},
                distortion: "turbulentDistortion",
                length: 400,
                roadWidth: 15,
                islandWidth: 2,
                lanesPerRoad: 4,
                fov: 90,
                fovSpeedUp: 150,
                speedUp: 4,
                carLightsFade: 0.23,
                totalSideLightSticks: 20,
                lightPairsPerRoadWay: 40,
                shoulderLinesWidthPercentage: 0.05,
                brokenLinesWidthPercentage: 0.1,
                brokenLinesLengthPercentage: 0.5,
                lightStickWidth: [0.12, 0.5],
                lightStickHeight: [1.3, 1.7],
                movingAwaySpeed: [60, 80],
                movingCloserSpeed: [-120, -160],
                carLightsLength: [400 * 0.03, 400 * 0.2],
                carLightsRadius: [0.05, 0.14],
                carWidthPercentage: [0.3, 0.5],
                carShiftX: [-0.8, 0.8],
                carFloorSeparation: [0, 5],
                colors: {
                  roadColor: 0x080808,
                  islandColor: 0x0a0a0a,
                  background: 0x000000,
                  shoulderLines: 0xffffff,
                  brokenLines: 0xffffff,
                  leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                  rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                  sticks: 0x03b3c3,
                },
              }}
            />
          </Suspense>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-3xl p-4 rounded-3xl">
              <Badge
                variant="secondary"
                className="rounded-full py-1 border-border"
                asChild
              >
                <Link href="#" className="cursor-pointer">
                  Just released v1.0.0 <ArrowUpRight className="ml-1 size-4" />
                </Link>
              </Badge>
              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter text-white ">
                Compete. Build Habits. Win the Race.
              </h1>
              <div className="mt-6 md:text-lg font-bold dark:text-muted-foreground/90">
                <GradientText
                  colors={[
                    "#40ffaa",
                    "#4079ff",
                    "#40ffaa",
                    "#4079ff",
                    "#40ffaa",
                  ]}
                  animationSpeed={3}
                >
                  Join global habit races, track streaks, and challenge friends
                  to stay consistent. Check in daily, weekly, or monthly.{" "}
                  <span className="text-[#FAB12F]">
                    Your streak decides your rank. 🚀
                  </span>
                </GradientText>
              </div>
              <div className="mt-12 flex items-center justify-center gap-4">
                <Link href={"/login"}>
                  <Button
                    size="lg"
                    className="rounded-full text-base cursor-pointer"
                  >
                    Start Racing <ArrowUpRight className="size-5" />
                  </Button>
                </Link>
                <Link href={"/hub"}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full text-base shadow-lg cursor-pointer text-white bg-linear-60"
                  >
                    <CirclePlay className="size-5" /> View Leaderboards
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ForceDarkMode>
  );
};

export default Hero01;
