"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDarkMode } from "@/hooks/use-dark-mode"
import {
  Plus,
  Twitter,
  Github,
  Instagram,
  Linkedin,
  Unlink,
  RotateCcw,
} from "lucide-react"

export default function SettingsPage() {
  const { themeClasses } = useDarkMode()

  // Custom colors
  const colors = {
    purple: "rgb(112, 90, 180)",
    blue: "rgba(0, 0, 238, 1)",
  }

  const linkedAccounts = [
    { platform: "Twitter", username: "@alexdev_", icon: Twitter, verified: true, color: "text-blue-400" },
    {
      platform: "GitHub",
      username: "alexdev",
      icon: Github,
      verified: true,
      color: "text-gray-700",
    },
    { platform: "LinkedIn", username: "alex-developer", icon: Linkedin, verified: true, color: "text-blue-500" },
    { platform: "Instagram", username: "alexdev.codes", icon: Instagram, verified: false, color: "text-pink-500" },
  ]

  return (
    <div className={`flex flex-col h-full ${themeClasses.background}`}>
      {/* Header */}
      <div className="p-6 pt-4">
        <h1 className={`text-xl font-bold mb-6 text-center ${themeClasses.text}`}>FarCreds</h1>
      </div>

      {/* Linked Accounts Management */}
      <div className="flex-1 px-6">
        <div className="mb-6">
          <h2 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Linked Accounts</h2>
          <div className="space-y-3">
            {linkedAccounts.map((account, index) => (
              <Card key={index} className={`${themeClasses.cardBg} ${themeClasses.cardBorder}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <account.icon className={`w-5 h-5 ${account.color}`} />
                      <div>
                        <p className={`font-medium ${themeClasses.text}`}>{account.platform}</p>
                        <p className={`text-sm ${themeClasses.textSecondary}`}>{account.username}</p>
                      </div>
                    </div>
                    <Badge
                      variant={account.verified ? "default" : "outline"}
                      className={
                        account.verified
                          ? "bg-green-600/20 text-green-500 border-green-500/30"
                          : "text-yellow-500 border-yellow-500/30"
                      }
                    >
                      {account.verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${themeClasses.cardBorder} ${themeClasses.textSecondary} hover:bg-gray-100`}
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reverify
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600/10">
                      <Unlink className="w-3 h-3 mr-1" />
                      Unlink
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button className="w-full text-white hover:opacity-90 mb-6" style={{ backgroundColor: colors.purple }}>
          <Plus className="w-4 h-4 mr-2" />
          Link a New Account
        </Button>
      </div>
    </div>
  )
} 