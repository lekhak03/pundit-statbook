"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

interface PlayerData {
  player: string
  axes: Array<{
    axis: string
    value: number
  }>
}

interface RadarChartProps {
  data: PlayerData[]
}

export function RadarChart({ data }: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 })

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement
        if (container) {
          const width = Math.min(container.clientWidth, 600)
          const height = width
          setDimensions({ width, height })
        }
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const { width, height } = dimensions
    const margin = 80
    const radius = Math.min(width, height) / 2 - margin
    const levels = 5
    const maxValue = 100

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    const angleSlice = (2 * Math.PI) / data[0].axes.length

    const circleColors = [
      "#1e293b", // Deep slate blue
      "#374151", // Deep gray
      "#581c87", // Deep purple
    ]

    for (let level = 0; level <= levels; level++) {
      const r = (radius / levels) * level
      const colorIndex = level % circleColors.length
      const strokeColor = level === 0 ? "hsl(var(--foreground))" : circleColors[colorIndex]

      g.append("circle")
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", strokeColor)
        .attr("stroke-width", level === 0 ? 3 : 1.5)
        .attr("stroke-dasharray", level === 0 ? "none" : "3,3")
        .attr("opacity", level === 0 ? 1 : 0.8)
    }

    g.append("circle")
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--foreground))")
      .attr("stroke-width", 3)
      .attr("opacity", 1)
      .attr("stroke-dasharray", "none")

    data[0].axes.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)

      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "hsl(var(--muted-foreground))")
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.7)

      g.append("text")
        .attr("x", x * 1.15)
        .attr("y", y * 1.15)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("class", "text-sm font-medium fill-foreground")
        .text(d.axis)
    })

    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.player))
      .range([
        "#b91c1c", // Dark red
        "#1e40af", // Dark blue
        "#166534", // Dark green
      ])

    const radarPath = d3
      .lineRadial<{ axis: string; value: number }>()
      .radius((d) => (d.value / maxValue) * radius)
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed)

    data.forEach((player, playerIndex) => {
      const path = g
        .append("path")
        .datum(player.axes)
        .attr("fill", colorScale(player.player))
        .attr("fill-opacity", 0.15)
        .attr("stroke", colorScale(player.player))
        .attr("stroke-width", 3)
        .attr("stroke-linejoin", "round")
        .attr("d", radarPath)
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")

      // Animation
      const totalLength = path.node()?.getTotalLength() || 0
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1500)
        .delay(playerIndex * 200)
        .ease(d3.easeCircleOut)
        .attr("stroke-dashoffset", 0)

      player.axes.forEach((axis, i) => {
        const angle = angleSlice * i - Math.PI / 2
        const r = (axis.value / maxValue) * radius
        const x = r * Math.cos(angle)
        const y = r * Math.sin(angle)

        const circle = g
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 0)
          .attr("fill", colorScale(player.player))
          .attr("stroke", "white")
          .attr("stroke-width", 2)
          .style("cursor", "pointer")
          .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))")

        circle
          .transition()
          .duration(800)
          .delay(playerIndex * 200 + i * 100)
          .attr("r", 5)

        // Tooltip
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "radar-tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("z-index", "1000")

        circle
          .on("mouseover", function (event) {
            d3.select(this).transition().duration(200).attr("r", 8)

            tooltip.transition().duration(200).style("opacity", 1)

            tooltip
              .html(`
              <div class="font-semibold text-foreground">${player.player}</div>
              <div class="text-sm text-muted-foreground">${axis.axis}</div>
              <div class="text-lg font-bold text-primary">${axis.value.toFixed(1)}%</div>
            `)
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 10 + "px")
          })
          .on("mouseout", function () {
            d3.select(this).transition().duration(200).attr("r", 5)

            tooltip.transition().duration(200).style("opacity", 0).remove()
          })
      })
    })
  }, [data, dimensions])

  return (
    <div className="w-full flex justify-center">
      <svg ref={svgRef} className="max-w-full h-auto" />
    </div>
  )
}
