"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Trash2, Loader2, Send, Calendar, User } from "lucide-react"
import { toast } from "sonner"
import NewCampaignModal from "@/app/admin/mail/campaigns/NewCampaignModal"

interface ContactRequest {
  id: string
  full_name: string
  email: string
  message: string
  created_at: string
}

export default function ContactRequestsTable() {
  const supabase = createClient()
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  
  // State for Reply Modal
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchRequests = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) toast.error("Failed to load requests")
    else setRequests(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchRequests() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return
    const { error } = await supabase.from("contact_requests").delete().eq("id", id)
    if (error) toast.error("Delete failed")
    else {
      setRequests(requests.filter(r => r.id !== id))
      toast.success("Inquiry removed")
    }
  }

  const handleReply = (email: string) => {
    setSelectedEmail(email)
    setIsModalOpen(true)
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin text-green-600 h-8 w-8" />
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">Fetching Inquiries...</p>
    </div>
  )

  return (
    <div className="space-y-4 transition-colors duration-300">
      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/50 dark:bg-zinc-900/50 border-b dark:border-zinc-800">
            <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 font-black">
              <th className="px-6 py-5 text-center w-12">#</th>
              <th className="px-6 py-5">Sender</th>
              <th className="px-6 py-5">Message Content</th>
              <th className="px-6 py-5">Date</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {requests.length > 0 ? (
              requests.map((req, index) => (
                <tr key={req.id} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4 text-center text-gray-300 dark:text-zinc-700 font-mono text-xs">{index + 1}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 dark:text-zinc-100">{req.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">{req.email}</p>
                  </td>
                  <td className="px-6 py-4 max-w-sm">
                    <p className="text-gray-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">"{req.message}"</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                      {new Date(req.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-3">
                      <button 
                        onClick={() => handleReply(req.email)}
                        className="p-2 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-500 hover:bg-green-600 hover:text-white transition-all"
                        title="Reply"
                      >
                        <Send size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(req.id)} 
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-300 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="p-20 text-center text-gray-400 dark:text-zinc-600 italic">Zero inquiries in the database.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-4 px-2">
        {requests.map((req) => (
          <div key={req.id} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-zinc-100 leading-tight">{req.full_name}</h3>
                  <p className="text-xs text-gray-500">{req.email}</p>
                </div>
              </div>
              <div className="text-[10px] font-black text-gray-300 uppercase flex items-center gap-1">
                <Calendar size={10} /> {new Date(req.created_at).toLocaleDateString()}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl italic leading-relaxed">
              "{req.message}"
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => handleReply(req.email)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white text-xs font-black uppercase tracking-widest"
              >
                <Send size={14} /> Reply
              </button>
              <button 
                onClick={() => handleDelete(req.id)}
                className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REFRESHED CAMPAIGN MODAL */}
      {isModalOpen && (
        <NewCampaignModal 
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialRecipient={selectedEmail} // Ensure your Modal accepts this prop
        />
      )}
    </div>
  )
}