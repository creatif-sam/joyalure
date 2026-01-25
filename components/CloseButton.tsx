import React from "react";

interface CloseButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
}

// Standalone close button component styled like the reference, with brand color
export default function CloseButton({ onClick, className = "", label = "CLOSE" }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-2 py-2 bg-black/80 border border-white rounded-md group ${className}`}
      style={{ minWidth: 56, minHeight: 56 }}
      aria-label={label}
      type="button"
    >
      {/* X icon with brand color */}
      <span className="flex items-center justify-center w-7 h-7">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="6" y1="6" x2="18" y2="18" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="18" y1="6" x2="6" y2="18" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-white tracking-[0.2em] text-base font-medium group-hover:text-green-300 transition-colors select-none">
        {label}
      </span>
    </button>
  );
}
