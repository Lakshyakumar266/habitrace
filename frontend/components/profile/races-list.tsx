import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface Race {
  id: string
  name: string
  date: string
  position: number
  time: string
}

interface RacesListProps {
  races: Race[]
}

export default function RacesList({ races }: RacesListProps) {
  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case 2:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      case 3:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return "🏃"
    }
  }

  return (
    <div className="space-y-4">
      {races.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No races joined yet</p>
        </Card>
      ) : (
        races.map((race) => (
          <Card key={race.id} className="overflow-hidden transition-all hover:shadow-lg">
            <div className="flex items-center gap-4 p-4 sm:p-6">
              {/* Medal/Position */}
              <div className="flex-shrink-0">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${getMedalColor(race.position)}`}
                >
                  <span className="text-xl">{getMedalEmoji(race.position)}</span>
                </div>
              </div>

              {/* Race Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">{race.name}</h4>
                <p className="text-sm text-muted-foreground">{race.date}</p>
              </div>

              {/* Position and Time */}
              <div className="flex flex-shrink-0 items-center gap-4">
                <div className="text-right">
                  <Badge variant="secondary" className="mb-2">
                    #{race.position}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {race.time}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
