"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  LayoutDashboard,
  Package,
  Boxes,
  CreditCard,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  Menu,
  Mail,
} from "lucide-react"

const menu = [
  {
    section: "Menu",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Product Category", href: "/admin/category", icon: Package },
      { name: "Inventory", href: "/admin/inventory", icon: Boxes },
      { name: "Orders", href: "/admin/payments", icon: CreditCard },
      { name: "Mail", href: "/admin/mail", icon: Mail },
      { name: "Customers", href: "/admin/customers", icon: Users },
      { name: "Blogs", href: "/admin/blog", icon: FileText },
    ],
  },
  {
    section: "Others",
    items: [
      { name: "Settings", href: "/admin/settings", icon: Settings },
      // Help Center removed
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg p-2 shadow-sm"
      >
        <Menu className="h-5 w-5 dark:text-gray-400" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          z-40 bg-white dark:bg-zinc-950 border-r dark:border-zinc-800 flex flex-col
          transition-all duration-300
          h-screen
          ${collapsed ? "w-20" : "w-72"}
          lg:sticky lg:top-0
          fixed lg:relative
          ${mobileOpen ? "left-0" : "-left-full"} lg:left-0
        `}
      >
        {/* Top Section */}
        <div>
          {/* Brand + collapse */}
          <div className="flex items-center justify-between px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold">
                J
              </div>
              {!collapsed && (
                <div className="animate-in fade-in duration-500">
                  <p className="font-bold text-gray-900 dark:text-gray-100 leading-tight">Joyalure</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Admin</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <ChevronLeft
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-7">
            {menu.map(section => (
              <div key={section.section}>
                {!collapsed && (
                  <p className="px-4 mb-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {section.section}
                  </p>
                )}

                <div className="space-y-1">
                  {section.items.map(item => {
                    const active = pathname === item.href
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-200
                        ${
                          active
                            ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-bold shadow-sm"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-gray-100"
                        }`}
                      >
                        <Icon className={`h-5 w-5 shrink-0 ${active ? "text-green-600 dark:text-green-400" : ""}`} />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
        
        {/* Removed Footer Section with Logout */}
      </aside>
    </>
  )
}