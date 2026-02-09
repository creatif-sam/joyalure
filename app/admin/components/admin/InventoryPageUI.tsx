"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  PackageOpen, 
  Edit, 
  Search, 
  Filter, 
  AlertCircle,
  TrendingUp,
  PackageCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface InventoryProduct {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  inventory: { stock: number | null }[] | { stock: number | null } | null;
}

export default function InventoryPageUI({ products }: { products: InventoryProduct[] }) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [stock, setStock] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  // Institutional Helper: Safely handles both Array and Object responses from Supabase
  const getStockCount = (product: any): number => {
    if (!product.inventory) return 0;
    if (Array.isArray(product.inventory)) {
      return product.inventory[0]?.stock ?? 0;
    }
    return product.inventory.stock ?? 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch("/api/inventory/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: selectedProduct, stock }),
      });

      if (!res.ok) throw new Error("Database update failed");

      // Institutional Toast Feedback
      toast.success(editMode ? "Stock level adjusted" : "Stock entry created", {
        description: "The warehouse records have been updated successfully.",
        icon: <PackageCheck className="h-4 w-4 text-green-500" />
      });

      setOpen(false);
      window.location.reload(); 
    } catch (err: any) {
      toast.error("Operation failed", {
        description: err.message || "Please check your database connection."
      });
    } finally {
      setSubmitting(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
    const currentStock = getStockCount(product);
    
    if (stockFilter === "in") return matchesSearch && currentStock > 0;
    if (stockFilter === "low") return matchesSearch && currentStock > 0 && currentStock < 10;
    if (stockFilter === "out") return matchesSearch && currentStock === 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">Warehouse Control</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Institutional stock management for Joyalure.</p>
        </div>
        <Button 
          onClick={() => { setEditMode(false); setOpen(true); }}
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 shadow-lg shadow-green-600/20 active:scale-95 transition-all"
        >
          <PackageOpen className="mr-2 h-4 w-4" />
          Update Inventory
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search collections..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-green-600 transition dark:text-gray-100"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-3 bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl">
          <Filter size={14} className="text-gray-400" />
          <select
            className="py-2.5 text-sm bg-transparent outline-none cursor-pointer dark:text-gray-100 pr-2"
            value={stockFilter}
            onChange={e => setStockFilter(e.target.value)}
          >
            <option value="all">Full Inventory</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock (&lt;10)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* INVENTORY CARD */}
      <Card className="border dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <TrendingUp size={14} />
            Live Inventory Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y dark:divide-zinc-800">
            {filteredProducts.length === 0 ? (
               <div className="p-16 text-center text-gray-400 italic text-sm">No inventory matches your search.</div>
            ) : filteredProducts.map((product) => {
              const currentStock = getStockCount(product);
              const isLow = currentStock > 0 && currentStock < 10;
              const isOut = currentStock === 0;

              return (
                <div key={product.id} className="group flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-xl overflow-hidden border dark:border-zinc-800 bg-gray-100 dark:bg-zinc-950">
                      <img src={product.image_url || "/placeholder.jpg"} alt="" className="object-cover h-full w-full" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{product.title}</h3>
                      <p className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">Base Stock Item</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isLow && <AlertCircle size={14} className="text-yellow-500 animate-pulse" />}
                        <p className={`text-xl font-black tracking-tighter ${isOut ? 'text-red-500' : isLow ? 'text-yellow-500' : 'text-green-500'}`}>
                          {currentStock}
                        </p>
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Units on hand</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
                      onClick={() => {
                        setEditMode(true);
                        setSelectedProduct(product.id);
                        setStock(currentStock);
                        setOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* MODAL SECTION - Accessible & Dark-mode ready */}
    // app/admin/components/admin/InventoryPageUI.tsx


<Dialog 
  open={open} 
  onOpenChange={(v: boolean) => { 
    setOpen(v); 
    if (!v) { 
      setEditMode(false); 
      setSelectedProduct(""); 
      setStock(0); 
    } 
  }}
>
        <DialogContent className="sm:max-w-md dark:bg-zinc-950 dark:border-zinc-800 rounded-3xl border shadow-2xl">
          <DialogHeader className="text-left">
            {/* Required DialogTitle for accessibility */}
            <DialogTitle className="text-xl font-bold dark:text-gray-100">
              {editMode ? "Adjust Stock" : "New Inventory Entry"}
            </DialogTitle>
            <p className="text-xs text-gray-500 mt-1">
              {editMode ? "Modify the existing count for this skincare product." : "Create a new entry for a product in the warehouse."}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Product</label>
              <select
                className="w-full bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-3 text-sm outline-none dark:text-gray-100 focus:ring-2 focus:ring-green-600 transition"
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
                required
                disabled={editMode}
              >
                <option value="">Choose item...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Unit Quantity</label>
              <input
                type="number"
                className="w-full bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-3 text-sm font-bold dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-600 transition"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                min={0}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="dark:text-gray-400">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-green-600 text-white rounded-xl px-10 hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95">
                {submitting ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}