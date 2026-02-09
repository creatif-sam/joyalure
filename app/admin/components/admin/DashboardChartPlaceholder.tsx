"use client"

import { useEffect, useRef, useState } from "react"
import { geoNaturalEarth1, geoPath } from "d3-geo"
import { select } from "d3-selection"
// @ts-ignore
import { feature } from "topojson-client"

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

interface WorldTopoData {
  type: "Topology"
  objects: {
    countries: {
      type: "GeometryCollection"
      geometries: any[]
    }
  }
  arcs: number[][][]
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

    fetch("/world-110m.json")
      .then((res) => res.json())
      .then((worldData: WorldTopoData) => {
        const countries = (feature(worldData, worldData.objects.countries) as any).features

        // Draw Map Background
        // Institutional Fix: We use 'currentColor' to allow the CSS to drive the theme
        svg
          .selectAll("path")
          .data(countries)
          .enter()
          .append("path")
          .attr("d", pathGenerator as any)
          .attr("class", "fill-gray-200 dark:fill-zinc-800 stroke-white dark:stroke-zinc-950")
          .attr("stroke-width", 0.5)

        const regions: Region[] = [
          { name: "USA", coords: [-98, 39], revenue: "$45,200", orders: 820, growth: "+8%" },
          { name: "UK", coords: [-2, 54], revenue: "$27,800", orders: 510, growth: "+5%" },
          { name: "Ghana", coords: [-1, 7.9], revenue: "$12,400", orders: 330, growth: "+12%" },
          { name: "Morocco", coords: [-7, 31.7], revenue: "$8,900", orders: 210, growth: "+15%" },
        ]

        const dots = svg
          .selectAll("circle")
          .data(regions)
          .enter()
          .append("circle")
          .attr("cx", (d) => projection(d.coords)?.[0] ?? 0)
          .attr("cy", (d) => projection(d.coords)?.[1] ?? 0)
          .attr("r", 6)
          .attr("class", "fill-green-600 dark:fill-green-500 cursor-pointer transition-all duration-200")

        dots.on("mouseenter", (event: MouseEvent, d: Region) => {
          const projected = projection(d.coords)
          if (projected) {
            setTooltip({ ...d, x: projected[0], y: projected[1] })
          }
          select(event.currentTarget as SVGCircleElement)
            .attr("r", 8)
            .attr("class", "fill-green-700 dark:fill-green-400")
        })

        dots.on("mouseleave", (event: MouseEvent) => {
          setTooltip(null)
          select(event.currentTarget as SVGCircleElement)
            .attr("r", 6)
            .attr("class", "fill-green-600 dark:fill-green-500")
        })
      })
      .catch((err) => console.error("D3 Mapping Error:", err))
  }, [])

  return (
    <div className="relative bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">Global Sales Analytics</h3>
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Real-time Map</span>
      </div>

      {/* Tooltip Component */}
      {tooltip && (
        <div
          className="absolute z-20 pointer-events-none bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-xl rounded-xl px-4 py-3 text-sm animate-in fade-in zoom-in duration-150"
          style={{ 
            left: `${tooltip.x + 20}px`, 
            top: `${tooltip.y + 20}px`,
            transform: 'translate(-50%, -100%)' 
          }}
        >
          <p className="font-bold text-gray-900 dark:text-gray-100 border-b dark:border-zinc-800 pb-1 mb-2">{tooltip.name}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-6">
              <span className="text-gray-500 dark:text-gray-400">Revenue:</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{tooltip.revenue}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-gray-500 dark:text-gray-400">Orders:</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{tooltip.orders}</span>
            </div>
            <div className="flex justify-between gap-6 pt-1 border-t dark:border-zinc-800 mt-1">
              <span className="text-gray-500 dark:text-gray-400">Growth:</span>
              <span className="text-green-600 dark:text-green-400 font-black">{tooltip.growth}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-zinc-950/50 rounded-xl overflow-hidden border dark:border-zinc-800/50">
        <svg
          ref={ref}
          viewBox="0 0 900 400"
          className="w-full h-auto max-h-[400px]"
        />
      </div>
    </div>
  )
}