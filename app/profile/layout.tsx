export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen max-w-sm mx-auto">
      {children}
    </div>
  )
} 