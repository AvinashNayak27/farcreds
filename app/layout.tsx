import type { Metadata } from 'next'
import './globals.css'
import { ClientProvider } from '@/components/client-provider'

export const metadata: Metadata = {
  title: 'FarCreds',
  description: 'Credential verification on Farcaster',
  generator: 'v0.dev',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  )
}
