"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import type { Product } from "@/types/product"

interface ProductViewModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProductViewModal({
  product,
  open,
  onOpenChange
}: ProductViewModalProps) {
  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {product.image_url && (
            <div className="relative w-48 h-48">
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-cover rounded border"
              />
            </div>
          )}

          <div className="w-full">
            <p className="font-semibold text-lg text-gray-900 mb-2">
              ${product.price}
            </p>

            {product.description && (
              <p className="text-gray-700 mb-2 text-sm">
                {product.description}
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
              <p className="text-[10px] text-gray-400 uppercase">
                Slug: {product.slug ?? "—"}
              </p>
              <p className="text-[10px] text-gray-400 uppercase">
                ID: {product.id}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
