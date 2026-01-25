import React from "react";

export default function HelpCenterPage() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2 text-left">Help Center</h1>
      <p className="text-gray-600 mb-8 text-left">
        Find answers to common questions, get support, and learn how to use our platform.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>How to create an account</li>
            <li>How to reset your password</li>
            <li>How to update your profile</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Orders & Payments</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>How to place an order</li>
            <li>Payment methods supported</li>
            <li>Tracking your order</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Account & Security</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>Managing your account</li>
            <li>Two-factor authentication</li>
            <li>Privacy settings</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Support</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>Contact support</li>
            <li>Report a problem</li>
            <li>Community forums</li>
          </ul>
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-4">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
        <div>
          <h3 className="text-lg font-semibold mb-1">Still need help?</h3>
          <p className="text-gray-700 text-sm mb-2">If you can't find your answer here, our support team is ready to assist you.</p>
          <a href="mailto:support@example.com" className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
