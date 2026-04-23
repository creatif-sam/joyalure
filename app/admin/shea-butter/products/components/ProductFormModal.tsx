"use client"

import { motion } from "framer-motion"
import { X, CheckCircle2, Loader2 } from "lucide-react"
import ImageUploadField from "./ImageUploadField"
import VideoUploadField from "./VideoUploadField"
import FeaturesField from "./FeaturesField"

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
  isEditing: boolean
  formData: Product
  submitting: boolean
  uploadingImage: boolean
  uploadingVideo: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  onChange: (field: keyof Product, value: any) => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  onRemoveVideo: (index: number) => void
  onAddFeature: () => void
  onUpdateFeature: (index: number, value: string) => void
  onRemoveFeature: (index: number) => void
}

export default function ProductFormModal({
  isEditing, formData, submitting, uploadingImage, uploadingVideo,
  onClose, onSubmit, onChange,
  onImageUpload, onVideoUpload, onRemoveImage, onRemoveVideo,
  onAddFeature, onUpdateFeature, onRemoveFeature,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-zinc-900 rounded-md p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-md focus:border-green-600 focus:outline-none"
              placeholder="Premium Shea Butter Body Cream"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-md focus:border-green-600 focus:outline-none resize-none"
              placeholder="Describe your product..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => onChange("price", parseFloat(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-md focus:border-green-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => onChange("stock_quantity", parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-md focus:border-green-600 focus:outline-none"
              />
            </div>
          </div>

          <ImageUploadField
            images={formData.images}
            uploading={uploadingImage}
            onUpload={onImageUpload}
            onRemove={onRemoveImage}
          />

          <VideoUploadField
            videos={formData.videos}
            uploading={uploadingVideo}
            onUpload={onVideoUpload}
            onRemove={onRemoveVideo}
          />

          <FeaturesField
            features={formData.features}
            onAdd={onAddFeature}
            onUpdate={onUpdateFeature}
            onRemove={onRemoveFeature}
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => onChange("active", e.target.checked)}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <label htmlFor="active" className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Product is active and visible in store
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
              {submitting ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
