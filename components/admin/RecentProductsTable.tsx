import Link from "next/link"
import ToggleRecent from "./ToggleRecent"

export default function RecentProductsTable({ products }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden mt-8">
      <h2 className="px-4 py-3 text-lg font-semibold border-b">Recent Products</h2>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Recent</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                No recent products
              </td>
            </tr>
          )}
          {products.map(product => (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-3 font-medium">{product.name}</td>
              <td className="px-4 py-3">${product.price}</td>
              <td className="px-4 py-3">
                <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded" />
              </td>
              <td className="px-4 py-3">
                <ToggleRecent productId={product.id} initialValue={product.is_recent} />
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/admin/products/${product.id}`} className="text-sm text-blue-600 hover:underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
