"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { Avatar } from "@/components/ui/avatar"
import { ThemeSwitcher } from "@/components/theme-switcher" // Standardized component

export default function ClientTopBar() {
  const [open, setOpen] = useState(false)
  const { user } = useUser()

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-950 border-b border-green-100 dark:border-zinc-800 z-50 transition-colors duration-300">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <Link
          href="/client-dashboard"
          className="text-lg font-black tracking-tighter text-green-700 dark:text-green-500"
        >
          Joyalure
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-5 relative">
          
          {/* THEME SWITCHER - Replaced manual toggle */}
          <ThemeSwitcher />

          {/* Notifications */}
          <button
            className="relative text-green-700 dark:text-green-500 hover:opacity-80 transition-opacity"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-600 rounded-full ring-2 ring-white dark:ring-zinc-950" />
          </button>

          {/* Profile */}
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2 focus:outline-none"
            aria-label="Account menu"
          >
            {user && (
              <Avatar
                src={user.avatar_url}
                name={user.displayName}
              />
            )}
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 top-12 w-48 bg-white dark:bg-zinc-900 border border-green-100 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 border-b dark:border-zinc-800">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Client Account</p>
              </div>
              
              <Link
                href="/client-dashboard/profile"
                className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>

              <Link
                href="/client-dashboard/settings"
                className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => setOpen(false)}
              >
                Settings
              </Link>

              <Link
                href="/logout"
                className="block px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
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