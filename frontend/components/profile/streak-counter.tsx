import { Card } from "@/components/ui/card"

interface StreakCounterProps {
  streak: number
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <Card className="p-6 text-center border-2 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
      <p className="text-sm font-semibold uppercase text-muted-foreground mb-2">Current Streak</p>
      <div className="flex items-center justify-center gap-3">
        <p className="text-5xl font-black text-primary">{streak}</p>
        <div className="text-6xl animate-pulse">🔥</div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">Keep racing to maintain your streak!</p>
    </Card>
  )
}
