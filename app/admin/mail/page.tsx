"use client";

import { useEffect, useState } from "react";
import { 
  Mail, Send, Trash2, Users, FileText, Plus, 
  Loader2, Download, MessageSquare 
} from "lucide-react";
import NewCampaignModal from "@/app/admin/mail/campaigns/NewCampaignModal";
import EmailTemplatesTable from "@/app/admin/mail/templates/EmailTemplatesTable";
import CampaignsTable from "@/app/admin/mail/campaigns/CampaignsTable";
import ContactRequestsTable from "./contactforms/ContactRequestsTable";
import { createClient } from "@/lib/supabase/client"; 
import { toast } from "sonner"; // Assuming sonner is used for Joyalure

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

interface Campaign {
  id: string;
  status: 'draft' | 'sent';
}

export default function AdminMail() {
  const supabase = createClient();

  const [tab, setTab] = useState("campaigns");
  const [filter, setFilter] = useState("all");
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templatesCount, setTemplatesCount] = useState(0);
  const [contactsCount, setContactsCount] = useState(0); 
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [subsRes, campRes, tempRes, contactRes] = await Promise.all([
        supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
        supabase.from("campaigns").select("id, status"),
        supabase.from("email_templates").select("id", { count: 'exact' }),
        supabase.from("contact_requests").select("id", { count: 'exact' }) 
      ]);

      if (subsRes.error) throw subsRes.error;
      
      setSubscribers(subsRes.data || []);
      setCampaigns(campRes.data || []);
      setTemplatesCount(tempRes.count || 0);
      setContactsCount(contactRes.count || 0);
    } catch (err) {
      toast.error("Dashboard Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Permanently remove subscriber?")) return;
    try {
      const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
      if (error) throw error;
      setSubscribers(prev => prev.filter(sub => sub.id !== id));
      toast.success("Subscriber Purged");
    } catch (err) {
      toast.error("Purge Failed");
    }
  };

  const exportCSV = () => {
    const headers = "Email,Date Joined\n";
    const rows = subscribers.map(s => `${s.email},${new Date(s.created_at).toLocaleDateString()}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "joyalure_subscribers.csv");
    a.click();
  };

  const statCards = [
    { label: "Subscribers", value: subscribers.length, icon: Users, color: "text-green-500", bg: "bg-green-50" },
    { label: "Inquiries", value: contactsCount, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Sent", value: campaigns.filter(c => c.status === 'sent').length, icon: Send, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Drafts", value: campaigns.filter(c => c.status === 'draft').length, icon: FileText, color: "text-zinc-400", bg: "bg-zinc-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* BRANDED HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-600/20">
            <Mail size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-zinc-100">
              Editorial <span className="text-green-600">Comms</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Newsletter & Inquiry Control</p>
          </div>
        </div>
        <button
          onClick={() => setShowNewCampaign(true)}
          className="w-full md:w-auto h-12 px-8 rounded-2xl bg-green-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-600/20 hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} /> New Campaign
        </button>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white dark:bg-zinc-950 rounded-[1.5rem] border dark:border-zinc-800 p-5 flex flex-col justify-between group hover:border-green-500/30 transition-all">
            <div className="flex justify-between items-center mb-4">
              <div className={`p-2 rounded-xl ${card.bg} dark:bg-zinc-900 ${card.color}`}>
                <card.icon size={18} />
              </div>
              <div className="h-1 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black italic text-zinc-900 dark:text-zinc-100 leading-none">
                {loading ? <Loader2 size={20} className="animate-spin" /> : card.value}
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-2">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* NAVIGATION TABS (Mobile Scrollable) */}
      <nav className="flex overflow-x-auto no-scrollbar gap-2 -mx-4 px-4 md:mx-0 md:px-0">
        {[
          { id: "campaigns", label: "Campaigns", icon: Send },
          { id: "contacts", label: `Inquiries`, count: contactsCount },
          { id: "templates", label: `Templates`, count: templatesCount },
          { id: "subscribers", label: `Audience`, count: subscribers.length }
        ].map((t) => (
          <button 
            key={t.id}
            onClick={() => setTab(t.id)} 
            className={`flex items-center gap-2 whitespace-nowrap px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              tab === t.id 
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xl" 
              : "bg-white dark:bg-zinc-950 text-zinc-400 hover:text-zinc-900 border dark:border-zinc-800"
            }`}
          >
            {t.label} {t.count !== undefined && <span className="opacity-50">[{t.count}]</span>}
          </button>
        ))}
      </nav>

      {/* TAB CONTENT */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-[400px]">
        {tab === "campaigns" && <CampaignsTable />}
        {tab === "contacts" && <ContactRequestsTable />}
        {tab === "templates" && <EmailTemplatesTable />}

        {tab === "subscribers" && (
          <div className="bg-white dark:bg-zinc-950 rounded-[2rem] border dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Archive Dataset</h3>
               <button onClick={exportCSV} className="h-10 px-4 rounded-xl bg-white dark:bg-zinc-800 border dark:border-zinc-700 text-[10px] font-black uppercase flex items-center gap-2 active:scale-95 transition-all">
                 <Download size={14} /> Export CSV
               </button>
            </div>

            {/* PC VIEW */}
            <div className="hidden md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-400 font-black uppercase text-[9px] tracking-widest border-b dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30">
                    <th className="px-8 py-5 italic">Identity</th>
                    <th className="px-8 py-5">Verified On</th>
                    <th className="px-8 py-5 text-right italic">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-zinc-800">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="group hover:bg-green-50/30 dark:hover:bg-green-500/5 transition-all">
                      <td className="px-8 py-5 font-bold text-zinc-900 dark:text-zinc-100 italic">{sub.email}</td>
                      <td className="px-8 py-5 text-xs font-medium text-zinc-500">{new Date(sub.created_at).toLocaleDateString()}</td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => handleDeleteSubscriber(sub.id)} className="opacity-0 group-hover:opacity-100 h-9 w-9 flex items-center justify-center text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all ml-auto">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW */}
            <div className="md:hidden divide-y dark:divide-zinc-800">
              {subscribers.map((sub) => (
                <div key={sub.id} className="p-5 flex justify-between items-center">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate italic leading-none">{sub.email}</p>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight mt-1.5">{new Date(sub.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleDeleteSubscriber(sub.id)} className="h-10 w-10 flex items-center justify-center text-zinc-300 active:text-red-500 active:bg-red-50 rounded-xl">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <NewCampaignModal 
        open={showNewCampaign} 
        onClose={() => {
            setShowNewCampaign(false);
            fetchAllData(); 
        }} 
      />
    </div>
  );
}