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
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Filter state
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); // all | in | low | out

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
      if (!res.ok) throw new Error("Failed to update inventory");
      setOpen(false);
      setSelectedProduct("");
      setStock(0);
      setEditMode(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  // Filtering logic
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
    let matchesStock = true;
    const stock = product.inventory?.stock ?? 0;
    if (stockFilter === "in") matchesStock = stock > 0;
    if (stockFilter === "low") matchesStock = stock > 0 && stock < 10;
    if (stockFilter === "out") matchesStock = stock === 0;
    return matchesSearch && matchesStock;
  });

  return (
    <div className="space-y-6">
      <div className="pl-6 pt-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <div className="flex gap-2">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <PackageOpen className="mr-2 h-4 w-4" />
              Update Stock
            </Button>
            <Button
              variant="secondary"
              onClick={() => setOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              + Add Inventory
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-center mt-4">
          <input
            type="text"
            placeholder="Search product name..."
            className="border rounded px-3 py-2 w-full md:w-64"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2 w-full md:w-48"
            value={stockFilter}
            onChange={e => setStockFilter(e.target.value)}
          >
            <option value="all">All Stock</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock (&lt;10)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      <Dialog open={open} onOpenChange={(v: boolean) => { setOpen(v); if (!v) { setEditMode(false); setSelectedProduct(""); setStock(0); setError(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Inventory" : "Add Inventory"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Product</label>
              <select
                className="w-full border rounded p-2"
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
                required
                disabled={editMode}
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
              <Button type="button" variant="outline" onClick={() => { setOpen(false); setEditMode(false); }} disabled={submitting}>Cancel</Button>
              <Button
                type="submit"
                disabled={submitting || !selectedProduct}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {editMode ? "Update" : "Add"}
              </Button>
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
            {filteredProducts.map((product: any) => (
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditMode(true);
                      setOpen(true);
                      setSelectedProduct(product.id);
                      setStock(product.inventory?.stock ?? 0);
                    }}
                  >
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
