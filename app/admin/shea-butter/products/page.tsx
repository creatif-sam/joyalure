"use client";

import { useEffect, useState } from "react";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  uploadSheaButterImage,
  uploadSheaButterVideo,
  deleteSheaButterImages,
  deleteSheaButterVideos
} from "@/lib/shea-butter-storage";
import ProductCard from "./components/ProductCard";
import ProductFormModal from "./components/ProductFormModal";

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  images: string[];
  videos: string[];
  features: string[];
  active: boolean;
}

const EMPTY_FORM: Product = {
  name: "", description: "", price: 0, stock_quantity: 0,
  images: [], videos: [], features: [""], active: true,
};

export default function SheaButterProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [formData, setFormData] = useState<Product>(EMPTY_FORM);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/shea-butter/products");
      if (res.ok) setProducts(await res.json());
    } catch (e) { console.error("Error fetching products:", e); }
    finally { setLoading(false); }
  };

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product ?? null);
    setFormData(product ? { ...product } : EMPTY_FORM);
    setShowModal(true);
  };

  const handleChange = (field: keyof Product, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = editingProduct ? "PUT" : "POST";
      const payload = editingProduct ? { ...formData, id: editingProduct.id } : formData;
      const res = await fetch("/api/shea-butter/products", {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchProducts();
        setShowModal(false);
        toast.success(editingProduct ? "Product updated!" : "Product created!");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to save product");
      }
    } catch { toast.error("An error occurred"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/shea-butter/products?id=${id}`, { method: "DELETE" });
      if (res.ok) { await fetchProducts(); toast.success("Product deleted!"); }
      else toast.error("Failed to delete product");
    } catch { toast.error("An error occurred"); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    try {
      const productId = editingProduct?.id || "temp-" + Date.now();
      for (let i = 0; i < files.length; i++) {
        const result = await uploadSheaButterImage(files[i], productId);
        if (result.url) setFormData((prev) => ({ ...prev, images: [...prev.images, result.url!] }));
        else if (result.error) toast.error(`Failed to upload ${files[i].name}: ${result.error}`);
      }
      toast.success(`Uploaded ${files.length} image(s)`);
    } catch { toast.error("Error uploading images"); }
    finally { setUploadingImage(false); e.target.value = ""; }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = formData.images[index];
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    try {
      const match = imageUrl.match(/shea-butter-images\/(.+)/);
      if (match) await deleteSheaButterImages([match[1]]);
    } catch { console.error("Error deleting image from storage"); }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingVideo(true);
    try {
      const productId = editingProduct?.id || "temp-" + Date.now();
      for (let i = 0; i < files.length; i++) {
        const result = await uploadSheaButterVideo(files[i], productId);
        if (result.url) setFormData((prev) => ({ ...prev, videos: [...prev.videos, result.url!] }));
        else if (result.error) toast.error(`Failed to upload ${files[i].name}: ${result.error}`);
      }
      toast.success(`Uploaded ${files.length} video(s)`);
    } catch { toast.error("Error uploading videos"); }
    finally { setUploadingVideo(false); e.target.value = ""; }
  };

  const handleRemoveVideo = async (index: number) => {
    const videoUrl = formData.videos[index];
    setFormData((prev) => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }));
    try {
      const match = videoUrl.match(/shea-butter-videos\/(.+)/);
      if (match) await deleteSheaButterVideos([match[1]]);
    } catch { console.error("Error deleting video from storage"); }
  };

  const addFeature = () => setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  const updateFeature = (idx: number, value: string) => {
    const next = [...formData.features]; next[idx] = value;
    setFormData((prev) => ({ ...prev, features: next }));
  };
  const removeFeature = (idx: number) =>
    setFormData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 uppercase">
            Shea Butter Products
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
            Manage your shea butter inventory
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-zinc-700">
          <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Products Yet</h3>
          <p className="text-gray-500 mb-6">Start by adding your first shea butter product</p>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-colors"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <ProductFormModal
          isEditing={!!editingProduct}
          formData={formData}
          submitting={submitting}
          uploadingImage={uploadingImage}
          uploadingVideo={uploadingVideo}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onImageUpload={handleImageUpload}
          onVideoUpload={handleVideoUpload}
          onRemoveImage={handleRemoveImage}
          onRemoveVideo={handleRemoveVideo}
          onAddFeature={addFeature}
          onUpdateFeature={updateFeature}
          onRemoveFeature={removeFeature}
        />
      )}
    </section>
  );
}
