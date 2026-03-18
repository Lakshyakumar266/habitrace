"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-white dark:from-purple-950 dark:via-gray-950 dark:to-gray-950 flex items-center justify-center px-6">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-10 text-center md:text-left animate-fadeIn">
          {/* 🖼️ Illustration */}
          <div className="flex-shrink-0">
            <Image
              src="/404-page-notfound.svg"
              alt="Page not found"
              width={345}
              height={345}
              className="drop-shadow-md rounded"
            />
          </div>

          {/* 📝 Text Section */}
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
              Oops! Wrong Route 🚧
            </h1>

            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Looks like you’ve taken a turn into unknown territory. This page
              doesn’t exist or the route is broken.
            </p>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all px-6 py-2.5 rounded-full shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Home
              <Compass className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
