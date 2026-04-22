"use client"

import { motion } from "framer-motion"
import { Edit, Trash2, Sparkles } from "lucide-react"
import Image from "next/image"

interface Product {
  id?: string
  name: string
  description: string
  price: number
  stock_quantity: number
  images: string[]
  videos: string[]
  features: string[]
  active: boolean
}

interface Props {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-lg border-2 border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-shadow"
    >
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20">
        {product.images && product.images.length > 0 ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Sparkles className="h-16 w-16 text-green-600/30" />
          </div>
        )}
        {!product.active && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Inactive
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xl font-black text-green-600">${product.price.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Stock: {product.stock_quantity}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="p-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </button>
            <button
              onClick={() => product.id && onDelete(product.id)}
              className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          {product.images.length > 0 && <div>📷 {product.images.length} image(s)</div>}
          {product.videos.length > 0 && <div>📹 {product.videos.length} video(s)</div>}
          {product.features.length > 0 && <div>✨ {product.features.length} feature(s)</div>}
        </div>
      </div>
    </motion.div>
  )
}
