"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { UserDropdown } from "./UserDropdown"
import NotificationsDropdown from "./NotificationsDropdown"

export default function AdminTopbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 transition-colors duration-150">
      <div className="flex items-center justify-between px-4 md:px-6 py-2.5 gap-3">

        {/* Spacer for mobile menu button */}
        <div className="w-8 lg:hidden" />

        {/* Search */}
        <div className={`
          ${isSearchOpen ? "absolute inset-0 z-40 bg-white dark:bg-zinc-900 px-4 flex items-center border-b border-gray-200 dark:border-zinc-800" : "relative flex-1 max-w-sm"}
          transition-all duration-200
        `}>
          <Search className={`absolute ${isSearchOpen ? "left-7" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
          <input
            type="text"
            placeholder="Search..."
            className={`
              w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800
              pl-9 pr-4 py-1.5 text-sm text-gray-900 dark:text-gray-100
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
              transition-all
              ${!isSearchOpen ? "hidden md:block" : "block"}
            `}
          />
          {isSearchOpen && (
            <button onClick={() => setIsSearchOpen(false)} className="ml-2 p-1 text-zinc-500 lg:hidden">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Right actions */}
        <div className={`flex items-center gap-1.5 ${isSearchOpen ? "hidden" : "flex"}`}>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>

          <ThemeSwitcher />
          <NotificationsDropdown />

          <div className="h-5 w-px bg-gray-200 dark:bg-zinc-700 mx-1" />

          <UserDropdown />
        </div>
      </div>
    </header>
  )
}