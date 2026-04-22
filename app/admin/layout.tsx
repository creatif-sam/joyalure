import "@/app/globals.css"
import AdminSidebar from "@/app/admin/components/admin/AdminSidebar"
import AdminTopbar from "@/app/admin/components/admin/AdminTopbar"
import { Toaster } from "sonner"

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
        <Toaster position="top-right" richColors closeButton />
        <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-150">
          <AdminSidebar />

          <div className="flex-1 flex flex-col min-w-0">
            <AdminTopbar />
            
            <main className="flex-1 p-5 lg:p-8">
              <div className="max-w-5xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}