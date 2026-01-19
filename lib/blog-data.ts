export type BlogSection = {
  id: string
  title: string
  content: string[]
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  image: string
  date: string
  author: string
  sections: BlogSection[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "building-a-simple-skincare-routine",
    title: "Building a Simple Skincare Routine",
    excerpt:
      "A minimal skincare routine that works for all skin types without irritation or complexity.",
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a",
    date: "Jan 08, 2026",
    author: "Skin Expert",
    sections: [
      {
        id: "why-simple",
        title: "Why Simple Skincare Works",
        content: [
          "A simple skincare routine reduces the risk of irritation.",
          "Fewer products allow your skin barrier to remain balanced."
        ]
      },
      {
        id: "essential-steps",
        title: "The Essential Steps",
        content: [
          "Cleanse gently without stripping oils.",
          "Hydrate with a serum that suits your skin type.",
          "Seal moisture with a nourishing moisturizer."
        ]
      },
      {
        id: "consistency",
        title: "Consistency Over Quantity",
        content: [
          "Consistency is more important than variety.",
          "Listen to your skin and adjust when needed."
        ]
      }
    ]
  }
]
