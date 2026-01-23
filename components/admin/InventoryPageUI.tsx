"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PackageOpen, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventoryPageUI({ products, lowStockProducts }: { products: any[]; lowStockProducts: any[] }) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [stock, setStock] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/inventory/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: selectedProduct, stock }),
      });
      if (!res.ok) throw new Error("Failed to add inventory");
      setOpen(false);
      setSelectedProduct("");
      setStock(0);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex gap-2">
          <Button>
            <PackageOpen className="mr-2 h-4 w-4" />
            Update Stock
          </Button>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            + Add Inventory
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inventory</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Product</label>
              <select
                className="w-full border rounded p-2"
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
                required
              >
                <option value="">Select a product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Stock</label>
              <input
                type="number"
                className="w-full border rounded p-2"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                min={0}
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
              <Button type="submit" disabled={submitting || !selectedProduct}>Add</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products?.map((product: any) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">${product.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">Stock</p>
                    <p className={`text-lg font-bold ${(product.inventory?.stock ?? 0) < 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.inventory?.stock ?? 0}
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
