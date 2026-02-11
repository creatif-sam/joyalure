"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Trash2, Loader2, Send, Calendar, User, MessageSquare } from "lucide-react"
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
  
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (err) {
      toast.error("Failed to sync inquiries")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRequests() }, [])

  const handleDelete = async (id: string) => {
    // Custom Joyalure-style confirm could be a modal, but standard confirm is safe here
    if (!confirm("Permanently purge this inquiry from archive?")) return
    
    const { error } = await supabase.from("contact_requests").delete().eq("id", id)
    if (error) {
      toast.error("Purge failed")
    } else {
      setRequests(prev => prev.filter(r => r.id !== id))
      toast.success("Inquiry Purged", { description: "Record removed from database." })
    }
  }

  const handleReply = (email: string) => {
    setSelectedEmail(email)
    setIsModalOpen(true)
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-6">
      <div className="relative">
        <Loader2 className="animate-spin text-green-600 h-10 w-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <MessageSquare size={12} className="text-green-600" />
        </div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 animate-pulse">
        Fetching Joyalure Inquiries
      </p>
    </div>
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block bg-white dark:bg-zinc-950 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-none overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b dark:border-zinc-800">
            <tr className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-black">
              <th className="px-8 py-6 w-16 text-center italic">Ref</th>
              <th className="px-6 py-6 font-black">Identity</th>
              <th className="px-6 py-6 font-black">Narrative</th>
              <th className="px-6 py-6 font-black">Timestamp</th>
              <th className="px-8 py-6 text-right font-black italic">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
            {requests.length > 0 ? (
              requests.map((req, index) => (
                <tr key={req.id} className="group hover:bg-green-50/30 dark:hover:bg-green-500/5 transition-all">
                  <td className="px-8 py-5 text-center text-zinc-300 dark:text-zinc-700 font-mono text-xs">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-black text-zinc-900 dark:text-zinc-100 tracking-tight italic">{req.full_name}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{req.email}</p>
                  </td>
                  <td className="px-6 py-5 max-w-md">
                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed text-xs font-medium">
                      "{req.message}"
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase">
                      <Calendar size={12} className="opacity-50" />
                      {new Date(req.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleReply(req.email)}
                        className="p-2.5 rounded-xl bg-green-600 text-white shadow-lg shadow-green-600/20 hover:scale-110 active:scale-95 transition-all"
                      >
                        <Send size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(req.id)} 
                        className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="p-32 text-center text-zinc-400 italic font-medium tracking-widest text-[10px] uppercase">Archive Clear</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="lg:hidden space-y-4 px-1">
        {requests.map((req) => (
          <div key={req.id} className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-5 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600">
                  <User size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-zinc-900 dark:text-zinc-100 leading-tight italic truncate">{req.full_name}</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">{req.email}</p>
                </div>
              </div>
              <div className="text-[9px] font-black text-zinc-300 dark:text-zinc-600 uppercase flex flex-col items-end">
                <span className="flex items-center gap-1"><Calendar size={10} /> DATE</span>
                <span>{new Date(req.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="relative">
               <div className="absolute -top-2 -left-1 text-4xl text-green-500/10 italic font-serif">“</div>
               <p className="text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 p-5 rounded-3xl italic leading-relaxed font-medium relative z-10">
                {req.message}
               </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => handleReply(req.email)}
                className="flex-[3] flex items-center justify-center gap-2 h-14 rounded-2xl bg-green-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-600/30 active:scale-95 transition-all"
              >
                <Send size={14} /> Initiate Reply
              </button>
              <button 
                onClick={() => handleDelete(req.id)}
                className="flex-1 flex items-center justify-center h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-red-500 active:scale-95 transition-all"
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
          initialRecipient={selectedEmail}
        />
      )}
    </div>
  )
}