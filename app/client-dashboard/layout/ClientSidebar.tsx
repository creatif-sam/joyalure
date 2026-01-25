"use client"

import Link from "next/link"
import { useState } from "react"
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  User,
  Settings,
  LifeBuoy,
  Mail,
  Ticket,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

export default function ClientSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`fixed left-0 top-0 pt-16 min-h-screen bg-white border-r border-green-100 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex justify-end px-3 py-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-green-700"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex flex-col px-3 py-2 text-sm text-gray-600 gap-1">

        <SidebarLink
          href="/client-dashboard"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          collapsed={collapsed}
          active
        />

        <SidebarLink
          href="/client-dashboard/orders"
          icon={<ShoppingBag size={18} />}
          label="My Orders"
          collapsed={collapsed}
        />

        <SidebarLink
          href="/client-dashboard/inbox"
          icon={<Mail size={18} />}
          label="Inbox"
          collapsed={collapsed}
        />

        <SidebarLink
          href="/client-dashboard/vouchers"
          icon={<Ticket size={18} />}
          label="Vouchers"
          collapsed={collapsed}
        />

        <SidebarLink
          href="/client-dashboard/wishlist"
          icon={<Heart size={18} />}
          label="Wishlist"
          collapsed={collapsed}
        />

        <SidebarLink
          href="/client-dashboard/profile"
          icon={<User size={18} />}
          label="My Profile"
          collapsed={collapsed}
        />

        <SidebarLink
          href="/client-dashboard/settings"
          icon={<Settings size={18} />}
          label="Settings"
          collapsed={collapsed}
        />

        <div className="mt-6 pt-4 border-t border-green-100">
          <SidebarLink
            href="/client-dashboard/help-center"
            icon={<LifeBuoy size={18} />}
            label="Help Center"
            collapsed={collapsed}
          />
        </div>

      </nav>
    </aside>
  )
}

function SidebarLink({
  href,
  icon,
  label,
  collapsed,
  active
}: {
  href: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        active
          ? "bg-green-50 text-green-700 font-medium"
          : "hover:bg-green-50 hover:text-green-700"
      }`}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}
