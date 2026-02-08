import type { Metadata } from "next"
import Navigation from "@/components/navigation/Navigation"
import Footer from "@/components/Footer"
import CartDrawer from "@/components/cart-drawer"
import CurrencySwitcher from "@/components/CurrencySwitcher"

export const metadata: Metadata = {
  title: "Joyalure Organic Skincare",
  description: "Organic vegan skincare products",
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
      <CartDrawer />
      <CurrencySwitcher />
    </>
  )
}
