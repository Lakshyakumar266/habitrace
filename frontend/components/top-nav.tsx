"use client";

import Link from "next/link";
import { Bell, Moon, PlusSquare, Search, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import localFont from "next/font/local";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { decode, JwtPayload } from "jsonwebtoken";
import ThemeSwitch from "./themeswitch";

interface userSchema extends JwtPayload {
  uuid: string;
  username: string;
}
const harmoneFont = localFont({
  src: "../assets/fonts/harmone/harmone.ttf",
  weight: "400",
});

export default function TopNav() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [Logdin, setLogdin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [User, setUser] = useState<userSchema>({} as userSchema);
  useEffect(() => {
    const user = Cookies.get("token");
    const decodedToken = decode(String(user));
    let decoded;
    if (typeof decodedToken === "string") {
      decoded = JSON.parse(decodedToken);
    } else if (decodedToken && typeof decodedToken === "object") {
      decoded = decodedToken;
    }
    setUser(decoded);
    setLogdin(!!user);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Clear client-side storage
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to login page
        router.push("/login");
        // router.refresh(); // Refresh to update middleware
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with query parameter
      router.push(
        `/race/search?query=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <header
      className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/hub" className="font-semibold tracking-tight">
            <span className={`text-pretty ${harmoneFont.className} text-2xl`}>
              HabitRace
            </span>
            <span className="sr-only">Go to homepage</span>
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-center px-4 md:flex">
          <div className="flex w-full max-w-md items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
            <Search
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={handleKeyPress}
              aria-label="Search"
              placeholder="Search"
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-1">

          <ThemeSwitch />

          {Logdin ? (
            <>
              <Link href="/race/create-race" className="cursor-pointer">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Create"
                  className="cursor-pointer"
                >
                  <PlusSquare className="h-5 w-5" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="hidden sm:inline-flex"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="ml-1 inline-flex items-center rounded-full outline-none ring-0"
                    aria-label="Open profile menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/diverse-avatars.png"
                        alt="Your profile picture"
                      />
                      <AvatarFallback>{"LK"}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${User.username}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button onClick={handleLogout}>Log out</button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open profile menu"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
