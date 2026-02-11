"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onClose?: () => void;
  className?: string;
}

export default function SearchBar({ onClose, className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(`/public/products?q=${encodeURIComponent(query.trim())}`);
    
    if (onClose) onClose();
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className={`relative w-full animate-in slide-in-from-top-2 duration-300 ${className}`}
    >
      <div className="relative flex items-center">
        <Search 
          size={18} 
          className="absolute left-4 text-gray-400 dark:text-zinc-500 pointer-events-none" 
        />
        <input
          autoFocus
          type="text"
          placeholder="Search for Joyalure products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:bg-white dark:focus:bg-zinc-950 transition-all text-sm shadow-sm dark:text-zinc-100"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition"
          >
            <X size={14} className="text-gray-500 dark:text-zinc-400" />
          </button>
        )}
      </div>
    </form>
  );
}