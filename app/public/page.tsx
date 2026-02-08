import Newsletter from "@/components/newsletter"
import HeroSlider from "@/components/hero-slider"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import Testimonials from "@/components/testimonials"
import HomeCategories from "@/components/home/shop-category"
import SpecialOffers from "@/components/special-offers"
import HomeProducts from "@/components/home/HomeProducts"
import BlogPreview from "@/components/blog-preview"

// 1. Import the data fetcher
import { getHomeProducts } from "@/lib/products"

export default async function HomePage() {
  
  // 2. Fetch the data from Supabase
  const { featured: rawFeatured, recent: rawRecent } = await getHomeProducts();

 
  const featured = rawFeatured?.map((product: any) => ({
    ...product,
    category: Array.isArray(product.category) ? product.category[0] : product.category
  })) || [];

  const recent = rawRecent?.map((product: any) => ({
    ...product,
    category: Array.isArray(product.category) ? product.category[0] : product.category
  })) || [];

  return (
    <main>
      <HeroSlider />
      <HomeCategories />
      
      {/* Institutional Note: Keeping FeaturedProducts if it's a separate 
         static section, but HomeProducts now handles the dynamic toggling. 
      */}
      <FeaturedProducts /> 
      
      <SpecialOffers />
      
      {/* 3. Passing the "Cleaned" data to HomeProducts */}
      <HomeProducts featured={featured} recent={recent} />
      
      <BlogPreview />
      <Testimonials />
      <Newsletter />
    </main>
  )
}