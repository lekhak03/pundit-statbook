"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

interface Metric {
  metric: string
  value: number
  max: number
}

interface SystemData {
  system: string
  status: string
  metrics: Metric[]
}

interface SystemRadarChartProps {
  data: SystemData[]
  selectedSystem: number
  isAnimated?: boolean
}

export function SystemRadarChart({ data, selectedSystem, isAnimated = true }: SystemRadarChartProps) {
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

    const angleSlice = (2 * Math.PI) / data[0].metrics.length

    // Create tooltip
    const tooltip = d3.select("body").selectAll(".radar-tooltip").data([0])
    const tooltipEnter = tooltip
      .enter()
      .append("div")
      .attr("class", "radar-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(15, 23, 42, 0.95)")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("border", "1px solid rgba(71, 85, 105, 0.5)")
      .style("backdrop-filter", "blur(8px)")
      .style("z-index", "1000")

    const tooltipDiv = tooltipEnter.merge(tooltip)

    // Draw grid circles with subtle styling
    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level
      g.append("circle")
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "rgba(71, 85, 105, 0.3)")
        .attr("stroke-width", level === levels ? 1.5 : 1)
        .attr("stroke-dasharray", level === levels ? "none" : "2,3")
    }

    // Draw axis lines
    data[0].metrics.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)

      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "rgba(71, 85, 105, 0.4)")
        .attr("stroke-width", 1)

      // Add metric labels
      g.append("text")
        .attr("x", x * 1.15)
        .attr("y", y * 1.15)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "rgb(148, 163, 184)")
        .attr("font-size", "11px")
        .attr("font-weight", "500")
        .text(d.metric)
    })

    // Add value labels on grid circles
    for (let level = 1; level <= levels; level++) {
      const value = (maxValue / levels) * level
      g.append("text")
        .attr("x", 4)
        .attr("y", -(radius / levels) * level)
        .attr("fill", "rgba(148, 163, 184, 0.6)")
        .attr("font-size", "9px")
        .text(`${value}%`)
    }

    // Color scheme for systems
    const colors = [
      { fill: "rgba(59, 130, 246, 0.15)", stroke: "rgb(59, 130, 246)" },
      { fill: "rgba(245, 158, 11, 0.15)", stroke: "rgb(245, 158, 11)" },
    ]

    // Radar area generator
    const radarLine = d3
      .lineRadial<Metric>()
      .radius((d) => (d.value / maxValue) * radius)
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed)

    // Draw radar areas for comparison
    data.forEach((system, systemIndex) => {
      const color = colors[systemIndex] || colors[0]
      const isSelected = systemIndex === selectedSystem

      const path = g
        .append("path")
        .datum(system.metrics)
        .attr("fill", color.fill)
        .attr("stroke", color.stroke)
        .attr("stroke-width", isSelected ? 2.5 : 1.5)
        .attr("opacity", isSelected ? 1 : 0.6)
        .attr("d", radarLine)

      if (isAnimated) {
        const totalLength = path.node()?.getTotalLength() || 0
        path
          .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(1500)
          .ease(d3.easeCircleOut)
          .attr("stroke-dashoffset", 0)
      }

      // Add data points
      system.metrics.forEach((metric, i) => {
        const angle = angleSlice * i - Math.PI / 2
        const r = (metric.value / maxValue) * radius
        const x = r * Math.cos(angle)
        const y = r * Math.sin(angle)

        const circle = g
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", isSelected ? 4 : 3)
          .attr("fill", color.stroke)
          .attr("stroke", "rgb(15, 23, 42)")
          .attr("stroke-width", 2)
          .attr("opacity", isSelected ? 1 : 0.8)
          .style("cursor", "pointer")

        if (isAnimated) {
          circle
            .attr("r", 0)
            .transition()
            .delay(1000 + i * 100)
            .duration(300)
            .attr("r", isSelected ? 4 : 3)
        }

        // Add hover effects
        circle
          .on("mouseover", function (event) {
            d3.select(this).transition().duration(200).attr("r", 6).attr("stroke-width", 3)

            tooltipDiv.style("visibility", "visible").html(`
                <div style="font-weight: 600; margin-bottom: 4px;">${system.system}</div>
                <div>${metric.metric}: <span style="color: ${color.stroke};">${metric.value.toFixed(1)}%</span></div>
              `)
          })
          .on("mousemove", (event) => {
            tooltipDiv.style("top", event.pageY - 10 + "px").style("left", event.pageX + 10 + "px")
          })
          .on("mouseout", function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("r", isSelected ? 4 : 3)
              .attr("stroke-width", 2)

            tooltipDiv.style("visibility", "hidden")
          })
      })
    })

    // Add legend
    const legend = g.append("g").attr("transform", `translate(${-radius + 20}, ${radius - 40})`)

    data.forEach((system, i) => {
      const color = colors[i] || colors[0]
      const legendItem = legend.append("g").attr("transform", `translate(0, ${i * 20})`)

      legendItem
        .append("circle")
        .attr("r", 6)
        .attr("fill", color.stroke)
        .attr("stroke", "rgb(15, 23, 42)")
        .attr("stroke-width", 1)

      legendItem
        .append("text")
        .attr("x", 15)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .attr("fill", "rgb(148, 163, 184)")
        .attr("font-size", "12px")
        .attr("font-weight", selectedSystem === i ? "600" : "400")
        .text(system.system)
    })
  }, [data, selectedSystem, dimensions, isAnimated])

  return (
    <div className="w-full flex justify-center">
      <svg ref={svgRef} className="max-w-full h-auto" />
    </div>
  )
}
