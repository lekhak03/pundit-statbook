"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Trophy, Users, BarChart3, Plus, ArrowLeft, Search } from "lucide-react"
import { RadarChart } from "@/components/radar-chart"
import { ThemeToggle } from "@/components/theme-toggle"
import { goalkeepers } from "@/lib/player-data"
import Link from "next/link"

export default function GoalkeepersPage() {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [comparisonMode, setComparisonMode] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPlayers = goalkeepers.filter(
    (player) =>
      player.player.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.team.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const displayData = comparisonMode
    ? goalkeepers.filter((player) => selectedPlayers.includes(player.id))
    : selectedPlayers.length > 0
      ? [goalkeepers.find((player) => player.id === selectedPlayers[0])!]
      : []

  const addPlayer = (playerId: string) => {
    if (comparisonMode) {
      setSelectedPlayers((prev) =>
        prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId].slice(0, 3),
      )
    } else {
      setSelectedPlayers([playerId])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-black text-foreground">Goalkeepers Analysis</h1>
                <p className="text-sm text-muted-foreground">Compare goalkeeper performance metrics</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                variant={comparisonMode ? "default" : "outline"}
                size="sm"
                onClick={() => setComparisonMode(!comparisonMode)}
                className="bg-primary hover:bg-primary/90"
              >
                {comparisonMode ? "Compare Mode" : "Single View"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Add Players Section */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground flex items-center justify-center gap-2 font-serif font-bold">
              <Plus className="h-5 w-5 text-primary" />
              Add Players
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Select up to {comparisonMode ? "3" : "1"} goalkeeper{comparisonMode ? "s" : ""} to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players by name or team..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {filteredPlayers.map((player) => (
                <Button
                  key={player.id}
                  variant={selectedPlayers.includes(player.id) ? "default" : "outline"}
                  onClick={() => addPlayer(player.id)}
                  className={`flex-shrink-0 flex items-center gap-2 ${
                    selectedPlayers.includes(player.id)
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  {player.player}
                  <Badge variant="outline" className="ml-1 border-muted-foreground/30 text-muted-foreground">
                    {player.team}
                  </Badge>
                </Button>
              ))}
            </div>
            {filteredPlayers.length === 0 && searchQuery && (
              <div className="text-center py-8 text-muted-foreground">No players found matching "{searchQuery}"</div>
            )}
          </CardContent>
        </Card>

        {/* Player Comparison Cards */}
        {displayData.length > 0 && (
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap gap-6 justify-center">
              {displayData.map((player) => (
                <Card key={player.id} className="player-card w-80">
                  <CardHeader className="text-center">
                    <CardTitle className="text-foreground font-serif font-bold">{player.player}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {player.position} • {player.team}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {player.axes.map((stat) => (
                      <div key={stat.axis} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{stat.axis}</span>
                        <span className="text-foreground font-medium">{stat.value}%</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Radar Chart */}
        {displayData.length > 0 && (
          <div className="flex justify-center">
            <Card className="player-card w-full max-w-4xl">
              <CardHeader className="text-center">
                <CardTitle className="text-foreground flex items-center justify-center gap-2 font-serif font-bold">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Performance Radar Chart
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {comparisonMode
                    ? `Comparing ${displayData.map((p) => p.player).join(" vs ")}`
                    : `Individual analysis for ${displayData[0]?.player}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadarChart data={displayData} />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
