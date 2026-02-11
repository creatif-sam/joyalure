"use client"

import { useState } from "react"
import { Search, Bell, X } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { UserDropdown } from "./UserDropdown" 

export default function AdminTopbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b transition-colors duration-300">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-2">
        
        {/* Mobile: Invisible spacer for centering if sidebar trigger exists */}
        <div className="w-8 lg:hidden md:block hidden" />

        {/* Search Logic: Expandable on Mobile, Static on Desktop */}
        <div className={`
          ${isSearchOpen ? 'absolute inset-0 z-40 bg-white dark:bg-zinc-950 px-4 flex items-center' : 'relative flex-1 max-w-xl'}
          transition-all duration-300
        `}>
          <Search className={`
            absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 
            ${isSearchOpen ? 'left-7' : ''}
          `} />
          
          <input
            type="text"
            placeholder={isSearchOpen ? "Search..." : "Search items..."}
            className={`
              w-full rounded-2xl border bg-gray-50 dark:bg-zinc-900 pl-10 pr-4 py-2 text-sm 
              focus:outline-none focus:ring-2 focus:ring-green-500 transition-all
              ${!isSearchOpen ? 'hidden md:block' : 'block'}
            `}
          />

          {/* Mobile Search Close Trigger */}
          {isSearchOpen && (
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="ml-2 p-2 text-zinc-500 lg:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Action Group */}
        <div className={`flex items-center gap-2 md:gap-3 ${isSearchOpen ? 'hidden' : 'flex'}`}>
          
          {/* Mobile Search Toggle */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>

          <ThemeSwitcher />

          {/* Notifications - Hidden on small mobile to save space, or kept if vital */}
          <button
            type="button"
            className="relative h-9 w-9 flex items-center justify-center rounded-xl border dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950" />
          </button>

          <div className="h-5 w-[1px] bg-gray-200 dark:bg-zinc-800 mx-0.5 md:mx-1" />

          <UserDropdown />
        </div>
      </div>
    </header>
  )
}