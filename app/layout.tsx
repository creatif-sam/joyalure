import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "sonner" 
import { ThemeProvider } from "next-themes" // Ensure this is installed

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-zinc-950 min-h-screen transition-colors duration-300">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange
        >
          <SpeedInsights />
          
          {children}

          {/* Institutional Toast Provider */}
          <Toaster 
            position="bottom-right" 
            richColors 
            expand={false} 
            closeButton
            // Optional: makes the toast match the theme
            theme="system" 
          />
        </ThemeProvider>
      </body>
    </html>
  )
}