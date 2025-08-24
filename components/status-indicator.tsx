"use client"
import { Circle } from "lucide-react"

interface StatusIndicatorProps {
  isLive: boolean
  lastUpdate: Date
}

export function StatusIndicator({ isLive, lastUpdate }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <Circle className={`h-2 w-2 fill-current ${isLive ? "text-green-400 animate-pulse" : "text-slate-500"}`} />
        <span className="text-slate-400">{isLive ? "Live" : "Paused"}</span>
      </div>
      <div className="text-slate-500 text-xs">Updated {lastUpdate.toLocaleTimeString()}</div>
    </div>
  )
}
