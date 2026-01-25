"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Bell, Sun, Moon } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { Avatar } from "@/components/ui/avatar"

export default function ClientTopBar() {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)

  const { user } = useUser()

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [dark])

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-100 border-b border-green-100 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <Link
          href="/client-dashboard"
          className="text-lg font-semibold text-green-700"
        >
          Joyalure
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-5 relative">
          {/* Theme Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="text-green-700"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <button
            className="relative text-green-700"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-600 rounded-full" />
          </button>

          {/* Profile */}
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2"
            aria-label="Account menu"
          >
            {user && (
              <Avatar
                src={user.avatar_url}
                name={user.displayName}
              />
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-12 w-44 bg-white dark:bg-gray-100 border border-green-100 rounded-md shadow-sm">
              <Link
                href="/client-dashboard/profile"
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-green-50"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>

              <Link
                href="/client-dashboard/settings"
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-green-50"
                onClick={() => setOpen(false)}
              >
                Settings
              </Link>

              <Link
                href="/logout"
                className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => setOpen(false)}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
