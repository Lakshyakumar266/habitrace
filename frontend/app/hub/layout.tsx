import type React from "react";
import "../globals.css";
import TopNav from "@/components/top-nav";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import SideNav from "@/components/side-nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Spinner className="size-8" />
          </div>
        }
      >
          <TopNav />
          <SideNav className="fixed"/>
        <div className="flex">
          <div className="mx-auto flex w-full max-w-screen-2xl">
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </Suspense>
      {/* <Analytics /> */}
    </>
  );
}
