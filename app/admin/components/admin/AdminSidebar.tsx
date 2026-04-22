"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  LayoutDashboard,
  Package,
  Tag,
  Boxes,
  CreditCard,
  Users,
  FileText,
  ChevronLeft,
  Menu,
  Mail,
  X,
  Sparkles,
  ShoppingBag,
  BarChart3,
} from "lucide-react"

const menu = [
  {
    section: "Main",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Blogs", href: "/admin/blog", icon: FileText },
      { name: "Customers", href: "/admin/customers", icon: Users },
      { name: "Inventory", href: "/admin/inventory", icon: Boxes },
      { name: "Mail", href: "/admin/mail", icon: Mail },
      { name: "Orders", href: "/admin/payments", icon: CreditCard },
      { name: "Product Category", href: "/admin/category", icon: Tag },
      { name: "Products", href: "/admin/products", icon: Package },
    ],
  },
  {
    section: "Shea Butter",
    items: [
      { name: "Manage Products", href: "/admin/shea-butter/products", icon: Sparkles },
      { name: "View Orders", href: "/admin/shea-butter/orders", icon: ShoppingBag },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Trigger */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden fixed top-3 left-4 z-[60] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md p-2 shadow-sm transition-all active:scale-95"
        >
          <Menu className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>
      )}

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[70] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 h-screen z-[80]
          bg-[#f6f6f7] dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[68px]" : "w-[240px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 rounded-md bg-green-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              J
            </div>
            {(!collapsed || mobileOpen) && (
              <div>
                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight">Joyalure</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Admin Panel</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-zinc-500 hover:text-zinc-900"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {menu.map(section => (
            <div key={section.section}>
              {(!collapsed || mobileOpen) && (
                <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {section.section}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      title={collapsed && !mobileOpen ? item.name : undefined}
                      className={`
                        flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors duration-150 group
                        ${active
                          ? "bg-white dark:bg-zinc-800 text-green-700 dark:text-green-400 shadow-sm border border-gray-200 dark:border-zinc-700"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                        }
                      `}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-green-600" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"}`} />
                      {(!collapsed || mobileOpen) && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        {(!collapsed || mobileOpen) && (
          <div className="px-4 py-4 border-t border-gray-200 dark:border-zinc-800">
            <p className="text-[10px] text-zinc-400 dark:text-zinc-600 text-center">v2026.1</p>
          </div>
        )}
      </aside>
    </>
  )
}