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
  
  // Modal States
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
      toast.success("Campaign Purged", { description: "The record has been removed from the archive." });
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
      <div className="flex flex-col items-center justify-center h-80 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[2.5rem]">
        <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Archiving Local Data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
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

      {/* VIEW / PREVIEW MODAL */}
      <Dialog open={!!viewCampaign} onOpenChange={() => setViewCampaign(null)}>
        <DialogContent className="max-w-2xl dark:bg-zinc-950 dark:border-zinc-800 rounded-[2.5rem] border shadow-2xl overflow-hidden p-0">
          <div className="p-6 border-b dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
            <h2 className="text-xl font-black italic uppercase dark:text-gray-100 tracking-tighter">Editorial Snapshot</h2>
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mt-1">Reviewing: {viewCampaign?.subject}</p>
          </div>
          <div className="p-8 max-h-[60vh] overflow-y-auto prose prose-zinc prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: viewCampaign?.body }} />
          <div className="p-6 border-t dark:border-zinc-800 bg-zinc-50/50 flex justify-end">
            <Button onClick={() => setViewCampaign(null)} className="rounded-xl font-black text-[10px] uppercase bg-zinc-900 text-white">Close Archive</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-md dark:bg-zinc-950 dark:border-zinc-800 rounded-[2.5rem] border shadow-2xl">
          <DialogHeader className="text-center pt-4">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4"><Trash2 className="text-red-600" size={24} /></div>
            <DialogTitle className="text-xl font-black uppercase italic dark:text-gray-100">Permanent Purge</DialogTitle>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-tight mt-2">Are you certain? This campaign archive will be erased from the system forever.</p>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:justify-center py-4">
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="text-[10px] font-black uppercase text-zinc-500">Cancel</Button>
            <Button onClick={handleDelete} disabled={isProcessing} className="bg-red-600 text-white rounded-xl px-8 font-black text-[10px] uppercase hover:bg-red-700 active:scale-95 transition-all">
              {isProcessing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Confirm Purge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SEND MODAL */}
      <Dialog open={!!confirmSend} onOpenChange={() => setConfirmSend(null)}>
        <DialogContent className="sm:max-w-md dark:bg-zinc-950 dark:border-zinc-800 rounded-[2.5rem] border shadow-2xl">
          <DialogHeader className="text-center pt-4">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4"><Send className="text-green-600" size={24} /></div>
            <DialogTitle className="text-xl font-black uppercase italic dark:text-gray-100">Initiate Broadcast</DialogTitle>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-tight mt-2 text-center">Blasting "{confirmSend?.subject}" to the <span className="text-green-600 font-black">{confirmSend?.recipient_type}</span> group. This action triggers immediate delivery via Resend.</p>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:justify-center py-4">
            <Button variant="ghost" onClick={() => setConfirmSend(null)} className="text-[10px] font-black uppercase text-zinc-500">Hold Broadcast</Button>
            <Button onClick={handleSend} disabled={isProcessing} className="bg-green-600 text-white rounded-xl px-8 font-black text-[10px] uppercase hover:bg-green-700 active:scale-95 transition-all">
              {isProcessing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Authorize Send"}
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
    sent: <CheckCircle className="h-3 w-3" />,
    scheduled: <Clock className="h-3 w-3" />,
    draft: <FileText className="h-3 w-3 opacity-50" />,
  };
  const currentStatus = (status?.toLowerCase() || 'draft') as keyof typeof styles;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${styles[currentStatus]}`}>
      {icons[currentStatus as keyof typeof icons]} {currentStatus}
    </span>
  );
}