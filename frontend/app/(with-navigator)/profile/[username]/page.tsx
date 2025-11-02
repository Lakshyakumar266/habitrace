"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { notFound, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Edit2, MessageCircle, Share2, MapPin } from "lucide-react";
import { formatIso8601ToFriendlyDate } from "@packfleet/datetime";
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
import { capitalizeFirstLetter } from "@/lib/utils";
import { useUser } from "@/context/useUser-context";
import { toast } from "sonner";
import Cookies from "js-cookie";


export default function ProfilePage() {
  const Params = useParams();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditSocialOpen, setIsEditSocialOpen] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const { user } = useUser();

  const username = Params?.username;

  useEffect(() => {
    if (!username) {
      setIsNotFound(true);
      return;
    }

    axios
      .get(`${BACKEND_URL}api/v1/user/${username}`)
      .then((response) => {
        const data = response.data.data;

        if (user?.username === data.username) {
          data.isOwner = true;
        } else {
          data.isOwner = false;
        }

        setUserData(data);
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setIsNotFound(true);
        }
      });
  }, [user, username]);

  if (isNotFound) {
    notFound();
  }
  if (!username || !userData) return null;

  const handleSaveProfile = async (updatedData: Partial<UserProfile>) => {

    let isUsernameChange = false;

    setUserData((prev) => ({ ...prev!, ...updatedData }));
    const { username, fullName, bannerUrl, profilePicUrl } = updatedData;

    const profileUpdateData: {
      pic?: string;
      banner?: string;
      fullName?: string;
      username?: string;
    } = {};

    // Checking and updateing only changed fields
    if (profilePicUrl !== "") {
      if (userData.profilePicUrl !== userData.profileImage) {
        profileUpdateData.pic = profilePicUrl;
      }
    }
    if (bannerUrl !== "") {
      if (bannerUrl !== userData.bannerImage) {
        profileUpdateData.banner = bannerUrl;
      }
    }
    if (fullName !== userData.fullName) {
      profileUpdateData.fullName = fullName;
    }
    if (username !== userData.username) {
      isUsernameChange = true;

      profileUpdateData.username = username;
    }

    try {
      const response = await axios.patch(
        `${BACKEND_URL}api/v1/user/${user?.username}/update`,
        profileUpdateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (response.status === 200 && response.data.success) {
        toast.success("Profile updated successfully");

        if (isUsernameChange) {
          window.location.href = `/api/auth/logout`;
        }
      } else {
        toast.success("Failed to update profile! Try again later.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Unauthorized");
        }
      } else {
        console.log(error);
        throw new Error("An unexpected error occurred");
      }
      toast.error("Failed to update profile! Try again later.");
      console.error("Error updating profile", error);
    }

    setIsEditModalOpen(false);
  };

  const handleSaveSocial = (updatedLinks: SocialLink[]) => {
    setUserData((prev) => ({ ...prev!, socialLinks: updatedLinks }));

    setIsEditSocialOpen(false);
  };
  const handleShareSocial = async () => {
    const profileUrl = `${window.location.origin}/profile/${userData.username}`;

    // Create share text based on user's stats
    const achievements =
      userData.currentStreak >= 30
        ? "Elite Runner"
        : userData.currentStreak >= 15
        ? "Advanced Runner"
        : userData.currentStreak >= 7
        ? "Intermediate Runner"
        : userData.currentStreak >= 1
        ? "Biggner Runner"
        : "Noob Runner";

    const shareText =
      `🏃 Check out ${userData.fullName}'s running journey!\n\n` +
      `🔥 ${userData.currentStreak} day streak\n` +
      `🏅 ${achievements}\n` +
      `🎯 ${userData.completedRaces.length} races completed\n\n` +
      `Join them on Habitrace:`;

    try {
      if (navigator.share) {
        const shareData = {
          title: `${userData.fullName}'s Profile on Habitrace`,
          text: shareText,
          url: profileUrl,
        };
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        // For X's web intent
        const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(profileUrl)}`;
        window.open(twitterShareUrl, "_blank");
        toast.success("Opening X to share...");
      }
    } catch (error) {
      // Only show error if it's not a user cancellation
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share profile");
      }
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="relative">
        {/* Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          <Image
          priority
            src={
              userData.bannerImage === ""
                ? "/profile/banner/randome-2.jpeg"
                : userData.bannerImage
            }
            alt="banner"
            fill
            className="object-center"
          />
          {/* dark overlay to make foreground dominate */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
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
                  {capitalizeFirstLetter(userData.fullName)}
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  {userData.location.toUpperCase()}
                </p>
                <p className="text-sm text-foreground mt-2">
                  <span className="font-semibold text-base">
                    @{userData.username}
                  </span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className=" text-orange-500 font-mono">
                    {userData.currentStreak >= 30
                      ? "Elite Runner"
                      : userData.currentStreak >= 15
                      ? "Advanced Runner"
                      : userData.currentStreak >= 7
                      ? "Intermediate Runner"
                      : userData.currentStreak >= 1
                      ? "Biggner Runner"
                      : "Noob Runner"}
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
              <Button className="gap-2" onClick={handleShareSocial}>
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
                  <p className="text-foreground mt-1">
                    {formatIso8601ToFriendlyDate(
                      userData.joinedDate,
                      "America/Chicago"
                    )}
                  </p>
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
