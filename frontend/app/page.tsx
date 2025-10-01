"use client";

import Hero01 from "@/components/MainPage/HomePage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // router.push("/hub");
  }, [router]);
  return (
    <>
      <Hero01 />
    </>
  );
}
