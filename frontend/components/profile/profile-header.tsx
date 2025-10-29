import { Card } from "@/components/ui/card"

interface ProfileHeaderProps {
  fullName: string
  username: string
  joinedDate: string
}

export default function ProfileHeader({ fullName, username, joinedDate }: ProfileHeaderProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{fullName}</h2>
          <p className="text-sm text-muted-foreground">@{username}</p>
        </div>
        <div className="border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Member Since</p>
          <p className="mt-1 text-sm text-foreground">{joinedDate}</p>
        </div>
      </div>
    </Card>
  )
}
