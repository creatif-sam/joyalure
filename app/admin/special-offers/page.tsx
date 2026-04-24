"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { uploadSpecialOfferImage } from "@/lib/supabase/special-offers-upload"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

type SpecialOffer = {
  id: string
  title: string
  description: string | null
  discount_percentage: number
  image_url: string | null
  link_url: string | null
  end_date: string | null
  is_active: boolean
  display_order: number
}

export default function SpecialOffersPage() {
  const [offers, setOffers] = useState<SpecialOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_percentage: 20,
    image_url: "",
    link_url: "",
    end_date: "",
    is_active: true,
    display_order: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchOffers()
  }, [])

  async function fetchOffers() {
    setLoading(true)
    const toastId = toast.loading("Loading special offers...")
    const { data, error } = await supabase
      .from("special_offers")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      toast.error("Failed to load offers. Check that the database table exists.", { id: toastId })
      console.error(error)
    } else {
      toast.dismiss(toastId)
      setOffers(data || [])
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (editingId) {
      // Update existing offer
      const { error } = await supabase
        .from("special_offers")
        .update(formData)
        .eq("id", editingId)

      if (error) {
        toast.error("Failed to update offer")
        console.error(error)
      } else {
        toast.success("Offer updated successfully")
        resetForm()
        fetchOffers()
      }
    } else {
      // Create new offer
      const { error } = await supabase
        .from("special_offers")
        .insert([formData])

      if (error) {
        toast.error("Failed to create offer")
        console.error(error)
      } else {
        toast.success("Offer created successfully")
        resetForm()
        fetchOffers()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this offer?")) return

    const { error } = await supabase
      .from("special_offers")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error("Failed to delete offer")
      console.error(error)
    } else {
      toast.success("Offer deleted successfully")
      fetchOffers()
    }
  }

  async function toggleActive(id: string, currentState: boolean) {
    const { error } = await supabase
      .from("special_offers")
      .update({ is_active: !currentState })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update offer status")
      console.error(error)
    } else {
      toast.success(`Offer ${!currentState ? "activated" : "deactivated"}`)
      fetchOffers()
    }
  }

  function handleEdit(offer: SpecialOffer) {
    setEditingId(offer.id)
    setFormData({
      title: offer.title,
      description: offer.description || "",
      discount_percentage: offer.discount_percentage,
      image_url: offer.image_url || "",
      link_url: offer.link_url || "",
      end_date: offer.end_date ? new Date(offer.end_date).toISOString().slice(0, 16) : "",
      is_active: offer.is_active,
      display_order: offer.display_order,
    })
    setShowForm(true)
  }

  function resetForm() {
    setEditingId(null)
    setFormData({
      title: "",
      description: "",
      discount_percentage: 20,
      image_url: "",
      link_url: "",
      end_date: "",
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
      const imageUrl = await uploadSpecialOfferImage(file)
      setFormData({ ...formData, image_url: imageUrl })
      toast.success("Image uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload image")
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
            Special Offers
          </h1>
          <p className="text-gray-600 dark:text-zinc-400 mt-1">
            Manage promotional offers and discounts
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-bold"
        >
          <Plus size={20} />
          {showForm ? "Cancel" : "New Offer"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Edit Offer" : "Create New Offer"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Discount % *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Link URL</label>
                <input
                  type="text"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                  placeholder="/products?offer=20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">End Date</label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
              <div className="flex items-center gap-2 pt-6">
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

            <div>
              <label className="block text-sm font-bold mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
              />
              {formData.image_url && (
                <div className="mt-2 relative w-40 h-40">
                  <Image
                    src={formData.image_url}
                    alt="Preview"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-bold"
              >
                {editingId ? "Update" : "Create"} Offer
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

      {/* Offers List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-zinc-400">Loading offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
          <p className="text-gray-600 dark:text-zinc-400">No special offers yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden"
            >
              {offer.image_url && (
                <div className="relative h-48">
                  <Image
                    src={offer.image_url}
                    alt={offer.title}
                    fill
                    className="object-cover"
                  />
                  {!offer.is_active && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold">
                        Inactive
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{offer.title}</h3>
                  <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                    -{offer.discount_percentage}%
                  </span>
                </div>
                {offer.description && (
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
                    {offer.description}
                  </p>
                )}
                {offer.end_date && (
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mb-3">
                    Ends: {new Date(offer.end_date).toLocaleDateString()}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-1"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(offer.id, offer.is_active)}
                    className={`px-3 py-2 rounded-md text-sm font-bold ${
                      offer.is_active
                        ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                        : "bg-green-100 hover:bg-green-200 text-green-800"
                    }`}
                  >
                    {offer.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
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
