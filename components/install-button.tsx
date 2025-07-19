'use client'

import { usePWA } from '@/hooks/usePWA'
import { Button } from '@/components/ui/button'
import { Download, Check } from 'lucide-react'

export function InstallButton() {
  const { isInstallable, isInstalled, installApp } = usePWA()

  if (isInstalled) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Check className="h-4 w-4" />
        App Installed
      </Button>
    )
  }

  if (!isInstallable) {
    return null
  }

  return (
    <Button 
      onClick={installApp}
      className="gap-2 bg-blue-600 hover:bg-blue-700"
    >
      <Download className="h-4 w-4" />
      Install App
    </Button>
  )
}
