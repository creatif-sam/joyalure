"use client";

import { useEffect, useState } from "react";
import { 
  Mail, 
  Send, 
  Trash2, 
  Users, 
  FileText, 
  Plus, 
  Loader2, 
  Download, 
  MessageSquare 
} from "lucide-react";
import NewCampaignModal from "@/app/admin/mail/campaigns/NewCampaignModal";
import EmailTemplatesTable from "@/app/admin/mail/templates/EmailTemplatesTable";
import CampaignsTable from "@/app/admin/mail/campaigns/CampaignsTable";
import ContactRequestsTable from "./contactforms/ContactRequestsTable";
import { createClient } from "@/lib/supabase/client"; 

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
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
      if (error) throw error;
      setSubscribers(subscribers.filter(sub => sub.id !== id));
    } catch (err) {
      alert("Failed to delete subscriber");
    }
  };

  const exportCSV = () => {
    const headers = "Email,Date Joined\n";
    const rows = subscribers.map(s => `${s.email},${new Date(s.created_at).toLocaleDateString()}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "joyallure_subscribers.csv");
    a.click();
  };

  const statCards = [
    { label: "Subscribers", value: subscribers.length, icon: "users-green" },
    { label: "Inquiries", value: contactsCount, icon: "message-purple" },
    { label: "Sent", value: campaigns.filter(c => c.status === 'sent').length, icon: "send-green" },
    { label: "Drafts", value: campaigns.filter(c => c.status === 'draft').length, icon: "filetext-gray" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-black transition-colors duration-300">
      {/* HEADER SECTION - Adjusted padding and text size for mobile */}
      <div className="mb-6 p-4 md:p-6 bg-blue-50 dark:bg-zinc-900 border border-blue-100 dark:border-zinc-800 rounded-2xl">
        <h2 className="text-lg md:text-xl font-black mb-1 flex items-center gap-2 text-blue-900 dark:text-blue-400 italic uppercase">
          <Mail className="h-5 w-5 md:h-6 md:w-6 text-blue-600" /> Email & Comms
        </h2>
        <p className="text-gray-600 dark:text-zinc-400 text-xs md:text-sm font-medium">
          Manage audience, inquiries, and professional campaigns.
        </p>
      </div>

      {/* STAT CARDS - Optimized 2x2 grid on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {statCards.map(card => (
          <div key={card.label} className="bg-white dark:bg-zinc-950 rounded-2xl border dark:border-zinc-800 p-4 flex flex-col items-center shadow-sm">
            <div className="mb-2">
              {card.icon === "message-purple" && <MessageSquare className="h-4 w-4 text-purple-500" />}
              {card.icon === "filetext-gray" && <FileText className="h-4 w-4 text-gray-400" />}
              {card.icon === "users-green" && <Users className="h-4 w-4 text-green-500" />}
              {card.icon === "send-green" && <Send className="h-4 w-4 text-green-500" />}
            </div>
            <div className="text-xl md:text-2xl font-black text-blue-900 dark:text-zinc-100">
              {loading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : card.value}
            </div>
            <div className="text-[9px] font-black uppercase tracking-tighter text-gray-400 mt-1 text-center">{card.label}</div>
          </div>
        ))}
      </div>

      {/* TABS NAVIGATION - Scrollable on mobile */}
      <div className="flex overflow-x-auto no-scrollbar gap-1 mb-4 border-b dark:border-zinc-800 -mx-4 px-4 md:mx-0 md:px-0">
        {[
          { id: "campaigns", label: "Campaigns", color: "border-green-600 text-green-600" },
          { id: "contacts", label: `Inquiries (${contactsCount})`, color: "border-purple-600 text-purple-600" },
          { id: "templates", label: `Templates (${templatesCount})`, color: "border-yellow-500 text-yellow-500" },
          { id: "subscribers", label: `Audience (${subscribers.length})`, color: "border-black dark:border-white text-black dark:text-white" }
        ].map((t) => (
          <button 
            key={t.id}
            onClick={() => setTab(t.id)} 
            className={`whitespace-nowrap px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${tab === t.id ? `border-b-2 ${t.color} bg-white dark:bg-zinc-900/50` : "text-gray-400 hover:text-gray-600"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {tab === "campaigns" && (
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => setFilter("all")} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === "all" ? "bg-green-600 text-white shadow-lg shadow-green-600/20" : "bg-gray-100 dark:bg-zinc-900 text-gray-500"}`}>All</button>
                <button onClick={() => setFilter("drafts")} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === "drafts" ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/20" : "bg-gray-100 dark:bg-zinc-900 text-gray-500"}`}>Drafts</button>
              </div>
              <button
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-green-600 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-green-600/20 hover:bg-green-700 active:scale-95 transition"
                onClick={() => setShowNewCampaign(true)}
              >
                <Plus className="h-4 w-4" /> New Campaign
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border dark:border-zinc-800">
              <CampaignsTable />
            </div>
          </div>
        )}

        {tab === "contacts" && <ContactRequestsTable />}
        {tab === "templates" && <EmailTemplatesTable />}

        {tab === "subscribers" && (
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
               <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Database Audience</h3>
               <button onClick={exportCSV} className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 bg-white dark:bg-zinc-800 border dark:border-zinc-700 px-3 py-2 rounded-xl hover:bg-gray-50 transition shadow-sm active:scale-95">
                 <Download className="h-3 w-3" /> Export
               </button>
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 font-black uppercase text-[10px] tracking-widest border-b dark:border-zinc-800">
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-zinc-100">{sub.email}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-zinc-400">{new Date(sub.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteSubscriber(sub.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE LIST CARDS */}
            <div className="md:hidden divide-y dark:divide-zinc-800">
              {subscribers.length > 0 ? subscribers.map((sub) => (
                <div key={sub.id} className="p-4 flex justify-between items-center">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 truncate">{sub.email}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">{new Date(sub.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleDeleteSubscriber(sub.id)} className="p-3 text-gray-300 active:text-red-500 active:bg-red-50 rounded-xl transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )) : (
                <div className="p-12 text-center text-gray-400 italic text-xs">No subscribers found.</div>
              )}
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