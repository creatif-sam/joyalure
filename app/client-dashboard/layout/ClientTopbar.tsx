"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, LogOut, User, Settings } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { Avatar } from "@/components/ui/avatar"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function ClientTopBar() {
  const [open, setOpen] = useState(false)
  const { user } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth/login")
      router.refresh()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-950 border-b border-green-100 dark:border-zinc-800 z-50 transition-colors duration-300">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/client-dashboard"
          className="text-lg font-black tracking-tighter text-green-700 dark:text-green-500 shrink-0"
        >
          Joyalure
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-5 relative">
          
          <ThemeSwitcher />

          {/* Notifications */}
          <button
            className="relative text-green-700 dark:text-green-500 hover:opacity-80 transition-opacity"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-green-600 rounded-full ring-2 ring-white dark:ring-zinc-950" />
          </button>

          {/* Profile Trigger */}
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2 focus:outline-none group active:scale-95 transition-transform"
            aria-label="Account menu"
          >
            <div className={`rounded-full p-0.5 transition-all ${open ? 'ring-2 ring-green-600' : 'group-hover:ring-2 group-hover:ring-green-600/30'}`}>
              {user && (
                /* FIX: Wrapper div handles sizing to bypass 'className' prop error on Avatar component */
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Avatar
                    src={user.avatar_url}
                    name={user.displayName || "User"}
                  />
                </div>
              )}
            </div>
          </button>

          {/* Dropdown Menu */}
          {open && (
            <>
              {/* Invisible backdrop to close menu on outside click */}
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setOpen(false)} 
              />
              
              <div className="absolute right-0 top-14 w-56 bg-white dark:bg-zinc-950 border border-green-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/20">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Client Account</p>
                   <p className="text-xs font-bold text-gray-700 dark:text-zinc-200 truncate mt-1">{user?.email}</p>
                </div>
                
                <div className="p-2">
                  <Link
                    href="/client-dashboard/profile"
                    className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-600 dark:text-zinc-400 hover:bg-green-50 dark:hover:bg-zinc-900 hover:text-green-700 dark:hover:text-green-400 rounded-lg transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <User size={16} /> Profile
                  </Link>

                  <Link
                    href="/client-dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-600 dark:text-zinc-400 hover:bg-green-50 dark:hover:bg-zinc-900 hover:text-green-700 dark:hover:text-green-400 rounded-lg transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Settings size={16} /> Settings
                  </Link>

                  <div className="my-1 border-t dark:border-zinc-800" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-black uppercase tracking-widest text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}