"use client";

import { useState, useEffect } from "react";
import { X, Eye, Code, Loader2, Save, Sparkles, Layout } from "lucide-react";
import { createEmailTemplate, updateEmailTemplate } from "@/app/actions";
import { toast } from "sonner";

const categories = ["Announcement", "Application Reception", "Reminder", "Welcome", "Promotion", "Other"];

interface NewTemplateModalProps {
  open: boolean;
  onClose: () => void;
  editData?: any; 
}

export default function NewTemplateModal({ open, onClose, editData }: NewTemplateModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (editData && open) {
      setName(editData.name || "");
      setCategory(editData.category || "Other");
      setSubject(editData.subject || "");
      setBody(editData.body || "");
    } else if (open) {
      setName(""); setCategory("Other"); setSubject(""); setBody("");
    }
  }, [editData, open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name || !subject || !body) {
      return toast.error("Editorial Sync Blocked", { description: "Name, Subject, and Body are required." });
    }
    setIsSubmitting(true);
    const payload = { name, category, subject, body };
    const result = editData?.id 
      ? await updateEmailTemplate(editData.id, payload)
      : await createEmailTemplate(payload);

    if (result.success) {
      toast.success(editData ? "Template Updated" : "Template Created");
      onClose();
    } else {
      toast.error("Sync Failed", { description: result.error });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-md md:p-4 text-black">
      <div className="bg-white dark:bg-zinc-950 rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-6xl flex flex-col h-[95dvh] md:h-[90vh] overflow-hidden border-t md:border border-zinc-200 dark:border-zinc-800 transition-all">
        
        {/* HEADER */}
        <div className="p-5 md:p-6 border-b dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black italic uppercase tracking-tighter dark:text-zinc-100">
                {editData ? "Edit Template" : "New Template"}
              </h2>
              <p className="hidden xs:block text-[9px] font-black uppercase text-zinc-400 tracking-widest">Editorial Architect</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* View Toggle - Custom Joyalure Switch */}
            <div className="flex bg-zinc-200 dark:bg-zinc-800 p-1 rounded-xl">
              <button 
                onClick={() => setPreviewMode(false)} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!previewMode ? "bg-white dark:bg-zinc-700 shadow-sm text-green-700 dark:text-green-400" : "text-zinc-500"}`}
              >
                <Code size={14} /> <span className="hidden sm:inline">Editor</span>
              </button>
              <button 
                onClick={() => setPreviewMode(true)} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${previewMode ? "bg-white dark:bg-zinc-700 shadow-sm text-green-700 dark:text-green-400" : "text-zinc-500"}`}
              >
                <Eye size={14} /> <span className="hidden sm:inline">Preview</span>
              </button>
            </div>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-red-500 transition-colors"><X size={24} /></button>
          </div>
        </div>

        {/* MAIN BODY */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* INPUTS PANEL */}
          <div className={`flex-1 p-5 md:p-8 overflow-y-auto border-r dark:border-zinc-800 ${previewMode ? 'hidden md:block' : 'block'}`}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Template Identifier</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Summer Welcome 2026" className="w-full border dark:border-zinc-800 rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-green-500 font-bold dark:text-zinc-100 transition-all" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Classification</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border dark:border-zinc-800 rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-green-500 font-bold dark:text-zinc-100 transition-all">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Subject</label>
                  <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Inbox headline..." className="w-full border dark:border-zinc-800 rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-green-500 font-bold dark:text-zinc-100 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">HTML Architecture</label>
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="<html><body>...</body></html>" className="w-full border dark:border-zinc-800 rounded-2xl px-5 py-5 bg-zinc-50 dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-green-500 h-64 md:h-80 font-mono text-sm dark:text-zinc-300 transition-all" />
              </div>
            </div>
          </div>

          {/* PREVIEW PANEL */}
          <div className={`flex-1 bg-zinc-100 dark:bg-zinc-900/50 p-4 md:p-8 overflow-y-auto ${!previewMode ? 'hidden md:block' : 'block'}`}>
             <div className="max-w-[375px] md:max-w-none mx-auto bg-white shadow-2xl rounded-2xl md:rounded-[2rem] overflow-hidden min-h-[500px]">
               {/* Mock Browser Header for PC Preview */}
               <div className="hidden md:flex p-3 bg-zinc-50 border-b gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                 <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
               </div>
               <div className="p-6 md:p-10 prose prose-zinc prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: body || '<p class="text-zinc-300 italic text-center py-20">Awaiting editorial content...</p>' }} />
             </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-5 md:p-6 border-t dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 border dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-black text-[10px] uppercase tracking-widest text-zinc-500 transition-all">Cancel</button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="px-10 py-3 bg-green-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-green-600/20 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
            {editData ? "Archive Changes" : "Create Template"}
          </button>
        </div>
      </div>
    </div>
  );
}