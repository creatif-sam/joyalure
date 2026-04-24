"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { uploadTestimonyScreenshot } from "@/lib/supabase/testimony-upload"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, Eye, EyeOff, Star, X, ImageIcon } from "lucide-react"
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

const EMPTY_FORM = {
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
}

const INPUT =
  "w-full px-2.5 py-1.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500"

const LABEL = "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1"

export default function TestimoniesAdminPage() {
  const supabase = useRef(createClient()).current
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ ...EMPTY_FORM })

  useEffect(() => { fetchTestimonies() }, [])

  async function fetchTestimonies() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("customer_testimonies")
        .select("*")
        .order("display_order", { ascending: true })
      if (error) throw error
      setTestimonies(data || [])
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
        customer_location: formData.customer_location || null,
        testimony_text: formData.testimony_text || null,
        platform: formData.platform || null,
        testimony_date: formData.testimony_date || null,
      }
      if (editingId) {
        const { error } = await supabase.from("customer_testimonies").update(payload).eq("id", editingId)
        if (error) throw error
        toast.success("Testimony updated", { id: tid })
      } else {
        const { error } = await supabase.from("customer_testimonies").insert([payload])
        if (error) throw error
        toast.success("Testimony added", { id: tid })
      }
      resetForm()
      fetchTestimonies()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      toast.error(`Error: ${msg}`, { id: tid })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete testimony from "${name}"?`)) return
    const tid = toast.loading("Deleting…")
    try {
      const { error } = await supabase.from("customer_testimonies").delete().eq("id", id)
      if (error) throw error
      setTestimonies((prev) => prev.filter((t) => t.id !== id))
      toast.success("Deleted", { id: tid })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      toast.error(`Error: ${msg}`, { id: tid })
    }
  }

  async function toggleActive(id: string, current: boolean) {
    setTestimonies((prev) => prev.map((t) => (t.id === id ? { ...t, is_active: !current } : t)))
    try {
      const { error } = await supabase.from("customer_testimonies").update({ is_active: !current }).eq("id", id)
      if (error) throw error
      toast.success(!current ? "Activated" : "Deactivated")
    } catch {
      setTestimonies((prev) => prev.map((t) => (t.id === id ? { ...t, is_active: current } : t)))
      toast.error("Failed to update status")
    }
  }

  async function toggleFeatured(id: string, current: boolean) {
    setTestimonies((prev) => prev.map((t) => (t.id === id ? { ...t, is_featured: !current } : t)))
    try {
      const { error } = await supabase.from("customer_testimonies").update({ is_featured: !current }).eq("id", id)
      if (error) throw error
      toast.success(!current ? "Featured" : "Unfeatured")
    } catch {
      setTestimonies((prev) => prev.map((t) => (t.id === id ? { ...t, is_featured: current } : t)))
      toast.error("Failed to update featured status")
    }
  }

  function handleEdit(testimony: Testimony) {
    setEditingId(testimony.id)
    setFormData({
      customer_name: testimony.customer_name,
      customer_location: testimony.customer_location || "",
      testimony_text: testimony.testimony_text || "",
      screenshot_url: testimony.screenshot_url,
      rating: testimony.rating ?? 5,
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
    setFormData({ ...EMPTY_FORM })
    setShowForm(false)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const tid = toast.loading("Uploading screenshot…")
    try {
      const url = await uploadTestimonyScreenshot(file)
      setFormData((prev) => ({ ...prev, screenshot_url: url }))
      toast.success("Screenshot uploaded", { id: tid })
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
            Customer Testimonies
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {testimonies.length} testimon{testimonies.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <button
          onClick={() => { if (showForm && !editingId) resetForm(); else setShowForm((v) => !v) }}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs font-bold px-3 py-1.5 rounded-md transition-colors"
        >
          {showForm && !editingId ? <><X size={13} /> Cancel</> : <><Plus size={13} /> New Testimony</>}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {editingId ? "Edit Testimony" : "New Testimony"}
            </p>
            <button onClick={resetForm} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Customer Name *</label>
                <input className={INPUT} required value={formData.customer_name} onChange={(e) => set("customer_name", e.target.value)} placeholder="Jane Doe" />
              </div>
              <div>
                <label className={LABEL}>Location</label>
                <input className={INPUT} value={formData.customer_location} onChange={(e) => set("customer_location", e.target.value)} placeholder="United States" />
              </div>
            </div>

            <div>
              <label className={LABEL}>Testimony Text</label>
              <textarea className={INPUT} rows={3} value={formData.testimony_text} onChange={(e) => set("testimony_text", e.target.value)} placeholder="Customer's words…" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={LABEL}>Rating</label>
                <select className={INPUT} value={formData.rating} onChange={(e) => set("rating", parseInt(e.target.value))}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n !== 1 ? "s" : ""}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Platform</label>
                <input className={INPUT} value={formData.platform} onChange={(e) => set("platform", e.target.value)} placeholder="Instagram" />
              </div>
              <div>
                <label className={LABEL}>Date</label>
                <input className={INPUT} type="date" value={formData.testimony_date} onChange={(e) => set("testimony_date", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Display Order</label>
                <input className={INPUT} type="number" value={formData.display_order} onChange={(e) => set("display_order", parseInt(e.target.value) || 0)} />
              </div>
              <div className="flex items-end gap-4 pb-1">
                {[
                  { key: "verified_purchase", label: "Verified" },
                  { key: "is_featured", label: "Featured" },
                  { key: "is_active", label: "Active" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData[key as keyof typeof formData] as boolean}
                      onChange={(e) => set(key, e.target.checked)}
                      className="w-3.5 h-3.5 accent-green-600"
                    />
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={LABEL}>Screenshot *</label>
              <div className="flex items-start gap-3">
                <label className="flex-1 flex items-center gap-2 px-3 py-2 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-md cursor-pointer hover:border-green-500 transition-colors">
                  <ImageIcon size={14} className="text-zinc-400 shrink-0" />
                  <span className="text-xs text-zinc-500">{uploading ? "Uploading…" : "Choose screenshot"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
                {formData.screenshot_url && (
                  <div className="relative w-20 h-14 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0 bg-zinc-50 dark:bg-zinc-800">
                    <Image src={formData.screenshot_url} alt="Preview" fill className="object-contain" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={saving || uploading || !formData.screenshot_url} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-1.5 rounded-md disabled:opacity-50 transition-colors">
                {saving ? "Saving…" : editingId ? "Update" : "Add"}
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
      ) : testimonies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">No testimonies yet</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">Upload your first customer testimony screenshot</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
          {testimonies.map((testimony) => (
            <div key={testimony.id} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              {/* Screenshot thumbnail */}
              <div className="w-14 h-10 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 relative border border-zinc-200 dark:border-zinc-700">
                <Image src={testimony.screenshot_url} alt={testimony.customer_name} fill className="object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{testimony.customer_name}</p>
                  {testimony.rating != null && (
                    <div className="flex gap-0.5 shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < testimony.rating! ? "fill-yellow-400 text-yellow-400" : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"} />
                      ))}
                    </div>
                  )}
                  {testimony.is_featured && (
                    <span className="shrink-0 text-[10px] font-bold bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded-full">Featured</span>
                  )}
                  {!testimony.is_active && (
                    <span className="shrink-0 text-[10px] font-bold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">Inactive</span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">
                  {testimony.customer_location}{testimony.platform ? ` · ${testimony.platform}` : ""}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button title="Edit" onClick={() => handleEdit(testimony)} className="p-1.5 rounded-md text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                  <Pencil size={13} />
                </button>
                <button
                  title={testimony.is_featured ? "Unfeature" : "Feature"}
                  onClick={() => toggleFeatured(testimony.id, testimony.is_featured)}
                  className={`p-1.5 rounded-md transition-colors ${testimony.is_featured ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30" : "text-zinc-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"}`}
                >
                  <Star size={13} className={testimony.is_featured ? "fill-current" : ""} />
                </button>
                <button
                  title={testimony.is_active ? "Deactivate" : "Activate"}
                  onClick={() => toggleActive(testimony.id, testimony.is_active)}
                  className={`p-1.5 rounded-md transition-colors ${testimony.is_active ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30" : "text-zinc-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30"}`}
                >
                  {testimony.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button title="Delete" onClick={() => handleDelete(testimony.id, testimony.customer_name)} className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
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
