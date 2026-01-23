import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageOpen, Edit, AlertTriangle } from "lucide-react";
import InventoryPageUI from "@/components/admin/InventoryPageUI";
import Link from "next/link";
import { unstable_noStore } from "next/cache";


type InventoryProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  inventory: {
    stock: number;
  } | null;
};

export default async function AdminInventory() {
  // Fetch all products for the dropdown
  unstable_noStore();
  const cookieStore = cookies();
  const supabase = createServerSupabaseClient({ cookies: cookieStore });

  // Fetch products joined with inventory (stock defaults to 0 if missing)
  const { data: products } = await supabase
    .from('products')
    .select('id, title, price, image_url, inventory(stock)')
    .order('title');

  // Low stock based on inventory table
  const lowStockProducts = products?.filter(product => (product.inventory?.stock ?? 0) < 10) || [];

  return (
    <InventoryPageUI products={products} lowStockProducts={lowStockProducts} />
  );
}
