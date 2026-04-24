"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { uploadTestimonyScreenshot } from "@/lib/supabase/testimony-upload"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, Eye, EyeOff, Star } from "lucide-react"
import Image from "next/image"

type Testimony = {
  id: string
  customer_name: string
  customer_location: string | null
  testimony_text: string | null
  screenshot_url: string
  rating: number | null
  platform: string | null
  verified_purchase: boolean
  testimony_date: string | null
  is_featured: boolean
  is_active: boolean
  display_order: number
}

export default function TestimoniesAdminPage() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_location: "",
    testimony_text: "",
    screenshot_url: "",
    rating: 5,
    platform: "",
    verified_purchase: false,
    testimony_date: "",
    is_featured: false,
    is_active: true,
    display_order: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchTestimonies()
  }, [])

  async function fetchTestimonies() {
    setLoading(true)
    const { data, error } = await supabase
      .from("customer_testimonies")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      toast.error("Failed to fetch testimonies")
      console.error(error)
    } else {
      setTestimonies(data || [])
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (editingId) {
      // Update existing testimony
      const { error } = await supabase
        .from("customer_testimonies")
        .update(formData)
        .eq("id", editingId)

      if (error) {
        toast.error("Failed to update testimony")
        console.error(error)
      } else {
        toast.success("Testimony updated successfully")
        resetForm()
        fetchTestimonies()
      }
    } else {
      // Create new testimony
      const { error } = await supabase
        .from("customer_testimonies")
        .insert([formData])

      if (error) {
        toast.error("Failed to create testimony")
        console.error(error)
      } else {
        toast.success("Testimony created successfully")
        resetForm()
        fetchTestimonies()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this testimony?")) return

    const { error } = await supabase
      .from("customer_testimonies")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error("Failed to delete testimony")
      console.error(error)
    } else {
      toast.success("Testimony deleted successfully")
      fetchTestimonies()
    }
  }

  async function toggleActive(id: string, currentState: boolean) {
    const { error } = await supabase
      .from("customer_testimonies")
      .update({ is_active: !currentState })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update testimony status")
      console.error(error)
    } else {
      toast.success(`Testimony ${!currentState ? "activated" : "deactivated"}`)
      fetchTestimonies()
    }
  }

  async function toggleFeatured(id: string, currentState: boolean) {
    const { error } = await supabase
      .from("customer_testimonies")
      .update({ is_featured: !currentState })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update featured status")
      console.error(error)
    } else {
      toast.success(`Testimony ${!currentState ? "featured" : "unfeatured"}`)
      fetchTestimonies()
    }
  }

  function handleEdit(testimony: Testimony) {
    setEditingId(testimony.id)
    setFormData({
      customer_name: testimony.customer_name,
      customer_location: testimony.customer_location || "",
      testimony_text: testimony.testimony_text || "",
      screenshot_url: testimony.screenshot_url,
      rating: testimony.rating || 5,
      platform: testimony.platform || "",
      verified_purchase: testimony.verified_purchase,
      testimony_date: testimony.testimony_date || "",
      is_featured: testimony.is_featured,
      is_active: testimony.is_active,
      display_order: testimony.display_order,
    })
    setShowForm(true)
  }

  function resetForm() {
    setEditingId(null)
    setFormData({
      customer_name: "",
      customer_location: "",
      testimony_text: "",
      screenshot_url: "",
      rating: 5,
      platform: "",
      verified_purchase: false,
      testimony_date: "",
      is_featured: false,
      is_active: true,
      display_order: 0,
    })
    setShowForm(false)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const imageUrl = await uploadTestimonyScreenshot(file)
      setFormData({ ...formData, screenshot_url: imageUrl })
      toast.success("Screenshot uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload screenshot")
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100">
            Customer Testimonies
          </h1>
          <p className="text-gray-600 dark:text-zinc-400 mt-1">
            Upload and manage customer testimony screenshots
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-bold"
        >
          <Plus size={20} />
          {showForm ? "Cancel" : "New Testimony"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Edit Testimony" : "Add New Testimony"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Customer Name *</label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Location</label>
                <input
                  type="text"
                  value={formData.customer_location}
                  onChange={(e) => setFormData({ ...formData, customer_location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                  placeholder="e.g., United States"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Testimony Text</label>
              <textarea
                value={formData.testimony_text}
                onChange={(e) => setFormData({ ...formData, testimony_text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                rows={4}
                placeholder="Customer's testimony text..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Platform</label>
                <input
                  type="text"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                  placeholder="e.g., Instagram, Facebook"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Testimony Date</label>
                <input
                  type="date"
                  value={formData.testimony_date}
                  onChange={(e) => setFormData({ ...formData, testimony_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                />
              </div>
              <div className="flex items-center gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="verified_purchase"
                    checked={formData.verified_purchase}
                    onChange={(e) => setFormData({ ...formData, verified_purchase: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="verified_purchase" className="text-sm font-bold">
                    Verified Purchase
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_featured" className="text-sm font-bold">
                    Featured
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_active" className="text-sm font-bold">
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Screenshot *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
              />
              {formData.screenshot_url && (
                <div className="mt-2 relative w-full max-w-md h-64">
                  <Image
                    src={formData.screenshot_url}
                    alt="Preview"
                    fill
                    className="object-contain rounded-md border border-gray-300 dark:border-zinc-700"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!formData.screenshot_url}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingId ? "Update" : "Create"} Testimony
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-6 py-2 rounded-md font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonies List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-zinc-400">Loading testimonies...</p>
        </div>
      ) : testimonies.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
          <p className="text-gray-600 dark:text-zinc-400">No testimonies yet. Upload your first one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonies.map((testimony) => (
            <div
              key={testimony.id}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden"
            >
              <div className="relative h-64">
                <Image
                  src={testimony.screenshot_url}
                  alt={testimony.customer_name}
                  fill
                  className="object-contain bg-gray-50 dark:bg-zinc-800"
                />
                {!testimony.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold">
                      Inactive
                    </span>
                  </div>
                )}
                {testimony.is_featured && testimony.is_active && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                      <Star size={12} className="fill-current" />
                      Featured
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{testimony.customer_name}</h3>
                    {testimony.customer_location && (
                      <p className="text-xs text-gray-500 dark:text-zinc-500">
                        {testimony.customer_location}
                      </p>
                    )}
                  </div>
                  {testimony.rating != null && (
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < testimony.rating!
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
                {testimony.testimony_text && (
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2 line-clamp-3">
                    {testimony.testimony_text}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mb-3">
                  {testimony.platform && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                      {testimony.platform}
                    </span>
                  )}
                  {testimony.verified_purchase && (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(testimony)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-1"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleFeatured(testimony.id, testimony.is_featured)}
                    className={`px-3 py-2 rounded-md text-sm font-bold ${
                      testimony.is_featured
                        ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200"
                    }`}
                  >
                    <Star size={14} className={testimony.is_featured ? "fill-current" : ""} />
                  </button>
                  <button
                    onClick={() => toggleActive(testimony.id, testimony.is_active)}
                    className={`px-3 py-2 rounded-md text-sm font-bold ${
                      testimony.is_active
                        ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                        : "bg-green-100 hover:bg-green-200 text-green-800"
                    }`}
                  >
                    {testimony.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(testimony.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-bold"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
