"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { useState } from "react"

export default function ProductViewModal({ product, open, onOpenChange }) {
  if (!product) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product.title || product.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.title || product.name}
              className="w-48 h-48 object-cover rounded border"
            />
          )}
          <div className="w-full">
            <p className="font-semibold text-lg text-gray-900 mb-2">
              ${product.price}
            </p>
            {product.description && (
              <p className="text-gray-700 mb-2">{product.description}</p>
            )}
            {product.slug && (
              <p className="text-xs text-gray-500">Slug: {product.slug}</p>
            )}
            <p className="text-xs text-gray-500">ID: {product.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
