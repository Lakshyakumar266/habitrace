import type React from "react";
import "../globals.css";
import TopNav from "@/components/top-nav";
import SideNav from "@/components/side-nav";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Suspense fallback={<div>Loading...</div>}>
          <TopNav />
          <div className="mx-auto flex w-full max-w-screen-2xl">
            <SideNav />
            <div className="flex-1">{children}</div>
          </div>
        </Suspense>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
