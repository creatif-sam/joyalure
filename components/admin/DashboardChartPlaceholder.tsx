"use client"

import { useEffect, useRef, useState } from "react"
import { geoNaturalEarth1, geoPath } from "d3-geo"
import { select } from "d3-selection"
import { feature } from "topojson-client"

type TooltipData = {
  name: string
  revenue: string
  orders: number
  growth: string
  x: number
  y: number
}

export default function DashboardChartPlaceholder() {
  const ref = useRef<SVGSVGElement | null>(null)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const width = 900
    const height = 400

    const svg = select(ref.current)
    svg.selectAll("*").remove()

    const projection = geoNaturalEarth1()
      .scale(160)
      .translate([width / 2, height / 2])

    const path = geoPath(projection)

    fetch("/world-110m.json")
      .then(res => res.json())
      .then(world => {
        const countries = feature(
          world,
          world.objects.countries
        ).features

        svg
          .selectAll("path")
          .data(countries)
          .enter()
          .append("path")
          .attr("d", path as any)
          .attr("fill", "#e5e7eb")
          .attr("stroke", "#ffffff")

        const regions = [
          {
            name: "USA",
            coords: [-98, 39],
            revenue: "$45,200",
            orders: 820,
            growth: "+8%",
          },
          {
            name: "UK",
            coords: [-2, 54],
            revenue: "$27,800",
            orders: 510,
            growth: "+5%",
          },
          {
            name: "Ghana",
            coords: [-1, 7.9],
            revenue: "$12,400",
            orders: 330,
            growth: "+12%",
          },
        ]

        svg
          .selectAll("circle")
          .data(regions)
          .enter()
          .append("circle")
          .attr("cx", d => projection(d.coords)?.[0] ?? 0)
          .attr("cy", d => projection(d.coords)?.[1] ?? 0)
          .attr("r", 6)
          .attr("fill", "#16a34a")
          .style("cursor", "pointer")
          .on("mouseenter", (event, d) => {
            const [x, y] = projection(d.coords) ?? [0, 0]
            setTooltip({
              name: d.name,
              revenue: d.revenue,
              orders: d.orders,
              growth: d.growth,
              x,
              y,
            })
          })
          .on("mouseleave", () => {
            setTooltip(null)
          })
      })
  }, [])

  return (
    <div className="relative bg-white rounded-xl p-6">
      <h3 className="font-semibold mb-4">Sales Analytics by Region</h3>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-10 bg-white border shadow-lg rounded-lg px-4 py-3 text-sm"
          style={{
            left: tooltip.x + 20,
            top: tooltip.y + 40,
          }}
        >
          <p className="font-semibold text-gray-800">{tooltip.name}</p>
          <p className="text-gray-600">Revenue: {tooltip.revenue}</p>
          <p className="text-gray-600">Orders: {tooltip.orders}</p>
          <p className="text-green-600">Growth: {tooltip.growth}</p>
        </div>
      )}

      <svg
        ref={ref}
        viewBox="0 0 900 400"
        className="w-full h-[360px]"
      />
    </div>
  )
}
