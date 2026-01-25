"use client";

import { useState } from "react";
import { X } from "lucide-react";

const categories = [
  "Announcement",
  "Application Reception",
  "Reminder",
  "Welcome",
  "Promotion",
  "Order",
  "Shipping",
  "Other",
];

export default function NewTemplateModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={24} /></button>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">Create New Template</h2>

          {/* Template Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Template Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Conference Welcome Email"
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="text-xs text-gray-500 mt-1">A descriptive name to identify this template</div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-1">Organize templates by type for easier management</div>
          </div>

          {/* Email Subject */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Subject <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Enter email subject line"
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Email Body */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Body (HTML supported) <span className="text-red-500">*</span></label>
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
            <button className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-yellow-400 text-black shadow hover:from-green-600 hover:to-yellow-500 transition">Create Template</button>
          </div>
        </div>
      </div>
    </div>
  );
}
