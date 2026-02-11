"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, Edit, Trash2, Loader2, Eye, X, Copy, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import { createClient } from "@/lib/supabase/client";
import NewTemplateModal from "./NewTemplateModal";
import { deleteEmailTemplate, createEmailTemplate } from "@/app/actions"; 
import { toast } from "sonner";

interface Template {
  id: number;
  name: string;
  category: string;
  subject: string;
  status: string;
  body: string; 
  updated_at: string;
}

export default function EmailTemplatesTable() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [viewTemplate, setViewTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("updated_at", { ascending: false });
      
      if (!error) setTemplates(data || []);
    } catch (err) {
      toast.error("Editorial Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Permanently delete this template? This cannot be undone.")) return;
    const res = await deleteEmailTemplate(id);
    if (res.success) {
      toast.success("Template Purged");
      fetchTemplates();
    } else toast.error("Purge Failed: " + res.error);
  };

  const handleDuplicate = async (template: Template) => {
    const res = await createEmailTemplate({
      name: `${template.name} (Copy)`,
      category: template.category,
      subject: template.subject,
      body: template.body
    });
    
    if (res.success) {
      toast.success("Template Duplicated");
      fetchTemplates();
    } else toast.error("Cloning Failed");
  };

  useEffect(() => { fetchTemplates(); }, []);

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-green-50 dark:bg-green-500/10 rounded-xl">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="font-black text-xl md:text-2xl tracking-tighter text-zinc-900 dark:text-zinc-100 italic uppercase">
              Email Templates
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Archived Assets: {templates.length}</p>
          </div>
        </div>
        <button
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 md:py-3 rounded-2xl bg-green-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-600/20 hover:bg-green-700 transition active:scale-95"
          onClick={() => { setSelectedTemplate(null); setShowModal(true); }}
        >
          <Plus size={16} /> New Template
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-green-600" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Syncing Editorial Data...</p>
        </div>
      ) : (
        <>
          {/* PC TABLE VIEW (Hidden on Mobile) */}
          <div className="hidden lg:block bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-400 border-b dark:border-zinc-800">
                <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-left">
                  <th className="px-8 py-6 italic">Identity</th>
                  <th className="px-6 py-6">Category</th>
                  <th className="px-6 py-6">Status</th>
                  <th className="px-6 py-6">Updated</th>
                  <th className="px-8 py-6 text-right italic">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                {templates.map((t) => (
                  <tr key={t.id} className="hover:bg-green-50/30 dark:hover:bg-green-500/5 transition-all group">
                    <td className="px-8 py-5">
                      <p className="font-black text-zinc-900 dark:text-zinc-100 italic tracking-tight">{t.name}</p>
                      <p className="text-[10px] text-zinc-400 font-bold truncate max-w-[200px]">{t.subject}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[9px] font-black uppercase tracking-widest border border-transparent group-hover:border-zinc-200 transition-all">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-500 text-[9px] font-black uppercase tracking-widest border border-green-100 dark:border-green-900/20">
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase italic">
                      {new Date(t.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <ActionButton icon={Eye} onClick={() => setViewTemplate(t)} color="hover:text-green-600" />
                        <ActionButton icon={Copy} onClick={() => handleDuplicate(t)} color="hover:text-orange-500" />
                        <ActionButton icon={Edit} onClick={() => { setSelectedTemplate(t); setShowModal(true); }} color="hover:text-blue-600" />
                        <ActionButton icon={Trash2} onClick={() => handleDelete(t.id)} color="hover:text-red-600" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW (Hidden on PC) */}
          <div className="lg:hidden space-y-4 px-1">
            {templates.map((t) => (
              <div key={t.id} className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-6 space-y-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-zinc-900 dark:text-zinc-100 italic tracking-tight leading-tight">{t.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Tag size={10} className="text-green-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{t.category}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 text-[8px] font-black uppercase tracking-tighter border border-green-100 dark:border-green-900/20">
                    {t.status}
                  </span>
                </div>
                
                <p className="text-xs text-zinc-500 line-clamp-1 italic font-medium">Subject: {t.subject}</p>

                <div className="grid grid-cols-4 gap-2 pt-2">
                  <MobileAction icon={Eye} onClick={() => setViewTemplate(t)} label="View" />
                  <MobileAction icon={Copy} onClick={() => handleDuplicate(t)} label="Clone" />
                  <MobileAction icon={Edit} onClick={() => { setSelectedTemplate(t); setShowModal(true); }} label="Edit" />
                  <MobileAction icon={Trash2} onClick={() => handleDelete(t.id)} label="Purge" isDestructive />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {viewTemplate && (
          <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center md:p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-white dark:bg-zinc-950 rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-5xl h-[92vh] md:h-[85vh] overflow-hidden flex flex-col border-t md:border dark:border-zinc-800">
              <div className="p-6 border-b dark:border-zinc-800 flex justify-between items-center bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-xl">
                <div>
                  <h3 className="font-black text-xl italic tracking-tighter uppercase text-zinc-900 dark:text-zinc-100">{viewTemplate.name}</h3>
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest truncate max-w-[200px] md:max-w-none">Subject: {viewTemplate.subject}</p>
                </div>
                <button onClick={() => setViewTemplate(null)} className="h-12 w-12 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 rounded-full transition-all active:scale-90"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-zinc-100 dark:bg-zinc-900/30 flex justify-center">
                {/* Image of e-mail preview interface in Joyalure branding */}
                <div className="bg-white text-black shadow-2xl rounded-2xl md:rounded-[2rem] p-6 md:p-12 w-full max-w-3xl min-h-full" dangerouslySetInnerHTML={{ __html: viewTemplate.body }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <NewTemplateModal 
        open={showModal} 
        editData={selectedTemplate}
        onClose={() => { 
          setShowModal(false); 
          setSelectedTemplate(null);
          fetchTemplates(); 
        }} 
      />
    </div>
  );
}

// SUB-COMPONENTS
function ActionButton({ icon: Icon, onClick, color }: any) {
  return (
    <button onClick={onClick} className={`p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-400 transition-all hover:scale-110 active:scale-90 ${color}`}>
      <Icon size={16} />
    </button>
  );
}

function MobileAction({ icon: Icon, onClick, label, isDestructive }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl transition-all active:scale-90 ${isDestructive ? 'bg-red-50 dark:bg-red-950/20 text-red-500' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500'}`}>
      <Icon size={14} />
      <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}