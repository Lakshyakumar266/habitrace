"use client"

import type React from "react"

import Link from "next/link"
import { Home, Search, Compass, Film, MessageCircle, Heart, PlusSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"

type Item = {
  href: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const items: Item[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/reels", label: "Reels", icon: Film },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/notifications", label: "Notifications", icon: Heart },
  { href: "/create", label: "Create", icon: PlusSquare },
  { href: "/profile", label: "Profile", icon: User },
]

export default function SideNav({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Primary"
      className={cn(
        "sticky top-16 hidden h-[calc(100vh-4rem)] w-16 flex-col border-r bg-sidebar text-sidebar-foreground md:flex lg:w-56",
        className,
      )}
    >
      <ul className="flex flex-1 flex-col gap-1 p-2">
        {items.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              )}
              title={label}
              aria-label={label}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="hidden truncate lg:inline">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="p-2">
        <Link
          href="/more"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          title="More"
          aria-label="More"
        >
          <span className="h-5 w-5 shrink-0 rounded-sm border" aria-hidden="true" />
          <span className="hidden lg:inline">More</span>
        </Link>
      </div>
    </nav>
  )
}
