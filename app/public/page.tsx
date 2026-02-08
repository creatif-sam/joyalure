import Newsletter from "@/components/newsletter"
import HeroSlider from "@/components/hero-slider"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import Testimonials from "@/components/testimonials"
import HomeCategories from "@/components/home/shop-category"
import SpecialOffers from "@/components/special-offers"
import HomeProducts from "@/components/home/HomeProducts"
import BlogPreview from "@/components/blog-preview"

// 1. Import the data fetcher we created
import { getHomeProducts } from "@/lib/products"

// 2. Make the function 'async' so we can use 'await'
export default async function HomePage() {
  
  // 3. Fetch the data from Supabase
  const { featured, recent } = await getHomeProducts();

  return (
    <main>
      <HeroSlider />
      <HomeCategories />
      
      {/* NOTE: You have 'FeaturedProducts' and 'HomeProducts' both here. 
        'HomeProducts' is the one we optimized to toggle between both lists. 
      */}
      <FeaturedProducts /> 
      
      <SpecialOffers />
      
      {/* 4. Now 'featured' and 'recent' are defined and can be passed here */}
      <HomeProducts featured={featured} recent={recent} />
      
      <BlogPreview />
      <Testimonials />
      <Newsletter />
    </main>
  )
}