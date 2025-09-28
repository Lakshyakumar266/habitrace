"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/hub");
  }, [router]);
  return (
    <>
      <h1 className="flex justify-center items-center text-3xl font-bold">
        HabitRace
      </h1>
    </>
  );
}
