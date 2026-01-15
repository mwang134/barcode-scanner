import type { Metadata } from 'next'
import './globals.css'
import { RoleProvider } from './contexts/RoleContext'

export const metadata: Metadata = {
  title: 'Warehouse Receiving MVP',
  description: 'Product Setup and Inventory Management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <RoleProvider>{children}</RoleProvider>
      </body>
    </html>
  )
}
