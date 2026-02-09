"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Mail, Users, Star, User, ShoppingCart, 
  MoreHorizontal, Eye, Trash2, Send, Clock, CheckCircle,FileText,
  Loader2, AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { sendCampaignAction } from "../actions"; // Import our aligned server action
import { toast } from "sonner";

const RecipientIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'newsletter': return <Mail className="h-4 w-4" />;
    case 'customers': return <Users className="h-4 w-4" />;
    case 'vip': return <Star className="h-4 w-4" />;
    case 'partners': return <ShoppingCart className="h-4 w-4" />;
    default: return <User className="h-4 w-4" />;
  }
};

export default function CampaignsTable() {
  const supabase = createClient();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null); // Track specific row sending

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (err: any) {
      toast.error("Editorial Sync Failed");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCampaigns();
    const channel = supabase
      .channel('campaigns-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, () => {
        fetchCampaigns();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchCampaigns, supabase]);

  // NEW: Handle triggering Resend from the Table
  const handleActivateResend = async (camp: any) => {
    if (camp.status === 'sent') return toast.error("Already broadcasted.");
    if (!confirm(`Confirm broadcast: "${camp.subject}" to ${camp.recipient_type}?`)) return;

    setSendingId(camp.id);
    try {
      const result = await sendCampaignAction(camp.id, camp.recipient_type, camp.emails);
      
      if (result.success) {
        toast.success("Broadcast Successful", { description: result.message });
        fetchCampaigns(); // Refresh to show 'sent' status
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast.error("Broadcast Failed", { description: err.message });
    } finally {
      setSendingId(null);
    }
  };

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[2.5rem]">
        <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Archiving Local Data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-200/50 dark:shadow-none animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-zinc-50/50 dark:bg-zinc-950/50 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 border-b dark:border-zinc-800">
            <tr>
              <th className="px-8 py-6 font-black italic">Identity</th>
              <th className="px-4 py-6">Targeting</th>
              <th className="px-4 py-6 text-center">Lifecycle</th>
              <th className="px-4 py-6">Timestamp</th>
              <th className="px-8 py-6 text-right">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-zinc-800">
            {campaigns.length > 0 ? (
              campaigns.map((camp) => (
                <tr key={camp.id} className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-all duration-300">
                  <td className="px-8 py-5">
                    <div className="font-black text-zinc-900 dark:text-zinc-100 italic tracking-tight text-base group-hover:text-green-600 transition-colors">
                      {camp.subject || "Untitled Archive"}
                    </div>
                    <div className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mt-0.5">
                      REF: {camp.id.slice(0, 8)}
                    </div>
                  </td>
                  
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 font-black uppercase text-[10px] tracking-tight">
                      <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 group-hover:text-green-600 transition-colors">
                        <RecipientIcon type={camp.recipient_type} />
                      </div>
                      {camp.recipient_type}
                    </div>
                  </td>

                  <td className="px-4 py-5 text-center">
                    <StatusBadge status={camp.status} />
                  </td>

                  <td className="px-4 py-5 text-zinc-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-tighter italic">
                    {camp.sent_at 
                      ? new Date(camp.sent_at).toLocaleDateString() 
                      : "Draft Saved"}
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-300">
                        {/* ACTIVATE RESEND BUTTON */}
                        {camp.status === 'draft' && (
                          <button 
                            onClick={() => handleActivateResend(camp)}
                            disabled={sendingId === camp.id}
                            className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all active:scale-90 shadow-lg shadow-green-600/20"
                            title="Send Now via Resend"
                          >
                            {sendingId === camp.id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                          </button>
                        )}
                        
                        <button className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-green-600 dark:hover:text-green-400 transition-all active:scale-90">
                            <Eye size={16} />
                        </button>
                        <button className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-red-500 transition-all active:scale-90">
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-32 text-center">
                   <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-full">
                        <Mail className="h-12 w-12 text-zinc-200 dark:text-zinc-700" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Zero Active Broadcasts</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    sent: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-100 dark:border-green-500/20",
    scheduled: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    draft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500 border-transparent",
  };
  const icons = {
    sent: <CheckCircle className="h-3 w-3" />,
    scheduled: <Clock className="h-3 w-3" />,
    draft: <FileText className="h-3 w-3 opacity-50" />,
  };
  const currentStatus = (status?.toLowerCase() || 'draft') as keyof typeof styles;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${styles[currentStatus]}`}>
      {icons[currentStatus as keyof typeof icons]}
      {currentStatus}
    </span>
  );
}