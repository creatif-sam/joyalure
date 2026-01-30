"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, Edit, Trash2, Loader2, Eye, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import NewTemplateModal from "./NewTemplateModal";
import { deleteEmailTemplate } from "@/app/actions";

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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this template?")) return;
    const res = await deleteEmailTemplate(id);
    if (res.success) fetchTemplates();
    else alert(res.error);
  };

  const handleEditOpen = (template: Template) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header Area */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-50 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <span className="font-bold text-lg text-gray-900 block leading-none">Email Templates</span>
            <span className="text-xs text-gray-400 font-medium">{templates.length} saved layouts</span>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-yellow-400 text-black font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          onClick={() => {
            setSelectedTemplate(null);
            setShowModal(true);
          }}
        >
          <Plus className="h-4 w-4" /> New Template
        </button>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Accessing Database...</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 text-gray-400">
              <tr className="text-[10px] uppercase tracking-widest font-bold text-left">
                <th className="px-6 py-4">Template Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {templates.length > 0 ? (
                templates.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-900">{t.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-tight">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{t.subject}</td>
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
                        <button onClick={() => setViewTemplate(t)} className="p-2 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-lg transition" title="Quick View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEditOpen(t)} className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition" title="Edit Template">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition" title="Delete Permanent">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic">
                    No templates found. Click "New Template" to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {viewTemplate && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Mail size={20} />
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900 leading-none">{viewTemplate.name}</h3>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">Inbox Preview</p>
                   </div>
                </div>
                <button onClick={() => setViewTemplate(null)} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-400 hover:text-black">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
                <div className="mb-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-sm">
                   <span className="text-gray-400 font-medium">Subject:</span> <span className="text-gray-900 font-bold ml-2">{viewTemplate.subject}</span>
                </div>
                <div 
                  className="bg-white shadow-xl rounded-xl p-10 min-h-full border border-gray-200"
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