import { Card } from "@/components/ui/card"

interface Badge {
  id: string
  name: string
  icon: string
  description: string
  unlockedDate: string
}

interface BadgesDisplayProps {
  badges: Badge[]
}

export default function BadgesDisplay({ badges }: BadgesDisplayProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {badges.length === 0 ? (
        <Card className="col-span-full p-8 text-center">
          <p className="text-muted-foreground">No badges unlocked yet</p>
        </Card>
      ) : (
        badges.map((badge) => (
          <Card
            key={badge.id}
            className="overflow-hidden transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="text-5xl mb-3">{badge.icon}</div>
              <h4 className="font-semibold text-foreground text-sm">{badge.name}</h4>
              <p className="text-xs text-muted-foreground mt-2">{badge.description}</p>
              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border w-full">
                Unlocked {badge.unlockedDate}
              </p>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
