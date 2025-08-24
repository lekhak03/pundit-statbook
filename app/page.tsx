"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Shield, Users, Target, Goal } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-black text-foreground">Player Stats Visualizer</h1>
                <p className="text-sm text-muted-foreground">Professional football analytics dashboard</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Choose Player Position</h2>
          <p className="text-muted-foreground text-lg">Select a position to explore and compare player statistics</p>
        </div>

        {/* Position Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Top Row */}
          <Link href="/goalkeepers">
            <Card className="player-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="p-4 bg-blue-500/10 rounded-full inline-block group-hover:bg-blue-500/20 transition-colors">
                    <Shield className="h-12 w-12 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Goalkeepers</h3>
                <p className="text-muted-foreground">Analyze saves, distribution, and defensive metrics</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/forwards">
            <Card className="player-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="p-4 bg-red-500/10 rounded-full inline-block group-hover:bg-red-500/20 transition-colors">
                    <Target className="h-12 w-12 text-red-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Forwards</h3>
                <p className="text-muted-foreground">Compare goals, assists, and attacking prowess</p>
              </CardContent>
            </Card>
          </Link>

          {/* Bottom Row */}
          <Link href="/midfielders">
            <Card className="player-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="p-4 bg-green-500/10 rounded-full inline-block group-hover:bg-green-500/20 transition-colors">
                    <Users className="h-12 w-12 text-green-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Midfielders</h3>
                <p className="text-muted-foreground">Explore passing, creativity, and control metrics</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/defenders">
            <Card className="player-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="p-4 bg-purple-500/10 rounded-full inline-block group-hover:bg-purple-500/20 transition-colors">
                    <Goal className="h-12 w-12 text-purple-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Defenders</h3>
                <p className="text-muted-foreground">Study defensive actions, tackles, and clearances</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
