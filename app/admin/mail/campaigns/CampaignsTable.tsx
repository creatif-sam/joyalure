"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Mail, Users, Star, User, ShoppingCart, 
  Eye, Trash2, Send, Clock, CheckCircle, FileText,
  Loader2, AlertCircle, X
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { sendCampaignAction } from "../actions"; 
import { toast } from "sonner";

const RecipientIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'newsletter': return <Mail className="h-3.5 w-3.5" />;
    case 'customers': return <Users className="h-3.5 w-3.5" />;
    case 'vip': return <Star className="h-3.5 w-3.5" />;
    case 'partners': return <ShoppingCart className="h-3.5 w-3.5" />;
    default: return <User className="h-3.5 w-3.5" />;
  }
};

export default function CampaignsTable() {
  const supabase = createClient();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [viewCampaign, setViewCampaign] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmSend, setConfirmSend] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleSend = async () => {
    if (!confirmSend) return;
    setIsProcessing(true);
    try {
      const result = await sendCampaignAction(confirmSend.id);
      if (result.success) {
        toast.success("Broadcast Successful");
        setConfirmSend(null);
        fetchCampaigns(); 
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast.error("Broadcast Failed", { description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase.from('campaigns').delete().eq('id', deleteId);
      if (error) throw error;
      toast.success("Campaign Purged");
      setCampaigns(prev => prev.filter(c => c.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      toast.error("Purge Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[2rem] md:rounded-[2.5rem]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Syncing Archive...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* MOBILE VIEW: Card List (Hidden on Desktop) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {campaigns.map((camp) => (
          <div key={camp.id} className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="max-w-[70%]">
                <h3 className="font-black text-zinc-900 dark:text-zinc-100 italic tracking-tight leading-tight">{camp.subject}</h3>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1">REF: {camp.id.slice(0, 8)}</p>
              </div>
              <StatusBadge status={camp.status} />
            </div>

            <div className="flex items-center justify-between border-y dark:border-zinc-800 py-3">
              <div className="flex items-center gap-2 font-black uppercase text-[9px] tracking-tight text-zinc-500 italic">
                <RecipientIcon type={camp.recipient_type} /> {camp.recipient_type}
              </div>
              <div className="text-[9px] font-black uppercase italic text-zinc-400">
                {camp.sent_at ? new Date(camp.sent_at).toLocaleDateString() : "Draft"}
              </div>
            </div>

            <div className="flex gap-2">
              {camp.status === 'draft' && (
                <button onClick={() => setConfirmSend(camp)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-lg shadow-green-600/20">
                  <Send size={14} /> Send
                </button>
              )}
              <button onClick={() => setViewCampaign(camp)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 font-black text-[10px] uppercase tracking-widest active:scale-95">
                <Eye size={14} /> View
              </button>
              <button onClick={() => setDeleteId(camp.id)} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-400 hover:text-red-500 active:scale-95">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW: Table (Hidden on Mobile) */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-zinc-50/50 dark:bg-zinc-950/50 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 border-b dark:border-zinc-800">
              <tr>
                <th className="px-8 py-6 italic font-black">Identity</th>
                <th className="px-4 py-6">Targeting</th>
                <th className="px-4 py-6 text-center">Lifecycle</th>
                <th className="px-4 py-6">Timestamp</th>
                <th className="px-8 py-6 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-800">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-all">
                  <td className="px-8 py-5">
                    <div className="font-black text-zinc-900 dark:text-zinc-100 italic tracking-tight text-base">{camp.subject}</div>
                    <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">REF: {camp.id.slice(0, 8)}</div>
                  </td>
                  <td className="px-4 py-5 font-black uppercase text-[10px] tracking-tight text-zinc-500">
                    <div className="flex items-center gap-2 italic">
                      <RecipientIcon type={camp.recipient_type} /> {camp.recipient_type}
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center"><StatusBadge status={camp.status} /></td>
                  <td className="px-4 py-5 text-[10px] font-black uppercase italic text-zinc-500">
                    {camp.sent_at ? new Date(camp.sent_at).toLocaleDateString() : "Draft Archive"}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      {camp.status === 'draft' && (
                        <button onClick={() => setConfirmSend(camp)} className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-600/20">
                          <Send size={16} />
                        </button>
                      )}
                      <button onClick={() => setViewCampaign(camp)} className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-green-600 transition-all"><Eye size={16} /></button>
                      <button onClick={() => setDeleteId(camp.id)} className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS (Shared between views) */}
      <Dialog open={!!viewCampaign} onOpenChange={() => setViewCampaign(null)}>
        <DialogContent className="max-w-2xl w-[95vw] sm:w-full dark:bg-zinc-950 dark:border-zinc-800 rounded-[2rem] md:rounded-[2.5rem] border shadow-2xl overflow-hidden p-0">
          <div className="p-5 md:p-6 border-b dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
            <h2 className="text-lg md:text-xl font-black italic uppercase dark:text-gray-100 tracking-tighter">Editorial Snapshot</h2>
            <p className="text-[9px] md:text-[10px] font-black uppercase text-zinc-500 tracking-widest mt-1 truncate">Reviewing: {viewCampaign?.subject}</p>
          </div>
          <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto prose prose-zinc prose-sm dark:prose-invert max-w-none text-xs md:text-sm" dangerouslySetInnerHTML={{ __html: viewCampaign?.body }} />
          <div className="p-5 md:p-6 border-t dark:border-zinc-800 bg-zinc-50/50 flex justify-end">
            <Button onClick={() => setViewCampaign(null)} className="rounded-xl font-black text-[10px] uppercase bg-zinc-900 text-white px-6">Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-[90vw] sm:max-w-md dark:bg-zinc-950 dark:border-zinc-800 rounded-[2rem] md:rounded-[2.5rem] border shadow-2xl">
          <DialogHeader className="text-center pt-2">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4"><Trash2 className="text-red-600" size={20} /></div>
            <DialogTitle className="text-lg md:text-xl font-black uppercase italic dark:text-gray-100">Permanent Purge</DialogTitle>
            <p className="text-[10px] md:text-xs text-zinc-500 font-medium uppercase tracking-tight mt-2">Are you certain? This record will be erased forever.</p>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-3 sm:justify-center py-4 flex flex-col-reverse sm:flex-row">
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="text-[10px] font-black uppercase text-zinc-500">Cancel</Button>
            <Button onClick={handleDelete} disabled={isProcessing} className="bg-red-600 text-white rounded-xl px-8 font-black text-[10px] uppercase hover:bg-red-700 active:scale-95">
              {isProcessing ? <Loader2 className="animate-spin h-3 w-3 mr-2" /> : "Confirm Purge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmSend} onOpenChange={() => setConfirmSend(null)}>
        <DialogContent className="max-w-[90vw] sm:max-w-md dark:bg-zinc-950 dark:border-zinc-800 rounded-[2rem] md:rounded-[2.5rem] border shadow-2xl">
          <DialogHeader className="text-center pt-2">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4"><Send className="text-green-600" size={20} /></div>
            <DialogTitle className="text-lg md:text-xl font-black uppercase italic dark:text-gray-100">Initiate Broadcast</DialogTitle>
            <p className="text-[10px] md:text-xs text-zinc-500 font-medium uppercase tracking-tight mt-2 text-center px-2">Blasting to the <span className="text-green-600 font-black">{confirmSend?.recipient_type}</span> group via Resend.</p>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-3 sm:justify-center py-4 flex flex-col-reverse sm:flex-row">
            <Button variant="ghost" onClick={() => setConfirmSend(null)} className="text-[10px] font-black uppercase text-zinc-500">Hold</Button>
            <Button onClick={handleSend} disabled={isProcessing} className="bg-green-600 text-white rounded-xl px-8 font-black text-[10px] uppercase hover:bg-green-700 active:scale-95">
              {isProcessing ? <Loader2 className="animate-spin h-3 w-3 mr-2" /> : "Authorize Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    sent: "bg-green-50 text-green-700 dark:bg-green-500/10 border-green-100",
    scheduled: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 border-blue-100",
    draft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 border-transparent",
  };
  const icons = {
    sent: <CheckCircle className="h-2.5 w-2.5" />,
    scheduled: <Clock className="h-2.5 w-2.5" />,
    draft: <FileText className="h-2.5 w-2.5 opacity-50" />,
  };
  const currentStatus = (status?.toLowerCase() || 'draft') as keyof typeof styles;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${styles[currentStatus]}`}>
      {icons[currentStatus as keyof typeof icons]} {currentStatus}
    </span>
  );
}