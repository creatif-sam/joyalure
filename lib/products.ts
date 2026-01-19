export type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string
  rating: number
  reviews: number
}

export const products: Product[] = [
  {
    id: 1,
    name: "Hydrating Face Serum",
    price: 45,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
    description: "Organic hyaluronic acid serum for deep hydration",
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: "Gentle Cleansing Foam",
    price: 32,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
    description: "pH balanced vegan cleanser for all skin types",
    rating: 4.9,
    reviews: 98
  }
]
