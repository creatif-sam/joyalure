"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Sparkles, Upload, X, CheckCircle2, Loader2, ImageIcon, Video } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { 
  uploadSheaButterImage, 
  uploadSheaButterVideo, 
  deleteSheaButterImages,
  deleteSheaButterVideos 
} from "@/lib/shea-butter-storage";

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

export default function SheaButterProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    images: [],
    videos: [],
    features: [""],
    active: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shea-butter/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: 0,
        stock_quantity: 0,
        images: [],
        videos: [],
        features: [""],
        active: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const payload = editingProduct ? { ...formData, id: editingProduct.id } : formData;
      
      const response = await fetch('/api/shea-butter/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchProducts();
        setShowModal(false);
        toast.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('An error occurred while saving the product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id:string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/shea-butter/products?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProducts();
        toast.success('Product deleted successfully!');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('An error occurred while deleting the product');
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const productId = editingProduct?.id || 'temp-' + Date.now();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadSheaButterImage(file, productId);
        
        if (result.url) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, result.url!],
          }));
        } else if (result.error) {
          toast.error(`Failed to upload ${file.name}: ${result.error}`);
        }
      }
      toast.success(`Successfully uploaded ${files.length} image(s)`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('An error occurred while uploading images');
    } finally {
      setUploadingImage(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = formData.images[index];
    
    // Remove from state immediately
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    // Try to delete from storage
    try {
      const pathMatch = imageUrl.match(/shea-butter-images\/(.+)/);
      if (pathMatch) {
        await deleteSheaButterImages([pathMatch[1]]);
      }
    } catch (error) {
      console.error('Error deleting image from storage:', error);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingVideo(true);
    try {
      const productId = editingProduct?.id || 'temp-' + Date.now();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadSheaButterVideo(file, productId);
        
        if (result.url) {
          setFormData(prev => ({
            ...prev,
            videos: [...prev.videos, result.url!],
          }));
        } else if (result.error) {
          toast.error(`Failed to upload ${file.name}: ${result.error}`);
        }
      }
      toast.success(`Successfully uploaded ${files.length} video(s)`);
    } catch (error) {
      console.error('Error uploading videos:', error);
      toast.error('An error occurred while uploading videos');
    } finally {
      setUploadingVideo(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removeVideo = async (index: number) => {
    const videoUrl = formData.videos[index];
    
    // Remove from state immediately
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));

    // Try to delete from storage
    try {
      const pathMatch = videoUrl.match(/shea-butter-videos\/(.+)/);
      if (pathMatch) {
        await deleteSheaButterVideos([pathMatch[1]]);
      }
    } catch (error) {
      console.error('Error deleting video from storage:', error);
    }
  };

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
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

      {/* Products List */}
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
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-lg border-2 border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-shadow"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Sparkles className="h-16 w-16 text-green-600/30" />
                  </div>
                )}
                {!product.active && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Inactive
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xl font-black text-green-600">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Stock: {product.stock_quantity}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="p-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button
                      onClick={() => product.id && handleDelete(product.id)}
                      className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  {product.images.length > 0 && (
                    <div>📷 {product.images.length} image(s)</div>
                  )}
                  {product.videos.length > 0 && (
                    <div>📹 {product.videos.length} video(s)</div>
                  )}
                  {product.features.length > 0 && (
                    <div>✨ {product.features.length} feature(s)</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={( e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:border-green-600 focus:outline-none"
                  placeholder="Premium Shea Butter Body Cream"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:border-green-600 focus:outline-none resize-none"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:border-green-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:border-green-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Product Images
                </label>
                
                {/* Upload Button */}
                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <div className="w-full px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-dashed border-green-300 dark:border-green-700 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center justify-center gap-3">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                        <span className="font-bold text-green-700 dark:text-green-400">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-5 w-5 text-green-600" />
                        <span className="font-bold text-green-700 dark:text-green-400">Click to Upload Images</span>
                        <span className="text-xs text-green-600">(Max 5MB each)</span>
                      </>
                    )}
                  </div>
                </label>

                {/* Image Previews */}
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <div className="relative h-24 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                          <Image
                            src={img}
                            alt={`Product ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Product Videos
                </label>
                
                {/* Upload Button */}
                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                    multiple
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploadingVideo}
                  />
                  <div className="w-full px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors flex items-center justify-center gap-3">
                    {uploadingVideo ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                        <span className="font-bold text-amber-700 dark:text-amber-400">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Video className="h-5 w-5 text-amber-600" />
                        <span className="font-bold text-amber-700 dark:text-amber-400">Click to Upload Videos</span>
                        <span className="text-xs text-amber-600">(Max 50MB each)</span>
                      </>
                    )}
                  </div>
                </label>

                {/* Video List */}
                {formData.videos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.videos.map((vid, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg group">
                        <Video className="h-5 w-5 text-amber-600 flex-shrink-0" />
                        <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                          Video {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeVideo(idx)}
                          className="p-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Product Features
                </label>
                <div className="space-y-2">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(idx, e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:border-green-600 focus:outline-none"
                        placeholder="e.g., 100% Natural Ingredients"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="p-2 bg-red-100 hover:bg-red-200 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="w-full py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Feature
                  </button>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="active" className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Product is active and visible in store
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                  {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}
