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

interface InventoryPageUIProps {
  products: InventoryProduct[];
  lowStockProducts: InventoryProduct[];
}

export default function InventoryPageUI({ products, lowStockProducts }: InventoryPageUIProps) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [stock, setStock] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

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
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 px-4 md:px-0">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100 italic uppercase">Warehouse Control</h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400 font-medium tracking-tight">Institutional stock management for Joyalure.</p>
        </div>
        <Button 
          onClick={() => { setEditMode(false); setOpen(true); }}
          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-6 md:py-2 shadow-lg shadow-green-600/20 active:scale-95 transition-all font-bold uppercase text-[10px] tracking-widest"
        >
          <PackageOpen className="mr-2 h-4 w-4" />
          Update Inventory
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-3 p-3 md:p-4 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search collections..."
            className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-green-600 transition dark:text-gray-100"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-3 bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl">
          <Filter size={14} className="text-gray-400" />
          <select
            className="w-full md:w-auto py-3 text-[10px] font-black uppercase tracking-widest bg-transparent outline-none cursor-pointer dark:text-gray-100 pr-2"
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

      {/* INVENTORY LISTING */}
      <Card className="border dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="border-b dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 p-4 md:p-6">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
            <TrendingUp size={14} className="text-green-500" />
            Live Inventory Tracking ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y dark:divide-zinc-800">
            {filteredProducts.length === 0 ? (
               <div className="p-16 text-center text-gray-400 italic text-sm">No inventory matches search.</div>
            ) : filteredProducts.map((product) => {
              const currentStock = getStockCount(product);
              const isLow = currentStock > 0 && currentStock < 10;
              const isOut = currentStock === 0;

              return (
                <div key={product.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors gap-4">
                  <div className="flex items-center space-x-4 md:space-x-5">
                    <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl overflow-hidden border dark:border-zinc-800 bg-gray-100 dark:bg-zinc-950">
                      <img src={product.image_url || "/placeholder.jpg"} alt="" className="object-cover h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 italic truncate">{product.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest shrink-0">Base Stock Item</span>
                        {isLow && <span className="bg-yellow-500/10 text-yellow-500 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-yellow-500/20 shrink-0">Critical Low</span>}
                        {isOut && <span className="bg-red-500/10 text-red-500 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-red-500/20 shrink-0">Stock Out</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <div className="flex items-center md:justify-end gap-2">
                        {isLow && <AlertCircle size={14} className="text-yellow-500 animate-pulse" />}
                        <p className={`text-xl md:text-2xl font-black tracking-tighter ${isOut ? 'text-red-500' : isLow ? 'text-yellow-500' : 'text-green-600'}`}>
                          {currentStock}
                        </p>
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">On Hand</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl h-10 w-10 md:h-10 md:w-10 bg-gray-100 md:bg-transparent dark:bg-zinc-800 md:dark:bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-90"
                      onClick={() => {
                        setEditMode(true);
                        setSelectedProduct(product.id);
                        setStock(currentStock);
                        setOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 text-zinc-500 md:text-zinc-400 group-hover:text-green-600 transition-colors" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* MODAL SECTION - Mobile Responsive */}
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
        <DialogContent className="w-[95vw] md:max-w-md dark:bg-zinc-950 dark:border-zinc-800 rounded-[2rem] border shadow-2xl p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-black uppercase italic dark:text-gray-100">
              {editMode ? "Adjust Stock" : "New Entry"}
            </DialogTitle>
            <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-tight">
              {editMode ? "Modifying warehouse count for existing product." : "Registering new unit quantity in system."}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Product Identity</label>
              <select
                className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-4 text-sm font-bold outline-none dark:text-gray-100 focus:ring-2 focus:ring-green-600 transition appearance-none"
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
                required
                disabled={editMode}
              >
                <option value="">Select archived item...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Unit Quantity</label>
              <input
                type="number"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-4 text-sm font-black dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-600 transition"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                min={0}
                required
              />
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="w-full md:w-auto text-[10px] font-black uppercase tracking-widest dark:text-zinc-500">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="w-full md:w-auto bg-green-600 text-white rounded-xl px-10 py-6 md:py-2 font-black uppercase text-[10px] tracking-widest hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95">
                {submitting ? "Syncing..." : "Commit Entry"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}