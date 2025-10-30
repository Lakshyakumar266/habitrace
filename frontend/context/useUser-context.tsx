// contexts/UserContext.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";
import { decode } from "jsonwebtoken";
interface User {
  uuid: string;
  username: string;
  // other user fields
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    // Decode token to get user info (client-side)
    try {
      const payload = Cookies.get("token");
      const decodedToken = decode(String(payload));
      let decoded;
      if (typeof decodedToken === "string") {
        decoded = JSON.parse(decodedToken);
      } else if (decodedToken && typeof decodedToken === "object") {
        decoded = decodedToken;
      }
      setUser(decoded);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
    setIsLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
