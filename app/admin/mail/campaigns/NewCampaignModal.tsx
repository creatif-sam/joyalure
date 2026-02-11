"use client";

import { useState, useEffect } from "react";
import { 
  X, User, Mail, ShoppingCart, Star, Users, Eye, Save, 
  Loader2, ArrowLeft, Monitor, Smartphone 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const recipientTypes = [
  { key: "custom", label: "Custom", icon: User },
  { key: "newsletter", label: "News", icon: Mail },
  { key: "customers", label: "Clients", icon: Users },
  { key: "vip", label: "VIP", icon: Star },
  { key: "partners", label: "Partners", icon: ShoppingCart },
];

interface NewCampaignModalProps {
  open: boolean;
  onClose: () => void;
  initialRecipient?: string | null;
}

export default function NewCampaignModal({ open, onClose, initialRecipient }: NewCampaignModalProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [recipient, setRecipient] = useState("custom");
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && initialRecipient) {
      setRecipient("custom");
      setEmails(initialRecipient);
    }
  }, [open, initialRecipient]);

  useEffect(() => {
    if (open) {
      const fetchTemplates = async () => {
        setLoadingTemplates(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from('email_templates')
          .select('*')
          .eq('status', 'Active')
          .order('name');
        
        if (error) toast.error("Template Sync Failed");
        else setTemplates(data || []);
        setLoadingTemplates(false);
      };
      fetchTemplates();
      setIsPreview(false);
    }
  }, [open]);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplateId(template.id);
    setSubject(template.subject);
    setBody(template.body);
    toast.info(`Loaded: ${template.name}`);
  };

  const handleSaveDraft = async () => {
    if (!subject || !body) return toast.error("Content Required");
    setIsSaving(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('campaigns')
        .insert([{
          subject, body, recipient_type: recipient, status: 'draft',
          template_id: selectedTemplateId,
          emails: recipient === 'custom' ? emails : null,
        }]);

      if (error) throw error;
      toast.success("Draft Archived");
      onClose();
    } catch (error: any) {
      toast.error("Save Failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md md:p-4">
      <div className={`bg-white dark:bg-zinc-950 md:rounded-[2.5rem] shadow-2xl w-full relative overflow-hidden flex flex-col transition-all duration-500 border-t md:border dark:border-zinc-800 ${
        isPreview ? 'max-w-5xl h-[100dvh] md:h-[85vh]' : 'max-w-2xl h-[95dvh] md:h-auto md:max-h-[90vh]'
      }`}>
        
        {/* HEADER */}
        <div className="sticky top-0 z-10 p-4 md:p-6 border-b dark:border-zinc-800 flex items-center justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
          <div>
            <h2 className="text-lg md:text-xl font-black tracking-tighter dark:text-gray-100 uppercase italic">
              {isPreview ? "System Preview" : "Architect"}
            </h2>
            <p className="hidden xs:block text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-0.5">Joyalure Editorial Desk</p>
          </div>
          
          <div className="flex items-center gap-2">
             {isPreview && (
               <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                 <button onClick={() => setPreviewDevice('desktop')} className={`p-2 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-white dark:bg-zinc-700 shadow-sm text-green-600' : 'text-zinc-400'}`}><Monitor size={14}/></button>
                 <button onClick={() => setPreviewDevice('mobile')} className={`p-2 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-white dark:bg-zinc-700 shadow-sm text-green-600' : 'text-zinc-400'}`}><Smartphone size={14}/></button>
               </div>
             )}
             <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"><X size={20} className="dark:text-zinc-400" /></button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950 pb-safe">
          {isPreview ? (
            /* PREVIEW MODE */
            <div className="p-4 md:p-8 bg-zinc-100 dark:bg-zinc-900/50 flex justify-center min-h-full">
              <div className={`bg-white text-black transition-all duration-500 shadow-2xl relative flex flex-col ${
                previewDevice === 'mobile' 
                ? 'w-full max-w-[320px] rounded-[2.5rem] border-[8px] border-zinc-950 h-[580px] my-4' 
                : 'w-full rounded-2xl min-h-[500px]'
              }`}>
                  <div className="p-4 border-b bg-zinc-50 flex flex-col gap-1">
                     <p className="text-[9px] font-black uppercase text-zinc-400 truncate">Subject: <span className="text-zinc-900 normal-case font-bold">{subject || "Empty"}</span></p>
                  </div>
                  <div className="p-6 md:p-10 prose prose-zinc prose-xs max-w-none overflow-x-hidden flex-1" dangerouslySetInnerHTML={{ __html: body || "<p class='text-zinc-400 text-center mt-20'>No content.</p>" }} />
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <div className="p-5 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
              
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-green-500" /> Target Audience
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {recipientTypes.map(r => (
                    <button 
                      key={r.key} 
                      onClick={() => setRecipient(r.key)} 
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border py-3 transition-all ${recipient === r.key ? "border-green-600 bg-green-50 dark:bg-green-600/10 text-green-600" : "border-zinc-100 dark:border-zinc-800 text-zinc-400"}`}
                    >
                      <r.icon className="h-4 w-4" />
                      <span className="text-[8px] font-black uppercase truncate w-full px-1">{r.label}</span>
                    </button>
                  ))}
                </div>
                {recipient === "custom" && (
                  <textarea 
                    value={emails} 
                    onChange={e => setEmails(e.target.value)} 
                    placeholder="Emails (comma separated)..." 
                    className="w-full border dark:border-zinc-800 rounded-xl px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950 outline-none transition font-bold" 
                  />
                )}
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-yellow-500" /> Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {templates.slice(0, 4).map(t => (
                    <button key={t.id} onClick={() => handleTemplateSelect(t)} className={`rounded-xl border p-3 text-left transition-all ${selectedTemplateId === t.id ? "border-green-500 bg-green-50/10" : "border-zinc-100 dark:border-zinc-800 text-zinc-400"}`}>
                      <div className="font-bold text-xs dark:text-zinc-200 truncate">{t.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Headline</label>
                  <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject..." className="w-full border dark:border-zinc-800 rounded-xl px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950 outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Body (HTML)</label>
                  <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="HTML Source..." className="w-full border dark:border-zinc-800 rounded-xl px-4 py-4 text-sm bg-zinc-50 dark:bg-zinc-950 outline-none min-h-[180px] font-mono" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER - Docked to bottom on mobile */}
        <div className="p-4 md:p-6 border-t dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center gap-3">
          {isPreview ? (
            <button onClick={() => setIsPreview(false)} className="flex-1 flex items-center justify-center gap-2 font-black text-[9px] uppercase text-zinc-500 h-12 border dark:border-zinc-800 rounded-xl"><ArrowLeft size={14}/> Back</button>
          ) : (
            <button onClick={() => setIsPreview(true)} className="flex-1 md:flex-none md:px-6 h-12 rounded-xl font-black text-[9px] uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-100 flex items-center justify-center gap-2"><Eye size={14} /> Preview</button>
          )}
          <button onClick={handleSaveDraft} disabled={isSaving} className="flex-[2] md:flex-none md:px-10 h-12 rounded-xl font-black text-[9px] uppercase bg-green-600 text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50">
            {isSaving ? <Loader2 className="animate-spin h-3 w-3" /> : <Save size={14} />} Archive
          </button>
        </div>
      </div>
    </div>
  );
}