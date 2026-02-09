"use client"

import ToggleRecent from "./ToggleRecent"
import type { Product } from "@/types/product"

interface RecentProductsTableProps {
  products: Product[]
}

export default function RecentProductsTable({
  products
}: RecentProductsTableProps) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden mt-8">
      <h2 className="px-4 py-3 text-lg font-semibold border-b">
        Recent Products
      </h2>

      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Product</th>
            <th className="px-4 py-3 text-left">Price</th>
            <th className="px-4 py-3 text-left">Recent</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-6 text-center text-gray-500"
              >
                No recent products
              </td>
            </tr>
          )}

          {products.map(product => (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-3 font-medium">
                {product.title}
              </td>

              <td className="px-4 py-3">
                ${product.price}
              </td>

              <td className="px-4 py-3">
                <ToggleRecent
                  productId={product.id}
                  initialValue={product.is_recent}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
