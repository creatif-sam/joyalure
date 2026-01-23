export default function RecentOrdersTable() {
  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="font-semibold mb-4">Recent Orders</h3>

      <table className="w-full text-sm">
        <thead className="text-left text-gray-500">
          <tr>
            <th className="py-2">Order</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="py-3">JL 1021</td>
            <td>Ava Mitchell</td>
            <td className="text-green-600">Completed</td>
            <td>$79.00</td>
          </tr>
          <tr className="border-t">
            <td className="py-3">JL 1022</td>
            <td>Liam Parker</td>
            <td className="text-yellow-600">Pending</td>
            <td>$55.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
