"use client"

import { Loader2, ImageIcon, X } from "lucide-react"
import Image from "next/image"

interface Props {
  images: string[]
  uploading: boolean
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: (index: number) => void
}

export default function ImageUploadField({ images, uploading, onUpload, onRemove }: Props) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
        Product Images
      </label>

      <label className="relative cursor-pointer">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={onUpload}
          className="hidden"
          disabled={uploading}
        />
        <div className="w-full px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-dashed border-green-300 dark:border-green-700 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center justify-center gap-3">
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-green-600" />
              <span className="font-bold text-green-700 dark:text-green-400">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-5 w-5 text-green-600" />
              <span className="font-bold text-green-700 dark:text-green-400">Click to Upload Images</span>
              <span className="text-xs text-green-600">(Max 5MB each)</span>
            </>
          )}
        </div>
      </label>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <div className="relative h-24 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                <Image src={img} alt={`Product ${idx + 1}`} fill className="object-cover" />
              </div>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
