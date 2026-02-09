import "@/app/globals.css"
import AdminSidebar from "@/app/admin/components/admin/AdminSidebar"
import AdminTopbar from "@/app/admin/components/admin/AdminTopbar"

// FIXED: Import from theme-provider, NOT theme-switcher
import { ThemeProvider } from "@/components/theme-provider" 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div suppressHydrationWarning>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
          <AdminSidebar />

          <div className="flex-1 flex flex-col ml-3">
            <AdminTopbar />
            
            <main className="flex-1 p-6 lg:p-10">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}