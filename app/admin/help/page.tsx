import React from "react";

export default function AdminHelpCenterPage() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2 text-left">Help Center</h1>
      <p className="text-gray-600 mb-8 text-left">
        Find answers to common admin questions, get support, and learn how to use the admin dashboard.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>How to add a new product</li>
            <li>How to manage inventory</li>
            <li>How to view orders</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>How to add a new admin</li>
            <li>How to reset user passwords</li>
            <li>How to manage customer accounts</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Settings & Security</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>Configuring dashboard settings</li>
            <li>Enabling two-factor authentication</li>
            <li>Managing permissions</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Support</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>Contact admin support</li>
            <li>Report a dashboard issue</li>
            <li>Admin community forums</li>
          </ul>
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-4">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.418-4 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
        <div>
          <h3 className="text-lg font-semibold mb-1">Still need help?</h3>
          <p className="text-gray-700 text-sm mb-2">If you can't find your answer here, you can contact Samuel directly:</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href="mailto:samuel.creatiftechs@gmail.com"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition text-center"
            >
              Email Samuel
            </a>
            <a
              href="https://wa.me/212684893821"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition text-center"
            >
              WhatsApp Samuel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
