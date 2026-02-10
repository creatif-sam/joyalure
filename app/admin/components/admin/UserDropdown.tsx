"use client"

import { useState, useEffect } from "react"
import { UserCircle, LogOut, Settings, Loader2, LifeBuoy } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export function UserDropdown() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserEmail(user.email ?? null)
    }
    getUser()
  }, [supabase])

  const handleLogout = async (e: React.MouseEvent) => {
    // Prevent the click from bubbling up and potentially 
    // being cancelled by the dropdown's "group-hover" logic
    e.preventDefault()
    e.stopPropagation()

    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      await supabase.auth.signOut()
      window.location.href = "/public"
    } catch (error) {
      console.error("Logout failed:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="relative group">
      <button
        type="button"
        className="h-9 w-9 flex items-center justify-center rounded-full border dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-900 focus:outline-none transition-colors shadow-sm overflow-hidden"
      >
        {userEmail ? (
          <span className="text-xs font-black text-green-600 dark:text-green-400 uppercase">
            {userEmail[0]}
          </span>
        ) : (
          <UserCircle className="h-7 w-7 text-gray-600 dark:text-gray-400" />
        )}
      </button>
      
      {/* Dropdown Menu - Added 'pointer-events-auto' to ensure buttons are clickable */}
      <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 pointer-events-none z-50 transform origin-top-right scale-95 group-hover:scale-100">
        <div className="py-2">
          <div className="px-4 py-2 border-b dark:border-zinc-800 mb-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Admin Account</p>
            <p className="text-xs font-bold text-gray-700 dark:text-zinc-300 truncate">{userEmail || "Loading..."}</p>
          </div>
          
          <Link 
            href="/admin/settings" 
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-sm text-gray-700 dark:text-gray-300 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>

          <Link 
            href="/admin/help" 
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-sm text-gray-700 dark:text-gray-300 transition-colors"
          >
            <LifeBuoy className="h-4 w-4" />
            Help Center
          </Link>

          <div className="my-1 border-t dark:border-zinc-800" />

          {/* Explicitly set type="button" and verify z-index */}
          <button 
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="relative z-[60] flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 dark:hover:bg-red-900/10 text-sm text-red-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span className="pointer-events-none">{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}