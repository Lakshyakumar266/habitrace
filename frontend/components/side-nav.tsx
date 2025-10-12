"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Target,
  TrendingUp,
  Users,
  History,
  Medal,
  Star,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import localFont from "next/font/local";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";

const harmoneFont = localFont({
  src: "../assets/fonts/harmone/harmone.ttf",
  weight: "400",
});
type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};
const mainItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/create-race", label: "Create Race", icon: Target },
  { href: "/leaderboard", label: "Leaderboard", icon: TrendingUp },
  { href: "/participants", label: "Participants", icon: Users },
  { href: "/race-history", label: "Race History", icon: History },
];

const myRaces: NavItem[] = [
  { href: "/team/design", label: "Design", icon: Medal },
  { href: "/team/security", label: "Security", icon: Star },
  { href: "/team/privacy", label: "Privacy", icon: Heart },
  { href: "/team/settings", label: "Settings", icon: Settings },
];

export default function SideNav({ className }: { className?: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeSidebar = () => setIsOpen(false);
    const { setTheme } = useTheme();


  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "left-0 top-0 z-40 h-screen w-64 border-r bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col",
          className
        )}
      >
        <div className="flex items-center gap-2 px-4 py-5 ">
          <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          <span className={`text-pretty ${harmoneFont.className} text-2xl`}>
            HabitRace
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {mainItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeSidebar}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 px-3">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              My Races
            </h3>
            <ul className="space-y-1">
              {myRaces.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeSidebar}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="border-t ">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Alex Smith" />
                <AvatarFallback className="bg-gray-300 text-gray-700">
                  AS
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Alex Smith
                </p>
                <p className="text-xs text-gray-500 truncate">
                  alex.smith@email.com
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <Link
                href="/preferences"
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors w-full"
                )}
              >
                <Settings className="h-4 w-4 shrink-0" />
                <span>Preferences</span>
              </Link>

              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}

              <button
                onClick={() => {
                  closeSidebar();
                  handleLogout();
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors w-full text-left"
                )}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
