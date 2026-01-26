export interface Product {
  id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
  slug: string | null
  is_featured: boolean
  is_recent: boolean
  active: boolean
  created_at: string
}
