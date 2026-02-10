"use client"

import { useState } from "react"
import { Copy, Check, Ticket } from "lucide-react"

export function VoucherList({ vouchers }: { vouchers: any[] }) {
  if (vouchers.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-950 border border-green-100 dark:border-zinc-800 rounded-2xl p-10 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
          You do not have any vouchers yet.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {vouchers.map((v) => (
        <VoucherCard key={v.id} voucher={v} />
      ))}
    </div>
  )
}

function VoucherCard({ voucher }: { voucher: any }) {
  const [copied, setCopied] = useState(false)
  
  const expired = voucher.expires_at && new Date(voucher.expires_at) < new Date()
  const label = voucher.discount_type === "percentage" ? `${voucher.discount_value}% OFF` : `$${voucher.discount_value} OFF`
  const isDisabled = expired || voucher.is_used

  const handleCopy = async () => {
    if (isDisabled) return
    await navigator.clipboard.writeText(voucher.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`relative border rounded-2xl p-5 space-y-3 transition-all ${
      isDisabled 
        ? "bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 opacity-70" 
        : "bg-white dark:bg-zinc-950 border-green-100 dark:border-zinc-800 shadow-sm hover:shadow-md"
    }`}>
      <div className="flex justify-between items-center">
        <span className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${
          isDisabled ? "text-gray-400 dark:text-zinc-500" : "text-green-700 dark:text-green-500"
        }`}>
          <Ticket size={14} /> {label}
        </span>
        {isDisabled && (
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
            {voucher.is_used ? "Used" : "Expired"}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-900 p-2 rounded-xl border border-dashed dark:border-zinc-700">
        <div className="text-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 block leading-none mb-1">Code</span>
          <span className={`font-mono font-bold ${isDisabled ? "text-gray-400 dark:text-zinc-600" : "text-green-700 dark:text-green-400"}`}>
            {voucher.code}
          </span>
        </div>
        {!isDisabled && (
          <button onClick={handleCopy} className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-all active:scale-90">
            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-gray-400 hover:text-green-600" />}
          </button>
        )}
      </div>

      <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
        Expires: {voucher.expires_at ? new Date(voucher.expires_at).toLocaleDateString() : "No expiry"}
      </div>
    </div>
  )
}