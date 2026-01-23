"use client"

import { Search, Bell, Moon, Users } from "lucide-react"

export default function AdminTopbar() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        {/* Left spacer for mobile */}
        <div className="w-8 lg:hidden" />

        {/* Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full rounded-xl border bg-gray-50 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle placeholder */}
          <button
            type="button"
            className="h-9 w-9 flex items-center justify-center rounded-xl border hover:bg-gray-100"
          >
            <Moon className="h-4 w-4 text-gray-600" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative h-9 w-9 flex items-center justify-center rounded-xl border hover:bg-gray-100"
          >
            <Bell className="h-4 w-4 text-gray-600" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Invite staff */}
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2 text-sm hover:bg-gray-800"
          >
            <Users className="h-4 w-4" />
            Invite Staff
          </button>
        </div>
      </div>
    </header>
  )
}
