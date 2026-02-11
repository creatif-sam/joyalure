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
  
  // Real Data States
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templatesCount, setTemplatesCount] = useState(0);
  const [contactsCount, setContactsCount] = useState(0); // Added for contact inquiries
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Parallel fetching for performance
      const [subsRes, campRes, tempRes, contactRes] = await Promise.all([
        supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
        supabase.from("campaigns").select("id, status"),
        supabase.from("email_templates").select("id", { count: 'exact' }),
        supabase.from("contact_requests").select("id", { count: 'exact' }) // Added
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
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
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
    { label: "Total Subscribers", value: subscribers.length, icon: "users-green" },
    { label: "Contact Inquiries", value: contactsCount, icon: "message-purple" },
    { label: "Sent Campaigns", value: campaigns.filter(c => c.status === 'sent').length, icon: "send-green" },
    { label: "Drafts", value: campaigns.filter(c => c.status === 'draft').length, icon: "filetext-gray" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 text-black transition-colors duration-300">
      <div className="mb-6 p-6 bg-blue-50 dark:bg-zinc-900 border border-blue-100 dark:border-zinc-800 rounded-xl">
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2 text-blue-900 dark:text-blue-400">
          <Mail className="h-6 w-6 text-blue-600" /> Email & Communication
        </h2>
        <p className="text-gray-700 dark:text-zinc-400 text-sm">
          Manage your newsletter audience, view contact form submissions, and create professional email campaigns.
        </p>
      </div>

      {/* Dynamic Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map(card => (
          <div key={card.label} className="bg-white dark:bg-zinc-950 rounded-xl border dark:border-zinc-800 p-4 flex flex-col items-center shadow-sm">
            <div className="mb-2">
              {card.icon === "message-purple" && <MessageSquare className="h-5 w-5 text-purple-500" />}
              {card.icon === "filetext-gray" && <FileText className="h-5 w-5 text-gray-400" />}
              {card.icon === "users-green" && <Users className="h-5 w-5 text-green-500" />}
              {card.icon === "send-green" && <Send className="h-5 w-5 text-green-500" />}
            </div>
            <div className="text-2xl font-black text-blue-900 dark:text-zinc-100">
              {loading ? <Loader2 className="h-5 w-5 animate-spin inline" /> : card.value}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1 text-center">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-4 border-b dark:border-zinc-800">
        <button 
          onClick={() => setTab("campaigns")} 
          className={`px-4 py-2 rounded-t-lg text-sm font-bold transition-all ${tab === "campaigns" ? "border-b-2 border-green-600 text-green-600 bg-white dark:bg-zinc-900" : "text-gray-400 hover:text-gray-600"}`}
        >
          Campaigns
        </button>
        <button 
          onClick={() => setTab("contacts")} 
          className={`px-4 py-2 rounded-t-lg text-sm font-bold transition-all ${tab === "contacts" ? "border-b-2 border-purple-600 text-purple-600 bg-white dark:bg-zinc-900" : "text-gray-400 hover:text-gray-600"}`}
        >
          Inquiries ({contactsCount})
        </button>
        <button 
          onClick={() => setTab("templates")} 
          className={`px-4 py-2 rounded-t-lg text-sm font-bold transition-all ${tab === "templates" ? "border-b-2 border-yellow-500 text-yellow-500 bg-white dark:bg-zinc-900" : "text-gray-400 hover:text-gray-600"}`}
        >
          Templates ({templatesCount})
        </button>
        <button 
          onClick={() => setTab("subscribers")} 
          className={`px-4 py-2 rounded-t-lg text-sm font-bold transition-all ${tab === "subscribers" ? "border-b-2 border-black dark:border-white text-black dark:text-white bg-white dark:bg-zinc-900" : "text-gray-400 hover:text-gray-600"}`}
        >
          Audience ({subscribers.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-500">
        {tab === "campaigns" && (
          <div className="bg-white dark:bg-zinc-950 rounded-xl border dark:border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${filter === "all" ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-zinc-900 text-gray-600"}`}>All</button>
                <button onClick={() => setFilter("drafts")} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${filter === "drafts" ? "bg-yellow-500 text-white" : "bg-gray-100 dark:bg-zinc-900 text-gray-600"}`}>Drafts</button>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white font-bold shadow hover:bg-green-700 transition"
                onClick={() => setShowNewCampaign(true)}
              >
                <Plus className="h-4 w-4" /> New Campaign
              </button>
            </div>
            <CampaignsTable />
          </div>
        )}

        {tab === "contacts" && <ContactRequestsTable />}

        {tab === "templates" && <EmailTemplatesTable />}

        {tab === "subscribers" && (
          <div className="bg-white dark:bg-zinc-950 rounded-xl border dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
               <h3 className="font-bold text-gray-700 dark:text-zinc-200">Database Audience</h3>
               <button onClick={exportCSV} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition shadow-sm">
                 <Download className="h-3 w-3" /> Export CSV
               </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white dark:bg-zinc-950 border-b dark:border-zinc-800">
                  <tr className="text-left text-gray-400 font-black uppercase text-[10px] tracking-widest">
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {subscribers.length > 0 ? (
                    subscribers.map((sub) => (
                      <tr key={sub.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition">
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-zinc-100">{sub.email}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-zinc-400">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => handleDeleteSubscriber(sub.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                             <Trash2 className="h-4 w-4" />
                           </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">No subscribers found.</td></tr>
                  )}
                </tbody>
              </table>
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