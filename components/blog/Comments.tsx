"use client"

import { useState } from "react"

type Comment = {
  id: number
  name: string
  message: string
}

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  function submitComment() {
    if (!name || !message) return

    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        message
      }
    ])

    setName("")
    setMessage("")
  }

  return (
    <div className="mt-16">
      <h3 className="text-xl font-semibold mb-6">Comments</h3>

      <div className="space-y-6 mb-8">
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900">
              {comment.name}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {comment.message}
            </p>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-gray-600">
            Be the first to leave a comment.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full border px-4 py-3 rounded-md"
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a comment..."
          rows={4}
          className="w-full border px-4 py-3 rounded-md"
        />

        <button
          onClick={submitComment}
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Post Comment
        </button>
      </div>
    </div>
  )
}
