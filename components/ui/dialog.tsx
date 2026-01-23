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
      <RadixDialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
      <RadixDialog.Content className={`fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg ${className}`}>
        {children}
        <RadixDialog.Close asChild>
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export function DialogHeader({ children }: any) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }: any) {
  return <h2 className="text-xl font-semibold mb-2">{children}</h2>;
}
