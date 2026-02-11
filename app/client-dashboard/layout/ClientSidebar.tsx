"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, ShoppingBag, Heart, User,
  Settings, LifeBuoy, Mail, Ticket,
  ChevronLeft, ChevronRight
} from "lucide-react"

export default function ClientSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // Navigation Config for easier maintenance
  const primaryLinks = [
    { href: "/client-dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/client-dashboard/orders", icon: ShoppingBag, label: "Orders" },
    { href: "/client-dashboard/inbox", icon: Mail, label: "Inbox" },
    { href: "/client-dashboard/vouchers", icon: Ticket, label: "Vouchers" },
    { href: "/client-dashboard/wishlist", icon: Heart, label: "Wishlist" },
  ]

  const secondaryLinks = [
    { href: "/client-dashboard/profile", icon: User, label: "Profile" },
    { href: "/client-dashboard/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <>
      {/* PC SIDEBAR - Hidden on Mobile */}
      <aside
        className={`fixed left-0 top-0 pt-16 min-h-screen bg-white dark:bg-zinc-950 border-r border-green-100 dark:border-zinc-800 transition-all duration-300 z-40 hidden md:flex flex-col ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex justify-end px-3 py-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-green-700 dark:text-green-500 hover:bg-green-50 dark:hover:bg-zinc-900 p-1 rounded-lg"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex flex-col px-3 py-2 text-sm gap-1 flex-1">
          {primaryLinks.map((link) => (
            <SidebarLink 
              key={link.href} 
              {...link} 
              collapsed={collapsed} 
              active={pathname === link.href} 
            />
          ))}
          
          <div className="mt-auto pb-4 space-y-1 border-t border-green-100 dark:border-zinc-800 pt-4">
            {secondaryLinks.map((link) => (
              <SidebarLink 
                key={link.href} 
                {...link} 
                collapsed={collapsed} 
                active={pathname === link.href} 
              />
            ))}
            <SidebarLink 
              href="/client-dashboard/help-center" 
              icon={LifeBuoy} 
              label="Help" 
              collapsed={collapsed} 
              active={pathname === "/client-dashboard/help-center"} 
            />
          </div>
        </nav>
      </aside>

      {/* MOBILE BOTTOM NAV - Hidden on PC */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-t border-green-100 dark:border-zinc-800 px-6 py-3 z-50 flex justify-between items-center pb-safe">
        {primaryLinks.slice(0, 5).map((link) => {
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1">
              <link.icon 
                size={20} 
                className={isActive ? "text-green-600" : "text-zinc-500"} 
              />
              <span className={`text-[10px] ${isActive ? "text-green-600 font-bold" : "text-zinc-500"}`}>
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  collapsed,
  active
}: {
  href: string
  icon: any
  label: string
  collapsed: boolean
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
        active
          ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-semibold"
          : "text-zinc-500 hover:bg-green-50 dark:hover:bg-zinc-900 hover:text-green-700 dark:hover:text-green-400"
      }`}
    >
      <div className={`shrink-0 ${active ? "text-green-600 dark:text-green-400" : "group-hover:scale-110 transition-transform"}`}>
        <Icon size={18} />
      </div>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  )
}