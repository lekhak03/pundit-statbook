"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface PlayerData {
  player: string
  team?: string
  position?: string
  axes: Array<{
    axis: string
    value: number
  }>
}

interface PlayerStatsGridProps {
  players: PlayerData[]
}

export function PlayerStatsGrid({ players }: PlayerStatsGridProps) {
  return (
    <div className="space-y-6">
      {players.map((player, index) => (
        <Card key={player.player} className="shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">{player.player}</CardTitle>
              <Badge
                variant="outline"
                className={index === 0 ? "border-chart-1 text-chart-1" : "border-chart-2 text-chart-2"}
              >
                {player.position}
              </Badge>
            </div>
            {player.team && <p className="text-sm text-muted-foreground">{player.team}</p>}
          </CardHeader>
          <CardContent className="space-y-4">
            {player.axes.map((stat) => (
              <div key={stat.axis} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{stat.axis}</span>
                  <span className="text-sm font-bold text-primary">{stat.value.toFixed(1)}%</span>
                </div>
                <Progress
                  value={stat.value}
                  className="h-2"
                  style={
                    {
                      "--progress-background": index === 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))",
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
