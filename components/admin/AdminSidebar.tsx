"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase/browser"

import {
  LayoutDashboard,
  Package,
  Boxes,
  CreditCard,
  BarChart3,
  Users,
  FileText,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react"

const menu = [
  {
    section: "Menu",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Inventory", href: "/admin/inventory", icon: Boxes },
      { name: "Orders", href: "/admin/payments", icon: CreditCard },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Customers", href: "/admin/customers", icon: Users },
      { name: "Blogs", href: "/admin/blog", icon: FileText },
    ],
  },
  {
    section: "Others",
    items: [
      { name: "Settings", href: "/admin/settings", icon: Settings },
      { name: "Help Center", href: "/admin/help", icon: LifeBuoy },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const router = useRouter()

async function handleLogout() {
  await supabaseBrowser.auth.signOut()
  router.replace("/auth/login")
}


  return (
    <>
      {/* Mobile top bar toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border rounded-lg p-2 shadow"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
  className={`
    z-40 bg-white border-r flex flex-col justify-between
    transition-all duration-300
    h-screen
    ${collapsed ? "w-20" : "w-72"}
    lg:sticky lg:top-0
    fixed lg:relative
    ${mobileOpen ? "left-0" : "-left-full"} lg:left-0
  `}
>

        {/* Top */}
        <div>
          {/* Brand + collapse */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-green-600 text-white flex items-center justify-center font-semibold">
                J
              </div>
              {!collapsed && (
                <div>
                  <p className="font-semibold text-gray-900">Joyalure</p>
                  <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft
                className={`h-4 w-4 transition-transform ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-2 space-y-6">
            {menu.map(section => (
              <div key={section.section}>
                {!collapsed && (
                  <p className="px-4 mb-2 text-xs uppercase text-gray-400">
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
                        className={`flex items-center gap-3 rounded-xl px-4 py-2 text-sm transition
                        ${
                          active
                            ? "bg-green-50 text-green-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>{item.name}</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="border-t px-4 py-4">
        <button
  type="button"
  onClick={handleLogout}
  className="flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-xl transition"
>
  <LogOut className="h-5 w-5" />
  {!collapsed && "Logout"}
</button>

        </div>
      </aside>
    </>
  )
}
