"use client";

import { useState, useEffect } from "react";
import { X, Eye, Code, Loader2 } from "lucide-react";
import { createEmailTemplate, updateEmailTemplate } from "@/app/actions";

const categories = ["Announcement", "Application Reception", "Reminder", "Welcome", "Promotion", "Other"];

// FIX: Explicit Prop Interface to resolve IntrinsicAttributes error
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
    if (!name || !subject || !body) return alert("Please fill in required fields");
    setIsSubmitting(true);
    const payload = { name, category, subject, body };
    const result = editData?.id 
      ? await updateEmailTemplate(editData.id, payload)
      : await createEmailTemplate(payload);

    if (result.success) onClose();
    else alert("Error: " + result.error);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-black">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold">{editData ? "Edit Template" : "New Template"}</h2>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-200 p-1 rounded-lg">
              <button onClick={() => setPreviewMode(false)} className={`px-3 py-1.5 rounded-md text-xs font-bold ${!previewMode ? "bg-white shadow-sm" : "text-gray-500"}`}>Editor</button>
              <button onClick={() => setPreviewMode(true)} className={`px-3 py-1.5 rounded-md text-xs font-bold ${previewMode ? "bg-white shadow-sm" : "text-gray-500"}`}>Preview</button>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-black"><X size={24} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          <div className={`flex-1 p-8 overflow-y-auto border-r ${previewMode ? 'hidden md:block' : 'block'}`}>
            <div className="space-y-4">
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Template Name" className="w-full border rounded-xl px-4 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-green-500" />
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded-xl px-4 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-green-500">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email Subject" className="w-full border rounded-xl px-4 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-green-500" />
              <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="HTML content here..." className="w-full border rounded-xl px-4 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-green-500 h-64 font-mono" />
            </div>
          </div>
          <div className={`flex-1 bg-gray-100 p-8 overflow-y-auto ${!previewMode ? 'hidden md:block' : 'block'}`}>
            <div className="bg-white rounded-xl shadow-sm border p-6 min-h-full" dangerouslySetInnerHTML={{ __html: body || '<p class="text-gray-300 italic">Live preview...</p>' }} />
          </div>
        </div>
        <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border rounded-xl hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-2 bg-gradient-to-r from-green-500 to-yellow-400 font-bold rounded-xl shadow-lg flex items-center gap-2">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {editData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}