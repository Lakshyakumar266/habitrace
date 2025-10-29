import { Button } from "@/components/ui/button"
import type React from "react"

interface SocialLink {
  platform: string
  url: string
  icon: React.ReactNode
}

interface SocialLinksProps {
  links: SocialLink[]
}

export default function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            {link.icon}
            {link.platform}
          </Button>
        </a>
      ))}
    </div>
  )
}
