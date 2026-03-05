"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, X, Check, Package, AlertCircle, TrendingUp, Mail } from "lucide-react"
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  subscribeToNotifications,
  formatRelativeTime,
  type Notification
} from "@/lib/supabase/notifications"
import { useUser } from "@/hooks/use-user"

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()

  const unreadCount = notifications.filter(n => !n.read).length

  // Fetch notifications on mount
  useEffect(() => {
    loadNotifications()
  }, [])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user?.id) return

    const unsubscribe = subscribeToNotifications(user.id, (newNotification) => {
      setNotifications(prev => [newNotification, ...prev])
    })

    return () => {
      unsubscribe()
    }
  }, [user?.id])

  const loadNotifications = async () => {
    setLoading(true)
    const data = await fetchNotifications()
    setNotifications(data)
    setLoading(false)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleMarkAsRead = async (id: string) => {
    const success = await markNotificationAsRead(id)
    if (success) {
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      )
    }
  }

  const handleMarkAllAsRead = async () => {
    const success = await markAllNotificationsAsRead()
    if (success) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }
  }

  const handleRemoveNotification = async (id: string) => {
    const success = await deleteNotification(id)
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="w-4 h-4" />
      case "alert":
        return <AlertCircle className="w-4 h-4" />
      case "info":
        return <TrendingUp className="w-4 h-4" />
      case "message":
        return <Mail className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
      case "alert":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
      case "info":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      case "message":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 flex items-center justify-center rounded-xl border dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
      >
        <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950 flex items-center justify-center text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 md:w-96 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
            <h3 className="font-bold text-gray-900 dark:text-zinc-100">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                  {unreadCount}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-green-600 dark:text-green-400 hover:underline font-semibold"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 dark:text-zinc-400 text-sm">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-700 mb-3" />
                <p className="text-gray-500 dark:text-zinc-400">No notifications</p>
              </div>
            ) : (
              <div className="divide-y dark:divide-zinc-800">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors relative group ${
                      !notification.read ? "bg-green-50/50 dark:bg-green-900/10" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-zinc-100">
                            {notification.title}
                          </h4>
                          <button
                            onClick={() => handleRemoveNotification(notification.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 dark:text-zinc-500">
                            {formatRelativeTime(notification.created_at)}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t dark:border-zinc-800 p-3 bg-gray-50 dark:bg-zinc-900/50">
              <button className="text-sm text-green-600 dark:text-green-400 hover:underline font-semibold w-full text-center">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
