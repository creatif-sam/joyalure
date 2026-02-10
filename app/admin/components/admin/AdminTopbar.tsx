"use client"

import { Search, Bell } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { UserDropdown } from "./UserDropdown" // 

export default function AdminTopbar() {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-zinc-950 border-b transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <div className="w-8 lg:hidden" />

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, orders, or categories..."
            className="w-full rounded-xl border bg-gray-50 dark:bg-zinc-900 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />

          {/* Notifications */}
          <button
            type="button"
            className="relative h-9 w-9 flex items-center justify-center rounded-xl border dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950" />
          </button>

          <div className="h-6 w-[1px] bg-gray-200 dark:bg-zinc-800 mx-1" />

          {/* Clean Standalone Component */}
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}