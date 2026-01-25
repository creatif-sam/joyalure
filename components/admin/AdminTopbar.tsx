"use client"

import { Search, Bell, Users, UserCircle, LogOut, Settings } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import Link from "next/link"
import { useState } from "react"

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
          {/* Theme toggle */}
          <ThemeSwitcher />

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

          {/* Staff profile dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="h-9 w-9 flex items-center justify-center rounded-full border hover:bg-gray-100 focus:outline-none"
              aria-label="Staff profile"
            >
              <UserCircle className="h-7 w-7 text-gray-600" />
            </button>
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-50">
              <div className="py-2">
                <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700">
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </Link>
                <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-50 text-gray-700">
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
