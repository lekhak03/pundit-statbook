"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Cpu, HardDrive, Wifi, Zap, Clock, TrendingUp, AlertTriangle } from "lucide-react"

interface Metric {
  metric: string
  value: number
  max: number
}

interface MetricsGridProps {
  metrics: Metric[]
}

const getMetricIcon = (metric: string) => {
  const iconMap: { [key: string]: any } = {
    "CPU Usage": Cpu,
    "Memory Usage": HardDrive,
    "Disk I/O": HardDrive,
    "Network Load": Wifi,
    "Response Time": Clock,
    Throughput: TrendingUp,
    "Error Rate": AlertTriangle,
  }
  return iconMap[metric] || Zap
}

const getMetricColor = (value: number, metric: string) => {
  // Error rate should be inverted (lower is better)
  if (metric === "Error Rate") {
    if (value <= 5) return "text-green-400"
    if (value <= 15) return "text-yellow-400"
    return "text-red-400"
  }

  // For other metrics, higher is generally better (except CPU/Memory usage)
  if (metric.includes("Usage")) {
    if (value <= 50) return "text-green-400"
    if (value <= 80) return "text-yellow-400"
    return "text-red-400"
  }

  if (value >= 80) return "text-green-400"
  if (value >= 60) return "text-yellow-400"
  return "text-red-400"
}

const getProgressColor = (value: number, metric: string) => {
  if (metric === "Error Rate") {
    if (value <= 5) return "bg-green-500"
    if (value <= 15) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (metric.includes("Usage")) {
    if (value <= 50) return "bg-green-500"
    if (value <= 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (value >= 80) return "bg-green-500"
  if (value >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="space-y-3">
      {metrics.map((metric, index) => {
        const Icon = getMetricIcon(metric.metric)
        const textColor = getMetricColor(metric.value, metric.metric)
        const progressColor = getProgressColor(metric.value, metric.metric)

        return (
          <Card key={metric.metric} className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">{metric.metric}</span>
                </div>
                <span className={`text-sm font-semibold ${textColor}`}>{metric.value.toFixed(1)}%</span>
              </div>
              <div className="relative">
                <Progress value={metric.value} className="h-2 bg-slate-800" />
                <div
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${progressColor}`}
                  style={{ width: `${Math.min(metric.value, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
