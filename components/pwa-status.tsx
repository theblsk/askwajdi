'use client'

import { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'

export function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-orange-100 border border-orange-200 p-3 text-orange-800 shadow-lg md:left-auto md:right-4 md:w-auto">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">You&apos;re offline</span>
      <span className="text-xs text-orange-600">Some features may be limited</span>
    </div>
  )
}
