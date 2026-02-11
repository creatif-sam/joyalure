"use client"

import { useEffect, useRef, useState } from "react"
import { geoNaturalEarth1, geoPath } from "d3-geo"
import { select } from "d3-selection"
// @ts-ignore
import { feature } from "topojson-client"
import { X } from "lucide-react"

interface Region {
  name: string
  coords: [number, number]
  revenue: string
  orders: number
  growth: string
}

export default function DashboardChartPlaceholder() {
  const ref = useRef<SVGSVGElement | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const width = 900
    const height = 400
    const svg = select(ref.current)
    svg.selectAll("*").remove()

    // Institutional Adjustment: Increased scale for better mobile visibility
    const projection = geoNaturalEarth1()
      .scale(170) 
      .translate([width / 2, height / 1.8])

    const pathGenerator = geoPath(projection)

    fetch("/world-110m.json")
      .then((res) => res.json())
      .then((worldData) => {
        const countries = (feature(worldData, worldData.objects.countries) as any).features

        // Draw Map
        svg
          .selectAll("path")
          .data(countries)
          .enter()
          .append("path")
          .attr("d", pathGenerator as any)
          .attr("class", "fill-zinc-100 dark:fill-zinc-800/50 stroke-white dark:stroke-zinc-900")
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
          .attr("r", 10) // Institutional Fix: Larger hit area for touch (10px vs 6px)
          .attr("class", "fill-green-600 dark:fill-green-500 opacity-80 animate-pulse-slow cursor-pointer")

        dots.on("click", (event, d: Region) => {
          setSelectedRegion(d)
          // Highlight active dot
          svg.selectAll("circle").attr("r", 10).attr("class", "fill-green-600 opacity-80")
          select(event.currentTarget).attr("r", 14).attr("class", "fill-green-500 opacity-100")
        })
      })
      .catch((err) => console.error("D3 Mapping Error:", err))
  }, [])

  return (
    <div className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-black italic uppercase tracking-tighter text-gray-900 dark:text-gray-100">Global Sales</h3>
          <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Touch dots for details</p>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl overflow-hidden border dark:border-zinc-800/50 touch-pan-x touch-pan-y">
        <svg
          ref={ref}
          viewBox="0 0 900 450"
          className="w-full h-auto min-h-[250px]"
        />
      </div>

      {/* MOBILE BOTTOM SHEET TOOLTIP */}
      {selectedRegion && (
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-[2rem] p-5 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-black italic uppercase text-lg text-green-600">{selectedRegion.name}</h4>
            <button 
              onClick={() => setSelectedRegion(null)}
              className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[8px] font-black uppercase text-zinc-400 mb-1">Revenue</p>
              <p className="text-sm font-bold">{selectedRegion.revenue}</p>
            </div>
            <div>
              <p className="text-[8px] font-black uppercase text-zinc-400 mb-1">Orders</p>
              <p className="text-sm font-bold">{selectedRegion.orders}</p>
            </div>
            <div>
              <p className="text-[8px] font-black uppercase text-zinc-400 mb-1">Growth</p>
              <p className="text-sm font-black text-green-500">{selectedRegion.growth}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}