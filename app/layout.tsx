import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "sonner" 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <SpeedInsights />
        
        {children}

        {/* Institutional Toast Provider */}
        <Toaster 
          position="bottom-right" 
          richColors 
          expand={false} 
          closeButton
        />
      </body>
    </html>
  )
}