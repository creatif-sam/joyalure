"use client"

import { useEffect, useState } from "react"
import { 
  Users, Search, Download, Trash2, ArrowLeft, Loader2, 
  MoreHorizontal, Mail, Calendar, UserPlus, ShieldCheck 
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner" // Assuming you use sonner for premium feel

interface Subscriber {
  id: string
  email: string
  created_at: string
}

export default function SubscribersPage() {
  const supabase = createClient()

  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setSubscribers(data || [])
    } catch (err) {
      toast.error("Failed to sync audience")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Remove this member from the newsletter archive?")) return
    
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id)

      if (error) throw error
      setSubscribers(prev => prev.filter(sub => sub.id !== id))
      toast.success("Subscriber Purged")
    } catch (err) {
      toast.error("Deletion Failed")
    }
  }

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Email,Date"].concat(subscribers.map(s => `${s.id},${s.email},${s.created_at}`)).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "joyalure_subscribers.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER AREA */}
        <div className="mb-8">
          <Link href="/admin/mail" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-green-600 mb-6 transition-all group">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 flex items-center gap-3 italic">
                <Users className="h-8 w-8 text-green-600" /> Newsletter <span className="text-green-600">Audience</span>
              </h1>
              <p className="text-xs md:text-sm text-zinc-500 font-medium tracking-tight">Managing {subscribers.length} verified editorial leads.</p>
            </div>
            
            <button 
              onClick={exportCSV}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md active:scale-95 transition-all text-zinc-900 dark:text-zinc-100"
            >
              <Download className="h-3.5 w-3.5" /> Export Dataset
            </button>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8">
          <StatCard label="Total Reach" value={subscribers.length} icon={Users} color="text-zinc-900" />
          <StatCard 
            label="Monthly Growth" 
            value={subscribers.filter(s => new Date(s.created_at).getMonth() === new Date().getMonth()).length} 
            icon={UserPlus} 
            color="text-green-600" 
          />
          <div className="hidden lg:block">
            <StatCard label="Database Sync" value="Verified" icon={ShieldCheck} color="text-blue-600" />
          </div>
        </div>

        {/* MAIN CONTAINER */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden">
          
          {/* SEARCH & ACTIONS */}
          <div className="p-4 md:p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input 
                type="text"
                placeholder="Search via email identity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-medium transition-all"
              />
            </div>
            <button onClick={fetchSubscribers} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-green-600 transition-colors shrink-0">
              <Loader2 className={`h-5 w-5 ${loading ? 'animate-spin text-green-600' : 'text-zinc-400'}`} />
            </button>
          </div>

          {/* PC TABLE VIEW (Hidden on Mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b dark:border-zinc-800">
                  <th className="px-8 py-5 italic">Identity</th>
                  <th className="px-6 py-5">Joined Timestamp</th>
                  <th className="px-6 py-5">Lifecycle</th>
                  <th className="px-8 py-5 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading ? (
                  <TableSkeleton />
                ) : filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-green-50/30 dark:hover:bg-green-500/5 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-700 font-black italic">
                          {sub.email[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{sub.email}</p>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter italic">Editorial Lead</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs font-bold text-zinc-500 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 opacity-50" />
                        {new Date(sub.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-[9px] font-black uppercase tracking-widest border border-green-200 dark:border-green-900/30">
                        Verified
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button onClick={() => deleteSubscriber(sub.id)} className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all rounded-xl">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW (Hidden on Desktop) */}
          <div className="md:hidden divide-y dark:divide-zinc-800">
            {loading ? (
              <TableSkeleton />
            ) : filteredSubscribers.map((sub) => (
              <div key={sub.id} className="p-5 flex items-center justify-between gap-4 active:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-700 font-black italic">
                    {sub.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate leading-tight">{sub.email}</p>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-0.5 italic">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteSubscriber(sub.id)}
                  className="p-3 text-zinc-300 active:text-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {!loading && filteredSubscribers.length === 0 && (
            <div className="p-20 text-center">
              <Users className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Archive Empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-black">{label}</p>
        <Icon className={`h-4 w-4 ${color} opacity-40`} />
      </div>
      <p className={`text-2xl md:text-3xl font-black italic tracking-tighter ${color}`}>{value}</p>
    </div>
  )
}

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="px-6 py-6 h-16 animate-pulse bg-zinc-50/50 dark:bg-zinc-900/50 border-b dark:border-zinc-800" />
  ))
}