"use client"

import { Plus, Trash2 } from "lucide-react"

interface Props {
  features: string[]
  onAdd: () => void
  onUpdate: (index: number, value: string) => void
  onRemove: (index: number) => void
}

export default function FeaturesField({ features, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
        Product Features
      </label>
      <div className="space-y-2">
        {features.map((feature, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => onUpdate(idx, e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:border-green-600 focus:outline-none"
              placeholder="e.g., 100% Natural Ingredients"
            />
            {features.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="p-2 bg-red-100 hover:bg-red-200 rounded-lg"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="w-full py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Feature
        </button>
      </div>
    </div>
  )
}
