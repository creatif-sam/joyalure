import Link from "next/link"
import { products } from "@/lib/products"
import Newsletter from "@/components/newsletter"
import HeroSlider from "@/components/hero-slider"
import FeaturedProducts from "@/components/featured-products"
import Testimonials from "@/components/testimonials"
import HomeCategories from "@/components/shop-category"
import SpecialOffers from "@/components/special-offers"
import RecentProducts from "@/components/recent-products"
import BlogPreview from "@/components/blog-preview"

export default function HomePage() {
  return (

  

    <main>
        <HeroSlider/>
        <HomeCategories/>
          <FeaturedProducts />
          <SpecialOffers />
          <RecentProducts />
          <BlogPreview/>
          <Testimonials />
     
      <Newsletter/>
    </main>
  )
}
