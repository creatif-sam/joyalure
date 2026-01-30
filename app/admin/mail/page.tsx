"use client";

import { useEffect, useState } from "react";
import { Mail, Send, Trash2, Users, FileText, Plus, Loader2, Download } from "lucide-react";
import NewCampaignModal from "@/app/admin/mail/campaigns/NewCampaignModal";
import EmailTemplatesTable from "@/app/admin/mail/templates/EmailTemplatesTable";

// IMPORT: This must point to your browser/client supabase file
import { createClient } from "@/lib/supabase/client"; 

// Interface for type safety
interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminMail() {
  // INITIALIZE SUPABASE CLIENT
  const supabase = createClient();

  const [tab, setTab] = useState("campaigns");
  const [filter, setFilter] = useState("all");
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  
  // Real Data States
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Subscribers from Supabase
  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Delete Subscriber Function
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSubscribers(subscribers.filter(sub => sub.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete subscriber");
    }
  };

  // Export to CSV Function
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

  // Dynamic stats
  const statCards = [
    { label: "Total Campaigns", value: 49, icon: "mail-blue" },
    { label: "Total Subscribers", value: subscribers.length, icon: "users-green" },
    { label: "Sent Campaigns", value: 38, icon: "send-green" },
    { label: "Total Emails Sent", value: 2539, icon: "mail-darkblue" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header UI */}
      <div className="mb-6 p-6 bg-blue-50 border border-blue-100 rounded-xl">
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2 text-blue-900">
          <Mail className="h-6 w-6 text-blue-600" /> Email Campaign Management
        </h2>
        <p className="text-gray-700 text-sm">
          Create and send email campaigns. <span className="text-blue-700 font-semibold">Live connection to newsletter_subscribers.</span>
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl border p-4 flex flex-col items-center shadow-sm">
            <div className="mb-2">
              {card.icon === "mail-blue" && <Mail className="h-5 w-5 text-blue-500" />}
              {card.icon === "users-green" && <Users className="h-5 w-5 text-green-500" />}
              {card.icon === "send-green" && <Send className="h-5 w-5 text-green-500" />}
              {card.icon === "mail-darkblue" && <Mail className="h-5 w-5 text-blue-700" />}
            </div>
            <div className="text-2xl font-bold text-blue-900">{card.value}</div>
            <div className="text-xs text-gray-500 mt-1 text-center">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab("campaigns")} className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition ${tab === "campaigns" ? "border-green-600 text-black bg-white" : "border-transparent text-gray-500 bg-gray-50"}`}>
          Email Campaigns
        </button>
        <button onClick={() => setTab("templates")} className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition ${tab === "templates" ? "border-yellow-400 text-black bg-white" : "border-transparent text-gray-500 bg-gray-50"}`}>
          Email Templates
        </button>
        <button onClick={() => setTab("subscribers")} className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition ${tab === "subscribers" ? "border-black text-black bg-white" : "border-transparent text-gray-500 bg-gray-50"}`}>
          Subscribers <span className="ml-1 text-xs text-gray-400">({subscribers.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {tab === "campaigns" && (
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded-lg text-sm font-medium ${filter === "all" ? "bg-green-500 text-black" : "bg-gray-100 text-gray-600"}`}>All</button>
              <button onClick={() => setFilter("drafts")} className={`px-3 py-1 rounded-lg text-sm font-medium ${filter === "drafts" ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-600"}`}>Drafts</button>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-yellow-400 text-black font-semibold shadow hover:brightness-105 transition"
              onClick={() => setShowNewCampaign(true)}
            >
              <Plus className="h-4 w-4" /> New Campaign
            </button>
          </div>
          <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
             <p>No active campaigns found. Start your first draft.</p>
          </div>
        </div>
      )}

      {tab === "templates" && <EmailTemplatesTable />}

      {tab === "subscribers" && (
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
             <h3 className="font-semibold text-gray-700">Database Audience</h3>
             <button onClick={exportCSV} className="text-xs flex items-center gap-1 bg-white border px-2 py-1 rounded hover:bg-gray-50 transition shadow-sm">
               <Download className="h-3 w-3" /> Export to CSV
             </button>
          </div>
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white border-b border-gray-100">
                  <tr className="text-left text-gray-400 font-medium uppercase text-[10px] tracking-wider">
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">Subscription Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subscribers.length > 0 ? (
                    subscribers.map((sub) => (
                      <tr key={sub.id} className="group hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">{sub.email}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button 
                             onClick={() => handleDelete(sub.id)}
                             className="text-gray-300 hover:text-red-500 transition-colors p-1"
                           >
                             <Trash2 className="h-4 w-4" />
                           </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">
                        The newsletter_subscribers table is empty.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      <NewCampaignModal open={showNewCampaign} onClose={() => setShowNewCampaign(false)} />
    </div>
  );
}