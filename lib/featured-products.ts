export type FeaturedProduct = {
  id: number
  name: string
  price: number
  image: string
}

export const featuredProducts: FeaturedProduct[] = [
  {
    id: 1,
    name: "Hydrating Face Serum",
    price: 45,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883"
  },
  {
    id: 2,
    name: "Gentle Cleansing Foam",
    price: 32,
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a"
  },
  {
    id: 3,
    name: "Nourishing Night Cream",
    price: 58,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108"
  },
  {
    id: 4,
    name: "Vitamin C Brightening Mask",
    price: 38,
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af"
  }
]
