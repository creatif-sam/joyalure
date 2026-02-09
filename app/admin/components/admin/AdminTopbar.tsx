"use client"

import { Search, Bell, UserCircle, LogOut, Settings } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import Link from "next/link"

export default function AdminTopbar() {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-zinc-950 border-b transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        {/* Left spacer for mobile - useful if your sidebar becomes a drawer */}
        <div className="w-8 lg:hidden" />

        {/* Search Bar - Institutional styling */}
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
          
          {/* THEME TOGGLE - Integrated here */}
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

          {/* Profile Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="h-9 w-9 flex items-center justify-center rounded-full border dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-900 focus:outline-none transition-colors shadow-sm"
              aria-label="Staff profile"
            >
              <UserCircle className="h-7 w-7 text-gray-600 dark:text-gray-400" />
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50 transform origin-top-right scale-95 group-hover:scale-100">
              <div className="py-2">
                <div className="px-4 py-2 border-b dark:border-zinc-800 mb-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Admin Account</p>
                </div>
                <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 dark:hover:bg-red-900/10 text-sm text-red-600 transition-colors">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}