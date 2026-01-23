import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageOpen, Edit, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { unstable_noStore } from "next/cache";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
};

export default async function AdminInventory() {
  unstable_noStore();
  const supabase = await createClient();

  // Fetch products with stock information
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('id');

  // For now, assume stock is a field in products table
  // You can modify this based on your actual database schema
  const lowStockProducts = products?.filter(product => (product as any).stock < 10) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Button>
          <PackageOpen className="mr-2 h-4 w-4" />
          Update Stock
        </Button>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700">
              {lowStockProducts.length} product(s) are running low on stock.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products?.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">${product.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">Stock</p>
                    <p className={`text-lg font-bold ${(product as any).stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {(product as any).stock || 0}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}