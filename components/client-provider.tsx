"use client"

import { useDarkMode } from "@/hooks/use-dark-mode"
import Navigation from "@/components/navigation"

interface ClientProviderProps {
  children: React.ReactNode
}

export function ClientProvider({ children }: ClientProviderProps) {
  const { themeClasses } = useDarkMode()

  return (
    <div className={`min-h-screen ${themeClasses.background} max-w-sm mx-auto relative`}>
      {/* Main Content */}
      <div className="pb-20">{children}</div>
      
      {/* Navigation */}
      <Navigation />
    </div>
  )
} 