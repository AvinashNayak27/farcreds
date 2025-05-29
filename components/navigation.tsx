"use client"

import { usePathname, useRouter } from "next/navigation"
import { useDarkMode } from "@/hooks/use-dark-mode"
import {
  Home,
  Settings,
  Compass,
} from "lucide-react"


export default function Navigation() {
  const { themeClasses } = useDarkMode()
  const pathname = usePathname()
  const router = useRouter()

  // Hide navigation on profile pages
  if (pathname?.startsWith('/profile/')) {
    return null
  }

  // Custom colors
  const colors = {
    purple: "rgb(112, 90, 180)",
    blue: "rgba(0, 0, 238, 1)",
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname?.startsWith(path)) return true
    return false
  }

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Compass, label: "Explore" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm ${themeClasses.footerBg} backdrop-blur-sm border-t ${themeClasses.footerBorder}`}
    >
      <div className="flex items-center justify-around py-3 bg-white">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
                active ? `bg-opacity-20` : `${themeClasses.textSecondary} hover:text-gray-400`
              }`}
              style={
                active
                  ? {
                      color: colors.purple,
                      backgroundColor: `${colors.purple}20`,
                    }
                  : {}
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}