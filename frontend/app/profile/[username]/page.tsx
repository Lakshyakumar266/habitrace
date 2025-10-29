"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { notFound, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Edit2,
  MessageCircle,
  Share2,
  X,
  Github,
  Instagram,
  Linkedin,
} from "lucide-react";
import RacesList from "@/components/profile/races-list";
import StreakCounter from "@/components/profile/streak-counter";
import EditProfileModal from "@/components/profile/edit-profile-modal";
import BadgesDisplay from "@/components/profile/badges-display";
import SocialLinks from "@/components/profile/social-links";
import EditSocialModal from "@/components/profile/edit-social-modal";
import Image from "next/image";
import { SocialLink, UserProfile } from "@/utils/types";
import axios from "axios";
import { BACKEND_URL } from "@/config";

// Mock data - replace with actual API call
const mockUserData: UserProfile = {
  username: "alex_runner",
  fullName: "Alex Johnson",
  profileImage:
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  bannerImage:
    "https://i.pinimg.com/originals/5f/f4/58/5ff45883d083027e28142ce6fc48659d.gif",
  email: "alex@example.com",
  joinedDate: "January 2024",
  location: "San Francisco, USA",
  currentStreak: 12,
  joinedRaces: [
    {
      id: "1",
      name: "Spring Marathon 2025",
      date: "March 15, 2025",
      position: 3,
      time: "2:45:32",
    },
    {
      id: "2",
      name: "City 10K Challenge",
      date: "February 28, 2025",
      position: 1,
      time: "35:12",
    },
    {
      id: "3",
      name: "Winter Half Marathon",
      date: "January 20, 2025",
      position: 5,
      time: "1:32:45",
    },
    {
      id: "4",
      name: "New Year 5K Sprint",
      date: "January 1, 2025",
      position: 2,
      time: "18:23",
    },
  ],
  completedRaces: [
    {
      id: "5",
      name: "Spring Marathon 2025",
      date: "March 15, 2025",
      position: 3,
      time: "2:45:32",
    },
    {
      id: "6",
      name: "City 10K Challenge",
      date: "February 28, 2025",
      position: 1,
      time: "35:12",
    },
    {
      id: "7",
      name: "Winter Half Marathon",
      date: "January 20, 2025",
      position: 5,
      time: "1:32:45",
    },
  ],
  badges: [
    {
      id: "1",
      name: "First Race",
      icon: "🏁",
      description: "Completed your first race",
      unlockedDate: "January 1, 2025",
    },
    {
      id: "2",
      name: "Speed Demon",
      icon: "⚡",
      description: "Finished in top 3 positions 5 times",
      unlockedDate: "February 15, 2025",
    },
    {
      id: "3",
      name: "Marathon Master",
      icon: "🏆",
      description: "Completed 3 marathons",
      unlockedDate: "March 10, 2025",
    },
    {
      id: "4",
      name: "Consistency King",
      icon: "🔥",
      description: "Maintained a 10-day streak",
      unlockedDate: "March 20, 2025",
    },
  ],
  socialLinks: [
    {
      platform: "X",
      url: "https://x.com/alexrunner",
      icon: <X className="h-5 w-5" />,
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/alexrunner",
      icon: <Instagram className="h-5 w-5" />,
    },
    {
      platform: "GitHub",
      url: "https://github.com/alexrunner",
      icon: <Github className="h-5 w-5" />,
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/alexrunner",
      icon: <Linkedin className="h-5 w-5" />,
    },
  ],
  isOwner: true,
};

export default function ProfilePage() {
  const Params = useParams();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditSocialOpen, setIsEditSocialOpen] = useState(false);
  const [userData, setUserData] = useState<UserProfile>(mockUserData);

  const username = Params?.username;

  useEffect(() => {
    axios.get(`${BACKEND_URL}api/v1/user/${username}`).then((response) => {
      console.log(response.data);
    });
  }, [username]);

  if (!username) return notFound();

  const handleSaveProfile = (updatedData: Partial<UserProfile>) => {
    setUserData((prev) => ({ ...prev, ...updatedData }));
    setIsEditModalOpen(false);
  };

  const handleSaveSocial = (updatedLinks: SocialLink[]) => {
    setUserData((prev) => ({ ...prev, socialLinks: updatedLinks }));
    setIsEditSocialOpen(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="relative">
        {/* Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          <Image
            src={userData.bannerImage}
            alt="banner"
            fill
            className="object-cover object-center"
          />
          {/* dark overlay to make foreground dominate */}
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        </div>

        {/* Profile Section */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-24 mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            {/* Profile Avatar and Info */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
              <Avatar className="h-40 w-40 border-4 border-white shadow-lg">
                <AvatarImage
                  src={userData.profileImage || "/placeholder.svg"}
                  alt={userData.fullName}
                />
                <AvatarFallback>{userData.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="pb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {userData.fullName}
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  🇺🇸 {userData.location}
                </p>
                <p className="text-sm text-foreground mt-2">
                  <span className="font-semibold text-base">@{userData.username}</span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className=" text-orange-500 font-mono">
                    {userData.currentStreak >= 30
                      ? "Elite Runner"
                      : userData.currentStreak >= 15
                      ? "Advanced Runner"
                      : userData.currentStreak >= 7
                      ? "Intermediate Runner"
                      : "Beginner Runner"}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 self-start sm:self-auto">
              <Button variant="outline" className="gap-2 bg-transparent">
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
              <Button className="gap-2">
                <Share2 className="h-4 w-4" />
                Share Profile
              </Button>
              {userData.isOwner && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Social Links Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Social Links
                </h2>
                {userData.isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditSocialOpen(true)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <SocialLinks links={userData.socialLinks} />
            </section>

            {/* Stats Row */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="p-6 text-center border">
                <p className="text-sm font-semibold uppercase text-muted-foreground mb-2">
                  Races Joined
                </p>
                <p className="text-3xl font-bold text-primary">
                  {userData.joinedRaces.length}
                </p>
              </Card>
              <Card className="p-6 text-center border">
                <p className="text-sm font-semibold uppercase text-muted-foreground mb-2">
                  Races Completed
                </p>
                <p className="text-3xl font-bold text-primary">
                  {userData.completedRaces.length}
                </p>
              </Card>
              <StreakCounter streak={userData.currentStreak} />
            </div>

            {/* Races Joined */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Races Joined
              </h2>
              <RacesList races={userData.joinedRaces} />
            </section>

            {/* Races Completed */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Races Completed
              </h2>
              <RacesList races={userData.completedRaces} />
            </section>

            {/* Badges */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Achievements
              </h2>
              <BadgesDisplay badges={userData.badges} />
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 border sticky top-4">
              <h3 className="font-semibold text-foreground mb-4">
                Profile Info
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-semibold">
                    Email
                  </p>
                  <p className="text-foreground mt-1">{userData.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-semibold">
                    Member Since
                  </p>
                  <p className="text-foreground mt-1">{userData.joinedDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-semibold">
                    Current Streak
                  </p>
                  <p className="text-foreground mt-1 text-lg font-bold">
                    {userData.currentStreak} 🔥
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {userData.isOwner && (
        <>
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            userData={userData}
            onSave={handleSaveProfile}
          />
          <EditSocialModal
            isOpen={isEditSocialOpen}
            onClose={() => setIsEditSocialOpen(false)}
            socialLinks={userData.socialLinks}
            onSave={handleSaveSocial}
          />
        </>
      )}
    </main>
  );
}
