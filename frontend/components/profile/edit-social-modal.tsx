"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface SocialLink {
  platform: string
  url: string
  icon: React.ReactNode
}

interface EditSocialModalProps {
  isOpen: boolean
  onClose: () => void
  socialLinks: SocialLink[]
  onSave: (links: SocialLink[]) => void
}

export default function EditSocialModal({ isOpen, onClose, socialLinks, onSave }: EditSocialModalProps) {
  const [links, setLinks] = useState<SocialLink[]>(socialLinks)

  const handleUpdateLink = (index: number, url: string) => {
    const updatedLinks = [...links]
    updatedLinks[index] = { ...updatedLinks[index], url }
    setLinks(updatedLinks)
  }

  const handleAddLink = () => {
    const newLink: SocialLink = {
      platform: "New Platform",
      url: "",
      icon: <X className="h-5 w-5" />,
    }
    setLinks([...links, newLink])
  }

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    onSave(links)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Social Links</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {links.map((link, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground">{link.platform}</label>
                <Input
                  value={link.url}
                  onChange={(e) => handleUpdateLink(index, e.target.value)}
                  placeholder={`https://${link.platform.toLowerCase()}.com/...`}
                  className="mt-1"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveLink(index)}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={handleAddLink} className="w-full bg-transparent">
          Add Social Link
        </Button>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
