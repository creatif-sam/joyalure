

"use client";

import { useState } from "react";
import { Mail, Send, Inbox, Trash2, Users, FileText, Plus } from "lucide-react";
import NewCampaignModal from "@/app/admin/mail/campaigns/NewCampaignModal";
import EmailTemplatesTable from "@/app/admin/mail/templates/EmailTemplatesTable";
import { newsletterSubscribers } from "@/lib/newsletter-subscribers";

const statCards = [
  { label: "Total Campaigns", value: 49, icon: "mail-blue" },
  { label: "Draft Campaigns", value: 0, icon: "filetext-gray" },
  { label: "Sent Campaigns", value: 38, icon: "send-green" },
  { label: "Total Emails Sent", value: 2539, icon: "mail-darkblue" },
];

export default function AdminMail() {
  const [tab, setTab] = useState("campaigns");
  const [filter, setFilter] = useState("all");
  const [showNewCampaign, setShowNewCampaign] = useState(false);

            return (
              <div className="max-w-6xl mx-auto p-8">
                <div className="mb-6 p-6 bg-blue-50 border border-blue-100 rounded-xl">
                  <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <Mail className="h-6 w-6 text-blue-600" /> Email Campaign Management
                  </h2>
                  <p className="text-gray-700 text-sm">
                    Create and send email campaigns to your subscribers, conference participants, or club members. Use templates for quick composition, save drafts, and track delivery status. <span className="text-blue-700 font-semibold">Powered by Resend (3,000 emails/month free).</span>
                  </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {statCards.map(card => (
                    <div key={card.label} className="bg-white rounded-xl border p-4 flex flex-col items-center shadow-sm">
                      <div className="mb-2">
                        {card.icon === "mail-blue" && <Mail className="h-5 w-5 text-blue-500" />}
                        {card.icon === "filetext-gray" && <FileText className="h-5 w-5 text-gray-400" />}
                        {card.icon === "send-green" && <Send className="h-5 w-5 text-green-500" />}
                        {card.icon === "mail-darkblue" && <Mail className="h-5 w-5 text-blue-700" />}
                      </div>
                      <div className="text-2xl font-bold text-blue-900">{card.value}</div>
                      <div className="text-xs text-gray-500 mt-1 text-center">{card.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  <button onClick={() => setTab("campaigns")}
                    className={`px-4 py-2 rounded-t-lg font-medium border-b-2 ${tab === "campaigns" ? "border-green-600 text-black bg-white" : "border-transparent text-gray-500 bg-gray-50"}`}
                  >
                    Email Campaigns
                  </button>
                  <button onClick={() => setTab("templates")}
                    className={`px-4 py-2 rounded-t-lg font-medium border-b-2 ${tab === "templates" ? "border-yellow-400 text-black bg-white" : "border-transparent text-gray-500 bg-gray-50"}`}
                  >
                    Email Templates <span className="ml-1 text-xs text-yellow-500">(4)</span>
                  </button>
                  <button onClick={() => setTab("subscribers")}
                    className={`px-4 py-2 rounded-t-lg font-medium border-b-2 ${tab === "subscribers" ? "border-black text-black bg-white" : "border-transparent text-gray-500 bg-gray-50"}`}
                  >
                    Subscribers
                  </button>
                </div>

                {/* Campaigns tab */}
                {tab === "campaigns" && (
                  <div className="bg-white rounded-xl border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded-lg text-sm font-medium ${filter === "all" ? "bg-green-500 text-black" : "bg-gray-100 text-gray-600"}`}>All</button>
                        <button onClick={() => setFilter("drafts") } className={`px-3 py-1 rounded-lg text-sm font-medium ${filter === "drafts" ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-600"}`}>Drafts</button>
                        <button onClick={() => setFilter("sent") } className={`px-3 py-1 rounded-lg text-sm font-medium ${filter === "sent" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>Sent</button>
                      </div>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-yellow-400 text-black font-semibold shadow hover:from-green-600 hover:to-yellow-500 transition"
                        onClick={() => setShowNewCampaign(true)}
                      >
                        <Plus className="h-4 w-4" /> New Campaign
                      </button>
                    </div>
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left">Subject</th>
                          <th className="text-left">Recipient Type</th>
                          <th className="text-left">Status</th>
                          <th className="text-left">Recipients</th>
                          <th className="text-left">Created</th>
                          <th className="text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {/* Placeholder row */}
                        <tr>
                          <td className="px-4 py-3">Welcome to Joyalure!</td>
                          <td>Subscribers</td>
                          <td><span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Sent</span></td>
                          <td>1,200</td>
                          <td>2026-01-24</td>
                          <td className="space-x-2">
                            <button className="text-blue-600 hover:underline">View</button>
                            <button className="text-gray-600 hover:underline">Edit</button>
                            <button className="text-red-600 hover:underline">Delete</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Templates tab */}
                {tab === "templates" && (
                  <EmailTemplatesTable />
                )}

                {/* Subscribers tab */}
                {tab === "subscribers" && (
                  <div className="bg-white rounded-xl border p-4">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left">Email</th>
                          <th className="text-left">Subscribed Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {newsletterSubscribers.map(sub => (
                          <tr key={sub.id}>
                            <td className="px-6 py-4">{sub.email}</td>
                            <td>{sub.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              {/* New Campaign Modal */}
              <NewCampaignModal open={showNewCampaign} onClose={() => setShowNewCampaign(false)} />
              </div>
            );
          }
