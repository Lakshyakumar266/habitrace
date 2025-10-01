"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Trophy, Zap, User } from "lucide-react";
import { format } from "date-fns";
import { RaceSchema } from "@/utils/types";

/*
TODO:
down there, also add the leaderboard table 
showing the name, streak, and position. that will come from different api call so by default keep it empty
*/

export function RacePage({ raceData }: { raceData: object }) {
  const [joining, setJoining] = useState(false);

  const race = raceData as RaceSchema;

  function handleJoinRace() {
    setJoining(true);
    setTimeout(() => {
      alert("Race joined successfully!");
      setJoining(false);
    }, 1000);
  }

  const startDate = new Date(race.startDate);
  const endDate = new Date(race.endDate);
  const now = new Date();
  const isUpcoming = startDate > now;
  const isActive = startDate <= now && endDate >= now;
  const isEnded = endDate < now;

  const durationDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {isUpcoming && (
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800 text-sm px-3 py-1">
                    Starting Soon
                  </Badge>
                )}
                {isActive && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800 text-sm px-3 py-1">
                    Active Now
                  </Badge>
                )}
                {isEnded && (
                  <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 text-sm px-3 py-1">
                    Completed
                  </Badge>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{race.participantCount} participants</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>by @{race.createdBy.username}</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 dark:from-orange-400 dark:via-orange-300 dark:to-amber-300 bg-clip-text text-transparent leading-tight">
                {race.name}
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                {race.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Start Date
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {format(startDate, "MMM d")}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {format(startDate, "yyyy")}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Duration
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {durationDays}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Days
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Zap className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Frequency
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 capitalize">
                  {race.frequency.toLowerCase()}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Check-ins
                </p>
              </div>
            </div>

            <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  What You&apos;ll Achieve
                </h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 flex-shrink-0" />
                    <span>
                      Build consistent habits through daily accountability
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 flex-shrink-0" />
                    <span>
                      Track your progress with detailed metrics and insights
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 flex-shrink-0" />
                    <span>
                      Join a community of motivated individuals on the same
                      journey
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 flex-shrink-0" />
                    <span>
                      Earn badges and achievements for your dedication
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 lg:sticky lg:top-8">
            <Card className="border-2 border-orange-500 dark:border-orange-400 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 dark:from-orange-500 dark:via-orange-400 dark:to-amber-400 p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 dark:bg-white/30 mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isUpcoming && "Join the Challenge"}
                  {isActive && "Start Racing Today"}
                  {isEnded && "Challenge Completed"}
                </h2>
                <p className="text-white/90 text-sm mb-6">
                  {isUpcoming && `Starts ${format(startDate, "MMMM d, yyyy")}`}
                  {isActive && "Race is live now"}
                  {isEnded && "See you in the next race"}
                </p>

                <Button
                  size="lg"
                  onClick={handleJoinRace}
                  disabled={joining || isEnded}
                  className="w-full text-lg px-8 py-6 h-auto bg-white text-orange-600 hover:bg-orange-50 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {joining ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600 mr-2" />
                      Joining...
                    </>
                  ) : isEnded ? (
                    "Race Ended"
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Join Race
                    </>
                  )}
                </Button>
              </div>

              <CardContent className="p-8 space-y-6 bg-white dark:bg-slate-900">
                <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800">
                  <p className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {race.participantCount}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Active Racers
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Created By
                    </span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      @{race.createdBy.username}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Start Date
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {format(startDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      End Date
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {format(endDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Commitment
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                      {race.frequency.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Total Days
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {durationDays} days
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    Free to join • No credit card required
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
