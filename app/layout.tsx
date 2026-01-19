import "./globals.css"
import type { Metadata } from "next"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import CartDrawer from "@/components/cart-drawer"
import CurrencySwitcher from "@/components/CurrencySwitcher"


export const metadata: Metadata = {
  title: "Joyalure Organic Skincare",
  description: "Organic vegan skincare products"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
       <script src="https://kit.fontawesome.com/36b61cda8f.js" crossOrigin="anonymous"></script>
      </head>
      <body className="bg-gray-50 min-h-screen">
        <Navigation />
        {children}
        <Footer />
        <CartDrawer />
        <CurrencySwitcher />
      </body>
    </html>
  )
}
