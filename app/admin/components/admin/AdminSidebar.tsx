"use client"

import { useState, useEffect } from "react"
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
  X,
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
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Institutional Note: Close mobile sidebar automatically when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      {/* 1. MOBILE TRIGGER (Top Left) */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden fixed top-3 left-4 z-[60] bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl p-2.5 shadow-xl shadow-black/10 transition-all active:scale-90"
        >
          <Menu className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>
      )}

      {/* 2. MOBILE OVERLAY (Glassmorphism) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[70] lg:hidden animate-in fade-in duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 3. SIDEBAR CONTAINER */}
      <aside
        className={`
          fixed lg:sticky top-0 h-screen z-[80] 
          bg-white dark:bg-zinc-950 border-r dark:border-zinc-900 flex flex-col
          transition-all duration-500 ease-in-out
          ${collapsed ? "w-20" : "w-[280px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Header Section */}
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-2xl bg-green-600 text-white flex items-center justify-center font-black italic shadow-lg shadow-green-600/20">
              J
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="animate-in slide-in-from-left-2 duration-500">
                <p className="font-black italic uppercase tracking-tighter text-zinc-900 dark:text-zinc-100">Joyalure</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-black">Management</p>
              </div>
            )}
          </div>

          {/* PC Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-800 hover:text-green-600 transition-all"
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 text-zinc-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-8 scrollbar-hide py-4">
          {menu.map(section => (
            <div key={section.section}>
              {(!collapsed || mobileOpen) && (
                <p className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  {section.section}
                </p>
              )}

              <div className="space-y-1.5">
                {section.items.map(item => {
                  const active = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center gap-4 rounded-2xl px-4 py-3 text-sm transition-all duration-300 group
                        ${active
                          ? "bg-green-600 text-white shadow-xl shadow-green-600/20 font-bold"
                          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 shrink-0 ${active ? "text-white" : "group-hover:text-green-600"}`} />
                      {(!collapsed || mobileOpen) && (
                        <span className="truncate tracking-tight uppercase text-[11px] font-black">{item.name}</span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Institutional System Label (Bottom) */}
        {(!collapsed || mobileOpen) && (
          <div className="p-6 border-t dark:border-zinc-900">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800">
               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-center">Version 2026.1.0</p>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}