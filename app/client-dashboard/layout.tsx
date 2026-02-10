"use client" // Layout must be a client component to handle theme state

import ClientTopbar from "./layout/ClientTopbar"
import ClientSidebar from "./layout/ClientSidebar"
import { ThemeProvider } from "next-themes" // Ensure this is installed

export default function ClientDashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
        <ClientTopbar />
        
        <div className="flex">
          <ClientSidebar />

          <main className="flex-1 pt-16 bg-gray-50 dark:bg-zinc-900/50 min-h-screen px-6 py-6 transition-all duration-300 lg:ml-64">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}