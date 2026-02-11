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
  { key: "newsletter", label: "Newsletter", icon: Mail },
  { key: "customers", label: "Customers", icon: Users },
  { key: "vip", label: "VIP", icon: Star },
  { key: "partners", label: "Partners", icon: ShoppingCart },
];

interface NewCampaignModalProps {
  open: boolean;
  onClose: () => void;
  initialRecipient?: string | null; // Added for the Reply functionality
}

export default function NewCampaignModal({ open, onClose, initialRecipient }: NewCampaignModalProps) {
  // UI States
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  
  // Form States
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [recipient, setRecipient] = useState("custom");
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 1. Sync with initialRecipient if provided
  useEffect(() => {
    if (open && initialRecipient) {
      setRecipient("custom");
      setEmails(initialRecipient);
      toast.success(`Replying to: ${initialRecipient}`);
    }
  }, [open, initialRecipient]);

  // 2. Fetch Dynamic Templates
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

  // 3. Load Template Data
  const handleTemplateSelect = (template: any) => {
    setSelectedTemplateId(template.id);
    setSubject(template.subject);
    setBody(template.body);
    toast.info(`Loaded Template: ${template.name}`);
  };

  // 4. Save to public.campaigns
  const handleSaveDraft = async () => {
    if (!subject || !body) {
      return toast.error("Content Required", { description: "Subject and body cannot be empty." });
    }

    if (recipient === 'custom' && !emails.trim()) {
      return toast.error("Audience Required", { description: "Please enter at least one email for custom targeting." });
    }

    setIsSaving(true);
    const supabase = createClient();

    try {
      const sanitizedEmails = emails
        .split(',')
        .map(e => e.trim())
        .filter(e => e !== "")
        .join(', ');

      const campaignData = {
        subject,
        body,
        recipient_type: recipient,
        status: 'draft',
        template_id: selectedTemplateId,
        emails: recipient === 'custom' ? sanitizedEmails : null,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('campaigns')
        .insert([campaignData]);

      if (error) throw error;

      toast.success("Editorial Draft Archived");
      
      // Reset State
      setSubject("");
      setBody("");
      setEmails("");
      onClose();
    } catch (error: any) {
      toast.error("Database Error", { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className={`bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl w-full relative overflow-hidden flex flex-col transition-all duration-500 border dark:border-zinc-800 ${isPreview ? 'max-w-5xl h-[85vh]' : 'max-w-2xl max-h-[90vh]'}`}>
        
        {/* HEADER */}
        <div className="p-6 border-b dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            <h2 className="text-xl font-black tracking-tighter dark:text-gray-100 uppercase italic">
              {isPreview ? "System Preview" : "Campaign Architect"}
            </h2>
            {!isPreview && <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-0.5">Joyalure Editorial Desk</p>}
          </div>
          
          <div className="flex items-center gap-3">
             {isPreview && (
               <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl mr-2">
                 <button onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-white dark:bg-zinc-700 shadow-sm text-green-600' : 'text-zinc-400'}`}><Monitor size={16}/></button>
                 <button onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-white dark:bg-zinc-700 shadow-sm text-green-600' : 'text-zinc-400'}`}><Smartphone size={16}/></button>
               </div>
             )}
             <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"><X size={20} className="dark:text-zinc-400" /></button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950">
          {isPreview ? (
            /* PREVIEW MODE */
            <div className="p-8 bg-zinc-100 dark:bg-zinc-900/50 flex justify-center min-h-full">
              <div className={`bg-white text-black transition-all duration-500 shadow-2xl relative flex flex-col ${previewDevice === 'mobile' ? 'w-[375px] rounded-[3rem] border-[12px] border-zinc-950 h-[700px] mb-10' : 'w-full rounded-2xl min-h-[500px]'}`}>
                  <div className="p-5 border-b bg-zinc-50 flex flex-col gap-1">
                     <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Subject: <span className="text-zinc-900 normal-case font-bold">{subject || "No Subject"}</span></p>
                     <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Target: <span className="text-green-600">{recipient}</span></p>
                  </div>
                  <div className="p-10 prose prose-zinc prose-sm max-w-none overflow-x-hidden flex-1" dangerouslySetInnerHTML={{ __html: body || "<p class='text-zinc-400 italic text-center mt-20'>No content detected for preview.</p>" }} />
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
              
              {/* Audience Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" /> Target Audience
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {recipientTypes.map(r => (
                    <button 
                      key={r.key} 
                      type="button" 
                      onClick={() => setRecipient(r.key)} 
                      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border py-4 transition-all ${recipient === r.key ? "border-green-600 bg-green-50 dark:bg-green-600/10 text-green-600 dark:text-green-400" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-400"}`}
                    >
                      <r.icon className="h-5 w-5" />
                      <span className="text-[9px] font-black uppercase tracking-tight">{r.label}</span>
                    </button>
                  ))}
                </div>
                {recipient === "custom" && (
                  <textarea 
                    value={emails} 
                    onChange={e => setEmails(e.target.value)} 
                    placeholder="Recipient email(s) separated by commas..." 
                    className="w-full border dark:border-zinc-800 rounded-2xl px-4 py-4 text-sm bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-green-600 outline-none transition dark:text-zinc-200 min-h-[100px] font-bold" 
                  />
                )}
              </div>

              {/* Template Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> Source Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {templates.map(t => (
                    <button key={t.id} type="button" onClick={() => handleTemplateSelect(t)} className={`rounded-2xl border p-4 text-left transition-all ${selectedTemplateId === t.id ? "border-green-500 bg-green-50/30 dark:bg-green-600/10 ring-1 ring-green-500" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-green-500/50"}`}>
                      <div className="font-bold text-sm dark:text-zinc-200">{t.name}</div>
                      <div className="text-[9px] uppercase font-black tracking-tighter text-zinc-400 mt-1">{t.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editorial Content */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Editorial Headline</label>
                  <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject line..." className="w-full border dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-green-600 outline-none font-bold transition dark:text-zinc-100" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Message Body (HTML Source)</label>
                  <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Enter HTML content..." className="w-full border dark:border-zinc-800 rounded-[2rem] px-6 py-6 text-sm bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-green-600 outline-none transition min-h-[220px] font-mono dark:text-zinc-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between items-center gap-4">
          {isPreview ? (
            <button onClick={() => setIsPreview(false)} className="flex items-center gap-2 font-black text-[10px] uppercase text-zinc-500 hover:text-green-600 transition-colors px-4"><ArrowLeft size={16}/> Back to Editor</button>
          ) : <div />}
          <div className="flex gap-3">
            {!isPreview && (
              <button onClick={() => setIsPreview(true)} className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"><Eye size={16} /> Run Preview</button>
            )}
            <button onClick={handleSaveDraft} disabled={isSaving} className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase bg-green-600 text-white shadow-xl shadow-green-600/30 flex items-center gap-2 hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50">
              {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={16} />} Archive Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}