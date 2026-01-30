"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Download, 
  Trash2, 
  ArrowLeft, 
  Loader2, 
  MoreHorizontal,
  Mail,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data
  const fetchSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setSubscribers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Delete function
  const deleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);

    if (!error) {
      setSubscribers(subscribers.filter(sub => sub.id !== id));
    }
  };

  // Export to CSV
  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Email,Date"].concat(subscribers.map(s => `${s.id},${s.email},${s.created_at}`)).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "joyallure_subscribers.csv");
    document.body.appendChild(link);
    link.click();
  };

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs & Header */}
        <div className="mb-8">
          <Link href="/admin/mail" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Mail Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-8 w-8 text-green-600" /> Newsletter Audience
              </h1>
              <p className="text-gray-500 mt-1">Manage your {subscribers.length} loyal subscribers and leads.</p>
            </div>
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 transition"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total Audience</p>
            <p className="text-3xl font-bold mt-2">{subscribers.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">New this month</p>
            <p className="text-3xl font-bold mt-2 text-green-600">
              {subscribers.filter(s => new Date(s.created_at).getMonth() === new Date().getMonth()).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Status</p>
            <p className="text-3xl font-bold mt-2 text-blue-600">Active</p>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Table Header / Search */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
              />
            </div>
            <button onClick={fetchSubscribers} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Loader2 className={`h-5 w-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Subscriber</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-6 py-4 h-16 bg-gray-50/20" />
                    </tr>
                  ))
                ) : filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                          {sub.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{sub.email}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> Customer Lead
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(sub.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                        Verified
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => deleteSubscriber(sub.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {!loading && filteredSubscribers.length === 0 && (
              <div className="p-20 text-center">
                <Users className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No subscribers found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}