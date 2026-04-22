"use client"

import { Loader2, Video, Trash2 } from "lucide-react"

interface Props {
  videos: string[]
  uploading: boolean
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: (index: number) => void
}

export default function VideoUploadField({ videos, uploading, onUpload, onRemove }: Props) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
        Product Videos
      </label>

      <label className="relative cursor-pointer">
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
          multiple
          onChange={onUpload}
          className="hidden"
          disabled={uploading}
        />
        <div className="w-full px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors flex items-center justify-center gap-3">
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
              <span className="font-bold text-amber-700 dark:text-amber-400">Uploading...</span>
            </>
          ) : (
            <>
              <Video className="h-5 w-5 text-amber-600" />
              <span className="font-bold text-amber-700 dark:text-amber-400">Click to Upload Videos</span>
              <span className="text-xs text-amber-600">(Max 50MB each)</span>
            </>
          )}
        </div>
      </label>

      {videos.length > 0 && (
        <div className="mt-4 space-y-2">
          {videos.map((vid, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg group">
              <Video className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">Video {idx + 1}</span>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="p-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
