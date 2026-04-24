"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { uploadSpecialOfferImage } from "@/lib/supabase/special-offers-upload"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, Eye, EyeOff, X, ImageIcon } from "lucide-react"
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

const EMPTY_FORM = {
  title: "",
  description: "",
  discount_percentage: 20,
  image_url: "",
  link_url: "",
  end_date: "",
  is_active: true,
  display_order: 0,
}

const INPUT =
  "w-full px-2.5 py-1.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500"

const LABEL = "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1"

export default function SpecialOffersPage() {
  const supabase = useRef(createClient()).current
  const [offers, setOffers] = useState<SpecialOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ ...EMPTY_FORM })

  useEffect(() => { fetchOffers() }, [])

  async function fetchOffers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("special_offers")
        .select("*")
        .order("display_order", { ascending: true })
      if (error) throw error
      setOffers(data || [])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      toast.error(`Failed to load: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const tid = toast.loading(editingId ? "Updating…" : "Creating…")
    try {
      const payload = {
        ...formData,
        end_date: formData.end_date || null,
        description: formData.description || null,
        link_url: formData.link_url || null,
        image_url: formData.image_url || null,
      }
      if (editingId) {
        const { error } = await supabase.from("special_offers").update(payload).eq("id", editingId)
        if (error) throw error
        toast.success("Offer updated", { id: tid })
      } else {
        const { error } = await supabase.from("special_offers").insert([payload])
        if (error) throw error
        toast.success("Offer created", { id: tid })
      }
      resetForm()
      fetchOffers()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      toast.error(`Error: ${msg}`, { id: tid })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    const tid = toast.loading("Deleting…")
    try {
      const { error } = await supabase.from("special_offers").delete().eq("id", id)
      if (error) throw error
      setOffers((prev) => prev.filter((o) => o.id !== id))
      toast.success("Deleted", { id: tid })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      toast.error(`Error: ${msg}`, { id: tid })
    }
  }

  async function toggleActive(id: string, current: boolean) {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, is_active: !current } : o)))
    try {
      const { error } = await supabase.from("special_offers").update({ is_active: !current }).eq("id", id)
      if (error) throw error
      toast.success(!current ? "Activated" : "Deactivated")
    } catch {
      setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, is_active: current } : o)))
      toast.error("Failed to update status")
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
    setFormData({ ...EMPTY_FORM })
    setShowForm(false)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const tid = toast.loading("Uploading image…")
    try {
      const url = await uploadSpecialOfferImage(file)
      setFormData((prev) => ({ ...prev, image_url: url }))
      toast.success("Image uploaded", { id: tid })
    } catch {
      toast.error("Upload failed", { id: tid })
    } finally {
      setUploading(false)
    }
  }

  const set = (k: string, v: unknown) => setFormData((prev) => ({ ...prev, [k]: v }))

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
            Special Offers
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {offers.length} offer{offers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { if (showForm && !editingId) resetForm(); else setShowForm((v) => !v) }}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs font-bold px-3 py-1.5 rounded-md transition-colors"
        >
          {showForm && !editingId ? <><X size={13} /> Cancel</> : <><Plus size={13} /> New Offer</>}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {editingId ? "Edit Offer" : "New Offer"}
            </p>
            <button onClick={resetForm} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Title *</label>
                <input className={INPUT} required value={formData.title} onChange={(e) => set("title", e.target.value)} placeholder="Summer Sale" />
              </div>
              <div>
                <label className={LABEL}>Discount %</label>
                <input className={INPUT} type="number" min={0} max={100} value={formData.discount_percentage} onChange={(e) => set("discount_percentage", parseInt(e.target.value) || 0)} />
              </div>
            </div>

            <div>
              <label className={LABEL}>Description</label>
              <textarea className={INPUT} rows={2} value={formData.description} onChange={(e) => set("description", e.target.value)} placeholder="Optional description…" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Link URL</label>
                <input className={INPUT} value={formData.link_url} onChange={(e) => set("link_url", e.target.value)} placeholder="/products" />
              </div>
              <div>
                <label className={LABEL}>End Date</label>
                <input className={INPUT} type="datetime-local" value={formData.end_date} onChange={(e) => set("end_date", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Display Order</label>
                <input className={INPUT} type="number" value={formData.display_order} onChange={(e) => set("display_order", parseInt(e.target.value) || 0)} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => set("is_active", e.target.checked)} className="w-4 h-4 accent-green-600" />
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Active</span>
                </label>
              </div>
            </div>

            <div>
              <label className={LABEL}>Image</label>
              <div className="flex items-start gap-3">
                <label className="flex-1 flex items-center gap-2 px-3 py-2 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-md cursor-pointer hover:border-green-500 transition-colors">
                  <ImageIcon size={14} className="text-zinc-400 shrink-0" />
                  <span className="text-xs text-zinc-500">{uploading ? "Uploading…" : "Choose image"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
                {formData.image_url && (
                  <div className="relative w-14 h-14 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
                    <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={saving || uploading} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-1.5 rounded-md disabled:opacity-50 transition-colors">
                {saving ? "Saving…" : editingId ? "Update" : "Create"}
              </button>
              <button type="button" onClick={resetForm} className="text-xs font-bold px-4 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">No special offers yet</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">Create your first offer to get started</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
          {offers.map((offer) => (
            <div key={offer.id} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="w-10 h-10 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 relative">
                {offer.image_url ? (
                  <Image src={offer.image_url} alt={offer.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={14} className="text-zinc-300" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{offer.title}</p>
                  <span className="shrink-0 text-[10px] font-bold bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded-full">
                    -{offer.discount_percentage}%
                  </span>
                  {!offer.is_active && (
                    <span className="shrink-0 text-[10px] font-bold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                {offer.end_date && (
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                    Ends {new Date(offer.end_date).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button title="Edit" onClick={() => handleEdit(offer)} className="p-1.5 rounded-md text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                  <Pencil size={13} />
                </button>
                <button
                  title={offer.is_active ? "Deactivate" : "Activate"}
                  onClick={() => toggleActive(offer.id, offer.is_active)}
                  className={`p-1.5 rounded-md transition-colors ${offer.is_active ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30" : "text-zinc-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30"}`}
                >
                  {offer.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button title="Delete" onClick={() => handleDelete(offer.id, offer.title)} className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
