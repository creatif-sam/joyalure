
"use client";

import { useState } from "react";
import { FileText, Plus, Edit, Trash2 } from "lucide-react";
import NewTemplateModal from "@/app/admin/mail/templates/NewTemplateModal";

const templates = [
  {
    id: 1,
    name: "Invitation and Registration AMBF 26 Casablanca",
    category: "Announcement",
    subject: "Invitation and Registration AfricaMed Business Forum 2026 Casablanca",
    status: "Active",
    updated: "1/8/2026",
  },
  {
    id: 2,
    name: "Application Received Mail",
    category: "Application Reception",
    subject: "AfricaMed Business Forum Application Received",
    status: "Active",
    updated: "1/6/2026",
  },
];
export default function EmailTemplatesTable() {
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  return (
    <div className="bg-white rounded-xl border p-0 overflow-x-auto">
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-lg">Email Templates (4)</span>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-yellow-400 text-white font-semibold shadow hover:from-green-600 hover:to-yellow-500 transition"
          onClick={() => setShowNewTemplate(true)}
        >
          <Plus className="h-4 w-4" /> New Template
        </button>
      </div>
      <table className="w-full text-sm mt-2">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left">TEMPLATE NAME</th>
            <th className="text-left">CATEGORY</th>
            <th className="text-left">SUBJECT</th>
            <th className="text-left">STATUS</th>
            <th className="text-left">LAST UPDATED</th>
            <th className="text-left">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {templates.map(t => (
            <tr key={t.id}>
              <td className="px-6 py-4 whitespace-pre-line font-medium">{t.name}</td>
              <td>
                <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold">
                  {t.category}
                </span>
              </td>
              <td>{t.subject}</td>
              <td>
                <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                  {t.status}
                </span>
              </td>
              <td>{t.updated}</td>
              <td className="space-x-2">
                <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full" title="Edit"><Edit size={16} /></button>
                <button className="text-red-600 hover:bg-red-50 p-2 rounded-full" title="Delete"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* New Template Modal */}
      <NewTemplateModal open={showNewTemplate} onClose={() => setShowNewTemplate(false)} />
    </div>
  );
}
