"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React from "react";

export function Dialog({ open, onOpenChange, children }: any) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  );
}

export function DialogContent({ children, className = "" }: any) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200" />
      <RadixDialog.Content 
        className={`fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-zinc-950 p-6 shadow-2xl border dark:border-zinc-800 animate-in zoom-in-95 duration-200 ${className}`}
      >
        {children}
        <RadixDialog.Close asChild>
          <button 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export function DialogHeader({ children }: any) {
  return <div className="mb-4 flex flex-col space-y-1.5 text-center sm:text-left">{children}</div>;
}

/**
 * FIX: Using RadixDialog.Title with asChild ensures 
 * accessibility and resolves the Console Error.
 */
export function DialogTitle({ children }: any) {
  return (
    <RadixDialog.Title asChild>
      <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">
        {children}
      </h2>
    </RadixDialog.Title>
  );
}

/**
 * FIX: Using RadixDialog.Description with asChild
 */
export function DialogDescription({ children }: any) {
  return (
    <RadixDialog.Description asChild>
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        {children}
      </p>
    </RadixDialog.Description>
  );
}

export function DialogFooter({ children, className = "" }: any) {
  return (
    <div className={`mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
      {children}
    </div>
  );
}