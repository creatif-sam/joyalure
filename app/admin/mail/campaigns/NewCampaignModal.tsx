"use client";

import { useState } from "react";
import { X, User, Mail, ShoppingCart, Star, Users, Eye, Save } from "lucide-react";

const templates = [
  { id: 1, name: "Order Confirmation", category: "Order", },
  { id: 2, name: "Shipping Update", category: "Shipping" },
  { id: 3, name: "Abandoned Cart", category: "Reminder" },
  { id: 4, name: "Welcome Email", category: "Welcome" },
];

const recipientTypes = [
  { key: "custom", label: "Custom", icon: User },
  { key: "newsletter", label: "Newsletter", icon: Mail },
  { key: "customers", label: "Customers", icon: Users },
  { key: "vip", label: "VIP", icon: Star },
  { key: "partners", label: "Partners", icon: ShoppingCart },
];

export default function NewCampaignModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [recipient, setRecipient] = useState("custom");
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={24} /></button>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">New Email Campaign</h2>

          {/* Templates */}
          <div className="mb-6">
            <div className="mb-2 text-sm font-semibold text-gray-700">Load from Template (Optional)</div>
            <div className="grid grid-cols-2 gap-3">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`rounded-lg border px-4 py-3 text-left ${selectedTemplate === t.id ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"}`}
                >
                  <div className="font-medium text-base">{t.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{t.category}</div>
                </button>
              ))}
            </div>
          </div>


          {/* Recipient Types */}
          <div className="mb-6">
            <div className="mb-2 text-sm font-semibold text-gray-700">Send To</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {recipientTypes.map(r => (
                <button
                  key={r.key}
                  onClick={() => setRecipient(r.key)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg border px-0 py-4 ${recipient === r.key ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white"}`}
                >
                  <r.icon className="h-6 w-6 mb-1" />
                  <span className="text-sm font-medium">{r.label}</span>
                </button>
              ))}
            </div>
            {recipient === "custom" && (
              <div className="mt-3">
                <div className="text-xs text-yellow-700 mb-1 flex items-center gap-1">
                  <span className="font-semibold">*</span> Enter specific email addresses (comma-separated) below
                </div>
                <textarea
                  value={emails}
                  onChange={e => setEmails(e.target.value)}
                  placeholder="email1@example.com, email2@example.com"
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[56px]"
                />
              </div>
            )}
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Email Body */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Body (HTML supported)</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Enter email content (HTML tags supported)"
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={onClose} className="px-6 py-2 rounded-lg font-semibold border border-black text-black bg-white hover:bg-gray-100">Cancel</button>
            <button className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-yellow-400 text-black shadow hover:from-green-600 hover:to-yellow-500 transition flex items-center gap-2"><Eye size={18} /> Preview</button>
            <button className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-yellow-400 text-black shadow hover:from-green-600 hover:to-yellow-500 transition flex items-center gap-2"><Save size={18} /> Save Draft</button>
          </div>
        </div>
      </div>
    </div>
  );
}
