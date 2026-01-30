"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, Edit, Trash2, Loader2, Eye, X, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import { createClient } from "@/lib/supabase/client";
import NewTemplateModal from "./NewTemplateModal";
// Import your activated actions
import { deleteEmailTemplate, createEmailTemplate } from "@/app/actions"; 

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
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ACTIVATE DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Permanently delete this template? This cannot be undone.")) return;
    
    const res = await deleteEmailTemplate(id);
    if (res.success) {
      fetchTemplates();
    } else {
      alert("Error: " + res.error);
    }
  };

  // ACTIVATE EDIT
  const handleEditOpen = (template: Template) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  // ACTIVATE DUPLICATE (Helper)
  const handleDuplicate = async (template: Template) => {
    const res = await createEmailTemplate({
      name: `${template.name} (Copy)`,
      category: template.category,
      subject: template.subject,
      body: template.body
    });
    
    if (res.success) fetchTemplates();
    else alert("Duplicate failed: " + res.error);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden text-black">
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-50 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <span className="font-bold text-lg text-gray-900">
            Email Templates ({templates.length})
          </span>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-yellow-400 text-black font-bold shadow-md hover:brightness-105 transition active:scale-95"
          onClick={() => {
            setSelectedTemplate(null);
            setShowModal(true);
          }}
        >
          <Plus className="h-4 w-4" /> New Template
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 text-gray-400">
              <tr className="text-[10px] uppercase tracking-widest font-bold text-left">
                <th className="px-6 py-4">Template Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {templates.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-900">{t.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600 text-[10px] font-bold uppercase">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{t.subject}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 rounded-md bg-green-50 text-green-700 text-[10px] font-bold uppercase">
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 italic">
                    {new Date(t.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setViewTemplate(t)}
                        className="text-gray-400 hover:text-green-600 p-2 hover:bg-green-50 rounded-lg transition"
                        title="View Preview"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDuplicate(t)}
                        className="text-gray-400 hover:text-orange-500 p-2 hover:bg-orange-50 rounded-lg transition"
                        title="Duplicate Template"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditOpen(t)}
                        className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Template"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition"
                        title="Delete Template"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {viewTemplate && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="font-bold text-gray-900">{viewTemplate.name}</h3>
                  <p className="text-xs text-gray-500">Subject: {viewTemplate.subject}</p>
                </div>
                <button 
                  onClick={() => setViewTemplate(null)} 
                  className="p-2 hover:bg-gray-200 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                <div 
                  className="bg-white shadow-sm rounded-lg p-8 min-h-full prose prose-sm max-w-none mx-auto"
                  dangerouslySetInnerHTML={{ __html: viewTemplate.body }}
                />
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