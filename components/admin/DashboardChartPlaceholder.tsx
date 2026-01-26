"use client"

import { useEffect, useRef, useState } from "react"
import { geoNaturalEarth1, geoPath } from "d3-geo"
import { select } from "d3-selection"
// @ts-ignore - Some versions of topojson-client have conflicting type exports
import { feature } from "topojson-client"

/** * TypeScript Interfaces to satisfy the compiler 
 */
interface Region {
  name: string
  coords: [number, number]
  revenue: string
  orders: number
  growth: string
}

interface TooltipData extends Omit<Region, 'coords'> {
  x: number
  y: number
}

// Define the shape of the TopoJSON object specifically
interface WorldTopoData {
  type: "Topology"
  objects: {
    countries: {
      type: "GeometryCollection"
      geometries: any[]
    }
  }
  arcs: number[][][]
  transform?: any
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

    const pathGenerator = geoPath(projection)

    // Ensure the JSON path matches your public folder
    fetch("/world-110m.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok")
        return res.json()
      })
      .then((worldData: WorldTopoData) => {
        // Convert TopoJSON to GeoJSON Features
        // We use 'any' casting here to bypass the library's internal type conflicts
        const countries = (feature(worldData, worldData.objects.countries) as any).features

        // Draw Map Background
        svg
          .selectAll("path")
          .data(countries)
          .enter()
          .append("path")
          .attr("d", pathGenerator as any)
          .attr("fill", "#f3f4f6")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 0.5)

        const regions: Region[] = [
          { name: "USA", coords: [-98, 39], revenue: "$45,200", orders: 820, growth: "+8%" },
          { name: "UK", coords: [-2, 54], revenue: "$27,800", orders: 510, growth: "+5%" },
          { name: "Ghana", coords: [-1, 7.9], revenue: "$12,400", orders: 330, growth: "+12%" },
        ]

        // Draw Data Points
        const dots = svg
          .selectAll("circle")
          .data(regions)
          .enter()
          .append("circle")
          .attr("cx", (d) => projection(d.coords)?.[0] ?? 0)
          .attr("cy", (d) => projection(d.coords)?.[1] ?? 0)
          .attr("r", 6)
          .attr("fill", "#16a34a")
          .style("cursor", "pointer")
          .style("transition", "all 0.2s ease")

        dots.on("mouseenter", (event: MouseEvent, d: Region) => {
          const projected = projection(d.coords)
          if (projected) {
            const [x, y] = projected
            setTooltip({
              name: d.name,
              revenue: d.revenue,
              orders: d.orders,
              growth: d.growth,
              x,
              y,
            })
          }
          select(event.currentTarget as SVGCircleElement)
            .attr("r", 8)
            .attr("fill", "#15803d")
        })

        dots.on("mouseleave", (event: MouseEvent) => {
          setTooltip(null)
          select(event.currentTarget as SVGCircleElement)
            .attr("r", 6)
            .attr("fill", "#16a34a")
        })
      })
      .catch((err) => console.error("D3 Mapping Error:", err))
  }, [])

  return (
    <div className="relative bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Global Sales Analytics</h3>
        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Real-time Map</span>
      </div>

      {/* Tooltip Component */}
      {tooltip && (
        <div
          className="absolute z-20 pointer-events-none bg-white border border-gray-200 shadow-xl rounded-lg px-4 py-3 text-sm animate-in fade-in zoom-in duration-150"
          style={{ 
            left: `${tooltip.x + 20}px`, 
            top: `${tooltip.y + 20}px`,
            transform: 'translate(-50%, -100%)' 
          }}
        >
          <p className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-2">{tooltip.name}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Revenue:</span>
              <span className="font-medium">{tooltip.revenue}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Orders:</span>
              <span className="font-medium">{tooltip.orders}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Growth:</span>
              <span className="text-green-600 font-bold">{tooltip.growth}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg overflow-hidden">
        <svg
          ref={ref}
          viewBox="0 0 900 400"
          className="w-full h-auto max-h-[400px]"
        />
      </div>
    </div>
  )
}